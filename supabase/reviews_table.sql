-- ==============================================================================
-- MANNEEDS VERIFIED CUSTOMER REVIEWS TABLE
-- Pulls real post-delivery ratings submitted via /review link or WhatsApp
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id TEXT,
  customer_name TEXT NOT NULL,
  city TEXT,
  product_name TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'link' CHECK (source IN ('link', 'whatsapp')),
  is_verified BOOLEAN NOT NULL DEFAULT true,
  is_published BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reviews_published_created
  ON public.reviews (is_published, created_at DESC);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.reviews TO anon, authenticated;

DROP POLICY IF EXISTS "Allow public read published reviews" ON public.reviews;
CREATE POLICY "Allow public read published reviews"
  ON public.reviews FOR SELECT TO public
  USING (is_published = true);

DROP POLICY IF EXISTS "Allow public insert reviews" ON public.reviews;
CREATE POLICY "Allow public insert reviews"
  ON public.reviews FOR INSERT TO public
  WITH CHECK (true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.reviews;
