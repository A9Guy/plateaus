import React from 'react';
import { Flag, CheckCircle, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ReviewModerationProps {
  pendingReviews: any[];
  onUpdateStatus: (reviewId: string, status: 'approved' | 'flagged' | 'rejected') => void;
}

const ReviewModeration: React.FC<ReviewModerationProps> = ({
  pendingReviews,
  onUpdateStatus
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Reviews</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingReviews.map((review: any) => (
            <div key={review.id} className="p-4 border rounded-lg">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-semibold">{review.product.name}</h4>
                  <p className="text-sm text-gray-600">
                    by {review.customer.full_name} • {review.rating}/5 stars
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => onUpdateStatus(review.id, 'approved')}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onUpdateStatus(review.id, 'flagged')}
                  >
                    <Flag className="h-4 w-4 mr-1" />
                    Flag
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onUpdateStatus(review.id, 'rejected')}
                  >
                    <X className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              </div>
              <p className="text-gray-700">{review.comment}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewModeration;