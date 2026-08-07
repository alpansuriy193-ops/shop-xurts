import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { collections } from "@/data/products";
import type { AffiliateProductRow } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Plus, Trash2, ExternalLink } from "lucide-react";
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

const SIZE_PRESETS: Record<string, string> = {
  fashion: "XS, S, M, L, XL",
  sepatu: "39, 40, 41, 42, 43, 44, 45",
  aksesoris: "80cm, 85cm, 90cm, 95cm, 100cm",
};

const emptyForm = {
  id: "",
  name: "",
  slug: "",
  collection: "fashion",
  price: "",
  description: "",
  long_description: "",
  materials: "",
  dimensions: "",
  images: "",
  sizes: "",
  colors: "",
  notes_top: "",
  notes_heart: "",
  notes_base: "",
  volume: "",
  specs: "",
  in_the_box: "",
  warranty: "",
  care: "",
  fit: "",
  stock: "",
  marketplace: "",
  affiliate_link: "",
  featured: false,
  is_new: true,
  active: true,
  sort_order: "0",
};

type FormState = typeof emptyForm;

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 70);

const toList = (value: string) =>
  value
    .split(/\r?\n|,/)
    .map((v) => v.trim())
    .filter(Boolean);

const parseColors = (value: string) =>
  toList(value).map((entry) => {
    const [name, hex] = entry.split("|").map((v) => v.trim());
    return { name: name || "Default", hex: hex || "#CCCCCC" };
  });

const parseSpecs = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(":");
      return { label: label.trim(), value: rest.join(":").trim() };
    })
    .filter((s) => s.label && s.value);

const rowToForm = (row: AffiliateProductRow): FormState => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  collection: row.collection,
  price: String(row.price ?? ""),
  description: row.description ?? "",
  long_description: row.long_description ?? "",
  materials: row.materials ?? "",
  dimensions: row.dimensions ?? "",
  images: (row.images ?? []).join("\n"),
  sizes: (row.sizes ?? []).join(", "),
  colors: (row.colors ?? []).map((c) => `${c.name} | ${c.hex}`).join("\n"),
  notes_top: row.notes?.top ?? "",
  notes_heart: row.notes?.heart ?? "",
  notes_base: row.notes?.base ?? "",
  volume: row.volume ?? "",
  specs: (row.specs ?? []).map((s) => `${s.label}: ${s.value}`).join("\n"),
  in_the_box: (row.in_the_box ?? []).join("\n"),
  warranty: row.warranty ?? "",
  care: row.care ?? "",
  fit: row.fit ?? "",
  stock: row.stock === null || row.stock === undefined ? "" : String(row.stock),
  marketplace: row.marketplace ?? "",
  affiliate_link: row.affiliate_link ?? "",
  featured: row.featured,
  is_new: row.is_new,
  active: row.active,
  sort_order: String(row.sort_order ?? 0),
});

const Field = ({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-1.5">
    <Label className="text-xs tracking-[.12em] uppercase text-muted-foreground">{label}</Label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

const AdminProducts = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [rows, setRows] = useState<AffiliateProductRow[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<AffiliateProductRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkOpen, setBulkOpen] = useState(false);

  const showSizes = ["fashion", "sepatu", "aksesoris"].includes(form.collection);
  const showParfum = form.collection === "parfum";
  const showSpecs = ["elektronik", "jam"].includes(form.collection);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }
    (supabase as any).rpc("is_admin").then(({ data }: { data: boolean | null }) => {
      if (data !== true) navigate("/", { replace: true });
      else setAuthorized(true);
    });
  }, [user, loading, navigate]);

  const fetchRows = async () => {
    const { data, error } = await (supabase as any)
      .from("affiliate_products")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setRows((data ?? []) as AffiliateProductRow[]);
  };

  useEffect(() => {
    if (authorized) fetchRows();
  }, [authorized]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const collectionOptions = useMemo(
    () => collections.map((c) => ({ value: c.slug === "jam-tangan" ? "jam" : c.slug, label: c.name })),
    []
  );

  const save = async () => {
    if (!form.name.trim()) return toast.error("Nama produk wajib diisi.");
    if (!form.affiliate_link.trim()) return toast.error("Link affiliate wajib diisi.");
    setSaving(true);

    const payload: Record<string, unknown> = {
      name: form.name.trim(),
      slug: (form.slug.trim() || slugify(form.name)) || slugify(form.name),
      collection: form.collection,
      price: Number(form.price) || 0,
      description: form.description.trim(),
      long_description: form.long_description.trim() || form.description.trim(),
      materials: form.materials.trim(),
      dimensions: form.dimensions.trim() || null,
      images: toList(form.images),
      sizes: showSizes ? toList(form.sizes) : [],
      colors: parseColors(form.colors),
      notes: showParfum
        ? { top: form.notes_top || undefined, heart: form.notes_heart || undefined, base: form.notes_base || undefined }
        : null,
      volume: showParfum ? form.volume.trim() || null : null,
      specs: showSpecs ? parseSpecs(form.specs) : [],
      in_the_box: showSpecs ? toList(form.in_the_box) : [],
      warranty: form.warranty.trim() || null,
      care: form.care.trim() || null,
      fit: form.fit.trim() || null,
      stock: form.stock === "" ? null : Number(form.stock),
      marketplace: form.marketplace.trim() || null,
      affiliate_link: form.affiliate_link.trim(),
      featured: form.featured,
      is_new: form.is_new,
      active: form.active,
      sort_order: Number(form.sort_order) || 0,
    };

    const query = form.id
      ? (supabase as any).from("affiliate_products").update(payload).eq("id", form.id)
      : (supabase as any).from("affiliate_products").insert(payload);

    const { error } = await query;
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success(form.id ? "Produk diperbarui." : "Produk ditambahkan.");
    setForm(emptyForm);
    fetchRows();
  };

  const remove = async (id: string) => {
    setDeleting(true);
    const { error } = await (supabase as any).from("affiliate_products").delete().eq("id", id);
    setDeleting(false);
    setPendingDelete(null);
    if (error) return toast.error(error.message);
    toast.success("Produk dihapus.");
    if (form.id === id) setForm(emptyForm);
    setSelected((prev) => prev.filter((s) => s !== id));
    fetchRows();
  };

  const removeMany = async () => {
    if (selected.length === 0) return;
    setDeleting(true);
    const { error } = await (supabase as any).from("affiliate_products").delete().in("id", selected);
    setDeleting(false);
    setBulkOpen(false);
    if (error) return toast.error(error.message);
    toast.success(`${selected.length} produk dihapus.`);
    if (selected.includes(form.id)) setForm(emptyForm);
    setSelected([]);
    fetchRows();
  };

  const toggleSelected = (id: string) =>
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));

  if (!authorized) return null;

  return (
    <Layout>
      <section className="container-full py-14 md:py-20">
        <p className="text-xs tracking-[.2em] uppercase text-primary mb-3">Admin</p>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl mb-2">Produk Affiliate</h1>
            <p className="text-muted-foreground max-w-xl text-sm">
              Isi form di bawah untuk menambah produk. Cukup nama, kategori, harga, deskripsi,
              gambar, ukuran, dan link affiliate — produk langsung tampil di katalog.
            </p>
          </div>
          <Button variant="outline" asChild className="rounded-none">
            <Link to="/admin">Kembali ke dashboard</Link>
          </Button>
        </div>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Form */}
          <div className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Nama produk">
                <Input
                  className="rounded-none"
                  value={form.name}
                  onChange={(e) => {
                    set("name", e.target.value);
                    if (!form.id) set("slug", slugify(e.target.value));
                  }}
                  placeholder="Jersey Fantasy Spain Full Print"
                />
              </Field>
              <Field label="Slug URL" hint="Otomatis dari nama, bisa diubah.">
                <Input className="rounded-none" value={form.slug} onChange={(e) => set("slug", slugify(e.target.value))} />
              </Field>
              <Field label="Kategori">
                <select
                  className="h-10 w-full border border-input bg-background px-3 text-sm"
                  value={form.collection}
                  onChange={(e) => {
                    const value = e.target.value;
                    set("collection", value);
                    if (!form.sizes && SIZE_PRESETS[value]) set("sizes", SIZE_PRESETS[value]);
                  }}
                >
                  {collectionOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Harga (Rp)" hint="Isi 0 kalau harga mengikuti marketplace.">
                <Input className="rounded-none" type="number" value={form.price} onChange={(e) => set("price", e.target.value)} />
              </Field>
              <Field label="Link affiliate">
                <Input
                  className="rounded-none"
                  value={form.affiliate_link}
                  onChange={(e) => set("affiliate_link", e.target.value)}
                  placeholder="https://s.shopee.co.id/..."
                />
              </Field>
              <Field label="Marketplace" hint="Shopee, Tokopedia, atau Amazon.">
                <Input className="rounded-none" value={form.marketplace} onChange={(e) => set("marketplace", e.target.value)} placeholder="Shopee" />
              </Field>
            </div>

            <Field label="Deskripsi singkat" hint="Satu baris, tampil di kartu produk.">
              <Input className="rounded-none" value={form.description} onChange={(e) => set("description", e.target.value)} />
            </Field>
            <Field label="Deskripsi lengkap">
              <Textarea className="rounded-none min-h-[110px]" value={form.long_description} onChange={(e) => set("long_description", e.target.value)} />
            </Field>
            <Field label="Link gambar" hint="Satu URL per baris. Gambar pertama jadi thumbnail.">
              <Textarea className="rounded-none min-h-[90px]" value={form.images} onChange={(e) => set("images", e.target.value)} placeholder={"https://...jpg\nhttps://...jpg"} />
            </Field>

            {showSizes && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Ukuran" hint="Pisahkan dengan koma. Contoh: S, M, L, XL / 40, 41, 42.">
                  <Input className="rounded-none" value={form.sizes} onChange={(e) => set("sizes", e.target.value)} />
                </Field>
                <Field label="Info fit">
                  <Input className="rounded-none" value={form.fit} onChange={(e) => set("fit", e.target.value)} placeholder="Regular fit, model 178cm pakai M" />
                </Field>
              </div>
            )}

            {showParfum && (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Volume">
                  <Input className="rounded-none" value={form.volume} onChange={(e) => set("volume", e.target.value)} placeholder="50ml Eau de Parfum" />
                </Field>
                <Field label="Top notes">
                  <Input className="rounded-none" value={form.notes_top} onChange={(e) => set("notes_top", e.target.value)} />
                </Field>
                <Field label="Heart notes">
                  <Input className="rounded-none" value={form.notes_heart} onChange={(e) => set("notes_heart", e.target.value)} />
                </Field>
                <Field label="Base notes">
                  <Input className="rounded-none" value={form.notes_base} onChange={(e) => set("notes_base", e.target.value)} />
                </Field>
              </div>
            )}

            {showSpecs && (
              <div className="grid gap-4">
                <Field label="Spesifikasi" hint='Satu baris per spec, format "Label: Nilai".'>
                  <Textarea className="rounded-none min-h-[90px]" value={form.specs} onChange={(e) => set("specs", e.target.value)} placeholder={"Baterai: 5000mAh\nLayar: 6.7 inci"} />
                </Field>
                <Field label="Isi paket" hint="Satu item per baris.">
                  <Textarea className="rounded-none min-h-[80px]" value={form.in_the_box} onChange={(e) => set("in_the_box", e.target.value)} />
                </Field>
                <Field label="Garansi">
                  <Input className="rounded-none" value={form.warranty} onChange={(e) => set("warranty", e.target.value)} />
                </Field>
              </div>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Warna" hint='Satu per baris, format "Nama | #HEX".'>
                <Textarea className="rounded-none min-h-[80px]" value={form.colors} onChange={(e) => set("colors", e.target.value)} placeholder={"Hitam | #1A1A1A\nKrem | #EFE9DC"} />
              </Field>
              <div className="space-y-4">
                <Field label="Material / bahan">
                  <Input className="rounded-none" value={form.materials} onChange={(e) => set("materials", e.target.value)} />
                </Field>
                <Field label="Perawatan">
                  <Input className="rounded-none" value={form.care} onChange={(e) => set("care", e.target.value)} />
                </Field>
              </div>
              <Field label="Stok" hint="Kosongkan kalau stok banyak. 0 = sold out.">
                <Input className="rounded-none" type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} />
              </Field>
              <Field label="Urutan tampil" hint="Angka kecil tampil lebih dulu.">
                <Input className="rounded-none" type="number" value={form.sort_order} onChange={(e) => set("sort_order", e.target.value)} />
              </Field>
            </div>

            <div className="flex flex-wrap gap-8 pt-2">
              {([
                ["featured", "Unggulan"],
                ["is_new", "Produk baru"],
                ["active", "Tampilkan di web"],
              ] as const).map(([key, label]) => (
                <div key={key} className="flex items-center gap-3">
                  <Switch checked={form[key]} onCheckedChange={(v) => set(key, v)} />
                  <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={save} disabled={saving} className="rounded-none">
                {form.id ? <Pencil className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
                {saving ? "Menyimpan..." : form.id ? "Simpan perubahan" : "Tambah produk"}
              </Button>
              {form.id && (
                <Button variant="outline" className="rounded-none" onClick={() => setForm(emptyForm)}>
                  Batal
                </Button>
              )}
            </div>
          </div>

          {/* List */}
          <aside>
            <h2 className="font-serif text-2xl mb-4">Daftar produk ({rows.length})</h2>
            {rows.length > 0 && (
              <div className="flex items-center justify-between gap-3 mb-3">
                <label className="flex items-center gap-2 text-xs tracking-[.12em] uppercase text-muted-foreground cursor-pointer">
                  <Checkbox
                    checked={selected.length === rows.length && rows.length > 0}
                    onCheckedChange={(v) => setSelected(v ? rows.map((r) => r.id) : [])}
                  />
                  Pilih semua
                </label>
                {selected.length > 0 && (
                  <Button
                    size="sm"
                    variant="destructive"
                    className="rounded-none"
                    disabled={deleting}
                    onClick={() => setBulkOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {deleting ? "Menghapus..." : `Hapus ${selected.length}`}
                  </Button>
                )}
              </div>
            )}
            <Separator className="mb-4" />
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {rows.length === 0 && <p className="text-sm text-muted-foreground">Belum ada produk affiliate.</p>}
              {rows.map((row) => (
                <div key={row.id} className="flex gap-3 border border-border p-3">
                  <Checkbox
                    className="mt-1"
                    checked={selected.includes(row.id)}
                    onCheckedChange={() => toggleSelected(row.id)}
                    aria-label={`Pilih ${row.name}`}
                  />
                  <img
                    src={row.images?.[0] || "/placeholder.svg"}
                    alt={row.name}
                    className="h-16 w-16 object-cover"
                    loading="lazy"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm truncate">{row.name}</p>
                    <p className="text-xs text-muted-foreground">{row.collection}</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {!row.active && <Badge variant="secondary" className="rounded-none text-[10px]">Draft</Badge>}
                      {row.featured && <Badge variant="outline" className="rounded-none text-[10px]">Unggulan</Badge>}
                      {row.marketplace && <Badge variant="outline" className="rounded-none text-[10px]">{row.marketplace}</Badge>}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <Button size="icon" variant="ghost" onClick={() => setForm(rowToForm(row))} aria-label="Edit produk">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {row.affiliate_link && (
                      <Button size="icon" variant="ghost" asChild aria-label="Buka link affiliate">
                        <a href={row.affiliate_link} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setPendingDelete(row)}
                      aria-label="Hapus produk"
                      disabled={deleting}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <AlertDialog open={!!pendingDelete} onOpenChange={(open) => !open && setPendingDelete(null)}>
          <AlertDialogContent className="rounded-none">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-serif text-2xl">Hapus produk ini?</AlertDialogTitle>
              <AlertDialogDescription>
                "{pendingDelete?.name}" akan dihapus permanen dari katalog dan tidak bisa dikembalikan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-none">Batal</AlertDialogCancel>
              <AlertDialogAction
                className="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleting}
                onClick={(e) => {
                  e.preventDefault();
                  if (pendingDelete) remove(pendingDelete.id);
                }}
              >
                {deleting ? "Menghapus..." : "Ya, hapus"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={bulkOpen} onOpenChange={(open) => !open && setBulkOpen(false)}>
          <AlertDialogContent className="rounded-none">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-serif text-2xl">Hapus {selected.length} produk?</AlertDialogTitle>
              <AlertDialogDescription>
                Semua produk yang dipilih akan dihapus permanen dan tidak bisa dikembalikan.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="rounded-none" disabled={deleting}>Batal</AlertDialogCancel>
              <AlertDialogAction
                className="rounded-none bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={deleting}
                onClick={(e) => {
                  e.preventDefault();
                  removeMany();
                }}
              >
                {deleting ? "Menghapus..." : "Ya, hapus semua"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>
    </Layout>
  );
};

export default AdminProducts;
