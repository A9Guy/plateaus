
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Filter, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    query: searchParams.get('q') || '',
    category: '',
    minPrice: 0,
    maxPrice: 1000000,
    sortBy: 'newest',
    inStock: false,
    flashSale: false,
  });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
    searchProducts();
  }, [filters]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true);

    setCategories(data || []);
  };

  const searchProducts = async () => {
    let query = supabase
      .from('products')
      .select(`
        *,
        store:stores (store_name, rating)
      `)
      .eq('status', 'active');

    if (filters.query) {
      query = query.ilike('name', `%${filters.query}%`);
    }

    if (filters.category) {
      query = query.eq('category_id', filters.category);
    }

    if (filters.minPrice > 0) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice < 1000000) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters.inStock) {
      query = query.gt('stock_quantity', 0);
    }

    if (filters.flashSale) {
      query = query.eq('is_flash_sale', true);
    }

    // Sorting
    switch (filters.sortBy) {
      case 'price_low':
        query = query.order('price', { ascending: true });
        break;
      case 'price_high':
        query = query.order('price', { ascending: false });
        break;
      case 'popular':
        query = query.order('views_count', { ascending: false });
        break;
      default:
        query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;

    if (error) {
      console.error('Search error:', error);
      return;
    }

    setProducts(data || []);
    setLoading(false);
  };

  const handleFilterChange = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchParams({ q: filters.query });
  };

  const clearFilters = () => {
    setFilters({
      query: '',
      category: '',
      minPrice: 0,
      maxPrice: 1000000,
      sortBy: 'newest',
      inStock: false,
      flashSale: false,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <form onSubmit={handleSearch} className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search for products..."
                value={filters.query}
                onChange={(e) => handleFilterChange('query', e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </form>

          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant={filters.flashSale ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleFilterChange('flashSale', !filters.flashSale)}
            >
              Flash Sale
            </Badge>
            <Badge
              variant={filters.inStock ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleFilterChange('inStock', !filters.inStock)}
            >
              In Stock
            </Badge>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="w-80 flex-shrink-0"
            >
              <Card className="sticky top-4">
                <CardContent className="p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Clear All
                    </Button>
                  </div>

                  {/* Category Filter */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => handleFilterChange('category', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Categories" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Categories</SelectItem>
                        {categories.map((category: any) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Price Range: ₦{filters.minPrice.toLocaleString()} - ₦{filters.maxPrice.toLocaleString()}
                    </label>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Min Price</label>
                        <Slider
                          value={[filters.minPrice]}
                          onValueChange={([value]) => handleFilterChange('minPrice', value)}
                          max={1000000}
                          step={1000}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-600 mb-1">Max Price</label>
                        <Slider
                          value={[filters.maxPrice]}
                          onValueChange={([value]) => handleFilterChange('maxPrice', value)}
                          max={1000000}
                          step={1000}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Sort Options */}
                  <div>
                    <label className="block text-sm font-medium mb-2">Sort By</label>
                    <Select
                      value={filters.sortBy}
                      onValueChange={(value) => handleFilterChange('sortBy', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="popular">Most Popular</SelectItem>
                        <SelectItem value="price_low">Price: Low to High</SelectItem>
                        <SelectItem value="price_high">Price: High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Availability Filters */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="inStock"
                        checked={filters.inStock}
                        onCheckedChange={(checked) => handleFilterChange('inStock', checked)}
                      />
                      <label htmlFor="inStock" className="text-sm">In Stock Only</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="flashSale"
                        checked={filters.flashSale}
                        onCheckedChange={(checked) => handleFilterChange('flashSale', checked)}
                      />
                      <label htmlFor="flashSale" className="text-sm">Flash Sale Only</label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Search Results */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {filters.query ? `Search results for "${filters.query}"` : 'All Products'}
              </h2>
              <p className="text-gray-600">{products.length} products found</p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl p-4 animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                    <div className="space-y-2">
                      <div className="bg-gray-200 h-4 rounded w-3/4"></div>
                      <div className="bg-gray-200 h-4 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <SearchIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search terms or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product: any) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    comparePrice={product.compare_price}
                    images={product.images}
                    rating={product.rating}
                    reviewCount={0}
                    isFlashSale={product.is_flash_sale}
                    flashSalePrice={product.flash_sale_price}
                    storeName={product.store.store_name}
                    viewsCount={product.views_count}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Search;
