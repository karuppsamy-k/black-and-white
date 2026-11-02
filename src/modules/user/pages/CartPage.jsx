import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Tag,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';

export const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, cartTotal, showToast } = useApp();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const navigate = useNavigate();

  const deliveryFee = cartTotal > 500 ? 0 : 40;
  const taxes = Math.round(cartTotal * 0.05);
  const finalTotal = Math.max(0, cartTotal + deliveryFee + taxes - discount);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'SWEET50') {
      setDiscount(50);
      showToast('Coupon SWEET50 applied! Saved ₹50', 'success');
    } else {
      showToast('Invalid coupon code. Try SWEET50', 'error');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl">
          🛍️
        </div>
        <h2 className="text-2xl font-serif font-black text-stone-900">Your Sweet Cart is Empty</h2>
        <p className="text-sm text-stone-500 max-w-sm mx-auto">
          You haven't added any traditional sweets or snacks to your cart yet. Explore our artisanal selection!
        </p>
        <div className="pt-2">
          <Link to="/user/products">
            <Button variant="primary" icon={ShoppingBag}>
              Explore Fresh Delicacies
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-stone-900">Your Sweets Cart</h1>
          <p className="text-sm text-stone-500 mt-1">Review your fresh artisan batch selections before checkout</p>
        </div>
        <button
          onClick={clearCart}
          className="text-xs font-semibold text-red-600 hover:underline flex items-center gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-stone-200/80 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-20 h-20 rounded-xl object-cover border border-stone-100 flex-shrink-0"
                />
                <div>
                  <p className="text-[11px] text-stone-400 font-medium">{item.shopName}</p>
                  <h3 className="font-serif font-bold text-stone-900 text-base">{item.name}</h3>
                  <p className="text-xs text-stone-500 mt-0.5">Weight: {item.weight}</p>
                  <p className="text-sm font-black text-amber-800 mt-1">₹{item.price}</p>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                {/* Quantity Controls */}
                <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="p-1.5 text-stone-600 hover:text-stone-900"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-stone-900">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="p-1.5 text-stone-600 hover:text-stone-900"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-base font-black text-stone-900">₹{item.price * item.quantity}</p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-[11px] text-red-500 hover:underline mt-1 font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Delivery Note */}
          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/60 flex items-center gap-3 text-xs text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>
              Orders above ₹500 qualify for <strong>FREE Temperature-Controlled Fresh Delivery</strong> across Tamil Nadu!
            </span>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4 space-y-4">
          <Card title="Order Summary">
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Estimated Packaging & Delivery</span>
                <span>{deliveryFee === 0 ? <strong className="text-emerald-600 uppercase text-xs">Free</strong> : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>GST (5%)</span>
                <span>₹{taxes}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount</span>
                  <span>-₹{discount}</span>
                </div>
              )}

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="pt-2 border-t border-stone-100 flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Coupon code (SWEET50)"
                  className="flex-1 px-3 py-1.5 text-xs border border-stone-200 rounded-lg uppercase outline-none focus:border-amber-600"
                />
                <Button size="sm" variant="outline" type="submit">
                  Apply
                </Button>
              </form>

              <div className="border-t border-stone-200 pt-3 flex justify-between items-baseline">
                <div>
                  <span className="text-base font-bold text-stone-900">Grand Total</span>
                  <p className="text-[10px] text-stone-400">Includes all taxes & packaging</p>
                </div>
                <span className="text-2xl font-black text-amber-800">₹{finalTotal}</span>
              </div>

              <div className="pt-3">
                <Button
                  fullWidth
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/user/checkout')}
                  icon={ArrowRight}
                  iconPosition="right"
                >
                  Proceed to Checkout
                </Button>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 pt-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted 256-bit Secure Checkout</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
