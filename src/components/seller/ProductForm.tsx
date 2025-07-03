import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface ProductFormProps {
  storeId: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ storeId, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    compare_price: '',
    weight: '',
    stock_quantity: '',
    description: '',
    category_id: '',
    is_flash_sale: false,
    flash_sale_price: '',
    origin_country: '',
    origin_state: '',
    is_locally_made: true,
    quality_standard: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true);
    setCategories(data || []);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const productData = {
        store_id: storeId,
        name: formData.name,
        price: parseFloat(formData.price),
        compare_price: formData.compare_price ? parseFloat(formData.compare_price) : null,
        weight: parseFloat(formData.weight),
        stock_quantity: parseInt(formData.stock_quantity),
        description: formData.description,
        category_id: formData.category_id,
        is_flash_sale: formData.is_flash_sale,
        flash_sale_price: formData.is_flash_sale && formData.flash_sale_price ? parseFloat(formData.flash_sale_price) : null,
        origin_country: formData.origin_country,
        origin_state: formData.is_locally_made ? formData.origin_state : null,
        is_locally_made: formData.is_locally_made,
        quality_standard: formData.quality_standard ? parseInt(formData.quality_standard) : null,
        status: 'active' as const
      };

      const { error } = await supabase
        .from('products')
        .insert(productData);

      if (error) throw error;

      toast.success('Product added successfully!');
      onSuccess();
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast.error('Failed to add product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter product name"
                required
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category_id} onValueChange={(value) => handleInputChange('category_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category: any) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="price">Price (₦) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div>
              <Label htmlFor="compare_price">Compare Price (₦)</Label>
              <Input
                id="compare_price"
                type="number"
                step="0.01"
                value={formData.compare_price}
                onChange={(e) => handleInputChange('compare_price', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div>
              <Label htmlFor="weight">Weight (kg) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.01"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="stock_quantity">Stock Quantity *</Label>
              <Input
                id="stock_quantity"
                type="number"
                value={formData.stock_quantity}
                onChange={(e) => handleInputChange('stock_quantity', e.target.value)}
                placeholder="0"
                required
              />
            </div>
            <div>
              <Label htmlFor="quality_standard">Quality Standard (%)</Label>
              <Input
                id="quality_standard"
                type="number"
                min="0"
                max="100"
                value={formData.quality_standard}
                onChange={(e) => handleInputChange('quality_standard', e.target.value)}
                placeholder="85"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Product Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Detailed product description..."
              rows={4}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_locally_made"
                checked={formData.is_locally_made}
                onCheckedChange={(checked) => handleInputChange('is_locally_made', checked)}
              />
              <Label htmlFor="is_locally_made">Locally Made Product</Label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="origin_country">Origin Country</Label>
                <Input
                  id="origin_country"
                  value={formData.origin_country}
                  onChange={(e) => handleInputChange('origin_country', e.target.value)}
                  placeholder="Nigeria"
                />
              </div>
              {formData.is_locally_made && (
                <div>
                  <Label htmlFor="origin_state">Origin State</Label>
                  <Input
                    id="origin_state"
                    value={formData.origin_state}
                    onChange={(e) => handleInputChange('origin_state', e.target.value)}
                    placeholder="Lagos"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_flash_sale"
                checked={formData.is_flash_sale}
                onCheckedChange={(checked) => handleInputChange('is_flash_sale', checked)}
              />
              <Label htmlFor="is_flash_sale">Flash Sale</Label>
              {formData.is_flash_sale && <Badge variant="secondary">Limited Time Offer</Badge>}
            </div>

            {formData.is_flash_sale && (
              <div>
                <Label htmlFor="flash_sale_price">Flash Sale Price (₦)</Label>
                <Input
                  id="flash_sale_price"
                  type="number"
                  step="0.01"
                  value={formData.flash_sale_price}
                  onChange={(e) => handleInputChange('flash_sale_price', e.target.value)}
                  placeholder="0.00"
                />
              </div>
            )}
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? 'Adding Product...' : 'Add Product'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProductForm;