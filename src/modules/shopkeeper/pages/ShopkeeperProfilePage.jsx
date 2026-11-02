import React, { useState } from 'react';
import { User, Mail, Phone, ShieldCheck, CheckCircle2, Save } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const ShopkeeperProfilePage = () => {
  const { currentUser } = useAuth();
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    ownerName: currentUser?.fullName || '',
    businessEmail: currentUser?.email || '',
    primaryPhone: currentUser?.mobileNumber || '',
    alternatePhone: '',
    residenceCity: currentUser?.city || 'Madurai',
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-emerald-950">FSSAI Status</p>
              <p className="text-[11px] text-emerald-700">
                {currentUser?.fssai ? `License: ${currentUser.fssai}` : 'Compliant Merchant'}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            <div>
              <p className="font-bold text-emerald-950">Mobile Verified</p>
              <p className="text-[11px] text-emerald-700">+91 {currentUser?.mobileNumber || 'Registered'}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Profile Form */}
      <Card title="Owner Particulars">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Proprietor Full Name"
              value={formData.ownerName}
              onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
              required
            />
            <Input
              label="Primary Contact Mobile"
              value={formData.primaryPhone}
              disabled
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Business Email"
              type="email"
              value={formData.businessEmail}
              onChange={(e) => setFormData({ ...formData, businessEmail: e.target.value })}
              placeholder="shop@email.com"
            />
            <Input
              label="Home / Operating City"
              value={formData.residenceCity}
              onChange={(e) => setFormData({ ...formData, residenceCity: e.target.value })}
            />
          </div>

          <div className="pt-4 flex justify-end">
            <Button type="submit" variant="primary" icon={Save} loading={loading}>
              Save Profile
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ShopkeeperProfilePage;
