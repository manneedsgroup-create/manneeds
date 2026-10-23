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
  reviews TEXT DEFAULT '100+',
  badge TEXT,
  description TEXT NOT NULL,
  image_url TEXT,
  stock_quantity INTEGER DEFAULT 0,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure stock_quantity column exists if table was created previously
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='products' AND column_name='stock_quantity') THEN
    ALTER TABLE public.products ADD COLUMN stock_quantity INTEGER DEFAULT 0;
  END IF;
END $$;

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

-- 4. ORDERS TABLE
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

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Allow public read access on products
DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
CREATE POLICY "Allow public read access on products"
  ON public.products FOR SELECT
  TO public
  USING (true);

-- Allow public insert on subscribers
DROP POLICY IF EXISTS "Allow public insert on subscribers" ON public.subscribers;
CREATE POLICY "Allow public insert on subscribers"
  ON public.subscribers FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public insert on quiz_leads
DROP POLICY IF EXISTS "Allow public insert on quiz_leads" ON public.quiz_leads;
CREATE POLICY "Allow public insert on quiz_leads"
  ON public.quiz_leads FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow public insert on orders
DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
CREATE POLICY "Allow public insert on orders"
  ON public.orders FOR INSERT
  TO public
  WITH CHECK (true);

-- ==============================================================================
-- ALL 16 PRODUCTS FROM MANNEEDS INVENTORY SPREADSHEET (STOCK AS OF 31.07.2026)
-- ==============================================================================

INSERT INTO public.products (id, name, category, flavour, price, original_price, discount, rating, reviews, badge, description, stock_quantity, in_stock)
VALUES 
  -- 1. PERI PERI SNACKS (Stock: 34)
  (
    1,
    'ManNeeds Peri Peri Snacks',
    'Healthy Snacks',
    'Fiery Peri Peri',
    '₹149',
    '₹199',
    '25% OFF',
    4.8,
    '320',
    'Hot Seller',
    'Crispy roasted superfood snacks dusted with zesty African bird’s eye chilli and aromatic herbs. Zero trans fat.',
    34,
    true
  ),
  -- 2. CHAT MASALA SNACKS (Stock: 43)
  (
    2,
    'ManNeeds Chat Masala Snacks',
    'Healthy Snacks',
    'Tangy Desi Chat',
    '₹149',
    '₹199',
    '25% OFF',
    4.9,
    '410',
    'Customer Favorite',
    'Crunchy roasted wholesome snacks coated in tangy Himalayan black salt, dry mango, and roasted cumin.',
    43,
    true
  ),
  -- 3. SALTED SNACKS (Stock: 17)
  (
    3,
    'ManNeeds Salted Snacks',
    'Healthy Snacks',
    'Classic Pink Salt',
    '₹139',
    '₹179',
    '22% OFF',
    4.7,
    '180',
    'Clean Munch',
    'Lightly roasted everyday crunch seasoned with pure mineral-rich pink Himalayan rock salt. Guilt-free snacking.',
    17,
    true
  ),
  -- 4. MANGO CANDY (Stock: 8)
  (
    4,
    'ManNeeds Mango Candy',
    'Real Fruit Candies',
    'Alphonso Mango',
    '₹199',
    '₹249',
    '20% OFF',
    4.9,
    '540',
    'Only 8 Left!',
    'Chewy, burst-in-your-mouth natural fruit bites made from 100% real sun-ripened mango pulp. Zero gelatin.',
    8,
    true
  ),
  -- 5. JACKFRUIT CANDY (Stock: 26)
  (
    5,
    'ManNeeds Jackfruit Candy',
    'Real Fruit Candies',
    'Ripe Kathal Honey',
    '₹219',
    '₹269',
    '18% OFF',
    4.8,
    '220',
    'Exotic Plant Bite',
    'Sweet and aromatic fruit chewies hand-crafted from farm-fresh ripe jackfruit pulp. Rich in natural dietary fiber.',
    26,
    true
  ),
  -- 6. BANANA CANDY (Stock: 12)
  (
    6,
    'ManNeeds Banana Candy',
    'Real Fruit Candies',
    'Caramelized Banana',
    '₹179',
    '₹219',
    '18% OFF',
    4.7,
    '160',
    'Pocket Energy',
    'Naturally sweet and chewy bite-sized banana fruit gems. An instant healthy stamina boost whenever you need it.',
    12,
    true
  ),
  -- 7. PUMKIN CANDY (Stock: 23)
  (
    7,
    'ManNeeds Pumpkin Candy',
    'Real Fruit Candies',
    'Spiced Pumpkin Gold',
    '₹189',
    '₹239',
    '21% OFF',
    4.8,
    '195',
    'Nutrient Dense',
    'Soft chewable vitamin-rich fruit bites made with slow-roasted pumpkin purée and natural jaggery.',
    23,
    true
  ),
  -- 8. DRIED MANGO CHIPS (Stock: 51)
  (
    8,
    'ManNeeds Dried Mango Chips',
    'Dried Fruit Chips',
    'Sun-Dried Golden Mango',
    '₹249',
    '₹329',
    '24% OFF',
    4.9,
    '680',
    'Bestseller Crunch',
    '100% pure real mango slices, vacuum-crisped with zero added refined sugar and zero palm oil.',
    51,
    true
  ),
  -- 9. DRIED JACKFRUIT CHIPS (Stock: 111)
  (
    9,
    'ManNeeds Dried Jackfruit Chips',
    'Dried Fruit Chips',
    'Crisp Jackfruit & Rock Salt',
    '₹229',
    '₹299',
    '23% OFF',
    4.9,
    '890',
    'Mega Stocked (111)',
    'Golden crispy jackfruit chips packed with gut-friendly dietary fiber. The ultimate guilt-free teatime munch.',
    111,
    true
  ),
  -- 10. DRIED BANANA CHIPS (Stock: 38)
  (
    10,
    'ManNeeds Dried Banana Chips',
    'Dried Fruit Chips',
    'Crisp Nendran Banana',
    '₹199',
    '₹259',
    '23% OFF',
    4.8,
    '430',
    'Traditional Crunch',
    'Thinly sliced, slow-crisped raw bananas lightly dusted with sea salt for that authentic, irresistible crunch.',
    38,
    true
  ),
  -- 11. MANGO POWDER (Stock: 120)
  (
    11,
    'ManNeeds Mango Powder',
    'Herbal & Superfood Powders',
    'Pure Raw Amchur',
    '₹299',
    '₹399',
    '25% OFF',
    4.9,
    '750',
    'Kitchen Staple (120)',
    '100% pure raw unrefined mango powder. Perfect for digestive detox drinks, morning tonics, and tangy recipes.',
    120,
    true
  ),
  -- 12. THANKUNI POWDER (Stock: 2)
  (
    12,
    'ManNeeds Thankuni Powder',
    'Herbal & Superfood Powders',
    'Gotu Kola Leaf Extract',
    '₹349',
    '₹449',
    '22% OFF',
    5.0,
    '340',
    'Only 2 In Stock!',
    'Rare organic Thankuni (Centella Asiatica / Gotu Kola) leaf powder. Ancient Ayurvedic botanical for gut lining & mental focus.',
    2,
    true
  ),
  -- 13. CHALKUMRO POWDER (Stock: 76)
  (
    13,
    'ManNeeds Chalkumro Powder',
    'Herbal & Superfood Powders',
    'Pure Ash Gourd Alkaline',
    '₹319',
    '₹419',
    '24% OFF',
    4.8,
    '510',
    'Daily Detox (76)',
    '100% pure dehydrated Ash Gourd (Winter Melon) powder. Highly alkalising, calming morning elixir for acidity relief.',
    76,
    true
  ),
  -- 14. LEMON POWDER (Stock: 11)
  (
    14,
    'ManNeeds Lemon Powder',
    'Herbal & Superfood Powders',
    'Zesty Citrus Vitamin C',
    '₹269',
    '₹349',
    '23% OFF',
    4.8,
    '290',
    'Vitamin C Boost',
    'Spray-dried natural whole lemon extract powder. Instant refreshing citrus hydration and daily antioxidant support.',
    11,
    true
  ),
  -- 15. MORINGA POWDER (Stock: 24)
  (
    15,
    'ManNeeds Moringa Powder',
    'Herbal & Superfood Powders',
    'Miracle Leaf Green',
    '₹329',
    '₹429',
    '23% OFF',
    4.9,
    '920',
    'Superfood Powerhouse',
    'Organically cultivated whole drumstick tree (Moringa Oleifera) green leaf powder. 7x more Vitamin C than oranges.',
    24,
    true
  ),
  -- 16. BANANA POWDER (Stock: 10)
  (
    16,
    'ManNeeds Banana Powder',
    'Herbal & Superfood Powders',
    'Raw Plantain Prebiotic',
    '₹279',
    '₹359',
    '22% OFF',
    4.7,
    '215',
    'Gut Prebiotic (10)',
    'Resistant starch-rich green plantain banana flour powder. Promotes beneficial gut flora and smooth digestion.',
    10,
    true
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  flavour = EXCLUDED.flavour,
  price = EXCLUDED.price,
  original_price = EXCLUDED.original_price,
  discount = EXCLUDED.discount,
  rating = EXCLUDED.rating,
  reviews = EXCLUDED.reviews,
  badge = EXCLUDED.badge,
  description = EXCLUDED.description,
  stock_quantity = EXCLUDED.stock_quantity,
  in_stock = EXCLUDED.in_stock;
