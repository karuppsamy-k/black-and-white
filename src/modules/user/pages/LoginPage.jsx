import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Phone, Lock, LogIn, Store, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const LoginPage = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const { customerLogin } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await customerLogin({ mobileNumber, password });
      showToast('Welcome back to Black & White Sweets & Snacks!', 'success');
      navigate('/user');
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/80 shadow-xl p-8 sm:p-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white font-serif font-black text-xl flex items-center justify-center mx-auto shadow-md">
            B&W
          </div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">Customer Sign In</h2>
          <p className="text-xs text-stone-500">Sign in with your 10-digit mobile number to access your cart & orders</p>
        </div>

        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Mobile Number"
            name="mobileNumber"
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
            icon={Phone}
            placeholder="10-digit mobile number (e.g. 9876543210)"
            maxLength={10}
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
            <button
              type="button"
              onClick={() => showToast('Password reset link sent to registered mobile number', 'info')}
              className="text-amber-700 hover:underline font-semibold"
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" fullWidth variant="primary" loading={loading} icon={LogIn}>
            Customer Sign In
          </Button>
        </form>

        <div className="pt-2 border-t border-stone-100 flex flex-col gap-3 text-center text-xs text-stone-500">
          <p>
            Don't have a customer account?{' '}
            <Link to="/user/register" className="text-amber-700 font-bold hover:underline">
              Register Here
            </Link>
          </p>
          <div className="pt-2 border-t border-stone-100">
            <Link
              to="/shopkeeper/login"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-amber-800 transition"
            >
              <Store className="w-3.5 h-3.5 text-amber-600" />
              <span>Are you a Sweet Shop Partner? Go to Shopkeeper Login</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
