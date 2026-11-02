import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlusCircle, ArrowLeft, Image, Save, Sparkles } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';

export const AddProductPage = () => {
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
    { value: 'Dry Fruits', label: 'Dry Fruit Confectionery' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast(`Added ${formData.name} to shop inventory!`, 'success');
      navigate('/shopkeeper/products/manage');
    }, 500);
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
                placeholder="e.g. Special Wheat Halwa"
                required
              />
              <Select
                label="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                options={categories}
                required
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
                label="MRP / Strike Price (₹)"
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                placeholder="280"
              />
              <Input
                label="Standard Package Weight"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="500g"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Stock Quantity in Units"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                placeholder="50"
                required
              />
              <div className="flex items-center pt-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.isPureGhee}
                    onChange={(e) => setFormData({ ...formData, isPureGhee: e.target.checked })}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Prepared in 100% Pure Cow Ghee</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Delicacy Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                placeholder="Describe texture, sweetness level, aroma, and artisanal cooking technique..."
                className="w-full rounded-xl text-sm p-3.5 border border-stone-200 outline-none focus:border-amber-600"
                required
              />
            </div>

            <Input
              label="Ingredients (comma separated)"
              value={formData.ingredients}
              onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
              placeholder="e.g. Samba Wheat, Pure Ghee, Sugar, Cashews, Cardamom"
            />
          </div>
        </Card>

        {/* Image Upload Box */}
        <Card title="Product Photo">
          <div
            onClick={() => showToast('Image upload available in Phase 3 storage', 'info')}
            className="border-2 border-dashed border-stone-300 rounded-2xl p-8 text-center cursor-pointer hover:bg-stone-50 transition"
          >
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto mb-2">
              <Image className="w-6 h-6" />
            </div>
            <p className="text-xs font-bold text-stone-800">Click to upload photo of fresh batch</p>
            <p className="text-[11px] text-stone-400 mt-0.5">PNG, JPG up to 5MB (Square or 4:3 recommended)</p>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading} icon={Save}>
            Publish Delicacy
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
