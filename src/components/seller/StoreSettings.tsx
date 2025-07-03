import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StoreSettingsProps {
  store: any;
  onUpdate: () => void;
}

const StoreSettings: React.FC<StoreSettingsProps> = ({ store, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    store_name: store?.store_name || '',
    store_font_color: store?.store_font_color || '#000000',
    store_description: store?.store_description || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('stores')
        .update(formData)
        .eq('id', store.id);

      if (error) throw error;

      toast.success('Store settings updated successfully!');
      onUpdate();
    } catch (error: any) {
      console.error('Error updating store settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Store Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h4 className="font-semibold">Store Appearance</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="store_name">Store Name</Label>
              <Input
                id="store_name"
                value={formData.store_name}
                onChange={(e) => handleInputChange('store_name', e.target.value)}
                placeholder="Your Store Name"
              />
            </div>
            <div>
              <Label htmlFor="store_font_color">Brand Color</Label>
              <div className="flex gap-2">
                <Input
                  id="store_font_color"
                  type="color"
                  value={formData.store_font_color}
                  onChange={(e) => handleInputChange('store_font_color', e.target.value)}
                  className="w-20"
                />
                <Input
                  value={formData.store_font_color}
                  onChange={(e) => handleInputChange('store_font_color', e.target.value)}
                  placeholder="#000000"
                  className="flex-1"
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="store_description">Store Description</Label>
            <Input
              id="store_description"
              value={formData.store_description}
              onChange={(e) => handleInputChange('store_description', e.target.value)}
              placeholder="Tell customers about your store..."
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <h4 className="font-semibold">Store Logo</h4>
          <div className="flex items-center gap-4">
            {store?.store_logo_url ? (
              <img 
                src={store.store_logo_url} 
                alt="Current Logo" 
                className="w-16 h-16 rounded object-cover border"
              />
            ) : (
              <div className="w-16 h-16 bg-muted rounded flex items-center justify-center border">
                <Upload className="h-6 w-6 text-muted-foreground" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">
                Upload a logo for your store. Recommended size: 200x200px
              </p>
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Upload Logo
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="font-semibold">Store Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Store ID:</span> {store?.id}
            </div>
            <div>
              <span className="font-medium">Created:</span> {new Date(store?.created_at).toLocaleDateString()}
            </div>
            <div>
              <span className="font-medium">Status:</span> 
              <span className={`ml-2 px-2 py-1 rounded text-xs ${
                store?.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {store?.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div>
              <span className="font-medium">Rating:</span> {store?.rating || 0}/5
            </div>
          </div>
        </div>

        <Button onClick={handleSaveSettings} disabled={loading} className="w-full">
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default StoreSettings;