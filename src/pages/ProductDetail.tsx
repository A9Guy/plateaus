
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, Share2, ShoppingCart, MessageCircle, Eye, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  compare_price?: number;
  images: string[];
  rating?: number;
  views_count: number;
  store: {
    store_name: string;
    rating: number;
  };
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  customer: {
    full_name: string;
  };
  is_verified_purchase: boolean;
}

interface QAItem {
  id: string;
  question: string;
  answer?: string;
  created_at: string;
  customer: {
    full_name: string;
  };
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [qaItems, setQAItems] = useState<QAItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [newQuestion, setNewQuestion] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchReviews();
      fetchQA();
      trackView();
    }
  }, [id]);

  const fetchProduct = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        store:stores (store_name, rating)
      `)
      .eq('id', id)
      .single();

    if (error) {
      toast.error('Product not found');
      navigate('/');
      return;
    }

    setProduct(data);
  };

  const fetchReviews = async () => {
    const { data } = await supabase
      .from('reviews')
      .select(`
        *,
        customer:profiles (full_name)
      `)
      .eq('product_id', id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    setReviews(data || []);
  };

  const fetchQA = async () => {
    const { data } = await supabase
      .from('product_qa')
      .select(`
        *,
        customer:profiles (full_name)
      `)
      .eq('product_id', id)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    setQAItems(data || []);
    setLoading(false);
  };

  const trackView = async () => {
    if (user) {
      await supabase
        .from('recently_viewed')
        .upsert({ user_id: user.id, product_id: id });
    }

    await supabase.rpc('increment_product_views', { product_id: id });
  };

  const submitReview = async () => {
    if (!user) {
      toast.error('Please login to submit a review');
      return;
    }

    const { error } = await supabase
      .from('reviews')
      .insert({
        product_id: id,
        customer_id: user.id,
        rating: newReview.rating,
        comment: newReview.comment,
      });

    if (error) {
      toast.error('Failed to submit review');
      return;
    }

    toast.success('Review submitted for approval');
    setNewReview({ rating: 5, comment: '' });
  };

  const submitQuestion = async () => {
    if (!user) {
      toast.error('Please login to ask a question');
      return;
    }

    const { error } = await supabase
      .from('product_qa')
      .insert({
        product_id: id,
        customer_id: user.id,
        question: newQuestion,
      });

    if (error) {
      toast.error('Failed to submit question');
      return;
    }

    toast.success('Question submitted');
    setNewQuestion('');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found</div>;
  }

  const hasDiscount = product.compare_price && product.compare_price > product.price;
  const discountPercentage = hasDiscount ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm">
              <img
                src={product.images[selectedImage] || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden ${
                      selectedImage === index ? 'ring-2 ring-black' : ''
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <p className="text-gray-600 mb-4">{product.store.store_name}</p>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating || 0}</span>
                  <span className="text-gray-500">({reviews.length} reviews)</span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Eye className="h-4 w-4" />
                  <span>{product.views_count} views</span>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-3xl font-bold text-black">
                  ₦{product.price.toLocaleString()}
                </span>
                {hasDiscount && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₦{product.compare_price!.toLocaleString()}
                    </span>
                    <Badge className="bg-green-500 text-white">
                      -{discountPercentage}%
                    </Badge>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Button className="w-full bg-black hover:bg-gray-800 text-white py-3">
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </Button>
              
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1">
                  <Heart className="h-4 w-4 mr-2" />
                  Save
                </Button>
                <Button variant="outline" className="flex-1">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {product.description && (
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5" />
              Customer Reviews ({reviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {user && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4">Write a Review</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Rating</label>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setNewReview({ ...newReview, rating: star })}
                          className={`${
                            star <= newReview.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        >
                          <Star className="h-6 w-6 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <Textarea
                    placeholder="Share your experience with this product..."
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                  />
                  <Button onClick={submitReview}>Submit Review</Button>
                </div>
              </div>
            )}

            {reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-medium">{review.customer.full_name}</span>
                  {review.is_verified_purchase && (
                    <Badge variant="secondary" className="text-xs">Verified Purchase</Badge>
                  )}
                  <span className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Q&A Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              Questions & Answers ({qaItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {user && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-4">Ask a Question</h4>
                <div className="space-y-4">
                  <Input
                    placeholder="What would you like to know about this product?"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                  <Button onClick={submitQuestion}>Submit Question</Button>
                </div>
              </div>
            )}

            {qaItems.map((qa) => (
              <div key={qa.id} className="border-b pb-4 last:border-b-0">
                <div className="mb-2">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium">Q:</span>
                    <span className="text-sm text-gray-500">{qa.customer.full_name}</span>
                    <span className="text-sm text-gray-500">
                      {new Date(qa.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-gray-700 ml-6">{qa.question}</p>
                </div>
                {qa.answer && (
                  <div className="ml-6 mt-2 bg-gray-50 p-3 rounded">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">A:</span>
                      <span className="text-sm text-gray-500">Store Owner</span>
                    </div>
                    <p className="text-gray-700">{qa.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
};

export default ProductDetail;
