import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, User, Mail, Phone, MapPin, ArrowLeft, Building, Plus, Package, MessageSquare, BarChart3, Settings, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Seller = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [currentView, setCurrentView] = useState<'register' | 'dashboard'>('register');
  const [sellerStore, setSellerStore] = useState<any>(null);

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

      toast.success('Your seller application has been submitted! Please check your email for approval status updates.');
      
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button
              variant="ghost"
              onClick={() => navigate(-1)}
              className="mb-6"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>

            <div className="max-w-2xl mx-auto">
              <Card className="mb-8">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Store className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-2xl">Become a PLATEAUS Seller</CardTitle>
                  <CardDescription>
                    Join thousands of sellers and start your online business today
                  </CardDescription>
                </CardHeader>
              </Card>

              {sellerStore?.approval_status === 'pending' ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Store className="h-8 w-8 text-orange-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Application Under Review</h3>
                    <p className="text-muted-foreground mb-4">
                      Your seller application is currently being reviewed by our team. You'll receive an email notification once approved.
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Application submitted for: {sellerStore.store_name}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Seller Registration</CardTitle>
                    <CardDescription>
                      Please fill out the form below to apply as a seller on our platform
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleRegistration} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            <User className="h-4 w-4 inline mr-2" />
                            Full Name *
                          </label>
                          <Input
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleInputChange}
                            placeholder="Your Full Name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            <Building className="h-4 w-4 inline mr-2" />
                            Company Name (Optional)
                          </label>
                          <Input
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleInputChange}
                            placeholder="Your Company Name"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            <Phone className="h-4 w-4 inline mr-2" />
                            Phone Number *
                          </label>
                          <Input
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                            placeholder="+234 800 000 0000"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">
                            <Mail className="h-4 w-4 inline mr-2" />
                            Email Address *
                          </label>
                          <Input
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="business@example.com"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">
                          <MapPin className="h-4 w-4 inline mr-2" />
                          Office Address *
                        </label>
                        <Textarea
                          name="officeAddress"
                          value={formData.officeAddress}
                          onChange={handleInputChange}
                          placeholder="Your complete office address"
                          required
                          rows={3}
                        />
                      </div>

                      <div className="bg-muted p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">What happens next?</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• We'll review your application within 1-2 business days</li>
                          <li>• You'll receive an email notification about your application status</li>
                          <li>• Once approved, you'll get login credentials to access your seller dashboard</li>
                          <li>• You can then start listing your products and managing your store</li>
                        </ul>
                      </div>

                      <Button
                        type="submit"
                        className="w-full"
                        disabled={loading}
                      >
                        {loading ? 'Submitting Application...' : 'Submit Application'}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              )}
            </div>
          </motion.div>
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Seller Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {sellerStore?.full_name}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-right">
                <p className="text-sm font-medium">{sellerStore?.store_name}</p>
                <p className="text-xs text-muted-foreground">Store Rating: {sellerStore?.rating || 0}/5</p>
              </div>
              {sellerStore?.store_logo_url && (
                <img 
                  src={sellerStore.store_logo_url} 
                  alt="Store Logo" 
                  className="w-12 h-12 rounded-full object-cover"
                />
              )}
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Products</p>
                    <p className="text-2xl font-bold">{products.length}</p>
                  </div>
                  <Package className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Unread Messages</p>
                    <p className="text-2xl font-bold">{messages.filter(m => !m.is_read).length}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total Sales</p>
                    <p className="text-2xl font-bold">₦{sellerStore?.total_sales || 0}</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Dashboard Tabs */}
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="messages">Messages</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Product Management</CardTitle>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {products.length === 0 ? (
                    <div className="text-center py-8">
                      <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                      <p className="text-muted-foreground mb-4">Start by adding your first product to your store</p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Product
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {products.map((product: any) => (
                        <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-4">
                            <img
                              src={product.images?.[0] || '/placeholder.svg'}
                              alt={product.name}
                              className="w-16 h-16 rounded object-cover"
                            />
                            <div>
                              <h3 className="font-semibold">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">₦{product.price}</p>
                              <p className="text-xs text-muted-foreground">Stock: {product.stock_quantity}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">Edit</Button>
                            <Button variant="outline" size="sm">View</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="messages">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No messages yet</h3>
                      <p className="text-muted-foreground">Customer messages will appear here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message: any) => (
                        <div key={message.id} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{message.customer.full_name}</h4>
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-sm">{message.message}</p>
                          {!message.is_read && (
                            <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mt-2">
                              New
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Sales Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                    <p className="text-muted-foreground">Detailed sales analytics and reports will be available here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Store Settings</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-semibold mb-4">Store Appearance</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium mb-2">Store Name</label>
                          <Input defaultValue={sellerStore?.store_name} />
                        </div>
                        <div>
                          <label className="block text-sm font-medium mb-2">Font Color</label>
                          <Input type="color" defaultValue={sellerStore?.store_font_color || '#000000'} />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-4">Store Logo</h4>
                      <div className="flex items-center gap-4">
                        {sellerStore?.store_logo_url ? (
                          <img 
                            src={sellerStore.store_logo_url} 
                            alt="Current Logo" 
                            className="w-16 h-16 rounded object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-muted rounded flex items-center justify-center">
                            <Upload className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                        <Button variant="outline">
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Logo
                        </Button>
                      </div>
                    </div>

                    <Button className="w-full">Save Settings</Button>
                  </div>
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

export default Seller;