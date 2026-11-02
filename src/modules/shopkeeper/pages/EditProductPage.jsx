import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Trash2 } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../../utils/mockData';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Select from '../../../components/common/Select';
import Button from '../../../components/common/Button';

export const EditProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useApp();

  const product = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];

  const [formData, setFormData] = useState({
    name: product.name,
    category: product.category,
    price: product.price,
    weight: product.weight,
    stock: product.stock,
    status: product.status || 'In Stock',
    description: product.description,
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast(`Updated ${formData.name} successfully!`, 'success');
      navigate('/shopkeeper/products/manage');
    }, 400);
  };

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
                label="Product Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <Select
                label="Stock Availability"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                options={['In Stock', 'Low Stock', 'Out of Stock']}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <Input
                label="Price (₹)"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
              <Input
                label="Package Weight"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                required
              />
              <Input
                label="Units in Stock"
                type="number"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full rounded-xl text-sm p-3.5 border border-stone-200 outline-none focus:border-amber-600"
                required
              />
            </div>
          </div>
        </Card>

        <div className="flex justify-between items-center">
          <Button
            variant="danger"
            size="sm"
            icon={Trash2}
            onClick={() => {
              showToast('Product archive requested', 'info');
              navigate('/shopkeeper/products/manage');
            }}
          >
            Delete Item
          </Button>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading} icon={Save}>
              Save Updates
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProductPage;
