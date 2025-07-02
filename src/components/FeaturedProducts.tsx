
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  // No dummy products - will be populated with real data
  const featuredProducts = {
    electronics: [],
    fashion: [],
    beauty: []
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-black mb-4">Featured Products</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our hand-picked selection of premium products from verified sellers
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Tabs defaultValue="electronics" className="w-full">
            <div className="flex justify-center mb-8">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="electronics">Electronics</TabsTrigger>
                <TabsTrigger value="fashion">Fashion</TabsTrigger>
                <TabsTrigger value="beauty">Beauty</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="electronics" className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[200px]">
                {featuredProducts.electronics.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    No electronics products available yet
                  </div>
                ) : (
                  featuredProducts.electronics.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <ProductCard {...product} />
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="fashion" className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[200px]">
                {featuredProducts.fashion.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    No fashion products available yet
                  </div>
                ) : (
                  featuredProducts.fashion.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <ProductCard {...product} />
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="beauty" className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[200px]">
                {featuredProducts.beauty.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-muted-foreground">
                    No beauty products available yet
                  </div>
                ) : (
                  featuredProducts.beauty.map((product, index) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <ProductCard {...product} />
                    </motion.div>
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button size="lg" className="bg-black hover:bg-gray-800 text-white group">
            View All Products
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
