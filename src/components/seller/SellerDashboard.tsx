import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Package, MessageSquare, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductForm from '@/components/seller/ProductForm';
import SellerInbox from '@/components/seller/SellerInbox';
import StoreSettings from '@/components/seller/StoreSettings';

interface SellerDashboardProps {
  sellerStore: any;
  user: any;
  products: any[];
  messages: any[];
  showProductForm: boolean;
  onShowProductForm: (show: boolean) => void;
  onRefreshData: () => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({
  sellerStore,
  user,
  products,
  messages,
  showProductForm,
  onShowProductForm,
  onRefreshData
}) => {
  return (
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
          {showProductForm ? (
            <ProductForm
              storeId={sellerStore.id}
              onSuccess={() => {
                onShowProductForm(false);
                onRefreshData();
              }}
              onCancel={() => onShowProductForm(false)}
            />
          ) : (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Product Management</CardTitle>
                  <Button onClick={() => onShowProductForm(true)}>
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
                    <Button onClick={() => onShowProductForm(true)}>
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
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-medium">₦{product.price}</p>
                              {product.compare_price && (
                                <p className="text-sm text-muted-foreground line-through">₦{product.compare_price}</p>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {product.stock_quantity} items left • {product.weight}kg
                            </p>
                            {product.is_flash_sale && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                Flash Sale: ₦{product.flash_sale_price}
                              </span>
                            )}
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
          )}
        </TabsContent>

        <TabsContent value="messages">
          <SellerInbox sellerId={user?.id || ''} />
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
          <StoreSettings 
            store={sellerStore} 
            onUpdate={onRefreshData}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default SellerDashboard;