import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera, Save, Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const UserProfilePage = () => {
  const { currentUser } = useAuth();
  const { showToast } = useApp();

  const [formData, setFormData] = useState({
    name: currentUser?.displayName || 'Karuppasamy',
    email: currentUser?.email || 'karuppu@blackandwhite.in',
    phone: '+91 98765 43210',
    city: 'Madurai',
    pincode: '625001',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(false);

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Profile information updated successfully!', 'success');
    }, 400);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    showToast('Password changed successfully!', 'success');
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-black text-stone-900">Customer Profile</h1>
        <p className="text-sm text-stone-500 mt-1">Manage your account credentials, contact info, and preferences</p>
      </div>

      {/* Profile Header Avatar Card */}
      <Card>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-3xl shadow-lg ring-4 ring-amber-100 overflow-hidden">
              <span className="font-serif">K</span>
            </div>
            <button
              onClick={() => showToast('Avatar upload available in Phase 3 storage', 'info')}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-stone-900 text-white shadow-md hover:bg-stone-800 transition"
              title="Change Avatar"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h3 className="text-xl font-bold text-stone-900">{formData.name}</h3>
            <p className="text-xs text-stone-500">{formData.email} • Member since Jan 2026</p>
            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2.5 py-0.5 rounded-full">
                Gold Sweet Club Member
              </span>
              <span className="text-[11px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full">
                Verified Phone
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Edit Profile Info Form */}
      <Card title="Personal Information">
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={User}
              required
            />
            <Input
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              icon={Mail}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Mobile Number"
              name="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              icon={Phone}
              required
            />
            <Input
              label="Primary City"
              name="city"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              icon={MapPin}
            />
            <Input
              label="Pincode"
              name="pincode"
              value={formData.pincode}
              onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
            />
          </div>

          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="primary" loading={loading} icon={Save}>
              Save Profile Changes
            </Button>
          </div>
        </form>
      </Card>

      {/* Change Password Card */}
      <Card title="Security & Password">
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Current Password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              placeholder="••••••••"
              required
            />
            <Input
              label="New Password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              placeholder="••••••••"
              required
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              placeholder="••••••••"
              required
            />
          </div>
          <div className="pt-2 flex justify-end">
            <Button type="submit" variant="secondary" icon={Shield}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default UserProfilePage;
