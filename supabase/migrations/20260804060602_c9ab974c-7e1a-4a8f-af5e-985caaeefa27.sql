ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user'
  CHECK (role IN ('user', 'admin'));

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

REVOKE ALL ON FUNCTION public.is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;

CREATE POLICY "Admins view all orders" ON public.orders
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins update all orders" ON public.orders
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE TABLE public.affiliate_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text NOT NULL UNIQUE,
  collection text NOT NULL,
  price numeric NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'IDR',
  description text NOT NULL DEFAULT '',
  long_description text NOT NULL DEFAULT '',
  materials text NOT NULL DEFAULT '',
  dimensions text,
  images text[] NOT NULL DEFAULT '{}',
  sizes text[] NOT NULL DEFAULT '{}',
  colors jsonb NOT NULL DEFAULT '[]'::jsonb,
  notes jsonb,
  volume text,
  specs jsonb NOT NULL DEFAULT '[]'::jsonb,
  in_the_box text[] NOT NULL DEFAULT '{}',
  warranty text,
  care text,
  fit text,
  stock integer,
  marketplace text,
  affiliate_link text,
  featured boolean NOT NULL DEFAULT false,
  is_new boolean NOT NULL DEFAULT false,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.affiliate_products TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.affiliate_products TO authenticated;
GRANT ALL ON public.affiliate_products TO service_role;

ALTER TABLE public.affiliate_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active products are public" ON public.affiliate_products
  FOR SELECT USING (active = true);

CREATE POLICY "Admins view all products" ON public.affiliate_products
  FOR SELECT TO authenticated USING (public.is_admin());

CREATE POLICY "Admins insert products" ON public.affiliate_products
  FOR INSERT TO authenticated WITH CHECK (public.is_admin());

CREATE POLICY "Admins update products" ON public.affiliate_products
  FOR UPDATE TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "Admins delete products" ON public.affiliate_products
  FOR DELETE TO authenticated USING (public.is_admin());

CREATE TRIGGER update_affiliate_products_updated_at
  BEFORE UPDATE ON public.affiliate_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX affiliate_products_collection_idx ON public.affiliate_products (collection);
