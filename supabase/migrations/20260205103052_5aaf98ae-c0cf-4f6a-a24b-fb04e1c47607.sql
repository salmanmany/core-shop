-- Create store themes enum
CREATE TYPE public.store_theme AS ENUM (
  'minecraft_classic',
  'nether_dark',
  'end_purple',
  'ocean_blue',
  'forest_green',
  'desert_gold',
  'ice_frost',
  'redstone_red',
  'diamond_cyan',
  'emerald_green'
);

-- Create store status enum
CREATE TYPE public.store_status AS ENUM ('pending', 'approved', 'suspended');

-- Create stores table
CREATE TABLE public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  theme store_theme NOT NULL DEFAULT 'minecraft_classic',
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status store_status NOT NULL DEFAULT 'pending',
  api_key UUID DEFAULT gen_random_uuid(),
  server_ip TEXT,
  discord_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create categories table for stores
CREATE TABLE public.store_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create products table (unified ranks/keys for stores)
CREATE TABLE public.store_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.store_categories(id) ON DELETE SET NULL,
  product_type TEXT NOT NULL CHECK (product_type IN ('rank', 'key', 'item')),
  name_en TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  desc_en TEXT NOT NULL,
  desc_ar TEXT NOT NULL,
  price NUMERIC NOT NULL,
  icon TEXT DEFAULT 'package',
  color_class TEXT NOT NULL DEFAULT 'text-gray-400',
  bg_class TEXT NOT NULL DEFAULT 'bg-gray-900/50',
  border_class TEXT NOT NULL DEFAULT 'border-gray-700',
  commands TEXT[],
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  stripe_price_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
  buyer_id UUID,
  buyer_email TEXT NOT NULL,
  buyer_minecraft_username TEXT,
  stripe_session_id TEXT,
  stripe_payment_intent_id TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'delivered', 'refunded', 'failed')),
  total_amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'usd',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.store_products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all new tables
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Stores policies
CREATE POLICY "Anyone can view approved stores" ON public.stores
  FOR SELECT USING (status = 'approved');

CREATE POLICY "Sellers can view their own stores" ON public.stores
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Sellers can create stores" ON public.stores
  FOR INSERT WITH CHECK (
    owner_id = auth.uid() AND 
    has_role(auth.uid(), 'seller')
  );

CREATE POLICY "Sellers can update their own stores" ON public.stores
  FOR UPDATE USING (owner_id = auth.uid());

CREATE POLICY "Admins can manage all stores" ON public.stores
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Store categories policies
CREATE POLICY "Anyone can view active categories" ON public.store_categories
  FOR SELECT USING (
    is_active = true AND 
    EXISTS (SELECT 1 FROM public.stores WHERE id = store_id AND status = 'approved')
  );

CREATE POLICY "Sellers can manage their store categories" ON public.store_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores WHERE id = store_id AND owner_id = auth.uid())
  );

CREATE POLICY "Admins can manage all categories" ON public.store_categories
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Store products policies
CREATE POLICY "Anyone can view active products from approved stores" ON public.store_products
  FOR SELECT USING (
    is_active = true AND 
    EXISTS (SELECT 1 FROM public.stores WHERE id = store_id AND status = 'approved')
  );

CREATE POLICY "Sellers can manage their store products" ON public.store_products
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.stores WHERE id = store_id AND owner_id = auth.uid())
  );

CREATE POLICY "Admins can manage all products" ON public.store_products
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Orders policies
CREATE POLICY "Buyers can view their own orders" ON public.orders
  FOR SELECT USING (buyer_id = auth.uid());

CREATE POLICY "Sellers can view orders for their stores" ON public.orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.stores WHERE id = store_id AND owner_id = auth.uid())
  );

CREATE POLICY "Anyone can create orders" ON public.orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Sellers can update order status for their stores" ON public.orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.stores WHERE id = store_id AND owner_id = auth.uid())
  );

CREATE POLICY "Admins can manage all orders" ON public.orders
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Order items policies
CREATE POLICY "Anyone can view order items for their orders" ON public.order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE id = order_id AND buyer_id = auth.uid())
  );

CREATE POLICY "Sellers can view order items for their store orders" ON public.order_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.orders o
      JOIN public.stores s ON o.store_id = s.id
      WHERE o.id = order_id AND s.owner_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can create order items" ON public.order_items
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can manage all order items" ON public.order_items
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Create triggers for updated_at
CREATE TRIGGER update_stores_updated_at
  BEFORE UPDATE ON public.stores
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_store_categories_updated_at
  BEFORE UPDATE ON public.store_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_store_products_updated_at
  BEFORE UPDATE ON public.store_products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for performance
CREATE INDEX idx_stores_slug ON public.stores(slug);
CREATE INDEX idx_stores_owner ON public.stores(owner_id);
CREATE INDEX idx_stores_status ON public.stores(status);
CREATE INDEX idx_store_products_store ON public.store_products(store_id);
CREATE INDEX idx_store_categories_store ON public.store_categories(store_id);
CREATE INDEX idx_orders_store ON public.orders(store_id);
CREATE INDEX idx_orders_buyer ON public.orders(buyer_id);
CREATE INDEX idx_order_items_order ON public.order_items(order_id);