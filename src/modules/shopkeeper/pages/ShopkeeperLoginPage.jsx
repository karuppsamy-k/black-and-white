import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Mail, Lock, LogIn, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const ShopkeeperLoginPage = () => {
  const [email, setEmail] = useState('meenakshi.sweets@gmail.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login('shopkeeper', email);
      setLoading(false);
      showToast('Welcome to Black&White Merchant Dashboard!', 'success');
      navigate('/shopkeeper/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-stone-950 rounded-3xl border border-stone-800 shadow-2xl p-8 sm:p-10 space-y-6 text-white">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-lg">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">Shopkeeper Portal</h2>
          <p className="text-xs text-stone-400">Access your store inventory, orders, and daily earnings</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Merchant Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={Mail}
            placeholder="merchant@example.com"
            className="text-stone-900"
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={Lock}
            placeholder="••••••••"
            className="text-stone-900"
          />

          <div className="pt-2">
            <Button type="submit" fullWidth variant="primary" loading={loading} icon={LogIn}>
              Enter Merchant Portal
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-stone-800 flex flex-col gap-3 text-center text-xs text-stone-400">
          <p>
            Want to list your sweet shop?{' '}
            <Link to="/shopkeeper/register" className="text-amber-400 font-bold hover:underline">
              Register Shop Here
            </Link>
          </p>
          <Link to="/user" className="text-stone-500 hover:text-stone-300 inline-flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Customer Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperLoginPage;
