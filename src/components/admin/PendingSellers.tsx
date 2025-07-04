import React from 'react';
import { Users, CheckCircle, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface PendingSellersProps {
  pendingSellers: any[];
  onApprove: (storeId: string, sellerEmail: string) => void;
  onReject: (storeId: string) => void;
}

const PendingSellers: React.FC<PendingSellersProps> = ({
  pendingSellers,
  onApprove,
  onReject
}) => {
  return (
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
                      onClick={() => onApprove(seller.id, seller.email)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onReject(seller.id)}
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
  );
};

export default PendingSellers;