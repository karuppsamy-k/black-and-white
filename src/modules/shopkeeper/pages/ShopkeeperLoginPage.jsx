import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Store, Phone, Lock, LogIn, ArrowLeft, AlertCircle, Clock, ShieldAlert, XCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import Input from '../../../components/common/Input';
import Button from '../../../components/common/Button';

export const ShopkeeperLoginPage = () => {
  const [mobileNumber, setMobileNumber] = useState('9842111222'); // Preset with verified merchant for easy demo
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [statusNotice, setStatusNotice] = useState(null); // { type: 'pending' | 'rejected' | 'deactivated' | 'error', message: string }

  const { shopkeeperLogin } = useAuth();
  const { showToast } = useApp();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusNotice(null);
    setLoading(true);

    try {
      await shopkeeperLogin({ mobileNumber, password });
      showToast('Welcome to Black & White Merchant Dashboard!', 'success');
      navigate('/shopkeeper/dashboard');
    } catch (err) {
      if (err.code === 'PENDING_APPROVAL') {
        setStatusNotice({
          type: 'pending',
          title: 'Account Pending Approval',
          message: err.message,
        });
      } else if (err.code === 'REJECTED') {
        setStatusNotice({
          type: 'rejected',
          title: 'Registration Application Rejected',
          message: err.message,
        });
      } else if (err.code === 'DEACTIVATED') {
        setStatusNotice({
          type: 'deactivated',
          title: 'Account Inactive',
          message: err.message,
        });
      } else {
        setStatusNotice({
          type: 'error',
          title: 'Authentication Failed',
          message: err.message || 'Invalid credentials. Please verify your mobile number and password.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-stone-950 rounded-3xl border border-stone-800 shadow-2xl p-8 sm:p-10 space-y-6 text-white">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center mx-auto shadow-lg">
            <Store className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-serif font-bold text-white">Shopkeeper Portal</h2>
          <p className="text-xs text-stone-400">
            Sign in with your registered mobile number to manage your sweet shop & orders
          </p>
        </div>

        {/* Dynamic Status Notices (Pending, Rejected, Deactivated, Error) */}
        {statusNotice && (
          <div
            className={`p-4 rounded-xl border text-xs flex items-start gap-3 ${
              statusNotice.type === 'pending'
                ? 'bg-amber-950/60 border-amber-500/40 text-amber-200'
                : statusNotice.type === 'rejected' || statusNotice.type === 'deactivated' || statusNotice.type === 'error'
                ? 'bg-red-950/60 border-red-500/40 text-red-200'
                : 'bg-stone-900 border-stone-700 text-stone-300'
            }`}
          >
            {statusNotice.type === 'pending' ? (
              <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            ) : statusNotice.type === 'rejected' ? (
              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            ) : statusNotice.type === 'deactivated' ? (
              <ShieldAlert className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            )}
            <div>
              <h4 className="font-bold mb-0.5">{statusNotice.title}</h4>
              <p className="opacity-90 leading-relaxed text-[11px]">{statusNotice.message}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Registered Mobile Number"
            name="mobileNumber"
            type="tel"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            required
            icon={Phone}
            placeholder="10-digit mobile number"
            maxLength={10}
            className="text-stone-900"
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
            className="text-stone-900"
          />

          <div className="flex items-center justify-end text-xs">
            <button
              type="button"
              onClick={() => showToast('Password reset link sent to registered mobile number', 'info')}
              className="text-amber-400 hover:underline font-semibold"
            >
              Forgot Password?
            </button>
          </div>

          <div className="pt-2">
            <Button type="submit" fullWidth variant="primary" loading={loading} icon={LogIn}>
              Sign In to Merchant Portal
            </Button>
          </div>
        </form>

        <div className="pt-4 border-t border-stone-800 flex flex-col gap-3 text-center text-xs text-stone-400">
          <p>
            Want to partner your sweet shop?{' '}
            <Link to="/shopkeeper/register" className="text-amber-400 font-bold hover:underline">
              Register Sweet Shop Here
            </Link>
          </p>
          <Link
            to="/user"
            className="text-stone-400 hover:text-white inline-flex items-center justify-center gap-1.5 transition pt-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Customer Website
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ShopkeeperLoginPage;
