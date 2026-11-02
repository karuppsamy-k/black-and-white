import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const AdminLoginPage = () => {
  const [email, setEmail] = useState('admin@blackandwhite.in');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login('admin', email);
      setLoading(false);
      showToast('Master Admin Console unlocked!', 'success');
      navigate('/admin/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl p-8 sm:p-10 space-y-6 text-white">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center mx-auto shadow-lg">
            <Shield className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-white">Admin Command Center</h2>
          <p className="text-xs text-slate-400">QuickConnect platform administration & moderation</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Superadmin Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={Mail}
            className="text-slate-900"
          />

          <Input
            label="Security Passkey"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={Lock}
            className="text-slate-900"
          />

          <div className="pt-2">
            <Button
              type="submit"
              fullWidth
              variant="primary"
              loading={loading}
              icon={LogIn}
              className="bg-purple-600 hover:bg-purple-700 focus:ring-purple-500"
            >
              Authorize Access
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-slate-800 text-center text-xs text-slate-400">
          <Link to="/user" className="text-slate-400 hover:text-white inline-flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Customer Store
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
