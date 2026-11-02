import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Phone,
  ShieldCheck,
  Truck,
  Store,
} from 'lucide-react';
import { MOCK_ORDERS } from '../../../utils/mockData';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';

export const OrderTrackingPage = () => {
  const { id } = useParams();
  const order = MOCK_ORDERS.find((o) => o.id === id) || MOCK_ORDERS[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <Link to="/user/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-3xl font-serif font-black text-stone-900">
              Tracking Order: {order.id}
            </h1>
            <p className="text-sm text-stone-500 mt-0.5">
              From <strong className="text-stone-800">{order.shopName}</strong> • Estimated Delivery in <strong>35 Mins</strong>
            </p>
          </div>
          <Badge variant={order.status === 'Delivered' ? 'success' : 'warning'} size="md">
            {order.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Timeline & Map */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tracking Step Progress Bar */}
          <Card title="Live Delivery Status">
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {order.trackingSteps?.map((step, idx) => (
                <div key={idx} className="relative flex items-start gap-4">
                  <div
                    className={`absolute -left-6 sm:-left-8 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ring-4 ring-white ${
                      step.done
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-200 text-stone-500'
                    }`}
                  >
                    {step.done ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  <div>
                    <h4 className={`text-sm font-bold ${step.done ? 'text-stone-900' : 'text-stone-400'}`}>
                      {step.title}
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Interactive Map Placeholder */}
          <Card title="Live Route Tracking">
            <div className="h-64 rounded-2xl bg-stone-100 border border-stone-200 overflow-hidden relative flex items-center justify-center text-center p-6">
              <div className="space-y-2 z-10">
                <div className="w-12 h-12 rounded-full bg-amber-600 text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
                  <Truck className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-stone-900 text-sm">Delivery Partner En Route</h4>
                <p className="text-xs text-stone-500 max-w-xs mx-auto">
                  Rider Muthu is arriving via West Masi Street with your hot fresh halwa batch.
                </p>
              </div>
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#78716c_1px,transparent_1px)] [background-size:12px_12px]"></div>
            </div>
          </Card>
        </div>

        {/* Delivery Agent & Order Details */}
        <div className="lg:col-span-4 space-y-6">
          {/* Delivery Agent Card */}
          <Card title="Delivery Executive">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-900 font-bold flex items-center justify-center text-base">
                MR
              </div>
              <div>
                <h4 className="font-bold text-stone-900 text-sm">Muthu Raman</h4>
                <p className="text-xs text-stone-500">Black&White Express Rider</p>
                <div className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold mt-0.5">
                  <span>★ 4.9 Rating</span> • <span>Verified Badge</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
              <a
                href="tel:+919876543210"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition"
              >
                <Phone className="w-3.5 h-3.5" /> Call Rider
              </a>
              <span className="text-[11px] text-stone-400">Masked Contact</span>
            </div>
          </Card>

          {/* Delivery Address */}
          <Card title="Drop-off Location">
            <div className="flex items-start gap-3 text-xs text-stone-600">
              <MapPin className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-stone-900">{order.customer}</p>
                <p className="mt-0.5">{order.address}</p>
                <p className="text-stone-400 mt-1">Phone: {order.phone}</p>
              </div>
            </div>
          </Card>

          {/* Order Summary */}
          <Card title="Delicacies in Order">
            <div className="space-y-2 text-xs">
              {order.items?.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-stone-700">
                    {item.name} × {item.quantity}
                  </span>
                  <span className="font-semibold text-stone-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="border-t border-stone-100 pt-2 flex justify-between font-bold text-sm text-stone-900">
                <span>Total Paid</span>
                <span className="text-amber-800 font-black">₹{order.total}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
