import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Truck,
  Plus,
  Minus,
  Sparkles,
  Store,
  RefreshCw,
} from 'lucide-react';
import { getProductById } from '../../../services/firebase/firestoreService';
import { useApp } from '../../../context/AppContext';
import Button from '../../../components/common/Button';
import { DetailSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (_err) {
      setError('Unable to load sweet details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity);
    }
  };

  const handleBuyNow = () => {
    if (product) {
      addToCart(product, quantity);
      navigate('/user/checkout');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Delicacy Not Found"
          description={error || "The delicacy you are looking for is currently unavailable."}
          actionLabel="Browse All Delicacies"
          onAction={() => navigate('/user/products')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back Link */}
      <div>
        <Link to="/user/products" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Sweets Catalog
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Product Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-white border border-stone-200/80 shadow-md">
            <img
              src={product.image || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80'}
              alt={product.name}
              className="w-full h-96 sm:h-[450px] object-cover object-center"
            />
            <span className="absolute top-4 left-4 bg-amber-500 text-stone-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
          </div>
        </div>

        {/* Product Information */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-700 uppercase tracking-widest">
                {product.shopName || 'Artisan Sweetmaker'}
              </span>
              <span className="text-stone-300">•</span>
              <span className="text-xs text-stone-500">{product.city || 'Tamil Nadu'}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-stone-900">
              {product.name}
            </h1>
            <p className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> Prepared with 100% Pure Desi Ghee
            </p>
          </div>

          {/* Pricing */}
          <div className="flex items-baseline gap-4 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60">
            <span className="text-3xl font-black text-stone-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-base text-stone-400 line-through">₹{product.originalPrice}</span>
            )}
            <span className="text-xs text-stone-600 ml-auto font-medium">Net Weight: {product.weight || '500g'}</span>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">About this Delicacy</h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {product.description || 'Traditional South Indian confectionery prepared following ancestral techniques in small artisanal batches.'}
            </p>
          </div>

          {/* Ingredients if available */}
          {product.ingredients && product.ingredients.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Ingredients</h3>
              <div className="flex flex-wrap gap-2">
                {product.ingredients.map((ing, i) => (
                  <span key={i} className="px-3 py-1 bg-stone-100 text-stone-700 text-xs rounded-lg font-medium">
                    {ing}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Counter & Action Buttons */}
          <div className="pt-4 space-y-4 border-t border-stone-200">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">Quantity:</span>
              <div className="flex items-center border border-stone-200 rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center font-bold text-sm text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-1.5 rounded-lg hover:bg-stone-100 text-stone-600"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleAddToCart}
                icon={ShoppingBag}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </Button>
              <Button
                variant="outline"
                size="lg"
                fullWidth
                onClick={handleBuyNow}
                disabled={product.stock === 0}
              >
                Buy Now
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
