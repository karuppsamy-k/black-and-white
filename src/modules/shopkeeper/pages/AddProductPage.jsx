import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Image, Save, Sparkles } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { createProduct } from '../../../services/firebase/firestoreService';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';

export const AddProductPage = () => {
  const { currentUser } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: 'Sweets',
    price: '',
    originalPrice: '',
    weight: '500g',
    stock: '',
    description: '',
    ingredients: '',
    isPureGhee: true,
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    { value: 'Halwa', label: 'Traditional Halwa' },
    { value: 'Sweets', label: 'Ghee Sweets' },
    { value: 'Savouries', label: 'Chettinad Savouries' },
    { value: 'Murukku', label: 'Crispy Murukku' },
    { value: 'Mixture', label: 'Spicy Mixture' },
    { value: 'Dry Fruits', label: 'Dry Fruit Confectionery' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const productPayload = {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price) || 0,
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
        weight: formData.weight,
        stock: Number(formData.stock) || 0,
        description: formData.description.trim(),
        ingredients: formData.ingredients ? formData.ingredients.split(',').map((s) => s.trim()) : [],
        isPureGhee: formData.isPureGhee,
        shopId: currentUser?.uid || 'merchant-hub',
        shopName: currentUser?.shopName || 'Registered Sweet Shop',
        city: currentUser?.city || 'Madurai',
        image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80',
      };

      await createProduct(productPayload);
      showToast(`Added ${formData.name} to shop inventory!`, 'success');
      navigate('/shopkeeper/products/manage');
    } catch (_err) {
      showToast('Error publishing product.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Link to="/shopkeeper/products/manage" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Inventory
        </Link>
        <h1 className="text-3xl font-serif font-black text-stone-900 mt-2">Add New Delicacy</h1>
        <p className="text-sm text-stone-500">Publish a new fresh batch of traditional sweet or snack to your menu</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Product Information">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Delicacy Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Special Tirunelveli Wheat Halwa"
                required
              />
              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={categories}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Selling Price (₹)"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="240"
                required
              />
              <Input
                label="Original Price (₹) [Optional]"
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="280"
              />
              <Input
                label="Pack Weight / Volume"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="500g"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Available Units in Stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="50"
                required
              />
              <Input
                label="Key Ingredients (Comma Separated)"
                value={formData.ingredients}
                onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                placeholder="Wheat milk, Pure cow ghee, Raw cane sugar, Cashews"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 block">Preparation & Taste Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="Describe texture, sweetness level, ghee aroma, and regional heritage..."
                required
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link to="/shopkeeper/products/manage">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" variant="primary" icon={Save} loading={loading}>
            Publish Delicacy to Store
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
