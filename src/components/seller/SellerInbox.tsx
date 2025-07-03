import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Send } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SellerInboxProps {
  sellerId: string;
}

const SellerInbox: React.FC<SellerInboxProps> = ({ sellerId }) => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, [sellerId]);

  const fetchMessages = async () => {
    const { data } = await supabase
      .from('seller_messages')
      .select(`
        *,
        customer:profiles!seller_messages_customer_id_fkey(full_name, email),
        product:products(name)
      `)
      .eq('seller_id', sellerId)
      .order('created_at', { ascending: false });

    setMessages(data || []);
  };

  const markAsRead = async (messageId: string) => {
    await supabase
      .from('seller_messages')
      .update({ is_read: true })
      .eq('id', messageId);
    
    fetchMessages();
  };

  const sendReply = async () => {
    if (!replyText.trim() || !selectedMessage) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('seller_messages')
        .insert({
          seller_id: sellerId,
          customer_id: selectedMessage.customer_id,
          product_id: selectedMessage.product_id,
          message: replyText,
          sender_type: 'seller',
          is_read: false
        });

      if (error) throw error;

      // Mark original message as read
      await markAsRead(selectedMessage.id);
      
      setReplyText('');
      setSelectedMessage(null);
      fetchMessages();
      toast.success('Reply sent successfully!');
    } catch (error: any) {
      console.error('Error sending reply:', error);
      toast.error('Failed to send reply');
    } finally {
      setLoading(false);
    }
  };

  const handleMessageClick = (message: any) => {
    setSelectedMessage(message);
    if (!message.is_read) {
      markAsRead(message.id);
    }
  };

  if (selectedMessage) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Message Details</CardTitle>
            <Button variant="outline" onClick={() => setSelectedMessage(null)}>
              Back to Inbox
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold">{selectedMessage.customer.full_name}</h4>
              <span className="text-sm text-muted-foreground">
                {new Date(selectedMessage.created_at).toLocaleString()}
              </span>
            </div>
            {selectedMessage.product && (
              <p className="text-sm text-muted-foreground mb-2">
                Re: {selectedMessage.product.name}
              </p>
            )}
            <p className="text-sm">{selectedMessage.message}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Reply to Customer</label>
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply here..."
              rows={4}
            />
            <Button onClick={sendReply} disabled={loading || !replyText.trim()}>
              <Send className="h-4 w-4 mr-2" />
              {loading ? 'Sending...' : 'Send Reply'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
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
              <div
                key={message.id}
                className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${
                  !message.is_read ? 'border-blue-200 bg-blue-50' : ''
                }`}
                onClick={() => handleMessageClick(message)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold">{message.customer.full_name}</h4>
                  <div className="flex items-center gap-2">
                    {!message.is_read && (
                      <Badge variant="default" className="text-xs">New</Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {new Date(message.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {message.product && (
                  <p className="text-sm text-muted-foreground mb-1">
                    Re: {message.product.name}
                  </p>
                )}
                <p className="text-sm line-clamp-2">{message.message}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SellerInbox;