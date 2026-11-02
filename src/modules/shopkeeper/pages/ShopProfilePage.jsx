import React, { useState, useEffect } from 'react';
import { Store, Camera, MapPin, Clock, ShieldCheck, Save, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { getShopkeeperProfile, createShopkeeperProfile } from '../../../services/firebase/firestoreService';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';
import { DetailSkeleton } from '../../../components/common/Skeleton';

export const ShopProfilePage = () => {
  const { currentUser } = useAuth();
  const { showToast } = useApp();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    location: '',
    phone: '',
    email: '',
    fssai: '',
    openTime: '08:00 AM',
    closeTime: '09:00 PM',
    deliveryRadius: '10 km',
    banner: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80',
  });

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        if (currentUser?.uid) {
          const profile = await getShopkeeperProfile(currentUser.uid);
          if (profile) {
            setFormData({
              name: profile.shopName || profile.fullName || '',
              tagline: profile.tagline || 'Artisan South Indian Sweets & Savouries',
              location: profile.location || `${profile.city || 'Madurai'}, Tamil Nadu`,
              phone: profile.mobileNumber || currentUser?.mobileNumber || '',
              email: profile.email || '',
              fssai: profile.fssai || '',
              openTime: profile.openTime || '08:00 AM',
              closeTime: profile.closeTime || '09:00 PM',
              deliveryRadius: profile.deliveryRadius || '10 km',
              banner: profile.banner || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80',
            });
          }
        }
      } catch (_err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (currentUser?.uid) {
        await createShopkeeperProfile(currentUser.uid, {
          fullName: currentUser.fullName || formData.name,
          mobileNumber: formData.phone || currentUser.mobileNumber,
          shopName: formData.name,
          email: formData.email,
          city: currentUser.city || 'Madurai',
          fssai: formData.fssai,
          tagline: formData.tagline,
          location: formData.location,
        });
      }
      showToast('Shop profile updated successfully!', 'success');
    } catch (_err) {
      showToast('Failed to save profile changes.', 'error');
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
            <span className="px-4 py-2 rounded-xl bg-white/90 text-stone-900 text-xs font-bold flex items-center gap-2">
              <Camera className="w-4 h-4 text-amber-700" /> Storefront Banner
            </span>
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <Card title="Store Details">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Sweet Shop Trade Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <Input
              label="Registered Contact Mobile"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled
            />
          </div>

          <Input
            label="Shop Tagline / Specialty"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
            placeholder="e.g. Traditional Wheat Halwa & Pure Ghee Delicacies"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Physical Kitchen / Store Address"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
            <Input
              label="14-Digit FSSAI License Number"
              value={formData.fssai}
              onChange={(e) => setFormData({ ...formData, fssai: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <Input
              label="Opening Time"
              value={formData.openTime}
              onChange={(e) => setFormData({ ...formData, openTime: e.target.value })}
            />
            <Input
              label="Closing Time"
              value={formData.closeTime}
              onChange={(e) => setFormData({ ...formData, closeTime: e.target.value })}
            />
            <Input
              label="Delivery Radius"
              value={formData.deliveryRadius}
              onChange={(e) => setFormData({ ...formData, deliveryRadius: e.target.value })}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" icon={Save} loading={saving}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ShopProfilePage;
