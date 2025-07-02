
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Store, User, Mail, Phone, MapPin, FileText, ArrowLeft, Building, Home, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BecomeSeller = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    storeName: '',
    storeDescription: '',
    businessEmail: '',
    businessPhone: '',
    businessAddress: '',
    businessType: '',
    experience: '',
    sellingLocation: '',
    marketName: '',
    shopNumber: '',
    physicalAddress: '',
    homeAddress: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to apply as a seller');
      navigate('/auth');
      return;
    }

    setLoading(true);

    try {
      // Create store entry with location data
      const storeData = {
        store_name: formData.storeName,
        store_description: formData.storeDescription,
        merchant_id: user.id,
        is_active: false, // Requires approval
        is_verified: false,
        selling_location_type: formData.sellingLocation,
        market_name: formData.sellingLocation === 'public-market' ? formData.marketName : null,
        shop_number: formData.sellingLocation === 'public-market' ? formData.shopNumber : null,
        physical_address: formData.sellingLocation === 'single-shop' ? formData.physicalAddress : null,
        home_address: formData.sellingLocation === 'home-based' ? formData.homeAddress : null,
      };

      const { error } = await supabase
        .from('stores')
        .insert(storeData);

      if (error) {
        throw error;
      }

      // Update user profile role to merchant
      await supabase
        .from('profiles')
        .update({ role: 'merchant' })
        .eq('user_id', user.id);

      toast.success('Your seller application has been submitted! We\'ll review it and get back to you soon.');
      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error submitting seller application:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
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
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                  <Store className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Become a PLATEAUS Seller</CardTitle>
                <CardDescription>
                  Join thousands of sellers and start your online business today
                </CardDescription>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Seller Application</CardTitle>
                <CardDescription>
                  Please fill out the form below to apply as a seller on our platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Store className="h-4 w-4 inline mr-2" />
                        Store Name *
                      </label>
                      <Input
                        name="storeName"
                        value={formData.storeName}
                        onChange={handleInputChange}
                        placeholder="Your Store Name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Mail className="h-4 w-4 inline mr-2" />
                        Business Email *
                      </label>
                      <Input
                        name="businessEmail"
                        type="email"
                        value={formData.businessEmail}
                        onChange={handleInputChange}
                        placeholder="business@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Phone className="h-4 w-4 inline mr-2" />
                        Business Phone *
                      </label>
                      <Input
                        name="businessPhone"
                        value={formData.businessPhone}
                        onChange={handleInputChange}
                        placeholder="+234 800 000 0000"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <FileText className="h-4 w-4 inline mr-2" />
                        Business Type
                      </label>
                      <Input
                        name="businessType"
                        value={formData.businessType}
                        onChange={handleInputChange}
                        placeholder="e.g., Electronics, Fashion, Food"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Business Address *
                    </label>
                    <Textarea
                      name="businessAddress"
                      value={formData.businessAddress}
                      onChange={handleInputChange}
                      placeholder="Your complete business address"
                      required
                      rows={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Store className="h-4 w-4 inline mr-2" />
                      Store Description *
                    </label>
                    <Textarea
                      name="storeDescription"
                      value={formData.storeDescription}
                      onChange={handleInputChange}
                      placeholder="Tell us about your store and what you plan to sell..."
                      required
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      Business Experience
                    </label>
                    <Textarea
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      placeholder="Tell us about your business experience and why you want to sell on PLATEAUS..."
                      rows={3}
                    />
                  </div>

                  {/* Selling Location Category */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      <MapPin className="h-4 w-4 inline mr-2" />
                      Selling Location Category *
                    </label>
                    <RadioGroup
                      value={formData.sellingLocation}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, sellingLocation: value }))}
                      className="space-y-4"
                    >
                      <div className="flex items-start space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value="public-market" id="public-market" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="public-market" className="flex items-center gap-2 font-medium cursor-pointer">
                            <ShoppingBag className="h-4 w-4" />
                            Public Market
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Selling from a market stall or public marketplace
                          </p>
                          {formData.sellingLocation === 'public-market' && (
                            <div className="mt-3 space-y-3">
                              <div>
                                <Label htmlFor="marketName" className="text-sm">Market Name *</Label>
                                <Input
                                  id="marketName"
                                  name="marketName"
                                  value={formData.marketName}
                                  onChange={handleInputChange}
                                  placeholder="e.g., Computer Village, Alaba Market"
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="shopNumber" className="text-sm">Shop Number *</Label>
                                <Input
                                  id="shopNumber"
                                  name="shopNumber"
                                  value={formData.shopNumber}
                                  onChange={handleInputChange}
                                  placeholder="e.g., Shop 123, Block A"
                                  required
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value="single-shop" id="single-shop" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="single-shop" className="flex items-center gap-2 font-medium cursor-pointer">
                            <Building className="h-4 w-4" />
                            Single Holding Shop
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Operating from a standalone retail location
                          </p>
                          {formData.sellingLocation === 'single-shop' && (
                            <div className="mt-3">
                              <Label htmlFor="physicalAddress" className="text-sm">Physical Address *</Label>
                              <Textarea
                                id="physicalAddress"
                                name="physicalAddress"
                                value={formData.physicalAddress}
                                onChange={handleInputChange}
                                placeholder="Enter your complete shop address (will be verified via Google Maps)"
                                required
                                rows={2}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Address will be validated using Google Maps verification
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start space-x-3 p-4 border rounded-lg">
                        <RadioGroupItem value="home-based" id="home-based" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="home-based" className="flex items-center gap-2 font-medium cursor-pointer">
                            <Home className="h-4 w-4" />
                            Selling from Home
                          </Label>
                          <p className="text-sm text-gray-600 mt-1">
                            Home-based business operations
                          </p>
                          {formData.sellingLocation === 'home-based' && (
                            <div className="mt-3">
                              <Label htmlFor="homeAddress" className="text-sm">Home Address *</Label>
                              <Textarea
                                id="homeAddress"
                                name="homeAddress"
                                value={formData.homeAddress}
                                onChange={handleInputChange}
                                placeholder="Enter your home address (will be verified via Google Maps)"
                                required
                                rows={2}
                              />
                              <p className="text-xs text-gray-500 mt-1">
                                Address will be validated using Google Maps verification
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">What happens next?</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• We'll review your application within 1-2 business days</li>
                      <li>• You'll receive an email notification about your application status</li>
                      <li>• Once approved, you can start listing your products</li>
                      <li>• Our team will guide you through the setup process</li>
                    </ul>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                    disabled={loading || !formData.sellingLocation}
                  >
                    {loading ? 'Submitting Application...' : 'Submit Application'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
      
      <Footer />
    </div>
  );
};

export default BecomeSeller;
