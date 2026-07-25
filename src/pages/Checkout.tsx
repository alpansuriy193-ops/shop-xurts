import { Link } from "react-router-dom";
import { ExternalLink, ShoppingBag } from "lucide-react";
import { Layout } from "@/components/Layout";
import { useCart } from "@/hooks/useCart";
import { Button } from "@/components/ui/button";

const Checkout = () => {
  const { items } = useCart();
  const groups = items.reduce<Record<string, typeof items>>((result, item) => {
    const marketplace = item.product.marketplace || "Marketplace lain";
    (result[marketplace] ||= []).push(item);
    return result;
  }, {});
  if (!items.length) return <Layout><div className="container-narrow py-28 text-center"><ShoppingBag className="w-12 h-12 mx-auto mb-5 text-muted-foreground/40"/><h1 className="font-serif text-4xl mb-4">Keranjang kosong</h1><Button asChild className="rounded-none"><Link to="/products">Lihat Produk</Link></Button></div></Layout>;
  return <Layout><section className="container-narrow py-14 md:py-20"><p className="text-xs tracking-[.2em] uppercase text-primary mb-3">Affiliate checkout</p><h1 className="font-serif text-4xl md:text-5xl mb-4">Lanjutkan ke Marketplace</h1><p className="text-muted-foreground mb-10">Produk dipisahkan berdasarkan marketplace. Klik tombol beli untuk melanjutkan melalui link affiliate kami.</p><div className="space-y-8">{Object.entries(groups).map(([marketplace, grouped]) => <div key={marketplace} className="border border-border p-6 md:p-8"><h2 className="font-serif text-2xl mb-5">{marketplace}</h2><div className="space-y-4">{grouped.map(({ product, quantity }) => <div key={product.id} className="flex gap-4 items-center"><img src={product.images[0]} alt={product.name} className="w-16 h-20 object-cover bg-muted"/><div className="flex-1"><p className="font-medium">{product.name}</p><p className="text-sm text-muted-foreground">Jumlah pilihan: {quantity}</p></div>{product.affiliateLink ? <Button asChild className="rounded-none"><a href={product.affiliateLink} target="_blank" rel="noopener noreferrer">Beli di {marketplace}<ExternalLink className="ml-2 w-4 h-4"/></a></Button> : <span className="text-sm text-muted-foreground">Link belum tersedia</span>}</div>)}</div></div>)}</div><p className="text-xs text-muted-foreground mt-8">Sebagian link adalah link affiliate. Kami dapat komisi tanpa biaya tambahan untuk Anda.</p></section></Layout>;
};
export default Checkout;
