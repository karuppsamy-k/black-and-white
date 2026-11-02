import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  Truck,
  Phone,
  MapPin,
  Clock,
  Printer,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { getOrderById, updateOrderStatus } from '../../../services/firebase/firestoreService';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { DetailSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const OrderDetailsPage = () => {
  const { id } = useParams();
  const { showToast } = useApp();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (_err) {
        setOrder(null);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      await updateOrderStatus(id, newStatus);
      setOrder((prev) => ({ ...prev, status: newStatus }));
      showToast(`Order status updated to: ${newStatus}`, 'success');
    } catch (_err) {
      showToast('Error updating status', 'error');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto py-16">
        <EmptyState
          icon={Package}
          title="Order Not Found"
          description="The requested order was not found in your store log."
          actionLabel="Back to Order Management"
          onAction={() => (window.location.href = '/shopkeeper/orders/manage')}
        />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Link to="/shopkeeper/orders/manage" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-3xl font-serif font-black text-stone-900">Order #{order.id}</h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString()} • Customer: {order.customerName}
            </p>
          </div>
          <Badge variant={order.status === 'Delivered' ? 'success' : 'warning'} size="md">
            {order.status}
          </Badge>
        </div>
      </div>

      {/* Stage Controller */}
      <Card title="Update Kitchen & Packing Stage">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            variant={order.status === 'Preparing' ? 'primary' : 'outline'}
            onClick={() => handleUpdateStatus('Preparing')}
          >
            Mark Preparing
          </Button>
          <Button
            size="sm"
            variant={order.status === 'Delivered' ? 'primary' : 'outline'}
            onClick={() => handleUpdateStatus('Delivered')}
          >
            Mark Delivered / Picked Up
          </Button>
          <Button
            size="sm"
            variant={order.status === 'Cancelled' ? 'danger' : 'outline'}
            onClick={() => handleUpdateStatus('Cancelled')}
          >
            Cancel Order
          </Button>
        </div>
      </Card>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Customer & Delivery">
          <div className="space-y-3 text-xs">
            <div>
              <span className="font-bold text-stone-900 block">{order.customerName}</span>
              <span className="text-stone-500">{order.customerPhone}</span>
            </div>
            <p className="text-stone-600 leading-relaxed">{order.address}</p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
              <span className="text-stone-400">Payment:</span>
              <span className="font-bold text-stone-900">{order.paymentMethod || 'UPI'}</span>
            </div>
          </div>
        </Card>

        <Card title="Order Items Summary">
          <div className="divide-y divide-stone-100 text-xs">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-2.5 flex justify-between">
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span className="font-bold">₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="pt-3 flex justify-between font-bold text-sm text-stone-900">
              <span>Total Payable</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OrderDetailsPage;
