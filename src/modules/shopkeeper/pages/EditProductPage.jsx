import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Package } from 'lucide-react';
import { getProductById, updateProduct } from '../../../services/firebase/firestoreService';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';
import { DetailSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Sweets',
    price: '',
    weight: '500g',
    stock: '',
    status: 'In Stock',
    description: '',
  });

  useEffect(() => {
    const fetchProd = async () => {
      setLoading(true);
      try {
        const data = await getProductById(id);
        if (data) {
          setProduct(data);
          setFormData({
            name: data.name || '',
            category: data.category || 'Sweets',
            price: data.price || '',
            weight: data.weight || '500g',
            stock: data.stock || '',
            status: data.status || 'In Stock',
            description: data.description || '',
          });
        }
      } catch (_err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProd();
  }, [id]);

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
    setSaving(true);
    try {
      await updateProduct(id, {
        name: formData.name.trim(),
        category: formData.category,
        price: Number(formData.price) || 0,
        weight: formData.weight,
        stock: Number(formData.stock) || 0,
        status: Number(formData.stock) > 0 ? 'In Stock' : 'Out of Stock',
        description: formData.description.trim(),
      });
      showToast(`Updated ${formData.name} successfully!`, 'success');
      navigate('/shopkeeper/products/manage');
    } catch (_err) {
      showToast('Error updating product.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto py-16">
        <EmptyState
          icon={Package}
          title="Product Not Found"
          description="The requested delicacy does not exist in your store catalog."
          actionLabel="Return to Inventory"
          onAction={() => navigate('/shopkeeper/products/manage')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Link to="/shopkeeper/products/manage" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Inventory
        </Link>
        <h1 className="text-3xl font-serif font-black text-stone-900 mt-2">Edit Product</h1>
        <p className="text-sm text-stone-500">Update stock levels, pricing, or description for {product.name}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card title="Product Details">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Delicacy Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                label="Price (₹)"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
              <Input
                label="Pack Weight"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                required
              />
              <Input
                label="Units in Stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-stone-700 block">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link to="/shopkeeper/products/manage">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button type="submit" variant="primary" icon={Save} loading={saving}>
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
