import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate("/auth", { replace: true }); return; }
    (supabase as any).rpc("is_admin").then(({ data }: { data: boolean | null }) => {
      if (data !== true) navigate("/", { replace: true });
      else setAuthorized(true);
    });
  }, [user, loading, navigate]);

  if (!authorized) return null;
  return (
    <Layout>
      <section className="container-full py-16 md:py-24">
        <p className="text-xs tracking-[.2em] uppercase text-primary mb-3">Admin</p>
        <h1 className="font-serif text-4xl md:text-5xl mb-4">Dashboard</h1>
        <p className="text-muted-foreground max-w-xl mb-8">
          Kelola produk affiliate dan pesanan dari satu tempat.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button asChild className="rounded-none">
            <Link to="/admin/products">Kelola produk affiliate</Link>
          </Button>
          <Button asChild variant="outline" className="rounded-none">
            <Link to="/orders">Lihat pesanan</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Admin;
