
import React, { useState } from 'react';
import { ChevronDown, Smartphone, Shirt, Heart, Home, Coffee, Dumbbell, Baby, Car, Gamepad2, PawPrint, Armchair, Briefcase, Book, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';

const categories = [
  { name: 'Electronics and Accessories', icon: Smartphone },
  { name: 'Fashion and Apparel', icon: Shirt },
  { name: 'Beauty and Personal Care', icon: Heart },
  { name: 'Home and Kitchen Essentials', icon: Home },
  { name: 'Food and Beverages', icon: Coffee },
  { name: 'Health and Wellness Products', icon: Dumbbell },
  { name: 'Baby Products', icon: Baby },
  { name: 'Automobile Accessories', icon: Car },
  { name: 'Toys and Hobbies', icon: Gamepad2 },
  { name: 'Pet Supplies', icon: PawPrint },
  { name: 'Furniture', icon: Armchair },
  { name: 'Office Supplies', icon: Briefcase },
  { name: 'Books', icon: Book },
  { name: 'PLATEAUS Engineering', icon: Wrench },
];

const CategoriesDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200"
      >
        <span className="font-medium">All Categories</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-4">Shop by Category</h3>
              <div className="grid grid-cols-1 gap-2">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className="flex items-center gap-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <category.icon className="h-5 w-5 text-gray-600" />
                    <span className="text-sm">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CategoriesDropdown;
