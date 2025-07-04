import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SellerRegistration from '@/components/seller/SellerRegistration';
import SellerDashboard from '@/components/seller/SellerDashboard';

const Seller = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'register' | 'dashboard'>('register');
  const [sellerStore, setSellerStore] = useState<any>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  // Registration form state
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    phoneNumber: '',
    email: '',
    officeAddress: ''
  });

  // Dashboard state
  const [products, setProducts] = useState([]);
  const [messages, setMessages] = useState([]);
  const [analytics, setAnalytics] = useState({ totalSales: 0, totalOrders: 0, totalProducts: 0 });

  useEffect(() => {
    if (user) {
      checkSellerStatus();
    }
  }, [user]);

  const checkSellerStatus = async () => {
    if (!user) return;

    const { data: store } = await supabase
      .from('stores')
      .select('*')
      .eq('merchant_id', user.id)
      .single();

    if (store) {
      setSellerStore(store);
      if (store.approval_status === 'approved') {
        setCurrentView('dashboard');
        fetchDashboardData();
      }
    }
  };

  const fetchDashboardData = async () => {
    if (!user) return;

    // Fetch products
    const { data: productsData } = await supabase
      .from('products')
      .select('*')
      .eq('store_id', sellerStore?.id);

    // Fetch messages
    const { data: messagesData } = await supabase
      .from('seller_messages')
      .select('*, customer:profiles!seller_messages_customer_id_fkey(full_name)')
      .eq('seller_id', user.id);

    setProducts(productsData || []);
    setMessages(messagesData || []);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to apply as a seller');
      navigate('/auth');
      return;
    }

    setLoading(true);

    try {
      const storeData = {
        store_name: formData.companyName || `${formData.fullName}'s Store`,
        merchant_id: user.id,
        full_name: formData.fullName,
        company_name: formData.companyName,
        phone_number: formData.phoneNumber,
        email: formData.email,
        office_address: formData.officeAddress,
        approval_status: 'pending',
        is_active: false,
        is_verified: false
      };

      const { error } = await supabase
        .from('stores')
        .insert(storeData);

      if (error) throw error;

      // Update user profile role to merchant
      await supabase
        .from('profiles')
        .update({ role: 'merchant' })
        .eq('user_id', user.id);

      toast.success('Welcome to the seller family! Your account is pending approval. Please check your email.');
      
      checkSellerStatus();
    } catch (error: any) {
      console.error('Error submitting seller application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (currentView === 'register' || !sellerStore || sellerStore.approval_status === 'pending') {
    return (
      <div className="min-h-screen bg-muted">
        <Header />
        
        <div className="container mx-auto px-4 py-8">
          <SellerRegistration
            formData={formData}
            loading={loading}
            sellerStore={sellerStore}
            onInputChange={handleInputChange}
            onRegistration={handleRegistration}
            onGoBack={() => navigate(-1)}
          />
        </div>
        
        <Footer />
      </div>
    );
  }

  // Seller Dashboard
  return (
    <div className="min-h-screen bg-muted">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <SellerDashboard
          sellerStore={sellerStore}
          user={user}
          products={products}
          messages={messages}
          showProductForm={showProductForm}
          onShowProductForm={setShowProductForm}
          onRefreshData={fetchDashboardData}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default Seller;