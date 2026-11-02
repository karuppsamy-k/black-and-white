import React, { useState } from 'react';
import { User, Mail, Phone, ShieldCheck, CheckCircle2, Save } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const ShopkeeperProfilePage = () => {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    ownerName: 'Sundaram Iyer',
    businessEmail: 'meenakshi.sweets@gmail.com',
    primaryPhone: '+91 98421 11222',
    alternatePhone: '+91 98421 33444',
    residenceCity: 'Madurai',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Proprietor profile details saved!', 'success');
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-black text-stone-900">Shopkeeper Profile</h1>
        <p className="text-sm text-stone-500 mt-1">
          Proprietor verification credentials and primary contact details
        </p>
      </div>

      {/* Verification Badges */}
      <Card title="Merchant Verification Badges">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-emerald-950">FSSAI Certified</p>
              <p className="text-[11px] text-emerald-700">License #12421008000451</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-emerald-950">GSTIN Verified</p>
              <p className="text-[11px] text-emerald-700">33AAAAA0000A1Z5</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-emerald-950">Bank KYC Approved</p>
              <p className="text-[11px] text-emerald-700">HDFC Bank Direct NEFT</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Form */}
      <Card title="Proprietor Contact Details">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Owner Full Name"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              icon={User}
              required
            />
            <Input
              label="Registered Business Email"
              type="email"
              value={formData.businessEmail}
              onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
              icon={Mail}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Primary Mobile"
              value={formData.primaryPhone}
              onChange={(e) => setFormData({ ...formData, primaryPhone: e.target.value })}
              icon={Phone}
              required
            />
            <Input
              label="Emergency / Alternate Phone"
              value={formData.alternatePhone}
              onChange={(e) => setFormData({ ...formData, alternatePhone: e.target.value })}
              icon={Phone}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" loading={loading} icon={Save}>
              Save Profile Updates
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ShopkeeperProfilePage;
