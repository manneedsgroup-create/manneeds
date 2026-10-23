-- ==============================================================================
-- MANNEEDS DATABASE SCHEMA & SEED DATA (SUPABASE / POSTGRESQL)
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  flavour TEXT,
  price TEXT NOT NULL,
  original_price TEXT,
  discount TEXT,
  rating NUMERIC(2,1) DEFAULT 4.9,
  reviews TEXT DEFAULT '1,000+',
  badge TEXT,
  description TEXT NOT NULL,
  image_url TEXT,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  coupon_code TEXT DEFAULT 'MANNEEDS15',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. QUIZ LEADS TABLE
CREATE TABLE IF NOT EXISTS public.quiz_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  concern TEXT,
  preferred_format TEXT,
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. ORDERS TABLE (For shopping cart checkouts)
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT,
  customer_email TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow anyone (public/anon) to read products
DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
CREATE POLICY "Allow public read access on products"
  ON public.products FOR SELECT
  TO public
  USING (true);

-- Allow anyone to join the newsletter
DROP POLICY IF EXISTS "Allow public insert on subscribers" ON public.subscribers;
CREATE POLICY "Allow public insert on subscribers"
  ON public.subscribers FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to submit the quiz
DROP POLICY IF EXISTS "Allow public insert on quiz_leads" ON public.quiz_leads;
CREATE POLICY "Allow public insert on quiz_leads"
  ON public.quiz_leads FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to create an order
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
CREATE POLICY "Allow public insert on orders"
  ON public.orders FOR INSERT
  TO public
  WITH CHECK (true);

-- ==============================================================================
-- INITIAL SEED DATA FOR PRODUCTS
-- ==============================================================================

INSERT INTO public.products (id, name, category, flavour, price, original_price, discount, rating, reviews, badge, description, in_stock)
VALUES 
  (
    1,
    'ManNeeds Apple Cider Vinegar Effervescent Fizz',
    'Drop & Fizz',
    'Pomegranate Burst',
    '₹699',
    '₹999',
    '30% OFF',
    4.9,
    '8,420',
    'India’s #1 ACV Fizz',
    'Pure Himalayan ACV with "The Mother", Vitamin B6 & B12 for gut detox and healthy weight management without the pungent taste.',
    true
  ),
  (
    2,
    'ManNeeds Rosemary Advanced Hair Growth Serum',
    'Hair Care',
    'Scalp Actives',
    '₹849',
    '₹1,199',
    '29% OFF',
    4.8,
    '5,910',
    'Clinical Favorite',
    'Targeted scalp concentrate powered by 3% Redensyl, 4% Baicapil, and pure Rosemary extract to stimulate dormant follicles.',
    true
  ),
  (
    3,
    'ManNeeds Glutathione Skin Glow Effervescent Drink',
    'Skin Glow',
    'Fruity Strawberry',
    '₹999',
    '₹1,400',
    '28% OFF',
    4.9,
    '12,300',
    'Mega Bestseller',
    '500mg L-Glutathione, Hyaluronic Acid & Berry Extracts for radiant skin luminosity and reduced dark spots from within.',
    true
  ),
  (
    4,
    'ManNeeds Super Greens & Debloat Effervescent',
    'Daily Wellness',
    'Zesty Green Citrus',
    '₹649',
    '₹899',
    '27% OFF',
    4.7,
    '4,150',
    'Instant Debloat',
    '35+ alkalising superfoods, spirulina, wheatgrass & digestive enzymes that ease acidity and bloating in minutes.',
    true
  )
ON CONFLICT (id) DO NOTHING;
