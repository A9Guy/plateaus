
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Header from '@/components/Header';
import AdminStats from '@/components/admin/AdminStats';
import PendingSellers from '@/components/admin/PendingSellers';
import StoreManagement from '@/components/admin/StoreManagement';
import ReviewModeration from '@/components/admin/ReviewModeration';
import QAModeration from '@/components/admin/QAModeration';

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

          <AdminStats stats={stats} />

          <Tabs defaultValue="pending-sellers" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pending-sellers">Pending Sellers</TabsTrigger>
              <TabsTrigger value="stores">Stores</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="qa">Q&A</TabsTrigger>
            </TabsList>

            <TabsContent value="pending-sellers">
              <PendingSellers
                pendingSellers={pendingSellers}
                onApprove={approveSellerApplication}
                onReject={rejectSellerApplication}
              />
            </TabsContent>

            <TabsContent value="stores">
              <StoreManagement
                stores={stores}
                onToggleStatus={toggleStoreStatus}
              />
            </TabsContent>

            <TabsContent value="reviews">
              <ReviewModeration
                pendingReviews={pendingReviews}
                onUpdateStatus={updateReviewStatus}
              />
            </TabsContent>

            <TabsContent value="qa">
              <QAModeration
                pendingQA={pendingQA}
                onUpdateStatus={updateQAStatus}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin;
