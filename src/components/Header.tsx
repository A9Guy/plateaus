
import React, { useState } from 'react';
import { Search, ShoppingCart, User, Menu, X, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoriesDropdown from './CategoriesDropdown';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-black text-white py-2">
        <div className="container mx-auto px-4 text-center text-sm">
          Welcome to PLATEAUS - Your Premier Marketplace | Free Shipping on Orders Over ₦10,000
        </div>
      </div>

      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img 
              src="/lovable-uploads/79bae75a-1e2d-4cdb-b7a1-32c8c5106ee4.png" 
              alt="PLATEAUS Ltd" 
              className="h-12 w-auto"
            />
          </div>

          {/* Location */}
          <div className="hidden md:flex items-center gap-1 text-sm">
            <MapPin className="h-4 w-4" />
            <span>Deliver to Lagos, Nigeria</span>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for products, brands and categories..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-black"
              />
              <Button 
                size="sm" 
                className="absolute right-1 top-1 bg-black hover:bg-gray-800"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:flex items-center gap-2">
              <User className="h-5 w-5" />
              <span>Sign In</span>
            </Button>
            
            <Button variant="ghost" size="sm" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                0
              </span>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <div className="hidden md:flex items-center gap-8 mt-4 pt-4 border-t border-gray-100">
          <CategoriesDropdown />
          <nav className="flex items-center gap-6">
            <a href="#" className="text-sm hover:text-gray-600 transition-colors">Today's Deals</a>
            <a href="#" className="text-sm hover:text-gray-600 transition-colors">Flash Sales</a>
            <a href="#" className="text-sm hover:text-gray-600 transition-colors">Become a Seller</a>
            <a href="#" className="text-sm hover:text-gray-600 transition-colors">Customer Service</a>
          </nav>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-col gap-3">
              <CategoriesDropdown />
              <Button variant="ghost" className="justify-start">
                <User className="h-4 w-4 mr-2" />
                Sign In
              </Button>
              <a href="#" className="text-sm py-2">Today's Deals</a>
              <a href="#" className="text-sm py-2">Flash Sales</a>
              <a href="#" className="text-sm py-2">Become a Seller</a>
              <a href="#" className="text-sm py-2">Customer Service</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
