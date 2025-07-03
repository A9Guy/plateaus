
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Users, Package, Store, Flag, CheckCircle, X, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Header from '@/components/Header';

const Admin = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStores: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingReviews: 0,
  });
  const [stores, setStores] = useState([]);
  const [pendingSellers, setPendingSellers] = useState([]);
  const [pendingReviews, setPendingReviews] = useState([]);
  const [pendingQA, setPendingQA] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
    fetchStats();
    fetchStores();
    fetchPendingSellers();
    fetchPendingReviews();
    fetchPendingQA();
  }, []);

  const checkAdminAccess = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (data?.role !== 'admin') {
      toast.error('Access denied');
      return;
    }
  };

  const fetchStats = async () => {
    const [storesRes, productsRes, ordersRes, reviewsRes] = await Promise.all([
      supabase.from('stores').select('id'),
      supabase.from('products').select('id'),
      supabase.from('orders').select('id'),
      supabase.from('reviews').select('id').eq('status', 'pending'),
    ]);

    setStats({
      totalStores: storesRes.data?.length || 0,
      totalProducts: productsRes.data?.length || 0,
      totalOrders: ordersRes.data?.length || 0,
      pendingReviews: reviewsRes.data?.length || 0,
    });
  };

  const fetchStores = async () => {
    const { data } = await supabase
      .from('stores')
      .select(`
        *,
        merchant:profiles (full_name, email)
      `)
      .eq('approval_status', 'approved')
      .order('created_at', { ascending: false });

    setStores(data || []);
  };

  const fetchPendingSellers = async () => {
    const { data } = await supabase
      .from('stores')
      .select(`
        *,
        merchant:profiles (full_name, email)
      `)
      .eq('approval_status', 'pending')
      .order('created_at', { ascending: false });

    setPendingSellers(data || []);
  };

  const fetchPendingReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select(`
        *,
        customer:profiles (full_name),
        product:products (name)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    setPendingReviews(data || []);
  };

  const fetchPendingQA = async () => {
    const { data } = await supabase
      .from('product_qa')
      .select(`
        *,
        customer:profiles (full_name),
        product:products (name)
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    setPendingQA(data || []);
    setLoading(false);
  };

  const updateReviewStatus = async (reviewId: string, status: 'approved' | 'flagged' | 'rejected') => {
    const { error } = await supabase
      .from('reviews')
      .update({ status })
      .eq('id', reviewId);

    if (error) {
      toast.error('Failed to update review');
      return;
    }

    toast.success(`Review ${status}`);
    fetchPendingReviews();
    fetchStats();
  };

  const updateQAStatus = async (qaId: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('product_qa')
      .update({ status })
      .eq('id', qaId);

    if (error) {
      toast.error('Failed to update Q&A');
      return;
    }

    toast.success(`Q&A ${status}`);
    fetchPendingQA();
  };

  const toggleStoreStatus = async (storeId: string, isActive: boolean) => {
    const { error } = await supabase
      .from('stores')
      .update({ is_active: !isActive })
      .eq('id', storeId);

    if (error) {
      toast.error('Failed to update store status');
      return;
    }

    toast.success(`Store ${!isActive ? 'activated' : 'deactivated'}`);
    fetchStores();
  };

  const approveSellerApplication = async (storeId: string, sellerEmail: string) => {
    const { error } = await supabase
      .from('stores')
      .update({ 
        approval_status: 'approved',
        is_active: true 
      })
      .eq('id', storeId);

    if (error) {
      toast.error('Failed to approve seller application');
      return;
    }

    toast.success('Seller application approved');
    fetchPendingSellers();
    fetchStores();
    fetchStats();
  };

  const rejectSellerApplication = async (storeId: string) => {
    const { error } = await supabase
      .from('stores')
      .update({ approval_status: 'rejected' })
      .eq('id', storeId);

    if (error) {
      toast.error('Failed to reject seller application');
      return;
    }

    toast.success('Seller application rejected');
    fetchPendingSellers();
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Stores</p>
                    <p className="text-2xl font-bold">{stats.totalStores}</p>
                  </div>
                  <Store className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Products</p>
                    <p className="text-2xl font-bold">{stats.totalProducts}</p>
                  </div>
                  <Package className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Orders</p>
                    <p className="text-2xl font-bold">{stats.totalOrders}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
                    <p className="text-2xl font-bold">{stats.pendingReviews}</p>
                  </div>
                  <Eye className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="pending-sellers" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending-sellers">Pending Sellers</TabsTrigger>
              <TabsTrigger value="stores">Stores</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="qa">Q&A</TabsTrigger>
            </TabsList>

            <TabsContent value="pending-sellers">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Seller Applications</CardTitle>
                  <CardDescription>Review and approve new seller registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingSellers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        No pending seller applications
                      </div>
                    ) : (
                      pendingSellers.map((seller: any) => (
                        <div key={seller.id} className="p-4 border rounded-lg">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-4 mb-3">
                                <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                                  <Users className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div>
                                  <h3 className="font-semibold">{seller.store_name}</h3>
                                  <p className="text-sm text-muted-foreground">{seller.full_name}</p>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium">Email:</span> {seller.email}
                                </div>
                                <div>
                                  <span className="font-medium">Phone:</span> {seller.phone_number}
                                </div>
                                <div className="md:col-span-2">
                                  <span className="font-medium">Office Address:</span> {seller.office_address}
                                </div>
                                {seller.company_name && (
                                  <div className="md:col-span-2">
                                    <span className="font-medium">Company:</span> {seller.company_name}
                                  </div>
                                )}
                              </div>
                              
                              <div className="mt-3 text-xs text-muted-foreground">
                                Applied: {new Date(seller.created_at).toLocaleDateString()}
                              </div>
                            </div>
                            
                            <div className="flex flex-col gap-2 ml-4">
                              <Button
                                size="sm"
                                onClick={() => approveSellerApplication(seller.id, seller.email)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => rejectSellerApplication(seller.id)}
                              >
                                <X className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stores">
              <Card>
                <CardHeader>
                  <CardTitle>Store Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {stores.map((store: any) => (
                      <div key={store.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <img
                            src={store.store_logo_url || '/placeholder.svg'}
                            alt={store.store_name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div>
                            <h3 className="font-semibold">{store.store_name}</h3>
                            <p className="text-sm text-gray-600">{store.merchant.full_name}</p>
                            <p className="text-sm text-gray-500">{store.merchant.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={store.is_active ? "default" : "secondary"}>
                            {store.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleStoreStatus(store.id, store.is_active)}
                          >
                            {store.is_active ? 'Deactivate' : 'Activate'}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingReviews.map((review: any) => (
                      <div key={review.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{review.product.name}</h4>
                            <p className="text-sm text-gray-600">
                              by {review.customer.full_name} • {review.rating}/5 stars
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateReviewStatus(review.id, 'approved')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateReviewStatus(review.id, 'flagged')}
                            >
                              <Flag className="h-4 w-4 mr-1" />
                              Flag
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => updateReviewStatus(review.id, 'rejected')}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="qa">
              <Card>
                <CardHeader>
                  <CardTitle>Pending Q&A</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {pendingQA.map((qa: any) => (
                      <div key={qa.id} className="p-4 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-semibold">{qa.product.name}</h4>
                            <p className="text-sm text-gray-600">
                              by {qa.customer.full_name}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateQAStatus(qa.id, 'approved')}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => updateQAStatus(qa.id, 'rejected')}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-700">{qa.question}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
