-- ==============================================================================
-- MANNEEDS VERIFIED CUSTOMER ACCOUNTS (GOOGLE, APPLE & MOBILE OTP)
-- Links Supabase Auth (auth.users) -> public.customers -> public.orders & reviews
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. CREATE CUSTOMERS TABLE
CREATE TABLE IF NOT EXISTS public.customers (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  phone TEXT,
  avatar_url TEXT,
  provider TEXT DEFAULT 'phone',
  shipping_address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  total_orders INTEGER NOT NULL DEFAULT 0,
  total_spent NUMERIC(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. LINK ORDERS & REVIEWS TO AUTHENTICATED CUSTOMERS
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;
ALTER TABLE public.reviews ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders (user_id, created_at DESC);

-- 3. AUTO-CREATE / UPDATE CUSTOMER PROFILE ON GOOGLE, APPLE, OR MOBILE OTP SIGN-IN
CREATE OR REPLACE FUNCTION public.handle_new_auth_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_provider TEXT;
  v_name TEXT;
  v_avatar TEXT;
BEGIN
  v_provider := COALESCE(NEW.raw_app_meta_data->>'provider', CASE WHEN NEW.phone IS NOT NULL THEN 'phone' ELSE 'email' END);
  v_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    NULL
  );
  v_avatar := COALESCE(
    NEW.raw_user_meta_data->>'avatar_url',
    NEW.raw_user_meta_data->>'picture',
    NULL
  );

  INSERT INTO public.customers (id, full_name, email, phone, avatar_url, provider)
  VALUES (NEW.id, v_name, NEW.email, NEW.phone, v_avatar, v_provider)
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(EXCLUDED.email, public.customers.email),
    phone = COALESCE(EXCLUDED.phone, public.customers.phone),
    full_name = COALESCE(public.customers.full_name, EXCLUDED.full_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, public.customers.avatar_url),
    provider = COALESCE(EXCLUDED.provider, public.customers.provider),
    updated_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT OR UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_auth_user();

-- 4. AUTO-UPDATE CUSTOMER ORDER STATS & SAVED ADDRESS ON NEW ORDER
CREATE OR REPLACE FUNCTION public.sync_customer_order_stats()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.user_id IS NOT NULL THEN
    UPDATE public.customers
    SET
      total_orders = total_orders + 1,
      total_spent = total_spent + COALESCE(NEW.total_amount, 0),
      full_name = COALESCE(full_name, NEW.customer_name),
      phone = COALESCE(phone, NEW.customer_phone),
      shipping_address = COALESCE(NEW.shipping_address, shipping_address),
      city = COALESCE(NEW.city, city),
      state = COALESCE(NEW.state, state),
      pincode = COALESCE(NEW.pincode, pincode),
      updated_at = now()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_order_sync_customer ON public.orders;
CREATE TRIGGER on_order_sync_customer
  AFTER INSERT ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.sync_customer_order_stats();

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.customers TO authenticated;

DROP POLICY IF EXISTS "Users can view own customer profile" ON public.customers;
CREATE POLICY "Users can view own customer profile"
  ON public.customers FOR SELECT TO authenticated
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own customer profile" ON public.customers;
CREATE POLICY "Users can insert own customer profile"
  ON public.customers FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own customer profile" ON public.customers;
CREATE POLICY "Users can update own customer profile"
  ON public.customers FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
