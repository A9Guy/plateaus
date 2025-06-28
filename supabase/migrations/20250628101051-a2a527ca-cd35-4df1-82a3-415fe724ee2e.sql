
-- Create enum types for various statuses
CREATE TYPE public.user_role AS ENUM ('customer', 'merchant', 'admin');
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.product_status AS ENUM ('active', 'inactive', 'pending_approval');
CREATE TYPE public.review_status AS ENUM ('approved', 'pending', 'flagged', 'rejected');

-- User profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  role user_role DEFAULT 'customer',
  avatar_url TEXT,
  location_state TEXT,
  location_city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id)
);

-- Merchant stores table
CREATE TABLE public.stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  merchant_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  store_name TEXT NOT NULL,
  store_description TEXT,
  store_logo_url TEXT,
  store_banner_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  total_sales DECIMAL(10,2) DEFAULT 0,
  rating DECIMAL(3,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Product categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  images TEXT[] DEFAULT '{}',
  status product_status DEFAULT 'active',
  is_flash_sale BOOLEAN DEFAULT false,
  flash_sale_price DECIMAL(10,2),
  flash_sale_end TIMESTAMP WITH TIME ZONE,
  allowed_states TEXT[] DEFAULT '{}',
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT,
  views_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status order_status DEFAULT 'pending',
  shipping_address JSONB NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  tracking_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Order items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL,
  price_at_time DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Product reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  status review_status DEFAULT 'pending',
  is_verified_purchase BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Product Q&A table
CREATE TABLE public.product_qa (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES public.profiles(user_id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT,
  answered_by UUID REFERENCES public.profiles(user_id),
  status review_status DEFAULT 'pending',
  is_helpful BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Recently viewed products table
CREATE TABLE public.recently_viewed (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Sales analytics table
CREATE TABLE public.sales_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  total_sales DECIMAL(10,2) DEFAULT 0,
  orders_count INTEGER DEFAULT 0,
  products_sold INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(store_id, date)
);

-- Insert default categories
INSERT INTO public.categories (name, description, icon_name) VALUES
('Electronics and Accessories', 'Phones, computers, gadgets and accessories', 'Smartphone'),
('Fashion and Apparel', 'Clothing, shoes, bags and fashion accessories', 'Shirt'),
('Beauty and Personal Care', 'Skincare, makeup, personal hygiene products', 'Heart'),
('Home and Kitchen Essentials', 'Home decor, kitchen appliances, household items', 'Home'),
('Food and Beverages', 'Groceries, snacks, beverages and food items', 'Coffee'),
('Health and Wellness Products', 'Supplements, fitness gear, health products', 'Dumbbell'),
('Baby Products', 'Baby care, toys, clothing and accessories', 'Baby'),
('Automobile Accessories', 'Car parts, accessories and automotive products', 'Car'),
('Toys and Hobbies', 'Games, toys, hobby items and entertainment', 'Gamepad2'),
('Pet Supplies', 'Pet food, toys, accessories and care products', 'PawPrint'),
('Furniture', 'Home and office furniture', 'Armchair'),
('Office Supplies', 'Stationery, office equipment and supplies', 'Briefcase'),
('Books', 'Books, magazines and reading materials', 'Book'),
('PLATEAUS Engineering', 'Custom engineering solutions and services', 'Wrench');

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_qa ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_analytics ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- RLS Policies for stores
CREATE POLICY "Anyone can view active stores" ON public.stores FOR SELECT USING (is_active = true);
CREATE POLICY "Merchants can manage own stores" ON public.stores FOR ALL USING (merchant_id = auth.uid());

-- RLS Policies for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view categories" ON public.categories FOR SELECT USING (true);

-- RLS Policies for products
CREATE POLICY "Anyone can view active products" ON public.products FOR SELECT USING (status = 'active');
CREATE POLICY "Store owners can manage own products" ON public.products 
  FOR ALL USING (store_id IN (SELECT id FROM public.stores WHERE merchant_id = auth.uid()));

-- RLS Policies for orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (customer_id = auth.uid());
CREATE POLICY "Users can create own orders" ON public.orders FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Merchants can view orders for their products" ON public.orders FOR SELECT 
  USING (id IN (SELECT DISTINCT order_id FROM public.order_items oi 
                JOIN public.products p ON oi.product_id = p.id 
                JOIN public.stores s ON p.store_id = s.id 
                WHERE s.merchant_id = auth.uid()));

-- RLS Policies for order items
CREATE POLICY "Users can view order items for own orders" ON public.order_items FOR SELECT 
  USING (order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid()));
CREATE POLICY "Users can create order items for own orders" ON public.order_items FOR INSERT 
  WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE customer_id = auth.uid()));

-- RLS Policies for reviews
CREATE POLICY "Anyone can view approved reviews" ON public.reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can create own reviews" ON public.reviews FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (customer_id = auth.uid());

-- RLS Policies for Q&A
CREATE POLICY "Anyone can view approved Q&A" ON public.product_qa FOR SELECT USING (status = 'approved');
CREATE POLICY "Users can create own questions" ON public.product_qa FOR INSERT WITH CHECK (customer_id = auth.uid());
CREATE POLICY "Store owners can answer questions about their products" ON public.product_qa FOR UPDATE 
  USING (product_id IN (SELECT p.id FROM public.products p 
                        JOIN public.stores s ON p.store_id = s.id 
                        WHERE s.merchant_id = auth.uid()));

-- RLS Policies for recently viewed
CREATE POLICY "Users can manage own recently viewed" ON public.recently_viewed FOR ALL USING (user_id = auth.uid());

-- RLS Policies for sales analytics
CREATE POLICY "Store owners can view own analytics" ON public.sales_analytics FOR SELECT 
  USING (store_id IN (SELECT id FROM public.stores WHERE merchant_id = auth.uid()));

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_stores_updated_at BEFORE UPDATE ON public.stores FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_product_qa_updated_at BEFORE UPDATE ON public.product_qa FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
