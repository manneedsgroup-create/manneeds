-- ==============================================================================
-- MANNEEDS 3-TABLE INVENTORY MANAGEMENT ARCHITECTURE
-- Run this script in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
--
-- FORMULA:
-- Stock Items (Initial) + New Stock Inventory - Sold Items = Available Quantity
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABLE 1: STOCK ITEMS (Initial / Opening Baseline Stock)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stock_items (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_weight TEXT NOT NULL DEFAULT 'all', -- '100g', '200g', '500g', '1kg', or 'all'
  quantity INTEGER NOT NULL DEFAULT 0 CHECK (quantity >= 0),
  unit_cost NUMERIC(10,2) DEFAULT NULL,
  notes TEXT DEFAULT 'Opening baseline stock',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT uq_stock_items_product_variant UNIQUE (product_id, variant_weight)
);

COMMENT ON TABLE public.stock_items IS 'Opening / baseline inventory per product and variant';

-- ------------------------------------------------------------------------------
-- 2. TABLE 2: NEW STOCK INVENTORY (Inward Batches / Restocked Inventory)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.new_stock_inventory (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_weight TEXT NOT NULL DEFAULT 'all',
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  batch_number TEXT,
  supplier TEXT,
  cost_per_unit NUMERIC(10,2) DEFAULT NULL,
  received_date DATE DEFAULT CURRENT_DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.new_stock_inventory IS 'Incoming restock shipments, supplier batches, and inventory additions';

-- ------------------------------------------------------------------------------
-- 3. TABLE 3: SOLD ITEMS (Sales Outflow / Deducted Orders)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.sold_items (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_weight TEXT NOT NULL DEFAULT 'all',
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  order_id TEXT, -- References order UUID or external sales channel ID
  unit_price NUMERIC(10,2) DEFAULT NULL,
  sold_date DATE DEFAULT CURRENT_DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

COMMENT ON TABLE public.sold_items IS 'Deducted sales, dispatched orders, and customer purchases';

-- ------------------------------------------------------------------------------
-- 4. PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_stock_items_product ON public.stock_items(product_id);
CREATE INDEX IF NOT EXISTS idx_new_stock_product ON public.new_stock_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_sold_items_product ON public.sold_items(product_id);

-- ------------------------------------------------------------------------------
-- 5. VIEW: INVENTORY SUMMARY (Product-Level Available Quantity)
-- Formula: Initial Stock + New Stock - Sold Items = Available Quantity
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.inventory_summary AS
SELECT 
  p.id AS product_id,
  p.name AS product_name,
  p.category,
  p.price,
  COALESCE(si.initial_stock, 0)::INTEGER AS initial_stock,
  COALESCE(ns.new_stock, 0)::INTEGER AS new_stock,
  COALESCE(so.sold_stock, 0)::INTEGER AS sold_stock,
  GREATEST(0, (COALESCE(si.initial_stock, 0) + COALESCE(ns.new_stock, 0) - COALESCE(so.sold_stock, 0)))::INTEGER AS available_quantity,
  CASE 
    WHEN (COALESCE(si.initial_stock, 0) + COALESCE(ns.new_stock, 0) - COALESCE(so.sold_stock, 0)) > 0 THEN true 
    ELSE false 
  END AS in_stock
FROM public.products p
LEFT JOIN (
  SELECT product_id, SUM(quantity) AS initial_stock
  FROM public.stock_items
  GROUP BY product_id
) si ON si.product_id = p.id
LEFT JOIN (
  SELECT product_id, SUM(quantity) AS new_stock
  FROM public.new_stock_inventory
  GROUP BY product_id
) ns ON ns.product_id = p.id
LEFT JOIN (
  SELECT product_id, SUM(quantity) AS sold_stock
  FROM public.sold_items
  GROUP BY product_id
) so ON so.product_id = p.id
ORDER BY p.id ASC;

-- ------------------------------------------------------------------------------
-- 6. VIEW: INVENTORY VARIANT SUMMARY (Breakdown by Product & Weight Variant)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.inventory_variant_summary AS
WITH all_variants AS (
  SELECT product_id, variant_weight FROM public.stock_items
  UNION
  SELECT product_id, variant_weight FROM public.new_stock_inventory
  UNION
  SELECT product_id, variant_weight FROM public.sold_items
)
SELECT 
  v.product_id,
  p.name AS product_name,
  v.variant_weight,
  COALESCE(si.quantity, 0)::INTEGER AS initial_stock,
  COALESCE(ns.total_new, 0)::INTEGER AS new_stock,
  COALESCE(so.total_sold, 0)::INTEGER AS sold_stock,
  GREATEST(0, (COALESCE(si.quantity, 0) + COALESCE(ns.total_new, 0) - COALESCE(so.total_sold, 0)))::INTEGER AS available_quantity,
  CASE 
    WHEN (COALESCE(si.quantity, 0) + COALESCE(ns.total_new, 0) - COALESCE(so.total_sold, 0)) > 0 THEN true 
    ELSE false 
  END AS in_stock
FROM all_variants v
JOIN public.products p ON p.id = v.product_id
LEFT JOIN public.stock_items si ON si.product_id = v.product_id AND si.variant_weight = v.variant_weight
LEFT JOIN (
  SELECT product_id, variant_weight, SUM(quantity) AS total_new
  FROM public.new_stock_inventory
  GROUP BY product_id, variant_weight
) ns ON ns.product_id = v.product_id AND ns.variant_weight = v.variant_weight
LEFT JOIN (
  SELECT product_id, variant_weight, SUM(quantity) AS total_sold
  FROM public.sold_items
  GROUP BY product_id, variant_weight
) so ON so.product_id = v.product_id AND so.variant_weight = v.variant_weight
ORDER BY v.product_id ASC, v.variant_weight ASC;

-- ------------------------------------------------------------------------------
-- 7. TRIGGER FUNCTION: AUTO-SYNC products.stock_quantity ON ANY INVENTORY CHANGE
-- Keeps products.stock_quantity and products.in_stock synchronized with:
-- stock_items + new_stock_inventory - sold_items
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.fn_sync_product_inventory_quantity()
RETURNS TRIGGER AS $$
DECLARE
  target_product_id BIGINT;
  computed_stock INTEGER;
BEGIN
  -- Determine affected product id
  IF (TG_OP = 'DELETE') THEN
    target_product_id := OLD.product_id;
  ELSE
    target_product_id := NEW.product_id;
  END IF;

  -- Compute available quantity: Initial Stock + New Stock - Sold Stock
  SELECT GREATEST(0, (
    COALESCE((SELECT SUM(quantity) FROM public.stock_items WHERE product_id = target_product_id), 0) +
    COALESCE((SELECT SUM(quantity) FROM public.new_stock_inventory WHERE product_id = target_product_id), 0) -
    COALESCE((SELECT SUM(quantity) FROM public.sold_items WHERE product_id = target_product_id), 0)
  )) INTO computed_stock;

  -- Automatically update the main products table
  UPDATE public.products
  SET 
    stock_quantity = computed_stock,
    in_stock = (computed_stock > 0)
  WHERE id = target_product_id;

  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Attach triggers to all 3 tables
DROP TRIGGER IF EXISTS trg_sync_stock_items ON public.stock_items;
CREATE TRIGGER trg_sync_stock_items
AFTER INSERT OR UPDATE OR DELETE ON public.stock_items
FOR EACH ROW EXECUTE FUNCTION public.fn_sync_product_inventory_quantity();

DROP TRIGGER IF EXISTS trg_sync_new_stock ON public.new_stock_inventory;
CREATE TRIGGER trg_sync_new_stock
AFTER INSERT OR UPDATE OR DELETE ON public.new_stock_inventory
FOR EACH ROW EXECUTE FUNCTION public.fn_sync_product_inventory_quantity();

DROP TRIGGER IF EXISTS trg_sync_sold_items ON public.sold_items;
CREATE TRIGGER trg_sync_sold_items
AFTER INSERT OR UPDATE OR DELETE ON public.sold_items
FOR EACH ROW EXECUTE FUNCTION public.fn_sync_product_inventory_quantity();

-- ------------------------------------------------------------------------------
-- 8. SECURITY & ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.new_stock_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sold_items ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.stock_items TO anon, authenticated;
GRANT ALL ON TABLE public.new_stock_inventory TO anon, authenticated;
GRANT ALL ON TABLE public.sold_items TO anon, authenticated;
GRANT SELECT ON public.inventory_summary TO anon, authenticated;
GRANT SELECT ON public.inventory_variant_summary TO anon, authenticated;

-- Public read policies
DROP POLICY IF EXISTS "Allow public read on stock_items" ON public.stock_items;
CREATE POLICY "Allow public read on stock_items" ON public.stock_items FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public write on stock_items" ON public.stock_items;
CREATE POLICY "Allow public write on stock_items" ON public.stock_items FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on new_stock_inventory" ON public.new_stock_inventory;
CREATE POLICY "Allow public read on new_stock_inventory" ON public.new_stock_inventory FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public write on new_stock_inventory" ON public.new_stock_inventory;
CREATE POLICY "Allow public write on new_stock_inventory" ON public.new_stock_inventory FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public read on sold_items" ON public.sold_items;
CREATE POLICY "Allow public read on sold_items" ON public.sold_items FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public write on sold_items" ON public.sold_items;
CREATE POLICY "Allow public write on sold_items" ON public.sold_items FOR ALL TO public USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 9. ENABLE REALTIME BROADCASTS
-- ------------------------------------------------------------------------------
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.stock_items;
  EXCEPTION WHEN duplicate_object THEN
    -- Table already added to publication
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.new_stock_inventory;
  EXCEPTION WHEN duplicate_object THEN
    -- Table already added to publication
  END;

  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.sold_items;
  EXCEPTION WHEN duplicate_object THEN
    -- Table already added to publication
  END;
END $$;

-- ------------------------------------------------------------------------------
-- 10. SEED INITIAL STOCK FROM CURRENT PRODUCTS TABLE
-- Preserves existing inventory numbers as opening baseline stock
-- ------------------------------------------------------------------------------
INSERT INTO public.stock_items (product_id, variant_weight, quantity, notes)
SELECT 
  id, 
  'all', 
  COALESCE(stock_quantity, 0), 
  'Initial baseline stock migrated from products table'
FROM public.products
ON CONFLICT (product_id, variant_weight) 
DO UPDATE SET quantity = EXCLUDED.quantity;

-- ------------------------------------------------------------------------------
-- 11. ENSURE ORDERS TABLE SUPPORTS CHECKOUT WITH DEDUCTION TO SOLD_ITEMS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT,
  customer_phone TEXT,
  customer_email TEXT,
  shipping_address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  payment_method TEXT DEFAULT 'cod',
  payment_status TEXT DEFAULT 'pending',
  subtotal NUMERIC(10,2) DEFAULT 0,
  discount_amount NUMERIC(10,2) DEFAULT 0,
  discount_code TEXT,
  shipping_fee NUMERIC(10,2) DEFAULT 0,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS customer_phone TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_address TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'cod';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS payment_status TEXT DEFAULT 'pending';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS subtotal NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS discount_code TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC(10,2) DEFAULT 0;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS notes TEXT;
ALTER TABLE public.orders ALTER COLUMN customer_email DROP NOT NULL;

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.orders TO anon, authenticated;

DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
CREATE POLICY "Allow public insert on orders"
  ON public.orders FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on orders" ON public.orders;
CREATE POLICY "Allow public select on orders"
  ON public.orders FOR SELECT TO public USING (true);

-- Output confirmation
SELECT 'Successfully created 3 inventory tables (stock_items, new_stock_inventory, sold_items), views, triggers, and migrated initial baseline stock.' AS status;
