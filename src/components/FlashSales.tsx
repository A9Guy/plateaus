
import React from 'react';
import { Clock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const flashSaleProducts = [
  {
    id: 1,
    name: 'Wireless Bluetooth Headphones',
    originalPrice: '₦45,000',
    salePrice: '₦22,500',
    discount: '50%',
    rating: 4.5,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=300&fit=crop',
    timeLeft: '2h 45m',
    sold: 45,
    stock: 100
  },
  {
    id: 2,
    name: 'Smart Fitness Watch',
    originalPrice: '₦85,000',
    salePrice: '₦59,500',
    discount: '30%',
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=300&fit=crop',
    timeLeft: '1h 12m',
    sold: 23,
    stock: 50
  },
  {
    id: 3,
    name: 'Premium Coffee Maker',
    originalPrice: '₦120,000',
    salePrice: '₦84,000',
    discount: '30%',
    rating: 4.3,
    reviews: 67,
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop',
    timeLeft: '3h 28m',
    sold: 12,
    stock: 30
  },
  {
    id: 4,
    name: 'Designer Handbag',
    originalPrice: '₦65,000',
    salePrice: '₦39,000',
    discount: '40%',
    rating: 4.6,
    reviews: 156,
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=300&fit=crop',
    timeLeft: '5h 15m',
    sold: 67,
    stock: 80
  }
];

const FlashSales = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-black mb-2">Flash Sales</h2>
            <p className="text-gray-600">Limited time offers - Grab them before they're gone!</p>
          </div>
          <div className="flex items-center gap-2 bg-red-100 px-4 py-2 rounded-lg">
            <Clock className="h-5 w-5 text-red-600" />
            <span className="font-semibold text-red-600">Ending Soon</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {flashSaleProducts.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow group">
              <div className="relative">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                  -{product.discount}
                </div>
                <div className="absolute top-2 right-2 bg-black text-white px-2 py-1 rounded text-sm">
                  {product.timeLeft}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-semibold text-black mb-2 line-clamp-2">
                  {product.name}
                </h3>
                
                <div className="flex items-center gap-1 mb-2">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm text-gray-600">{product.rating} ({product.reviews})</span>
                </div>
                
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-black">{product.salePrice}</span>
                  <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Sold: {product.sold}</span>
                    <span>Stock: {product.stock}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full" 
                      style={{ width: `${(product.sold / product.stock) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <Button className="w-full bg-black hover:bg-gray-800 text-white">
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Button variant="outline" size="lg" className="border-black text-black hover:bg-black hover:text-white">
            View All Flash Sales
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FlashSales;
