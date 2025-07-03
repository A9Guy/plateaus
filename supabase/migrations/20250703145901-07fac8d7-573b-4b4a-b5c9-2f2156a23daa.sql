-- Update the stores table to include the new seller fields
ALTER TABLE public.stores 
ADD COLUMN full_name TEXT,
ADD COLUMN company_name TEXT,
ADD COLUMN phone_number TEXT,
ADD COLUMN email TEXT,
ADD COLUMN office_address TEXT,
ADD COLUMN approval_status TEXT DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
ADD COLUMN password_set BOOLEAN DEFAULT false,
ADD COLUMN store_font_color TEXT DEFAULT '#000000',
ADD COLUMN store_logo_url TEXT;

-- Create a products table enhancement for seller dashboard
ALTER TABLE public.products
ADD COLUMN weight DECIMAL,
ADD COLUMN is_locally_made BOOLEAN DEFAULT true,
ADD COLUMN origin_country TEXT,
ADD COLUMN origin_state TEXT,
ADD COLUMN quality_standard INTEGER CHECK (quality_standard >= 0 AND quality_standard <= 100);

-- Create seller messages table for customer-seller communication
CREATE TABLE public.seller_messages (
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
CREATE TABLE public.market_pricing (
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

CREATE POLICY "Anyone can view pricing for active products" 
ON public.market_pricing 
FOR SELECT 
USING (
  product_id IN (
    SELECT id FROM products WHERE status = 'active'
  )
);

-- Add triggers for updated_at
CREATE TRIGGER update_seller_messages_updated_at
BEFORE UPDATE ON public.seller_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add foreign key constraints
ALTER TABLE public.seller_messages
ADD CONSTRAINT seller_messages_seller_id_fkey 
FOREIGN KEY (seller_id) REFERENCES profiles(user_id),
ADD CONSTRAINT seller_messages_customer_id_fkey 
FOREIGN KEY (customer_id) REFERENCES profiles(user_id),
ADD CONSTRAINT seller_messages_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES products(id);

ALTER TABLE public.market_pricing
ADD CONSTRAINT market_pricing_product_id_fkey 
FOREIGN KEY (product_id) REFERENCES products(id);

-- Update stores table RLS policy to include approval status
DROP POLICY IF EXISTS "Anyone can view active stores" ON public.stores;
CREATE POLICY "Anyone can view approved active stores" 
ON public.stores 
FOR SELECT 
USING (is_active = true AND approval_status = 'approved');