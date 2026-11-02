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
  ShoppingBag,
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import { useAuth } from '../../../context/AuthContext';
import { createOrder } from '../../../services/firebase/firestoreService';
import Button from '../../../components/common/Button';
import Card from '../../../components/common/Card';
import EmptyState from '../../../components/common/EmptyState';

export const CheckoutPage = () => {
  const { cart, cartTotal, clearCart, showToast } = useApp();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState(
    currentUser?.address || 'Doorstep Delivery Address, Tamil Nadu'
  );
  const [selectedDeliverySlot, setSelectedDeliverySlot] = useState('evening');
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);

  const deliveryFee = cartTotal > 500 ? 0 : 40;
  const taxes = Math.round(cartTotal * 0.05);
  const finalTotal = cartTotal + deliveryFee + taxes;

  const handlePlaceOrder = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const orderPayload = {
        customerId: currentUser?.uid || 'guest-cust',
        customerName: currentUser?.fullName || 'Valued Customer',
        customerPhone: currentUser?.mobileNumber || '',
        shopId: cart[0]?.shopId || 'artisan-hub',
        shopName: cart[0]?.shopName || 'Artisan Sweet Shop',
        items: cart.map((c) => ({
          id: c.id,
          name: c.name,
          price: c.price,
          quantity: c.quantity,
          weight: c.weight || '500g',
        })),
        subtotal: cartTotal,
        deliveryFee,
        tax: taxes,
        total: finalTotal,
        address: deliveryAddress,
        deliverySlot: selectedDeliverySlot,
        paymentMethod: paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'cod' ? 'Cash on Delivery' : 'Credit Card',
        paymentStatus: paymentMethod === 'cod' ? 'Pending' : 'Paid',
      };

      const placed = await createOrder(orderPayload);
      clearCart();
      showToast(`Order ${placed.id} placed successfully!`, 'success');
      navigate(`/user/orders/${placed.id}`);
    } catch (_err) {
      showToast('Error placing order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your Cart is Empty"
          description="Please add fresh traditional sweets or snacks to your cart before proceeding to checkout."
          actionLabel="Explore Delicacies"
          onAction={() => navigate('/user/products')}
        />
      </div>
    );
  }

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
              <label className="text-xs font-semibold text-stone-600 block">
                Delivery Address:
              </label>
              <textarea
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                rows={3}
                className="w-full p-3 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500"
                placeholder="Enter complete delivery street address, city, and pincode..."
              />
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
                    <h5 className="font-bold text-stone-900">{item.name}</h5>
                    <p className="text-stone-400">Qty: {item.quantity} • {item.weight || '500g'}</p>
                  </div>
                  <span className="font-bold text-stone-800">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-100 space-y-2 text-xs">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span>
                <span className="font-semibold text-stone-800">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Packaging & Delivery</span>
                <span className="font-semibold text-stone-800">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>GST (5%)</span>
                <span className="font-semibold text-stone-800">₹{taxes}</span>
              </div>
              <div className="pt-2 border-t border-stone-200 flex justify-between text-sm font-bold text-stone-900">
                <span>Total Payable</span>
                <span className="text-base text-amber-700">₹{finalTotal}</span>
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              fullWidth
              className="mt-4"
              loading={loading}
              onClick={handlePlaceOrder}
            >
              Place Fresh Batch Order • ₹{finalTotal}
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
