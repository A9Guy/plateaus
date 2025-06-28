
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from './ProductCard';

const FlashSales = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 12,
    minutes: 34,
    seconds: 56
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Mock flash sale products
  const flashSaleProducts = [
    {
      id: '1',
      name: 'iPhone 13 Pro Max - 128GB',
      price: 450000,
      comparePrice: 520000,
      images: ['/placeholder.svg'],
      rating: 4.8,
      reviewCount: 124,
      isFlashSale: true,
      flashSalePrice: 450000,
      storeName: 'TechHub Nigeria',
      viewsCount: 1234
    },
    {
      id: '2',
      name: 'Samsung Galaxy Watch 5',
      price: 85000,
      comparePrice: 120000,
      images: ['/placeholder.svg'],
      rating: 4.6,
      reviewCount: 87,
      isFlashSale: true,
      flashSalePrice: 85000,
      storeName: 'Gadget World',
      viewsCount: 892
    },
    {
      id: '3',
      name: 'Nike Air Max 270',
      price: 35000,
      comparePrice: 45000,
      images: ['/placeholder.svg'],
      rating: 4.7,
      reviewCount: 203,
      isFlashSale: true,
      flashSalePrice: 35000,
      storeName: 'Sneaker Haven',
      viewsCount: 567
    },
    {
      id: '4',
      name: 'MacBook Air M2',
      price: 850000,
      comparePrice: 950000,
      images: ['/placeholder.svg'],
      rating: 4.9,
      reviewCount: 156,
      isFlashSale: true,
      flashSalePrice: 850000,
      storeName: 'Apple Store NG',
      viewsCount: 2341
    }
  ];

  return (
    <section className="py-12 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center space-x-4">
            <h2 className="text-3xl font-bold text-black">Flash Sales</h2>
            <div className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg">
              <Clock className="h-5 w-5" />
              <span className="font-mono text-lg">
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
          
          <Button variant="outline" className="group">
            View All
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {flashSaleProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ProductCard {...product} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FlashSales;
