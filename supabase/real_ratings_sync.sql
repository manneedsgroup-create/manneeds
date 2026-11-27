-- ==============================================================================
-- MANNEEDS REAL D2C RATINGS RULE (ZERO FAKE RATINGS)
-- 1. Clears all seeded/random ratings on public.products (sets rating = 0, reviews = '0')
-- 2. Auto-computes real AVG(rating) & COUNT(*) on public.products whenever
--    a verified customer review is added, updated, or removed in public.reviews
-- Run this in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/aicgtlizgpcacdidoeut/sql/new
-- ==============================================================================

-- 1. Reset all seeded/random ratings to 0
UPDATE public.products
SET rating = 0, reviews = '0';

-- 2. Trigger function: recalculate product rating & count from published reviews
CREATE OR REPLACE FUNCTION public.sync_product_rating_from_reviews()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_product_name TEXT;
  v_avg NUMERIC(2,1);
  v_count INTEGER;
BEGIN
  v_product_name := COALESCE(NEW.product_name, OLD.product_name);
  IF v_product_name IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  SELECT
    COALESCE(ROUND(AVG(rating)::numeric, 1), 0),
    COUNT(*)
  INTO v_avg, v_count
  FROM public.reviews
  WHERE is_published = true
    AND (
      LOWER(TRIM(product_name)) = LOWER(TRIM(v_product_name))
      OR LOWER(REGEXP_REPLACE(TRIM(product_name), '^manneeds\s+', '', 'i')) = LOWER(REGEXP_REPLACE(TRIM(v_product_name), '^manneeds\s+', '', 'i'))
    );

  UPDATE public.products
  SET
    rating = v_avg,
    reviews = v_count::text
  WHERE LOWER(REGEXP_REPLACE(TRIM(name), '^manneeds\s+', '', 'i')) = LOWER(REGEXP_REPLACE(TRIM(v_product_name), '^manneeds\s+', '', 'i'));

  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trg_sync_product_rating ON public.reviews;
CREATE TRIGGER trg_sync_product_rating
  AFTER INSERT OR UPDATE OR DELETE ON public.reviews
  FOR EACH ROW EXECUTE FUNCTION public.sync_product_rating_from_reviews();

-- 3. Backfill from any existing published reviews in public.reviews
UPDATE public.products p
SET
  rating = COALESCE(sub.avg_rating, 0),
  reviews = COALESCE(sub.rev_count, 0)::text
FROM (
  SELECT
    LOWER(REGEXP_REPLACE(TRIM(product_name), '^manneeds\s+', '', 'i')) AS clean_name,
    ROUND(AVG(rating)::numeric, 1) AS avg_rating,
    COUNT(*) AS rev_count
  FROM public.reviews
  WHERE is_published = true
  GROUP BY 1
) sub
WHERE LOWER(REGEXP_REPLACE(TRIM(p.name), '^manneeds\s+', '', 'i')) = sub.clean_name;
