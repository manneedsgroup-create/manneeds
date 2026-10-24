-- ==============================================================================
-- MANNEEDS DATABASE SCHEMA & COMPLETE 22 PRODUCTS WITH WEIGHT VARIANTS
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. CREATE PRODUCTS TABLE (WITH VARIANTS JSONB & STOCK QUANTITY)
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
  variants JSONB DEFAULT '[]'::jsonb,
  in_stock BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ensure variants & stock_quantity columns exist if table was created previously
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS variants JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;

-- 2. CREATE SUPPORTING TABLES
CREATE TABLE IF NOT EXISTS public.subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  coupon_code TEXT DEFAULT 'MANNEEDS15',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.quiz_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  concern TEXT,
  preferred_format TEXT,
  recommendation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT,
  customer_email TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC(10,2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. PERMISSIONS & ROW LEVEL SECURITY (RLS)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.products TO anon, authenticated;
GRANT ALL ON TABLE public.subscribers TO anon, authenticated;
GRANT ALL ON TABLE public.quiz_leads TO anon, authenticated;
GRANT ALL ON TABLE public.orders TO anon, authenticated;

DROP POLICY IF EXISTS "Allow public read access on products" ON public.products;
CREATE POLICY "Allow public read access on products"
  ON public.products FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public insert on subscribers" ON public.subscribers;
CREATE POLICY "Allow public insert on subscribers"
  ON public.subscribers FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert on quiz_leads" ON public.quiz_leads;
CREATE POLICY "Allow public insert on quiz_leads"
  ON public.quiz_leads FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public insert on orders" ON public.orders;
CREATE POLICY "Allow public insert on orders"
  ON public.orders FOR INSERT TO public WITH CHECK (true);

-- Enable realtime updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.products;

-- ==============================================================================
-- 4. INSERT / SYNC ALL 22 PRODUCTS WITH WEIGHT VARIANTS (100g, 200g, etc.)
-- ==============================================================================

INSERT INTO public.products (id, name, category, flavour, price, original_price, discount, rating, reviews, badge, description, stock_quantity, variants, in_stock)
VALUES 
  -- 1. PERI PERI SNACKS
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
    'Crispy roasted superfood snacks dusted with zesty African bird’s eye chilli and herbs.',
    45,
    '[{"weight": "100g", "price": "₹149", "original_price": "₹199", "stock": 30}, {"weight": "200g", "price": "₹269", "original_price": "₹379", "stock": 15}]'::jsonb,
    true
  ),
  -- 2. CHAT MASALA SNACKS
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
    'Crunchy roasted wholesome snacks coated in tangy Himalayan black salt and amchur.',
    43,
    '[{"weight": "100g", "price": "₹149", "original_price": "₹199", "stock": 25}, {"weight": "200g", "price": "₹269", "original_price": "₹379", "stock": 18}]'::jsonb,
    true
  ),
  -- 3. SALTED SNACKS
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
    'Lightly roasted everyday crunch seasoned with pure mineral-rich pink Himalayan rock salt.',
    17,
    '[{"weight": "100g", "price": "₹139", "original_price": "₹179", "stock": 10}, {"weight": "200g", "price": "₹249", "original_price": "₹349", "stock": 7}]'::jsonb,
    true
  ),
  -- 4. MANGO CANDY
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
    'Chewy, burst-in-your-mouth natural fruit bites made from 100% real sun-ripened mango pulp.',
    8,
    '[{"weight": "100g", "price": "₹199", "original_price": "₹249", "stock": 5}, {"weight": "200g", "price": "₹369", "original_price": "₹479", "stock": 3}]'::jsonb,
    true
  ),
  -- 5. JACKFRUIT CANDY
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
    'Sweet and aromatic fruit chewies hand-crafted from farm-fresh ripe jackfruit pulp.',
    26,
    '[{"weight": "100g", "price": "₹219", "original_price": "₹269", "stock": 16}, {"weight": "200g", "price": "₹399", "original_price": "₹499", "stock": 10}]'::jsonb,
    true
  ),
  -- 6. BANANA CANDY
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
    'Naturally sweet and chewy bite-sized banana fruit gems. Instant healthy energy on the go.',
    12,
    '[{"weight": "100g", "price": "₹179", "original_price": "₹219", "stock": 8}, {"weight": "200g", "price": "₹329", "original_price": "₹419", "stock": 4}]'::jsonb,
    true
  ),
  -- 7. PUMPKIN CANDY
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
    '[{"weight": "100g", "price": "₹189", "original_price": "₹239", "stock": 15}, {"weight": "200g", "price": "₹349", "original_price": "₹449", "stock": 8}]'::jsonb,
    true
  ),
  -- 8. DRIED MANGO CHIPS
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
    '[{"weight": "100g", "price": "₹249", "original_price": "₹329", "stock": 31}, {"weight": "200g", "price": "₹459", "original_price": "₹629", "stock": 20}]'::jsonb,
    true
  ),
  -- 9. DRIED JACKFRUIT CHIPS
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
    '[{"weight": "100g", "price": "₹229", "original_price": "₹299", "stock": 70}, {"weight": "200g", "price": "₹419", "original_price": "₹569", "stock": 41}]'::jsonb,
    true
  ),
  -- 10. DRIED BANANA CHIPS
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
    'Thinly sliced, slow-crisped raw bananas lightly dusted with sea salt for authentic crunch.',
    38,
    '[{"weight": "100g", "price": "₹199", "original_price": "₹259", "stock": 25}, {"weight": "200g", "price": "₹369", "original_price": "₹489", "stock": 13}]'::jsonb,
    true
  ),
  -- 11. MANGO POWDER
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
    'Kitchen Staple',
    '100% pure raw unrefined mango powder for digestive detox drinks and recipes.',
    120,
    '[{"weight": "100g", "price": "₹299", "original_price": "₹399", "stock": 70}, {"weight": "200g", "price": "₹549", "original_price": "₹749", "stock": 50}]'::jsonb,
    true
  ),
  -- 12. THANKUNI POWDER
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
    'Rare organic Thankuni (Centella Asiatica / Gotu Kola) leaf powder for gut lining & mental focus.',
    2,
    '[{"weight": "100g", "price": "₹349", "original_price": "₹449", "stock": 2}, {"weight": "200g", "price": "₹649", "original_price": "₹849", "stock": 0}]'::jsonb,
    true
  ),
  -- 13. CHALKUMRO POWDER
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
    'Daily Detox',
    '100% pure dehydrated Ash Gourd (Winter Melon) powder for morning alkaline detox.',
    76,
    '[{"weight": "100g", "price": "₹319", "original_price": "₹419", "stock": 46}, {"weight": "200g", "price": "₹589", "original_price": "₹799", "stock": 30}]'::jsonb,
    true
  ),
  -- 14. LEMON POWDER
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
    'Spray-dried natural whole lemon extract powder for refreshing citrus immunity.',
    11,
    '[{"weight": "100g", "price": "₹269", "original_price": "₹349", "stock": 8}, {"weight": "200g", "price": "₹489", "original_price": "₹649", "stock": 3}]'::jsonb,
    true
  ),
  -- 15. MORINGA POWDER
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
    'Organically cultivated whole Moringa Oleifera leaf powder. 7x more Vitamin C than oranges.',
    24,
    '[{"weight": "100g", "price": "₹329", "original_price": "₹429", "stock": 15}, {"weight": "200g", "price": "₹599", "original_price": "₹799", "stock": 9}]'::jsonb,
    true
  ),
  -- 16. BANANA POWDER
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
    'Resistant starch-rich green plantain banana flour powder for healthy gut flora and digestion.',
    10,
    '[{"weight": "100g", "price": "₹279", "original_price": "₹359", "stock": 7}, {"weight": "200g", "price": "₹519", "original_price": "₹689", "stock": 3}]'::jsonb,
    true
  ),
  -- 17. OKRA POWDER (NEW)
  (
    17,
    'ManNeeds Okra Powder',
    'Herbal & Superfood Powders',
    'Pure Ladyfinger Extract',
    '₹289',
    '₹379',
    '24% OFF',
    4.8,
    '140',
    'Blood Sugar & Fiber',
    '100% dehydrated green Okra (Bhindi) pod powder. Rich in natural mucilage and soluble fiber for digestive health.',
    30,
    '[{"weight": "100g", "price": "₹289", "original_price": "₹379", "stock": 20}, {"weight": "200g", "price": "₹529", "original_price": "₹699", "stock": 10}]'::jsonb,
    true
  ),
  -- 18. KULEKHARA POWDER (NEW)
  (
    18,
    'ManNeeds Kulekhara Powder',
    'Herbal & Superfood Powders',
    'Ayurvedic Iron Elixir',
    '₹319',
    '₹419',
    '24% OFF',
    4.9,
    '380',
    'Hemoglobin Booster',
    'Potent wild Kulekhara (Hygrophila spinosa) leaf powder. Renowned in Ayurvedic tradition for boosting natural iron & RBC count.',
    45,
    '[{"weight": "100g", "price": "₹319", "original_price": "₹419", "stock": 30}, {"weight": "200g", "price": "₹589", "original_price": "₹799", "stock": 15}]'::jsonb,
    true
  ),
  -- 19. CHALTA POWDER (NEW)
  (
    19,
    'ManNeeds Chalta Powder',
    'Herbal & Superfood Powders',
    'Elephant Apple Tang',
    '₹279',
    '₹369',
    '24% OFF',
    4.7,
    '110',
    'Traditional Digestive',
    'Sun-dried and powdered wild Chalta (Elephant Apple / Dillenia indica). Abundant in natural fruit tannins and vitamin C.',
    25,
    '[{"weight": "100g", "price": "₹279", "original_price": "₹369", "stock": 15}, {"weight": "200g", "price": "₹499", "original_price": "₹699", "stock": 10}]'::jsonb,
    true
  ),
  -- 20. PROTEIN & VITAMIN POWDER (NEW)
  (
    20,
    'ManNeeds Protein & Vitamin Powder',
    'Herbal & Superfood Powders',
    'Vanilla Malt Berry',
    '₹599',
    '₹799',
    '25% OFF',
    4.9,
    '640',
    'Complete Daily Nutrition',
    'Plant-powered complete multi-protein blend enriched with 21 essential micronutrients, vitamins, and minerals. Zero bloating.',
    50,
    '[{"weight": "200g", "price": "₹599", "original_price": "₹799", "stock": 30}, {"weight": "500g", "price": "₹1,299", "original_price": "₹1,699", "stock": 20}]'::jsonb,
    true
  ),
  -- 21. AMLA POWDER (NEW)
  (
    21,
    'ManNeeds Amla Powder',
    'Herbal & Superfood Powders',
    'Pure Indian Gooseberry',
    '₹229',
    '₹299',
    '23% OFF',
    4.9,
    '890',
    'Vitamin C Powerhouse',
    'Cold-processed raw organic Amla fruit powder. Packed with high-bioavailability vitamin C and collagen-boosting antioxidants.',
    60,
    '[{"weight": "100g", "price": "₹229", "original_price": "₹299", "stock": 40}, {"weight": "200g", "price": "₹399", "original_price": "₹549", "stock": 20}]'::jsonb,
    true
  ),
  -- 22. PREMIUM HONEY (NEW)
  (
    22,
    'ManNeeds Premium Honey',
    'Raw Honey & Pure Elixirs',
    'Wild Sundarban Floral',
    '₹399',
    '₹499',
    '20% OFF',
    5.0,
    '520',
    '100% Pure Forest Raw',
    'Unprocessed, unpasteurized natural wild forest honey. Retains all natural pollen, live enzymes, and antibacterial benefits.',
    40,
    '[{"weight": "250g", "price": "₹399", "original_price": "₹499", "stock": 25}, {"weight": "500g", "price": "₹729", "original_price": "₹949", "stock": 15}]'::jsonb,
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
  variants = EXCLUDED.variants,
  in_stock = EXCLUDED.in_stock;
