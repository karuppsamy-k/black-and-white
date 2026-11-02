import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Store } from 'lucide-react';
import Button from '../components/common/Button';

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl mb-6 shadow-inner">
        🍬
      </div>
      <h1 className="text-6xl font-black text-stone-900 font-serif mb-2">404</h1>
      <h2 className="text-2xl font-bold text-stone-800 mb-3">Delicacy Not Found!</h2>
      <p className="text-sm text-stone-600 max-w-md mb-8 leading-relaxed">
        The page you are looking for might have been moved, renamed, or is temporarily out of stock in our sweet shop catalog.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        <Button variant="outline" icon={ArrowLeft} onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Link to="/user">
          <Button variant="primary" icon={Home}>
            Customer Home
          </Button>
        </Link>
      </div>

      <div className="border-t border-stone-200 pt-6 flex items-center gap-3 text-xs text-stone-500">
        <span>Are you a registered merchant?</span>
        <Link to="/shopkeeper/login" className="text-amber-700 hover:underline flex items-center gap-1 font-semibold">
          <Store className="w-3.5 h-3.5" />
          Shopkeeper Portal
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
