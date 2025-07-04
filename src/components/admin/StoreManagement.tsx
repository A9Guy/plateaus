import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface StoreManagementProps {
  stores: any[];
  onToggleStatus: (storeId: string, isActive: boolean) => void;
}

const StoreManagement: React.FC<StoreManagementProps> = ({
  stores,
  onToggleStatus
}) => {
  return (
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
                  onClick={() => onToggleStatus(store.id, store.is_active)}
                >
                  {store.is_active ? 'Deactivate' : 'Activate'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StoreManagement;