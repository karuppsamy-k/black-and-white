import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, User, Mail, Phone, MapPin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const ShopkeeperRegisterPage = () => {
  const [formData, setFormData] = useState({
    shopName: '',
    ownerName: '',
    email: '',
    phone: '',
    city: 'Madurai',
    fssai: '',
    gstin: '',
    category: 'Sweets & Savouries',
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login('shopkeeper', formData.email);
      setLoading(false);
      showToast('Shop registered! Welcome to the Black&White artisan network.', 'success');
      navigate('/shopkeeper/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-stone-950 rounded-3xl border border-stone-800 shadow-2xl p-8 sm:p-10 space-y-6 text-white">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-lg">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">Register Sweet Shop</h2>
          <p className="text-xs text-stone-400">Join our verified network of traditional master sweetmakers</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Shop Trade Name"
              value={formData.shopName}
              onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
              placeholder="e.g. Meenakshi Sweets"
              required
              className="text-stone-900"
            />
            <Input
              label="Proprietor / Owner Name"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              placeholder="e.g. Sundaram Iyer"
              required
              className="text-stone-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Business Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              icon={Mail}
              placeholder="shop@example.com"
              className="text-stone-900"
            />
            <Input
              label="Contact Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              icon={Phone}
              placeholder="+91 98421 11222"
              className="text-stone-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City / Region"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              required
              icon={MapPin}
              className="text-stone-900"
            />
            <Input
              label="FSSAI License Number"
              value={formData.fssai}
              onChange={(e) => setFormData({ ...formData, fssai: e.target.value })}
              required
              icon={ShieldCheck}
              placeholder="14-digit number"
              className="text-stone-900"
            />
          </div>

          <Input
            label="GSTIN (Optional)"
            value={formData.gstin}
            onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
            placeholder="GSTIN registration"
            className="text-stone-900"
          />

          <div className="pt-2">
            <Button type="submit" fullWidth variant="primary" loading={loading} icon={CheckCircle2}>
              Submit Merchant Application
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-stone-800 text-center text-xs text-stone-400">
          Already registered?{' '}
          <Link to="/shopkeeper/login" className="text-amber-400 font-bold hover:underline">
            Merchant Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperRegisterPage;
