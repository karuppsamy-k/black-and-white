import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, User, Phone, Mail, Lock, MapPin, ShieldCheck, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const ShopkeeperRegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    shopName: '',
    email: '',
    city: 'Madurai',
    fssai: '',
    gstin: '',
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const { shopkeeperRegister } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await shopkeeperRegister(formData);
      setIsSuccess(true);
      showToast('Sweet shop application submitted for administrative review!', 'success');
    } catch (err) {
      setErrorMessage(err.message || 'Application submission failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-stone-950 rounded-3xl border border-stone-800 shadow-2xl p-8 sm:p-10 space-y-6 text-white text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center mx-auto text-3xl">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">Application Under Review</h2>
          <p className="text-xs text-stone-300 leading-relaxed">
            Thank you for registering <strong>{formData.shopName}</strong> on the Black & White platform! Your FSSAI credentials have been submitted to platform administrators for compliance approval.
          </p>
          <div className="p-4 bg-stone-900 rounded-xl border border-stone-800 text-xs text-stone-400 text-left space-y-1">
            <p>• Proprietor: <strong className="text-stone-200">{formData.fullName}</strong></p>
            <p>• Mobile: <strong className="text-stone-200">{formData.mobileNumber}</strong></p>
            <p>• Status: <span className="text-amber-400 font-bold">Pending Admin Approval</span></p>
          </div>
          <div className="pt-2">
            <Button
              fullWidth
              variant="primary"
              onClick={() => navigate('/shopkeeper/login')}
            >
              Go to Shopkeeper Login
            </Button>
          </div>
        </div>
      </div>
    );
  }

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

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-500/40 text-xs text-red-200 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Shop Trade Name"
              name="shopName"
              value={formData.shopName}
              onChange={handleChange}
              placeholder="e.g. Meenakshi Sweets"
              required
              className="text-stone-900"
            />
            <Input
              label="Proprietor Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="e.g. Sundaram Iyer"
              required
              icon={User}
              className="text-stone-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Registered Mobile Number"
              name="mobileNumber"
              type="tel"
              value={formData.mobileNumber}
              onChange={handleChange}
              required
              icon={Phone}
              placeholder="10-digit mobile number"
              maxLength={10}
              className="text-stone-900"
            />
            <Input
              label="Business Email (Optional)"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              icon={Mail}
              placeholder="shop@example.com"
              className="text-stone-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              icon={Lock}
              placeholder="Minimum 6 characters"
              className="text-stone-900"
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
              className="text-stone-900"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="City / Hub"
              name="city"
              value={formData.city}
              onChange={handleChange}
              required
              icon={MapPin}
              className="text-stone-900"
            />
            <Input
              label="FSSAI License ID"
              name="fssai"
              value={formData.fssai}
              onChange={handleChange}
              required
              icon={ShieldCheck}
              placeholder="14-digit FSSAI number"
              className="text-stone-900"
            />
          </div>

          <Input
            label="GSTIN (Optional)"
            name="gstin"
            value={formData.gstin}
            onChange={handleChange}
            placeholder="GSTIN registration"
            className="text-stone-900"
          />

          <div className="pt-2">
            <Button type="submit" fullWidth variant="primary" loading={loading} icon={CheckCircle2}>
              Submit Sweet Shop Application
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-stone-800 text-center text-xs text-stone-400">
          Already registered?{' '}
          <Link to="/shopkeeper/login" className="text-amber-400 font-bold hover:underline">
            Shopkeeper Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperRegisterPage;
