import React, { useState } from 'react';
import { Shield, Key, Lock, CheckCircle2, Save, User } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const AdminProfilePage = () => {
  const { showToast } = useApp();
  const [formData, setFormData] = useState({
    name: 'Super Administrator',
    email: 'admin@blackandwhite.in',
    phone: '+91 94444 88888',
    role: 'Root SuperAdmin',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Admin profile credentials updated!', 'success');
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Administrator Profile</h1>
        <p className="text-sm text-slate-500 mt-1">
          Master security credentials, 2FA authentication, and permission keys
        </p>
      </div>

      <Card>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-lg">
            <Shield className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900">{formData.name}</h3>
            <p className="text-xs text-slate-500">{formData.email}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-full uppercase">
                {formData.role}
              </span>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full uppercase">
                2FA Enabled
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Security Credentials">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Admin Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              icon={User}
              required
            />
            <Input
              label="Root Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <Input
            label="Recovery Security Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />

          <div className="pt-2 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              icon={Save}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Save Credentials
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AdminProfilePage;
