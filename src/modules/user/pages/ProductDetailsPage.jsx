import React, { useState } from 'react';
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
} from 'lucide-react';
import { MOCK_PRODUCTS } from '../../../utils/mockData';
import { useApp } from '../../../context/AppContext';
import Button from '../../../components/common/Button';

export const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();
  const [quantity, setQuantity] = useState(1);
  const [selectedWeight, setSelectedWeight] = useState('500g');

  // Fallback to first product
  const product = MOCK_PRODUCTS.find((p) => p.id === id) || MOCK_PRODUCTS[0];

  const weights = ['250g', '500g', '1kg'];

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/user/checkout');
  };

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
              src={product.image}
              alt={product.name}
              className="w-full h-96 sm:h-[450px] object-cover object-center"
            />
            <span className="absolute top-4 left-4 bg-amber-500 text-stone-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category}
            </span>
          </div>
          <div className="flex gap-3">
            <div className="w-20 h-20 rounded-xl overflow-hidden border-2 border-amber-600 shadow-xs">
              <img src={product.image} alt="thumbnail" className="w-full h-full object-cover" />
            </div>
            <div className="w-20 h-20 rounded-xl overflow-hidden border border-stone-200 opacity-70">
              <img src="https://images.unsplash.com/photo-1544025162-d76694265947?w=200&auto=format&fit=crop&q=80" alt="thumb2" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Product Details & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <Link
              to={`/user/shops/${product.shopId || 'shop-1'}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline bg-amber-50 px-2.5 py-1 rounded-md"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Prepared by {product.shopName}</span>
            </Link>
            <h1 className="text-3xl sm:text-4xl font-serif font-black text-stone-900 leading-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-3 pt-1">
              <div className="flex items-center gap-1 bg-amber-500 text-stone-900 px-2 py-0.5 rounded-full text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>{product.rating}</span>
              </div>
              <span className="text-xs text-stone-500">{product.reviews} verified reviews</span>
              <span className="text-stone-300">•</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Fresh Today
              </span>
            </div>
          </div>

          {/* Pricing */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-baseline gap-3">
            <span className="text-3xl font-black text-stone-900">₹{product.price}</span>
            {product.originalPrice && (
              <span className="text-base text-stone-400 line-through">₹{product.originalPrice}</span>
            )}
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md ml-auto">
              Inclusive of GST
            </span>
          </div>

          <p className="text-sm text-stone-600 leading-relaxed">{product.description}</p>

          {/* Weight Selection */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              Select Package Weight
            </label>
            <div className="flex gap-3">
              {weights.map((w) => (
                <button
                  key={w}
                  onClick={() => setSelectedWeight(w)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition border ${
                    selectedWeight === w
                      ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                      : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {w}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Counter & CTA */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-stone-200 rounded-xl bg-white shadow-xs">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 text-stone-600 hover:text-stone-900 transition"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 text-sm font-bold text-stone-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 text-stone-600 hover:text-stone-900 transition"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                icon={ShoppingBag}
                className="flex-1"
              >
                Add to Cart • ₹{product.price * quantity}
              </Button>
            </div>

            <Button fullWidth variant="secondary" size="lg" onClick={handleBuyNow}>
              Instant Checkout
            </Button>
          </div>

          {/* Ingredients & Pure Ghee Assurance */}
          <div className="border-t border-stone-200 pt-6 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">Pure Artisan Ingredients</h3>
            <div className="flex flex-wrap gap-2">
              {product.ingredients?.map((ing, i) => (
                <span key={i} className="text-xs bg-amber-50 text-amber-900 font-medium px-3 py-1 rounded-full border border-amber-200/50">
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-2 gap-4 text-xs text-stone-600 pt-2">
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-stone-100">
              <Truck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Same-day temperature controlled dispatch</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-stone-100">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>100% Authentic regional recipe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
