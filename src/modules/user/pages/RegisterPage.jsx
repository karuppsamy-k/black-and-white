import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Phone, Lock, CheckCircle, Store, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    agreeTerms: true,
  });
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { customerRegister } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.agreeTerms) {
      setErrorMessage('Please accept the Terms of Service to register.');
      return;
    }

    setLoading(true);

    try {
      await customerRegister({
        fullName: formData.fullName,
        mobileNumber: formData.mobileNumber,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      showToast('Registration successful! Welcome to Black & White.', 'success');
      navigate('/user');
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/80 shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-serif font-black text-xl flex items-center justify-center mx-auto shadow-md">
            B&W
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">Customer Registration</h2>
          <p className="text-xs text-stone-500">Create an account with your mobile number for fresh artisan sweets</p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

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
            label="Mobile Number"
            name="mobileNumber"
            type="tel"
            value={formData.mobileNumber}
            onChange={handleChange}
            required
            icon={Phone}
            placeholder="10-digit mobile number"
            maxLength={10}
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
            <span>I agree to Black & White Terms of Service & Privacy Policy</span>
          </label>

          <Button type="submit" fullWidth variant="primary" loading={loading} icon={CheckCircle}>
            Register & Continue
          </Button>
        </form>

        <div className="pt-2 border-t border-stone-100 flex flex-col gap-2 text-center text-xs text-stone-500">
          <p>
            Already have a customer account?{' '}
            <Link to="/user/login" className="text-amber-700 font-bold hover:underline">
              Sign In
            </Link>
          </p>
          <div className="pt-2 border-t border-stone-100">
            <Link
              to="/shopkeeper/register"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-800 transition"
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>Are you a Sweet Shop Proprietor? Register Shop Here</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
