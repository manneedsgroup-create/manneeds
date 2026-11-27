-- ==============================================================================
-- MANNEEDS PRODUCT REELS & PROMOTIONAL VIDEOS TABLE
-- Add Instagram Reels, Facebook Reels, YouTube Shorts, or MP4 links here
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/aicgtlizgpcacdidoeut/sql/new
-- ==============================================================================

CREATE TABLE IF NOT EXISTS public.reels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  platform TEXT NOT NULL DEFAULT 'instagram' CHECK (platform IN ('instagram', 'facebook', 'youtube', 'mp4')),
  reel_url TEXT NOT NULL,
  product_name TEXT,
  is_published BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reels_published_order
  ON public.reels (is_published, sort_order ASC, created_at DESC);

ALTER TABLE public.reels ENABLE ROW LEVEL SECURITY;

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON TABLE public.reels TO anon, authenticated;

DROP POLICY IF EXISTS "Allow public read published reels" ON public.reels;
CREATE POLICY "Allow public read published reels"
  ON public.reels FOR SELECT TO public
  USING (is_published = true);

ALTER PUBLICATION supabase_realtime ADD TABLE public.reels;
