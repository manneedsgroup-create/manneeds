-- ==============================================================================
-- REMOVE "ManNeeds " PREFIX FROM ALL PRODUCTS IN SUPABASE
-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- 1. Strip "ManNeeds " (case-insensitive) from existing products
UPDATE public.products
SET name = REGEXP_REPLACE(name, '^ManNeeds\s+', '', 'i')
WHERE name ILIKE 'ManNeeds %';

-- 2. Strip "ManNeeds " if stored in any orders notes
UPDATE public.orders
SET notes = REPLACE(notes, 'ManNeeds ', '')
WHERE notes ILIKE '%ManNeeds %';

-- 3. Notify PostgREST to refresh its schema cache
NOTIFY pgrst, 'reload schema';

-- 4. Verification Query: Confirm all product names are cleaned
SELECT id, name, category, stock_quantity 
FROM public.products 
ORDER BY id ASC;
