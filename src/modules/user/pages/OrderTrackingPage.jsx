import React, { useState, useEffect, useCallback } from 'react';
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
  RefreshCw,
} from 'lucide-react';
import { getOrderById } from '../../../services/firebase/firestoreService';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { DetailSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOrderById(id);
      setOrder(data);
    } catch (_err) {
      setError('Unable to fetch tracking details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={Truck}
          title="Order Not Found"
          description={error || `Order ID "${id}" could not be located in our live tracking database.`}
          actionLabel="Return to My Orders"
          onAction={() => (window.location.href = '/user/orders')}
        />
      </div>
    );
  }

  const steps = [
    { title: 'Order Placed', time: 'Received', done: true },
    {
      title: 'Confirmed by Shop',
      time: order.status !== 'Placed' ? 'Confirmed' : 'Pending',
      done: order.status !== 'Placed',
    },
    {
      title: 'Packing Fresh Batch',
      time: order.status === 'Preparing' || order.status === 'Delivered' ? 'In Progress' : 'Upcoming',
      done: order.status === 'Preparing' || order.status === 'Delivered',
    },
    {
      title: 'Delivered',
      time: order.status === 'Delivered' ? 'Delivered' : 'Estimated',
      done: order.status === 'Delivered',
    },
  ];

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
              From <strong className="text-stone-800">{order.shopName || 'Sweet Shop'}</strong> • Delivery to <strong>{order.address || 'Address provided'}</strong>
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
          <Card title="Live Delivery Status">
            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-stone-200">
              {steps.map((step, idx) => (
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
                    <span className="text-xs text-stone-400">{step.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Order Items & Summary */}
        <div className="lg:col-span-4 space-y-6">
          <Card title="Items Ordered">
            <div className="divide-y divide-stone-100 text-xs">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center">
                  <span className="text-stone-700 font-medium">
                    {item.quantity} × {item.name}
                  </span>
                  <span className="font-bold text-stone-900">₹{item.price * item.quantity}</span>
                </div>
              ))}
              <div className="pt-3 flex justify-between font-bold text-sm text-stone-900">
                <span>Total Amount:</span>
                <span>₹{order.total}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderTrackingPage;
