
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, Clock, User, ShoppingBag, Heart, Eye } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  tracking_number?: string;
  order_items: {
    quantity: number;
    price_at_time: number;
    product: {
      name: string;
      images: string[];
    };
  }[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchOrders();
      fetchRecentlyViewed();
    }
  }, [user]);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        order_items (
          quantity,
          price_at_time,
          product:products (name, images)
        )
      `)
      .eq('customer_id', user?.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Failed to fetch orders');
      return;
    }

    setOrders(data || []);
    setLoading(false);
  };

  const fetchRecentlyViewed = async () => {
    const { data } = await supabase
      .from('recently_viewed')
      .select(`
        *,
        product:products (id, name, price, images)
      `)
      .eq('user_id', user?.id)
      .order('viewed_at', { ascending: false })
      .limit(10);

    setRecentlyViewed(data || []);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'processing':
        return <Package className="h-4 w-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="h-4 w-4 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Please login to access your dashboard</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Dashboard</h1>

          <Tabs defaultValue="orders" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="orders" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                My Orders
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="wishlist" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Wishlist
              </TabsTrigger>
              <TabsTrigger value="recently-viewed" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Recently Viewed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="orders" className="space-y-6">
              <div className="grid gap-6">
                {loading ? (
                  <p>Loading orders...</p>
                ) : orders.length === 0 ? (
                  <Card>
                    <CardContent className="text-center py-12">
                      <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No orders yet</h3>
                      <p className="text-gray-600">When you place your first order, it will appear here.</p>
                    </CardContent>
                  </Card>
                ) : (
                  orders.map((order) => (
                    <Card key={order.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">Order #{order.id.slice(-8)}</CardTitle>
                          <Badge className={getStatusColor(order.status)}>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(order.status)}
                              {order.status}
                            </div>
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          <span>Placed on {new Date(order.created_at).toLocaleDateString()}</span>
                          <span className="font-semibold text-black">₦{order.total_amount.toLocaleString()}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          {order.tracking_number && (
                            <div className="bg-blue-50 p-3 rounded-lg">
                              <p className="text-sm font-medium text-blue-900">
                                Tracking Number: {order.tracking_number}
                              </p>
                            </div>
                          )}
                          <div className="space-y-2">
                            {order.order_items.map((item, index) => (
                              <div key={index} className="flex items-center gap-4">
                                <img
                                  src={item.product.images[0] || '/placeholder.svg'}
                                  alt={item.product.name}
                                  className="w-16 h-16 object-cover rounded-lg"
                                />
                                <div className="flex-1">
                                  <h4 className="font-medium">{item.product.name}</h4>
                                  <p className="text-sm text-gray-600">
                                    Qty: {item.quantity} × ₦{item.price_at_time.toLocaleString()}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-4 pt-4">
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                            {order.status === 'delivered' && (
                              <Button variant="outline" size="sm">
                                Leave Review
                              </Button>
                            )}
                            {order.status === 'shipped' && order.tracking_number && (
                              <Button variant="outline" size="sm">
                                Track Package
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <p className="text-gray-900">{user.user_metadata?.full_name || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <p className="text-gray-900">{user.email}</p>
                    </div>
                    <Button>Edit Profile</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="wishlist">
              <Card>
                <CardContent className="text-center py-12">
                  <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
                  <p className="text-gray-600">Save items you love to buy them later.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="recently-viewed">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-5 w-5" />
                    Recently Viewed Products
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {recentlyViewed.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-600">No recently viewed products</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {recentlyViewed.map((item: any) => (
                        <div key={item.id} className="border rounded-lg p-4">
                          <img
                            src={item.product.images[0] || '/placeholder.svg'}
                            alt={item.product.name}
                            className="w-full h-32 object-cover rounded mb-2"
                          />
                          <h4 className="font-medium truncate">{item.product.name}</h4>
                          <p className="text-lg font-bold">₦{item.product.price.toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
