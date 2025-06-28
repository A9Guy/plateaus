
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UtensilsCrossed, Clock, Star, MapPin, Phone, ShoppingCart, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const PlateausFood = () => {
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Items', count: 25 },
    { id: 'appetizers', name: 'Appetizers', count: 6 },
    { id: 'mains', name: 'Main Courses', count: 12 },
    { id: 'desserts', name: 'Desserts', count: 4 },
    { id: 'beverages', name: 'Beverages', count: 8 }
  ];

  const menuItems = [
    {
      id: 1,
      name: "Jollof Rice Special",
      description: "Our signature jollof rice with chicken, beef, and prawns",
      price: 3500,
      image: "/placeholder.svg",
      category: "mains",
      rating: 4.8,
      prepTime: "25-30 mins",
      isPopular: true
    },
    {
      id: 2,
      name: "Pepper Soup",
      description: "Spicy Nigerian pepper soup with assorted meat",
      price: 2800,
      image: "/placeholder.svg",
      category: "appetizers",
      rating: 4.6,
      prepTime: "15-20 mins",
      isPopular: false
    },
    {
      id: 3,
      name: "Pounded Yam & Egusi",
      description: "Traditional pounded yam served with rich egusi soup",
      price: 4200,
      image: "/placeholder.svg",
      category: "mains",
      rating: 4.9,
      prepTime: "35-40 mins",
      isPopular: true
    },
    {
      id: 4,
      name: "Chin Chin",
      description: "Crispy traditional Nigerian snack, perfect for sharing",
      price: 800,
      image: "/placeholder.svg",
      category: "desserts",
      rating: 4.3,
      prepTime: "5 mins",
      isPopular: false
    },
    {
      id: 5,
      name: "Chapman",
      description: "Refreshing Nigerian cocktail with mixed fruits",
      price: 1200,
      image: "/placeholder.svg",
      category: "beverages",
      rating: 4.5,
      prepTime: "5 mins",
      isPopular: false
    },
    {
      id: 6,
      name: "Suya Platter",
      description: "Grilled beef suya with onions and pepper sauce",
      price: 3000,
      image: "/placeholder.svg",
      category: "appetizers",
      rating: 4.7,
      prepTime: "20-25 mins",
      isPopular: true
    }
  ];

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center mb-6">
              <UtensilsCrossed className="h-12 w-12 mr-4" />
              <h1 className="text-5xl font-bold">PLATEAUS FOOD</h1>
            </div>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Authentic Nigerian cuisine delivered fresh to your doorstep. 
              Experience the rich flavors and traditions of Nigeria.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                Order Now
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-orange-600">
                View Menu
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        {/* Restaurant Info */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white shadow-lg">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Opening Hours</h3>
                <p className="text-gray-600">Mon - Sun: 9:00 AM - 11:00 PM</p>
                <p className="text-sm text-orange-600 mt-2">Open Now</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Location</h3>
                <p className="text-gray-600">123 Jos Main Street</p>
                <p className="text-gray-600">Plateau State, Nigeria</p>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-orange-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Contact</h3>
                <p className="text-gray-600">+234 123 456 7890</p>
                <p className="text-gray-600">orders@plateausfood.com</p>
              </CardContent>
            </Card>
          </div>
        </motion.section>

        {/* Menu Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-4xl font-bold text-center mb-4">Our Menu</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Discover authentic Nigerian flavors prepared with fresh ingredients and traditional recipes
          </p>

          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex flex-col">
                  <span>{category.name}</span>
                  <span className="text-xs text-gray-500">({category.count})</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="h-full bg-white shadow-lg hover:shadow-xl transition-shadow">
                    <div className="relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {item.isPopular && (
                        <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
                          Popular
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold">{item.name}</h3>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{item.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-bold text-orange-600">
                          ₦{item.price.toLocaleString()}
                        </span>
                        <div className="flex items-center gap-1 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {item.prepTime}
                        </div>
                      </div>
                      
                      <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Add to Cart
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </Tabs>
        </motion.section>

        {/* About Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-3xl p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6">About PLATEAUS FOOD</h2>
                <p className="text-orange-100 mb-6">
                  Founded in 2020, PLATEAUS FOOD has been serving authentic Nigerian cuisine 
                  to the Jos community and beyond. Our chefs use traditional recipes passed 
                  down through generations, combined with fresh, locally-sourced ingredients.
                </p>
                <p className="text-orange-100 mb-6">
                  From our signature jollof rice to our perfectly spiced pepper soup, 
                  every dish tells a story of Nigerian culture and culinary excellence.
                </p>
                <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100">
                  Learn More About Us
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">1000+</div>
                  <div className="text-orange-100">Happy Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">4.8</div>
                  <div className="text-orange-100">Average Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">30+</div>
                  <div className="text-orange-100">Menu Items</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold mb-2">4</div>
                  <div className="text-orange-100">Years Experience</div>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h2 className="text-4xl font-bold mb-4">Ready to Order?</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Experience the taste of authentic Nigerian cuisine. Order now and get your food 
            delivered fresh and hot to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
              Order for Delivery
            </Button>
            <Button size="lg" variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-50">
              Make Reservation
            </Button>
          </div>
        </motion.section>
      </div>
    </div>
  );
};

export default PlateausFood;
