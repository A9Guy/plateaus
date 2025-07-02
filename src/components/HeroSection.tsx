
import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Truck, Shield, Star } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-gray-900 to-black text-white overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                PLATEAUS
                <span className="block text-gray-300">Marketplace</span>
              </h1>
              <p className="text-xl text-gray-300 max-w-lg">
                Discover quality products from verified sellers nationwide.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="bg-white text-black hover:bg-gray-100">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-black"
                onClick={() => window.location.href = '/become-seller'}
              >
                Become a Seller
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-center"
              >
                <Truck className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-300">Fast Delivery</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-center"
              >
                <Shield className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-300">Secure Payment</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="text-center"
              >
                <Star className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm text-gray-300">Quality Products</p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-2">Join PLATEAUS Today</h3>
                  <p className="text-gray-300">Over 10,000+ products from verified sellers</p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold">10K+</div>
                    <div className="text-sm text-gray-300">Products</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-sm text-gray-300">Sellers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">50K+</div>
                    <div className="text-sm text-gray-300">Customers</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">4.8★</div>
                    <div className="text-sm text-gray-300">Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
