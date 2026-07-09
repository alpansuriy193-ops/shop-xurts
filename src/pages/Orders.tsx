import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Package, ArrowRight, Lock } from "lucide-react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

interface OrderItem {
  product_id: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  total: number;
  subtotal: number;
  discount: number;
  shipping: number;
  coupon_code: string | null;
  full_name: string;
  city: string;
  country: string;
  items: OrderItem[];
}

const statusLabel: Record<string, string> = {
  pending: "Menunggu Konfirmasi",
  processing: "Diproses",
  shipped: "Dikirim",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
};

const Orders = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    if (authLoading || !user) return;
    supabase
      .from("orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) {
          console.error(error);
          setOrders([]);
          return;
        }
        setOrders((data ?? []) as unknown as Order[]);
      });
  }, [user, authLoading]);

  if (!authLoading && !user) {
    return (
      <Layout>
        <div className="container-narrow py-28 text-center">
          <Lock className="w-10 h-10 mx-auto mb-6 text-muted-foreground/40" />
          <h1 className="font-serif text-4xl mb-4">Masuk untuk Lihat Pesanan</h1>
          <p className="text-muted-foreground mb-8">Riwayat pesananmu tersimpan di akunmu.</p>
          <Button asChild size="lg" className="rounded-none px-10 py-6 text-sm tracking-[0.15em] uppercase btn-premium">
            <Link to="/auth">Masuk / Daftar</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container-full py-6 border-b border-border">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span className="text-border">/</span>
          <span className="text-foreground">Pesanan Saya</span>
        </div>
      </div>

      <section className="py-10 md:py-16">
        <div className="container-full">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-serif text-4xl md:text-5xl mb-12"
          >
            Pesanan Saya
          </motion.h1>

          {orders === null ? (
            <p className="text-muted-foreground">Memuat pesananmu…</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-12 h-12 mx-auto mb-6 text-muted-foreground/30" />
              <p className="font-serif text-2xl mb-2">Belum ada pesanan</p>
              <p className="text-muted-foreground mb-8">Yuk mulai belanja koleksi kami.</p>
              <Button asChild className="rounded-none px-8 py-5 text-xs tracking-[0.15em] uppercase">
                <Link to="/products">Mulai Belanja <ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <div key={order.id} className="border border-border bg-linen/40 p-6 md:p-8">
                  <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-border">
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.15em] uppercase text-muted-foreground/70">
                        Pesanan #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(order.created_at).toLocaleDateString("id-ID", {
                          day: "numeric", month: "long", year: "numeric",
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-3 py-1 text-[11px] font-semibold tracking-[0.15em] uppercase bg-primary/10 text-primary">
                        {statusLabel[order.status] ?? order.status}
                      </span>
                      <p className="font-serif text-xl mt-2">${Number(order.total).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 py-4">
                    {order.items.map((it) => (
                      <div key={it.product_id} className="flex gap-4">
                        <Link to={`/product/${it.slug}`} className="w-14 h-16 bg-muted/30 overflow-hidden flex-shrink-0">
                          <img src={it.image} alt={it.name} className="w-full h-full object-cover" />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{it.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">Qty: {it.quantity}</p>
                        </div>
                        <p className="text-sm">${(it.price * it.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-border text-xs text-muted-foreground">
                    Dikirim ke {order.full_name} — {order.city}, {order.country}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Orders;