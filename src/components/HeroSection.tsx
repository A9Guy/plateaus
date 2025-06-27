
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Shield, Truck } from 'lucide-react';

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-r from-gray-50 to-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6">
              Your Premier
              <span className="block text-gray-600">Marketplace</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Discover quality products from trusted sellers across Nigeria. 
              From electronics to fashion, find everything you need in one place.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="bg-black hover:bg-gray-800 text-white px-8">
                Start Shopping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="border-black text-black hover:bg-black hover:text-white px-8">
                Become a Seller
              </Button>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium">Quality Products</p>
              </div>
              <div className="text-center">
                <div className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Shield className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium">Secure Shopping</p>
              </div>
              <div className="text-center">
                <div className="bg-black text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                  <Truck className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium">Fast Delivery</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="bg-black rounded-2xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Special Launch Offer</h3>
              <p className="text-gray-300 mb-6">
                Get up to 50% off on your first purchase. Limited time offer for new customers.
              </p>
              <div className="flex items-center gap-4 mb-6">
                <div className="text-center">
                  <div className="text-3xl font-bold">23</div>
                  <div className="text-sm text-gray-300">Hours</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">45</div>
                  <div className="text-sm text-gray-300">Minutes</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold">12</div>
                  <div className="text-sm text-gray-300">Seconds</div>
                </div>
              </div>
              <Button className="w-full bg-white text-black hover:bg-gray-100">
                Claim Offer Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
