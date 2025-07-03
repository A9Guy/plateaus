-- Update the stores table to include the new seller fields (checking for existing columns)
ALTER TABLE public.stores 
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS office_address TEXT,
ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS password_set BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS store_font_color TEXT DEFAULT '#000000';

-- Add check constraint for approval_status if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'stores_approval_status_check') THEN
        ALTER TABLE public.stores ADD CONSTRAINT stores_approval_status_check 
        CHECK (approval_status IN ('pending', 'approved', 'rejected'));
    END IF;
END $$;

-- Create a products table enhancement for seller dashboard
ALTER TABLE public.products
ADD COLUMN IF NOT EXISTS weight DECIMAL,
ADD COLUMN IF NOT EXISTS is_locally_made BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS origin_country TEXT,
ADD COLUMN IF NOT EXISTS origin_state TEXT,
ADD COLUMN IF NOT EXISTS quality_standard INTEGER;

-- Add check constraint for quality_standard if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'products_quality_standard_check') THEN
        ALTER TABLE public.products ADD CONSTRAINT products_quality_standard_check 
        CHECK (quality_standard >= 0 AND quality_standard <= 100);
    END IF;
END $$;

-- Create seller messages table for customer-seller communication
CREATE TABLE IF NOT EXISTS public.seller_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seller_id UUID NOT NULL,
  customer_id UUID NOT NULL,
  product_id UUID,
  message TEXT NOT NULL,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'seller')),
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create market comparison table for pricing
CREATE TABLE IF NOT EXISTS public.market_pricing (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID NOT NULL,
  current_price DECIMAL NOT NULL,
  market_average_price DECIMAL,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS for new tables
ALTER TABLE public.seller_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_pricing ENABLE ROW LEVEL SECURITY;

-- RLS policies for seller messages
DROP POLICY IF EXISTS "Sellers can manage their messages" ON public.seller_messages;
CREATE POLICY "Sellers can manage their messages" 
ON public.seller_messages 
FOR ALL 
USING (
  seller_id IN (
    SELECT merchant_id FROM stores WHERE merchant_id = auth.uid()
  ) OR 
  customer_id = auth.uid()
);

-- RLS policies for market pricing
DROP POLICY IF EXISTS "Sellers can view their product pricing" ON public.market_pricing;
CREATE POLICY "Sellers can view their product pricing" 
ON public.market_pricing 
FOR SELECT 
USING (
  product_id IN (
    SELECT p.id FROM products p 
    JOIN stores s ON p.store_id = s.id 
    WHERE s.merchant_id = auth.uid()
  )
);

DROP POLICY IF EXISTS "Anyone can view pricing for active products" ON public.market_pricing;
CREATE POLICY "Anyone can view pricing for active products" 
ON public.market_pricing 
FOR SELECT 
USING (
  product_id IN (
    SELECT id FROM products WHERE status = 'active'
  )
);

-- Add triggers for updated_at (with check for existence)
DROP TRIGGER IF EXISTS update_seller_messages_updated_at ON public.seller_messages;
CREATE TRIGGER update_seller_messages_updated_at
BEFORE UPDATE ON public.seller_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraints (with existence checks)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'seller_messages_seller_id_fkey') THEN
        ALTER TABLE public.seller_messages
        ADD CONSTRAINT seller_messages_seller_id_fkey 
        FOREIGN KEY (seller_id) REFERENCES profiles(user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'seller_messages_customer_id_fkey') THEN
        ALTER TABLE public.seller_messages
        ADD CONSTRAINT seller_messages_customer_id_fkey 
        FOREIGN KEY (customer_id) REFERENCES profiles(user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'seller_messages_product_id_fkey') THEN
        ALTER TABLE public.seller_messages
        ADD CONSTRAINT seller_messages_product_id_fkey 
        FOREIGN KEY (product_id) REFERENCES products(id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'market_pricing_product_id_fkey') THEN
        ALTER TABLE public.market_pricing
        ADD CONSTRAINT market_pricing_product_id_fkey 
        FOREIGN KEY (product_id) REFERENCES products(id);
    END IF;
END $$;

-- Update stores table RLS policy to include approval status
DROP POLICY IF EXISTS "Anyone can view active stores" ON public.stores;
DROP POLICY IF EXISTS "Anyone can view approved active stores" ON public.stores;
CREATE POLICY "Anyone can view approved active stores" 
ON public.stores 
FOR SELECT 
USING (is_active = true AND approval_status = 'approved');