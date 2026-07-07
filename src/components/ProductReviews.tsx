import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  comment: string;
  created_at: string;
  display_name?: string | null;
}

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().max(120).optional(),
  comment: z.string().trim().min(3, "Komentar minimal 3 karakter").max(1000),
});

const StarRow = ({ value, size = 16, onChange }: { value: number; size?: number; onChange?: (v: number) => void }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        disabled={!onChange}
        onClick={() => onChange?.(n)}
        className={cn(onChange && "cursor-pointer hover:scale-110 transition-transform", !onChange && "cursor-default")}
        aria-label={`${n} star`}
      >
        <Star
          style={{ width: size, height: size }}
          className={cn(n <= value ? "fill-primary text-primary" : "text-muted-foreground/40")}
        />
      </button>
    ))}
  </div>
);

export const ProductReviews = ({ productId }: { productId: string }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("product_reviews")
      .select("id, product_id, user_id, rating, title, comment, created_at")
      .eq("product_id", productId)
      .order("created_at", { ascending: false });
    if (!error && data) {
      const ids = Array.from(new Set(data.map((r) => r.user_id)));
      let profileMap = new Map<string, string | null>();
      if (ids.length) {
        const { data: profs } = await supabase
          .from("profiles")
          .select("id, display_name")
          .in("id", ids);
        profileMap = new Map((profs ?? []).map((p) => [p.id, p.display_name]));
      }
      setReviews(data.map((r) => ({ ...r, display_name: profileMap.get(r.user_id) ?? null })) as Review[]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = reviewSchema.safeParse({ rating, title: title || undefined, comment });
    if (!parsed.success) {
      toast({ title: "Review tidak valid", description: parsed.error.issues[0]?.message });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("product_reviews").upsert(
      { product_id: productId, user_id: user.id, rating: parsed.data.rating, title: parsed.data.title ?? null, comment: parsed.data.comment },
      { onConflict: "product_id,user_id" }
    );
    setSubmitting(false);
    if (error) {
      toast({ title: "Gagal mengirim review", description: error.message });
    } else {
      toast({ title: "Review terkirim", description: "Terima kasih atas ulasanmu." });
      setTitle("");
      setComment("");
      setRating(5);
      load();
    }
  };

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const myReview = reviews.find((r) => r.user_id === user?.id);

  return (
    <section className="py-16 md:py-20 border-t border-border">
      <div className="container-full">
        <div className="max-w-4xl">
          <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-primary mb-4">Customer Reviews</p>
          <div className="flex items-baseline gap-6 mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-foreground">
              {reviews.length > 0 ? avg.toFixed(1) : "—"}
              <span className="text-xl text-muted-foreground"> / 5</span>
            </h2>
            <div className="flex items-center gap-3">
              <StarRow value={Math.round(avg)} size={18} />
              <span className="text-sm text-muted-foreground">
                {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
              </span>
            </div>
          </div>

          {/* Write review */}
          <div className="mb-12 pb-12 border-b border-border">
            {user ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h3 className="font-serif text-xl">{myReview ? "Update your review" : "Write a review"}</h3>
                <div className="space-y-2">
                  <Label className="text-[11px] tracking-[0.2em] uppercase">Rating</Label>
                  <StarRow value={rating} size={24} onChange={setRating} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rev-title" className="text-[11px] tracking-[0.2em] uppercase">Title (opsional)</Label>
                  <Input id="rev-title" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} className="rounded-none h-11" placeholder="Ringkasan singkat" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rev-comment" className="text-[11px] tracking-[0.2em] uppercase">Review</Label>
                  <Textarea id="rev-comment" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1000} rows={4} required className="rounded-none" placeholder="Bagaimana pengalamanmu dengan produk ini?" />
                </div>
                <Button type="submit" disabled={submitting} className="rounded-none px-8 py-5 text-xs tracking-[0.15em] uppercase">
                  {submitting ? "Mengirim..." : myReview ? "Update Review" : "Submit Review"}
                </Button>
              </form>
            ) : (
              <div className="text-center py-6 bg-muted/30 border border-border">
                <p className="text-sm text-muted-foreground mb-4">Sign in untuk menulis review produk ini.</p>
                <Button asChild className="rounded-none px-8 py-5 text-xs tracking-[0.15em] uppercase">
                  <Link to="/auth">Sign In to Review</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Reviews list */}
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p className="text-sm text-muted-foreground">Belum ada review. Jadilah yang pertama!</p>
          ) : (
            <div className="space-y-8">
              {reviews.map((r) => (
                <div key={r.id} className="pb-8 border-b border-border/60 last:border-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <StarRow value={r.rating} />
                      {r.title && <span className="font-serif text-base">{r.title}</span>}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-line mb-2">{r.comment}</p>
                  <p className="text-xs text-muted-foreground">
                    — {r.display_name ?? "Anonymous"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};