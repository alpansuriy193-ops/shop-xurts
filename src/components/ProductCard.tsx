import { Link } from "react-router-dom";
import { Heart, Eye, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Product, collections } from "@/data/products";
import { useWishlist } from "@/hooks/useWishlist";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useDeleteMode } from "@/hooks/useDeleteMode";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { QuickViewDialog } from "./QuickViewDialog";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface ProductCardProps {
  product: Product;
  index?: number;
  variant?: "default" | "large";
}

export const ProductCard = ({ product, index = 0, variant = "default" }: ProductCardProps) => {
  const { t, tCollection } = useLanguage();
  const { addItem, removeItem, isInWishlist } = useWishlist();
  const isAdmin = useIsAdmin();
  const deleteMode = useDeleteMode((s) => s.deleteMode);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const canDelete = isAdmin && deleteMode && UUID_RE.test(product.id);
  const inWishlist = isInWishlist(product.id);
  const collection = collections.find((c) => c.id === product.collection);
  const hasSecondImage = product.images.length > 1;
  const [quickOpen, setQuickOpen] = useState(false);
  const soldOut = product.stock === 0;
  const lowStock = typeof product.stock === "number" && product.stock > 0 && product.stock <= 5;

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWishlist) {
      removeItem(product.id);
    } else {
      addItem(product);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setQuickOpen(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await (supabase as any)
      .from("affiliate_products")
      .delete()
      .eq("id", product.id);
    setDeleting(false);
    setConfirmOpen(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Produk dihapus.");
    window.location.reload();
  };

  return (
    <>
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        {/* Image Container */}
        <div
          className={cn(
            "relative overflow-hidden bg-muted/50 mb-5",
            variant === "large" ? "aspect-[3/4]" : "aspect-[4/5]"
          )}
        >
          {/* Primary Image */}
          <img
            src={product.images[0]}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover transition-all duration-[1s] ease-out",
              hasSecondImage
                ? "group-hover:opacity-0 group-hover:scale-105"
                : "group-hover:scale-105"
            )}
          />

          {/* Secondary Image (hover) */}
          {hasSecondImage && (
            <img
              src={product.images[1]}
              alt={`${product.name} - alternate view`}
              className="absolute inset-0 w-full h-full object-cover opacity-0 scale-105 transition-all duration-[1s] ease-out group-hover:opacity-100 group-hover:scale-100"
            />
          )}

          {/* Gradient Overlay on Hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Wishlist button */}
          <button
            onClick={handleWishlistToggle}
            className={cn(
              "absolute top-5 p-2.5 rounded-full transition-all duration-500",
              canDelete ? "right-16" : "right-5",
              "bg-background/90 backdrop-blur-md hover:bg-background shadow-sm",
              "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0",
              inWishlist && "opacity-100 translate-y-0"
            )}
          >
            <Heart
              className={cn(
                "w-4 h-4 transition-all duration-300",
                inWishlist ? "fill-primary text-primary scale-110" : "text-foreground"
              )}
            />
          </button>

          {/* Admin delete button */}
          {canDelete && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setConfirmOpen(true);
              }}
              aria-label={`Hapus ${product.name}`}
              disabled={deleting}
              className="absolute top-5 right-5 p-2 rounded-full bg-destructive text-destructive-foreground shadow-md transition-all duration-300 hover:scale-110 disabled:opacity-60"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Quick view button */}
          <button
            onClick={handleQuickView}
            aria-label={t("cardQuickViewAria")}
            className={cn(
              "absolute top-5 transition-all duration-500 p-2.5 rounded-full",
              canDelete ? "right-[6.5rem]" : "right-16",
              "bg-background/90 backdrop-blur-md hover:bg-background shadow-sm",
              "opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
            )}
          >
            <Eye className="w-4 h-4 text-foreground" />
          </button>

          {/* Badges */}
          <div className="absolute top-5 left-5 flex flex-col gap-2">
            {soldOut && (
              <span className="px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] uppercase bg-foreground text-background">
                {t("cardSoldOut")}
              </span>
            )}
            {lowStock && (
              <span className="px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] uppercase bg-primary text-primary-foreground">
                {t("cardLowStock")}
              </span>
            )}
            {product.new && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] uppercase bg-foreground text-background"
              >
                {t("cardNew")}
              </motion.span>
            )}
            {product.featured && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] uppercase bg-primary text-primary-foreground"
              >
                {t("cardFeatured")}
              </motion.span>
            )}
          </div>

          {/* Sold out overlay */}
          {soldOut && (
            <div className="absolute inset-0 bg-background/40 backdrop-blur-[1px]" />
          )}

          {/* Quick View Indicator */}
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-center pb-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
            <button
              onClick={handleQuickView}
              className="px-6 py-2.5 text-xs font-medium tracking-[0.15em] uppercase bg-background/95 backdrop-blur-md text-foreground shadow-lg hover:bg-background transition-colors"
            >
              {t("cardQuickView")}
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-2">
          {/* Collection label */}
          {collection && (
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground/70 transition-colors duration-300 group-hover:text-primary">
              {tCollection(collection.slug, collection.name)}
            </p>
          )}

          <h3 className="font-serif text-xl text-foreground transition-colors duration-300 group-hover:text-primary leading-snug">
            {product.name}
          </h3>

          <p className="text-sm text-muted-foreground line-clamp-1 leading-relaxed">
            {product.description}
          </p>

          <div className="flex items-center gap-3 pt-1">
            <p className="text-base font-medium text-foreground tracking-wide">
              ${product.price.toLocaleString()}
            </p>
            {product.materials && (
              <>
                <span className="w-px h-3 bg-border" />
                <p className="text-xs text-muted-foreground/60 tracking-wide">
                  {product.materials.split(",")[0]}
                </p>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.article>
    <QuickViewDialog product={product} open={quickOpen} onOpenChange={setQuickOpen} />
    <AlertDialog open={confirmOpen} onOpenChange={(open) => !open && setConfirmOpen(false)}>
      <AlertDialogContent className="rounded-none">
        <AlertDialogHeader>
          <AlertDialogTitle className="font-serif text-2xl">Hapus produk ini?</AlertDialogTitle>
          <AlertDialogDescription>
            "{product.name}" akan dihapus permanen dari katalog.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-none" disabled={deleting}>Batal</AlertDialogCancel>
          <AlertDialogAction
            className="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={deleting}
            onClick={(e) => {
              e.preventDefault();
              handleDelete();
            }}
          >
            {deleting ? "Menghapus..." : "Ya, hapus"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
};
