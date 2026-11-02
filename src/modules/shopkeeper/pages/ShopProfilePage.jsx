import React, { useState } from 'react';
import { Store, Camera, MapPin, Clock, ShieldCheck, Save } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const ShopProfilePage = () => {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    name: 'Madurai Meenakshi Sweets',
    tagline: 'Traditional South Indian Sweets & Savouries since 1978',
    location: 'West Masi Street, Madurai - 625001',
    phone: '+91 98421 11222',
    email: 'meenakshi.sweets@gmail.com',
    fssai: '12421008000451',
    openTime: '07:30 AM',
    closeTime: '09:30 PM',
    deliveryRadius: '15 km',
    banner: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Shop profile updated successfully!', 'success');
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-black text-stone-900">Shop Profile & Branding</h1>
        <p className="text-sm text-stone-500 mt-1">
          Customize your customer-facing sweet shop storefront, timings, and licenses
        </p>
      </div>

      {/* Banner Preview */}
      <Card>
        <div className="relative h-48 sm:h-64 rounded-2xl overflow-hidden border border-stone-200">
          <img src={formData.banner} alt="Shop Banner" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-stone-950/40 flex items-center justify-center">
            <button
              onClick={() => showToast('Banner image upload ready in Phase 3', 'info')}
              className="px-4 py-2 rounded-xl bg-white/90 text-stone-900 text-xs font-bold flex items-center gap-2 hover:bg-white transition"
            >
              <Camera className="w-4 h-4 text-amber-700" /> Change Shopfront Banner
            </button>
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <Card title="Store Details">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Shop Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={Store}
              required
            />
            <Input
              label="FSSAI License ID"
              value={formData.fssai}
              onChange={(e) => setFormData({ ...formData, fssai: e.target.value })}
              icon={ShieldCheck}
              required
            />
          </div>

          <Input
            label="Tagline / Bio"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            required
          />

          <Input
            label="Street Address"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            icon={MapPin}
            required
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Opening Time"
              value={formData.openTime}
              onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
              icon={Clock}
            />
            <Input
              label="Closing Time"
              value={formData.closeTime}
              onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
              icon={Clock}
            />
            <Input
              label="Delivery Radius"
              value={formData.deliveryRadius}
              onChange={(e) => setFormData({ ...formData, deliveryRadius: e.target.value })}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" loading={loading} icon={Save}>
              Save Store Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ShopProfilePage;
