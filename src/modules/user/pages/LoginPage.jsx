import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, Store, Shield } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const LoginPage = () => {
  const [email, setEmail] = useState('karuppu@blackandwhite.in');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    login('user', email);
    setTimeout(() => {
      setLoading(false);
      showToast('Welcome back to Black&White!', 'success');
      navigate('/user/dashboard');
    }, 400);
  };

  const handleDemoLogin = (role, target) => {
    login(role);
    showToast(`Logged in as Demo ${role.toUpperCase()}`, 'info');
    navigate(target);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/80 shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-serif font-black text-xl flex items-center justify-center mx-auto shadow-md">
            B&W
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">Customer Sign In</h2>
          <p className="text-xs text-stone-500">Access your saved sweets cart, addresses & orders</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            icon={Mail}
            placeholder="you@example.com"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            icon={Lock}
            placeholder="••••••••"
          />

          <div className="flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-stone-600">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded text-amber-600 focus:ring-amber-500"
              />
              <span>Remember me</span>
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Password reset link sent to registered email', 'info'); }} className="text-amber-700 hover:underline font-medium">
              Forgot password?
            </a>
          </div>

          <Button type="submit" fullWidth variant="primary" loading={loading} icon={LogIn}>
            Sign In
          </Button>
        </form>

        {/* Quick Demo Access */}
        <div className="pt-2 border-t border-stone-100">
          <p className="text-[11px] text-center text-stone-400 uppercase tracking-wider font-semibold mb-3">
            Quick Demo Login
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => handleDemoLogin('shopkeeper', '/shopkeeper/dashboard')}
              className="p-2 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 flex items-center justify-center gap-1.5 transition"
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>Shopkeeper Demo</span>
            </button>
            <button
              onClick={() => handleDemoLogin('admin', '/admin/dashboard')}
              className="p-2 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 flex items-center justify-center gap-1.5 transition"
            >
              <Shield className="w-3.5 h-3.5 text-purple-600" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          Don't have an account yet?{' '}
          <Link to="/user/register" className="text-amber-700 font-bold hover:underline">
            Register Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
