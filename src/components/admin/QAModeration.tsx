import React from 'react';
import { CheckCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface QAModerationProps {
  pendingQA: any[];
  onUpdateStatus: (qaId: string, status: 'approved' | 'rejected') => void;
}

const QAModeration: React.FC<QAModerationProps> = ({
  pendingQA,
  onUpdateStatus
}) => {
  return (
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
                    onClick={() => onUpdateStatus(qa.id, 'approved')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onUpdateStatus(qa.id, 'rejected')}
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
  );
};

export default QAModeration;