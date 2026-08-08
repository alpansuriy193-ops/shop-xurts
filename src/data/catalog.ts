import { supabase } from "@/integrations/supabase/client";
import { products, type Product } from "@/data/products";
import { readHiddenIds } from "@/hooks/useHiddenProducts";

export interface AffiliateProductRow {
  id: string;
  name: string;
  slug: string;
  collection: string;
  price: number;
  currency: string;
  description: string;
  long_description: string;
  materials: string;
  dimensions: string | null;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[] | null;
  notes: { top?: string; heart?: string; base?: string } | null;
  volume: string | null;
  specs: { label: string; value: string }[] | null;
  in_the_box: string[];
  warranty: string | null;
  care: string | null;
  fit: string | null;
  stock: number | null;
  marketplace: string | null;
  affiliate_link: string | null;
  featured: boolean;
  is_new: boolean;
  active: boolean;
  sort_order: number;
}

export const rowToProduct = (row: AffiliateProductRow): Product => ({
  id: row.id,
  name: row.name,
  slug: row.slug,
  collection: row.collection,
  price: Number(row.price) || 0,
  description: row.description || "",
  longDescription: row.long_description || row.description || "",
  materials: row.materials || "",
  dimensions: row.dimensions || undefined,
  images: row.images?.length ? row.images : ["/placeholder.svg"],
  featured: row.featured || undefined,
  new: row.is_new || undefined,
  sizes: row.sizes?.length ? row.sizes : undefined,
  colors: row.colors?.length ? row.colors : undefined,
  notes: row.notes || undefined,
  volume: row.volume || undefined,
  care: row.care || undefined,
  fit: row.fit || undefined,
  specs: row.specs?.length ? row.specs : undefined,
  inTheBox: row.in_the_box?.length ? row.in_the_box : undefined,
  warranty: row.warranty || undefined,
  stock: row.stock ?? undefined,
  marketplace: (row.marketplace as Product["marketplace"]) || undefined,
  affiliateLink: row.affiliate_link || undefined,
});

let loaded = false;

/** Remove locally hidden (deleted-by-admin) demo products from the in-memory catalog. */
export const pruneHiddenProducts = (): void => {
  const hidden = new Set(readHiddenIds());
  if (!hidden.size) return;
  for (let i = products.length - 1; i >= 0; i--) {
    if (hidden.has(products[i].id)) products.splice(i, 1);
  }
};

/** Fetch admin-managed products and merge them into the in-memory catalog. */
export const loadRemoteCatalog = async (): Promise<void> => {
  if (loaded) return;
  loaded = true;
  pruneHiddenProducts();
  const { data, error } = await (supabase as any)
    .from("affiliate_products")
    .select("*")
    .eq("active", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });

  if (error || !data) return;

  const mapped = (data as AffiliateProductRow[]).map(rowToProduct);
  for (const item of mapped) {
    const existing = products.findIndex((p) => p.slug === item.slug);
    if (existing >= 0) products[existing] = item;
    else products.unshift(item);
  }
  pruneHiddenProducts();
};
