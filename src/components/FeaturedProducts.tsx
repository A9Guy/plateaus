
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductCard from './ProductCard';

const FeaturedProducts = () => {
  // Mock featured products by category
  const featuredProducts = {
    electronics: [
      {
        id: '1',
        name: 'Sony WH-1000XM4 Headphones',
        price: 120000,
        comparePrice: 150000,
        images: ['/placeholder.svg'],
        rating: 4.8,
        reviewCount: 342,
        isFlashSale: false,
        storeName: 'AudioTech Pro',
        viewsCount: 1876
      },
      {
        id: '2',
        name: 'Dell XPS 13 Laptop',
        price: 650000,
        images: ['/placeholder.svg'],
        rating: 4.7,
        reviewCount: 89,
        isFlashSale: false,
        storeName: 'CompuMart',
        viewsCount: 934
      }
    ],
    fashion: [
      {
        id: '3',
        name: 'Designer Handbag - Leather',
        price: 45000,
        comparePrice: 60000,
        images: ['/placeholder.svg'],
        rating: 4.6,
        reviewCount: 156,
        isFlashSale: false,
        storeName: 'Fashion Forward',
        viewsCount: 678
      },
      {
        id: '4',
        name: 'Premium Polo Shirt',
        price: 15000,
        images: ['/placeholder.svg'],
        rating: 4.5,
        reviewCount: 203,
        isFlashSale: false,
        storeName: 'Style Central',
        viewsCount: 445
      }
    ],
    beauty: [
      {
        id: '5',
        name: 'Skincare Bundle Set',
        price: 25000,
        comparePrice: 35000,
        images: ['/placeholder.svg'],
        rating: 4.9,
        reviewCount: 287,
        isFlashSale: false,
        storeName: 'BeautyPro',
        viewsCount: 1123
      },
      {
        id: '6',
        name: 'Premium Makeup Kit',
        price: 40000,
        images: ['/placeholder.svg'],
        rating: 4.7,
        reviewCount: 198,
        isFlashSale: false,
        storeName: 'Glam Studio',
        viewsCount: 756
      }
    ]
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.electronics.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <ProductCard {...product} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="fashion" className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.fashion.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <ProductCard {...product} />
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="beauty" className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {featuredProducts.beauty.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <ProductCard {...product} />
                  </motion.div>
                ))}
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
