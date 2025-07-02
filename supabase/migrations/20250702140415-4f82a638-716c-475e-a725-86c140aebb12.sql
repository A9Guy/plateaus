-- Update stores table to include selling location information
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS selling_location_type text;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS market_name text;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS shop_number text;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS physical_address text;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS home_address text;

-- Add check constraint for valid selling location types
ALTER TABLE public.stores ADD CONSTRAINT valid_selling_location_type 
CHECK (selling_location_type IN ('public-market', 'single-shop', 'home-based') OR selling_location_type IS NULL);

-- Update the profiles table to enable leaked password protection
-- This will be handled through Supabase dashboard settings