import React from 'react';
import { motion } from 'framer-motion';
import { Store, User, Mail, Phone, MapPin, ArrowLeft, Building } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SellerRegistrationProps {
  formData: {
    fullName: string;
    companyName: string;
    phoneNumber: string;
    email: string;
    officeAddress: string;
  };
  loading: boolean;
  sellerStore: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onRegistration: (e: React.FormEvent) => void;
  onGoBack: () => void;
}

const SellerRegistration: React.FC<SellerRegistrationProps> = ({
  formData,
  loading,
  sellerStore,
  onInputChange,
  onRegistration,
  onGoBack
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Button
        variant="ghost"
        onClick={onGoBack}
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
            <CardTitle className="text-2xl">PLATEAUS Seller</CardTitle>
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
              <form onSubmit={onRegistration} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <User className="h-4 w-4 inline mr-2" />
                      Full Name *
                    </label>
                    <Input
                      name="fullName"
                      value={formData.fullName}
                      onChange={onInputChange}
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
                      onChange={onInputChange}
                      placeholder="Your Company Name"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      <Phone className="h-4 w-4 inline mr-2" />
                      Mobile Phone Number *
                    </label>
                    <Input
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={onInputChange}
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
                      onChange={onInputChange}
                      placeholder="business@example.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <MapPin className="h-4 w-4 inline mr-2" />
                    Office Address (Optional)
                  </label>
                  <Textarea
                    name="officeAddress"
                    value={formData.officeAddress}
                    onChange={onInputChange}
                    placeholder="Your complete office address"
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
  );
};

export default SellerRegistration;