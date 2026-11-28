-- Add extended account profile & ₹99/year Harvest Club membership columns to public.customer_profiles
ALTER TABLE public.customer_profiles
  ADD COLUMN IF NOT EXISTS alt_phone text,
  ADD COLUMN IF NOT EXISTS landmark text,
  ADD COLUMN IF NOT EXISTS address_type text DEFAULT 'Home',
  ADD COLUMN IF NOT EXISTS dietary_pref text DEFAULT 'All Pure Foods',
  ADD COLUMN IF NOT EXISTS whatsapp_opt_in boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS gstin text,
  ADD COLUMN IF NOT EXISTS membership_tier text,
  ADD COLUMN IF NOT EXISTS membership_expires_at timestamptz,
  ADD COLUMN IF NOT EXISTS membership_payment_id text;
