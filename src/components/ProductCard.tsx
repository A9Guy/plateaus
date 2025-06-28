
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Eye, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  comparePrice?: number;
  images: string[];
  rating?: number;
  reviewCount?: number;
  isFlashSale: boolean;
  flashSalePrice?: number;
  storeName: string;
  viewsCount: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  name,
  price,
  comparePrice,
  images,
  rating = 0,
  reviewCount = 0,
  isFlashSale,
  flashSalePrice,
  storeName,
  viewsCount
}) => {
  const displayPrice = isFlashSale && flashSalePrice ? flashSalePrice : price;
  const hasDiscount = comparePrice && comparePrice > displayPrice;
  const discountPercentage = hasDiscount ? Math.round(((comparePrice - displayPrice) / comparePrice) * 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden border-0 shadow-md bg-white">
        <div className="relative">
          <img
            src={images[0] || '/placeholder.svg'}
            alt={name}
            className="w-full h-48 object-cover"
          />
          {isFlashSale && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white">
              Flash Sale
            </Badge>
          )}
          {hasDiscount && (
            <Badge className="absolute top-2 right-2 bg-green-500 text-white">
              -{discountPercentage}%
            </Badge>
          )}
          <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
            <Eye className="h-3 w-3" />
            {viewsCount}
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm line-clamp-2 text-gray-900">{name}</h3>
            
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span>{storeName}</span>
              {rating > 0 && (
                <>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{rating.toFixed(1)}</span>
                    <span>({reviewCount})</span>
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-black">
                ₦{displayPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-sm text-gray-500 line-through">
                  ₦{comparePrice.toLocaleString()}
                </span>
              )}
            </div>
            
            <Button className="w-full mt-3 bg-black hover:bg-gray-800 text-white">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default ProductCard;
