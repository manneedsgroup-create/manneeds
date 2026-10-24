-- ==============================================================================
-- FIX PERMISSIONS & ORDERS COLUMNS FOR MANNEEDS D2C CHECKOUT
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/aicgtlizgpcacdidoeut/sql
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CRITICAL: GRANT SEQUENCE PERMISSIONS
-- Fixes "permission denied for sequence sold_items_id_seq"
-- In PostgreSQL, BIGSERIAL tables use sequences. anon & authenticated need usage.
-- ------------------------------------------------------------------------------
GRANT USAGE, SELECT, UPDATE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT USAGE, SELECT, UPDATE ON SEQUENCES TO anon, authenticated;

-- ------------------------------------------------------------------------------
-- 2. ENSURE ORDERS TABLE HAS ALL INDIAN D2C CHECKOUT COLUMNS
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

-- Safe column additions if public.orders already exists
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

-- ------------------------------------------------------------------------------
-- 3. PERMISSIONS & ROW LEVEL SECURITY (RLS) FOR ORDERS & INVENTORY
-- ------------------------------------------------------------------------------
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sold_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.new_stock_inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stock_items ENABLE ROW LEVEL SECURITY;

GRANT ALL ON TABLE public.orders TO anon, authenticated;
GRANT ALL ON TABLE public.sold_items TO anon, authenticated;
GRANT ALL ON TABLE public.new_stock_inventory TO anon, authenticated;
GRANT ALL ON TABLE public.stock_items TO anon, authenticated;

-- Orders policies
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
CREATE POLICY "Allow public insert on orders"
  ON public.orders FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on orders" ON public.orders;
CREATE POLICY "Allow public select on orders"
  ON public.orders FOR SELECT TO public USING (true);

-- Sold items policies
DROP POLICY IF EXISTS "Allow public read on sold_items" ON public.sold_items;
CREATE POLICY "Allow public read on sold_items"
  ON public.sold_items FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public write on sold_items" ON public.sold_items;
CREATE POLICY "Allow public write on sold_items"
  ON public.sold_items FOR ALL TO public USING (true) WITH CHECK (true);

-- New stock inventory policies
DROP POLICY IF EXISTS "Allow public read on new_stock_inventory" ON public.new_stock_inventory;
CREATE POLICY "Allow public read on new_stock_inventory"
  ON public.new_stock_inventory FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public write on new_stock_inventory" ON public.new_stock_inventory;
CREATE POLICY "Allow public write on new_stock_inventory"
  ON public.new_stock_inventory FOR ALL TO public USING (true) WITH CHECK (true);

-- Stock items policies
DROP POLICY IF EXISTS "Allow public read on stock_items" ON public.stock_items;
CREATE POLICY "Allow public read on stock_items"
  ON public.stock_items FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public write on stock_items" ON public.stock_items;
CREATE POLICY "Allow public write on stock_items"
  ON public.stock_items FOR ALL TO public USING (true) WITH CHECK (true);

-- ------------------------------------------------------------------------------
-- 4. RELOAD POSTGREST SCHEMA CACHE
-- Forces Supabase API to immediately see the new columns
-- ------------------------------------------------------------------------------
NOTIFY pgrst, 'reload schema';

SELECT 'Successfully granted sequence permissions, updated orders columns, and configured RLS policies for instant checkout!' AS status;
