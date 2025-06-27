
import React from 'react';
import { Star, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

const featuredProducts = [
  {
    id: 1,
    name: 'MacBook Pro 16-inch',
    price: '₦850,000',
    rating: 4.8,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=300&h=300&fit=crop',
    category: 'Electronics',
    seller: 'TechHub Store',
    location: 'Lagos'
  },
  {
    id: 2,
    name: 'Nike Air Max Sneakers',
    price: '₦35,000',
    rating: 4.6,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=300&fit=crop',
    category: 'Fashion',
    seller: 'SportZone',
    location: 'Abuja'
  },
  {
    id: 3,
    name: 'Organic Skincare Set',
    price: '₦18,500',
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300&h=300&fit=crop',
    category: 'Beauty',
    seller: 'Beauty Haven',
    location: 'Lagos'
  },
  {
    id: 4,
    name: 'Modern Dining Table',
    price: '₦125,000',
    rating: 4.5,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=300&h=300&fit=crop',
    category: 'Furniture',
    seller: 'Home Decor Plus',
    location: 'Port Harcourt'
  },
  {
    id: 5,
    name: 'Professional Camera',
    price: '₦245,000',
    rating: 4.9,
    reviews: 178,
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=300&h=300&fit=crop',
    category: 'Electronics',
    seller: 'PhotoPro',
    location: 'Lagos'
  },
  {
    id: 6,
    name: 'Baby Stroller',
    price: '₦45,000',
    rating: 4.4,
    reviews: 112,
    image: 'https://images.unsplash.com/photo-1544833919-5beeda47644c?w=300&h=300&fit=crop',
    category: 'Baby Products',
    seller: 'BabyWorld',
    location: 'Abuja'
  }
];

const FeaturedProducts = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-4">
            Featured Products
          </h2>
          <p className="text-gray-600 text-lg">
            Handpicked products from our trusted sellers
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow group">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <button className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors">
                  <Heart className="h-5 w-5 text-gray-600" />
                </button>
                <div className="absolute bottom-4 left-4 bg-black text-white px-3 py-1 rounded-full text-sm">
                  {product.category}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="font-bold text-xl text-black mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">({product.reviews} reviews)</span>
                </div>
                
                <div className="text-2xl font-bold text-black mb-3">
                  {product.price}
                </div>
                
                <div className="flex justify-between items-center text-sm text-gray-600 mb-4">
                  <span>By {product.seller}</span>
                  <span>{product.location}</span>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1 bg-black hover:bg-gray-800 text-white">
                    Add to Cart
                  </Button>
                  <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg" className="border-black text-black hover:bg-black hover:text-white px-8">
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
