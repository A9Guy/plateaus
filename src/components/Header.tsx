
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, Heart, Bell, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import CategoriesDropdown from './CategoriesDropdown';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="text-xl font-bold text-gray-900">PLATEAUS</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <CategoriesDropdown />
            <Link to="/search" className="text-gray-700 hover:text-black transition-colors">
              Browse
            </Link>
            <div className="relative group">
              <button className="text-gray-700 hover:text-black transition-colors flex items-center gap-1">
                Seller
                <ChevronDown className="h-4 w-4" />
              </button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link to="/seller" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Sign Up as Seller
                  </Link>
                  <Link to="/seller" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Seller Login
                  </Link>
                </div>
              </div>
            </div>
            <Link to="/plateaus-engineering" className="text-gray-700 hover:text-black transition-colors">
              <Button variant="outline" size="sm" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                PLATEAUS Engineering
              </Button>
            </Link>
            <Link to="/plateaus-food" className="text-gray-700 hover:text-black transition-colors">
              <Button variant="outline" size="sm" className="border-orange-600 text-orange-600 hover:bg-orange-50">
                PLATEAUS FOOD
              </Button>
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-md mx-6">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-full border-gray-300 focus:border-black focus:ring-black"
              />
            </div>
          </form>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user && (
              <>
                <Button variant="ghost" size="sm" className="relative">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  <Badge variant="destructive" className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                    3
                  </Badge>
                </Button>
              </>
            )}
            
            <Link to="/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {getTotalItems() > 0 && (
                  <Badge variant="destructive" className="absolute -right-1 -top-1 h-4 w-4 p-0 flex items-center justify-center text-xs">
                    {getTotalItems()}
                  </Badge>
                )}
              </Button>
            </Link>

            {user ? (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm">
                    <User className="h-5 w-5 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-2">
                <Link to="/auth">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="bg-black hover:bg-gray-800 text-white">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
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

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="space-y-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="flex">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 w-full"
                  />
                </div>
              </form>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                <Link to="/search" className="block py-2 text-gray-700">
                  Browse Products
                </Link>
                <Link to="/cart" className="block py-2 text-gray-700">
                  Shopping Cart ({getTotalItems()})
                </Link>
                <div className="py-2">
                  <div className="text-sm font-medium text-gray-900 mb-2">Seller Options</div>
                  <Link to="/seller" className="block px-2 py-1 text-sm text-gray-700">
                    Sign Up as Seller
                  </Link>
                  <Link to="/seller" className="block px-2 py-1 text-sm text-gray-700">
                    Seller Login
                  </Link>
                </div>
                <Link to="/plateaus-engineering" className="block py-2">
                  <Button variant="outline" size="sm" className="w-full border-blue-600 text-blue-600">
                    PLATEAUS Engineering
                  </Button>
                </Link>
                <Link to="/plateaus-food" className="block py-2">
                  <Button variant="outline" size="sm" className="w-full border-orange-600 text-orange-600">
                    PLATEAUS FOOD
                  </Button>
                </Link>
                
                {user ? (
                  <>
                    <Link to="/dashboard" className="block py-2 text-gray-700">
                      Dashboard
                    </Link>
                    <button
                      onClick={signOut}
                      className="block py-2 text-gray-700 w-full text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/auth" className="block py-2 text-gray-700">
                      Sign In
                    </Link>
                    <Link to="/auth" className="block py-2">
                      <Button size="sm" className="w-full bg-black hover:bg-gray-800 text-white">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
