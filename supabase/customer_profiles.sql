-- ==============================================================================
-- MANNEEDS CROSS-DEVICE CUSTOMER PROFILES (SYNCED ACROSS ALL DEVICES)
-- Stores saved delivery address & phone for Firebase Google / Mobile OTP users
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/aicgtlizgpcacdidoeut/sql/new
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.customer_profiles (
  firebase_uid TEXT PRIMARY KEY,
  email TEXT,
  phone TEXT,
  full_name TEXT,
  avatar_url TEXT,
  provider TEXT DEFAULT 'google',
  shipping_address TEXT,
  city TEXT,
  state TEXT,
  pincode TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_customer_profiles_email ON public.customer_profiles (email);
CREATE INDEX IF NOT EXISTS idx_customer_profiles_phone ON public.customer_profiles (phone);

ALTER TABLE public.customer_profiles ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.customer_profiles TO anon, authenticated;

DROP POLICY IF EXISTS "Allow public read customer_profiles" ON public.customer_profiles;
CREATE POLICY "Allow public read customer_profiles"
  ON public.customer_profiles FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public insert customer_profiles" ON public.customer_profiles;
CREATE POLICY "Allow public insert customer_profiles"
  ON public.customer_profiles FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update customer_profiles" ON public.customer_profiles;
CREATE POLICY "Allow public update customer_profiles"
  ON public.customer_profiles FOR UPDATE TO public USING (true) WITH CHECK (true);
