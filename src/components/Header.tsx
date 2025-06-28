
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingCart, User, Heart, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Link } from 'react-router-dom';
import CategoriesDropdown from './CategoriesDropdown';

const Header = () => {
  const { user, signOut } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-black"
            >
              PLATEAUS
            </motion.div>
          </Link>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <div className="relative w-full">
              <Input
                type="text"
                placeholder="Search for products, brands, or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              <Button
                size="sm"
                className="absolute right-1 top-1 bg-black hover:bg-gray-800"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Button variant="ghost" size="sm" className="relative">
                    <Heart className="h-5 w-5" />
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                      0
                    </Badge>
                  </Button>
                  <Button variant="ghost" size="sm" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                      0
                    </Badge>
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <User className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={signOut}
                    >
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                <Link to="/auth">
                  <Button className="bg-black hover:bg-gray-800 text-white">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Categories Bar - Desktop */}
        <div className="hidden md:flex items-center py-3 border-t border-gray-100">
          <CategoriesDropdown />
          <div className="ml-6 flex space-x-6">
            <a href="#" className="text-sm text-gray-700 hover:text-black">Flash Sales</a>
            <a href="#" className="text-sm text-gray-700 hover:text-black">New Arrivals</a>
            <a href="#" className="text-sm text-gray-700 hover:text-black">Best Sellers</a>
            <a href="#" className="text-sm text-gray-700 hover:text-black">Electronics</a>
            <a href="#" className="text-sm text-gray-700 hover:text-black">Fashion</a>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-200 py-4"
          >
            {/* Mobile Search */}
            <div className="mb-4">
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-3">
              {user ? (
                <>
                  <Button variant="ghost" className="w-full justify-start">
                    <User className="h-5 w-5 mr-3" />
                    My Account
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Heart className="h-5 w-5 mr-3" />
                    Wishlist
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <ShoppingCart className="h-5 w-5 mr-3" />
                    Cart
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={signOut}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <Link to="/auth" className="block">
                  <Button className="w-full bg-black hover:bg-gray-800 text-white">
                    Sign In / Sign Up
                  </Button>
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </header>
  );
};

export default Header;
