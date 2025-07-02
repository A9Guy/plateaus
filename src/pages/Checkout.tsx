
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, MapPin, Package, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Checkout = () => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    paymentMethod: 'card'
  });

  useEffect(() => {
    if (!user) {
      toast.error('Please login to proceed with checkout');
      navigate('/auth');
      return;
    }

    if (items.length === 0) {
      navigate('/cart');
      return;
    }
  }, [user, items, navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    // Simulate order placement
    setOrderPlaced(true);
    clearCart();
    toast.success('Order placed successfully!');
    
    // Redirect to order confirmation after 3 seconds
    setTimeout(() => {
      navigate('/dashboard');
    }, 3000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
            <p className="text-gray-600 mb-4">Thank you for your purchase</p>
            <p className="text-sm text-gray-500">
              Order #PLT{Date.now().toString().slice(-6)}
            </p>
            <p className="text-sm text-gray-500 mb-6">
              You'll receive a confirmation email shortly
            </p>
            <Button onClick={() => navigate('/dashboard')} className="bg-black hover:bg-gray-800 text-white">
              View Order Details
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Progress Steps */}
              <div className="flex items-center justify-between mb-8">
                {[1, 2, 3].map((stepNum) => (
                  <div key={stepNum} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      step >= stepNum ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {stepNum}
                    </div>
                    {stepNum < 3 && (
                      <div className={`w-16 h-0.5 mx-2 ${
                        step > stepNum ? 'bg-black' : 'bg-gray-200'
                      }`} />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Shipping Information */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Shipping Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input
                            id="firstName"
                            value={formData.firstName}
                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input
                            id="lastName"
                            value={formData.lastName}
                            onChange={(e) => handleInputChange('lastName', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="address">Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label htmlFor="state">State</Label>
                          <Select onValueChange={(value) => handleInputChange('state', value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="lagos">Lagos</SelectItem>
                              <SelectItem value="abuja">Abuja</SelectItem>
                              <SelectItem value="kano">Kano</SelectItem>
                              <SelectItem value="rivers">Rivers</SelectItem>
                              <SelectItem value="ogun">Ogun</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="postalCode">Postal Code</Label>
                          <Input
                            id="postalCode"
                            value={formData.postalCode}
                            onChange={(e) => handleInputChange('postalCode', e.target.value)}
                          />
                        </div>
                      </div>
                      <Button 
                        onClick={() => setStep(2)}
                        className="w-full bg-black hover:bg-gray-800 text-white"
                      >
                        Continue to Payment
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 2: Payment Information */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Payment Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Payment Method</Label>
                        <Select onValueChange={(value) => handleInputChange('paymentMethod', value)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select payment method" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="card">Credit/Debit Card</SelectItem>
                            <SelectItem value="bank">Bank Transfer</SelectItem>
                            <SelectItem value="cod">Cash on Delivery</SelectItem>
                            <SelectItem value="mobile">Mobile Money</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {formData.paymentMethod === 'card' && (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="cardNumber">Card Number</Label>
                            <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor="expiry">Expiry Date</Label>
                              <Input id="expiry" placeholder="MM/YY" />
                            </div>
                            <div>
                              <Label htmlFor="cvv">CVV</Label>
                              <Input id="cvv" placeholder="123" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex gap-4">
                        <Button 
                          variant="outline"
                          onClick={() => setStep(1)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={() => setStep(3)}
                          className="flex-1 bg-black hover:bg-gray-800 text-white"
                        >
                          Review Order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Step 3: Order Review */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Review Your Order
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-4">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center justify-between gap-4 p-4 border rounded-lg">
                            <div className="flex items-center gap-4 flex-1">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">{item.name}</h4>
                                <p className="text-sm text-muted-foreground">{item.storeName}</p>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
                              <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>₦{getTotalPrice().toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Shipping</span>
                          <span>₦2,500</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                          <span>Total</span>
                          <span>₦{(getTotalPrice() + 2500).toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="flex gap-4">
                        <Button 
                          variant="outline"
                          onClick={() => setStep(2)}
                          className="flex-1"
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={handlePlaceOrder}
                          className="flex-1 bg-black hover:bg-gray-800 text-white"
                        >
                          Place Order
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name} × {item.quantity}</span>
                      <span>₦{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₦{getTotalPrice().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>₦2,500</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₦{(getTotalPrice() + 2500).toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Checkout;
