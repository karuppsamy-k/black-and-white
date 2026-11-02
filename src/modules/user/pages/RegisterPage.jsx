import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, CheckCircle, Store } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      showToast('Passwords do not match', 'error');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login('user', formData.email);
      setLoading(false);
      showToast('Account registered successfully! Welcome to Black&White.', 'success');
      navigate('/user/dashboard');
    }, 400);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/80 shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-serif font-black text-xl flex items-center justify-center mx-auto shadow-md">
            B&W
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">Create Customer Account</h2>
          <p className="text-xs text-stone-500">Enjoy handcrafted sweets, fast delivery, and artisan rewards</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            required
            icon={User}
            placeholder="e.g. Karuppasamy"
          />

          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            icon={Mail}
            placeholder="you@example.com"
          />

          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            icon={Phone}
            placeholder="+91 98765 43210"
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            icon={Lock}
            placeholder="Minimum 6 characters"
          />

          <Input
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            icon={Lock}
            placeholder="Repeat password"
          />

          <label className="flex items-start gap-2 cursor-pointer text-xs text-stone-600 pt-1">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              required
              className="mt-0.5 rounded text-amber-600 focus:ring-amber-500"
            />
            <span>I agree to Black&White Terms of Service & Privacy Policy</span>
          </label>

          <Button type="submit" fullWidth variant="primary" loading={loading} icon={CheckCircle}>
            Register & Continue
          </Button>
        </form>

        <div className="pt-2 border-t border-stone-100 flex flex-col gap-2 text-center text-xs text-stone-500">
          <p>
            Already have an account?{' '}
            <Link to="/user/login" className="text-amber-700 font-bold hover:underline">
              Sign In
            </Link>
          </p>
          <p className="pt-1 text-[11px] text-stone-400">
            Are you a sweet shop owner?{' '}
            <Link to="/shopkeeper/register" className="text-stone-700 font-semibold hover:underline inline-flex items-center gap-1">
              <Store className="w-3 h-3" /> Register as Merchant
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
