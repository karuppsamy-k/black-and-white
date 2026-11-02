import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MapPin,
  CreditCard,
  Clock,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Banknote,
  QrCode,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';

export const CheckoutPage = () => {
  const { cart, cartTotal, clearCart, showToast } = useApp();
  const navigate = useNavigate();

  const [selectedAddress, setSelectedAddress] = useState('addr-1');
  const [selectedDeliverySlot, setSelectedDeliverySlot] = useState('evening');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);

  const deliveryFee = cartTotal > 500 ? 0 : 40;
  const taxes = Math.round(cartTotal * 0.05);
  const finalTotal = cartTotal + deliveryFee + taxes;

  const addresses = [
    {
      id: 'addr-1',
      title: 'Home (Madurai)',
      details: 'Flat 4B, Meenakshi Towers, West Masi Street, Madurai - 625001',
      phone: '+91 98765 43210',
    },
    {
      id: 'addr-2',
      title: 'Office (Madurai Branch)',
      details: '3rd Floor, Tech Park, Bypass Road, Madurai - 625016',
      phone: '+91 98765 43210',
    },
  ];

  const handlePlaceOrder = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      clearCart();
      showToast('Order BW-ORD-9021 placed successfully!', 'success');
      navigate('/user/orders/BW-ORD-9021/track');
    }, 800);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link to="/user/cart" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Cart
        </Link>
        <h1 className="text-3xl font-serif font-black text-stone-900 mt-2">Secure Checkout</h1>
        <p className="text-sm text-stone-500">Provide delivery details and choose your preferred payment option</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Checkout Forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* 1. Address Selection */}
          <Card title="1. Delivery Address">
            <div className="space-y-3">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                    selectedAddress === addr.id
                      ? 'border-amber-600 bg-amber-50/40 ring-1 ring-amber-600'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddress === addr.id}
                    onChange={() => setSelectedAddress(addr.id)}
                    className="mt-1 text-amber-600 focus:ring-amber-500"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" /> {addr.title}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1">{addr.details}</p>
                    <p className="text-xs text-stone-400 mt-0.5">Contact: {addr.phone}</p>
                  </div>
                </label>
              ))}

              <Link to="/user/addresses" className="inline-block text-xs font-bold text-amber-700 hover:underline pt-2">
                + Add or manage saved addresses
              </Link>
            </div>
          </Card>

          {/* 2. Delivery Time Slot */}
          <Card title="2. Fresh Batch Delivery Slot">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'standard', label: 'Express Delivery', sub: '35 - 45 mins' },
                { id: 'evening', label: 'Evening Fresh Batch', sub: 'Today, 5 PM - 7 PM' },
                { id: 'morning', label: 'Tomorrow Morning', sub: '9 AM - 11 AM' },
              ].map((slot) => (
                <label
                  key={slot.id}
                  className={`p-3.5 rounded-xl border flex flex-col justify-between cursor-pointer transition ${
                    selectedDeliverySlot === slot.id
                      ? 'border-amber-600 bg-amber-50/40 ring-1 ring-amber-600'
                      : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-stone-900">{slot.label}</span>
                    <input
                      type="radio"
                      name="slot"
                      checked={selectedDeliverySlot === slot.id}
                      onChange={() => setSelectedDeliverySlot(slot.id)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                  </div>
                  <span className="text-[11px] text-stone-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-amber-600" /> {slot.sub}
                  </span>
                </label>
              ))}
            </div>
          </Card>

          {/* 3. Payment Method */}
          <Card title="3. Payment Method">
            <div className="space-y-3">
              {[
                { id: 'upi', name: 'Instant UPI (Google Pay / PhonePe / Paytm)', icon: QrCode },
                { id: 'card', name: 'Credit / Debit Card (Visa, MasterCard, RuPay)', icon: CreditCard },
                { id: 'cod', name: 'Cash on Delivery (Pay upon arrival)', icon: Banknote },
              ].map((pm) => {
                const Icon = pm.icon;
                return (
                  <label
                    key={pm.id}
                    className={`p-4 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                      paymentMethod === pm.id
                        ? 'border-amber-600 bg-amber-50/40 ring-1 ring-amber-600'
                        : 'border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-stone-100 flex items-center justify-center text-stone-700">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-stone-800">{pm.name}</span>
                    </div>
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === pm.id}
                      onChange={() => setPaymentMethod(pm.id)}
                      className="text-amber-600 focus:ring-amber-500"
                    />
                  </label>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <Card title="Items in Order">
            <div className="space-y-3 divide-y divide-stone-100 max-h-60 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="pt-2.5 first:pt-0 flex items-center justify-between text-xs">
                  <div>
                    <h5 className="font-semibold text-stone-800 line-clamp-1">{item.name}</h5>
                    <p className="text-[10px] text-stone-400">Qty: {item.quantity} • {item.weight}</p>
                  </div>
                  <span className="font-bold text-stone-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-stone-200 mt-4 pt-3 space-y-2 text-xs">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span className="font-medium text-stone-900">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>GST Tax (5%)</span>
                <span>₹{taxes}</span>
              </div>
              <div className="border-t border-stone-200 pt-2 flex justify-between items-baseline font-bold">
                <span className="text-sm text-stone-900">Total Payable</span>
                <span className="text-xl text-amber-800">₹{finalTotal}</span>
              </div>
            </div>

            <div className="pt-5">
              <Button
                fullWidth
                variant="primary"
                size="lg"
                loading={loading}
                onClick={handlePlaceOrder}
                icon={CheckCircle2}
              >
                Place Order Now • ₹{finalTotal}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 text-center mt-3">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>100% Satisfaction & Freshness Guarantee</span>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
