import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Shield, MapPin, CreditCard, RotateCcw, Package } from 'lucide-react';
import { getOrderById } from '../../../services/firebase/firestoreService';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { DetailSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const AdminOrderDetailsPage = () => {
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

  const handleRefund = () => {
    showToast(`Refund audit record logged for Order ${order?.id}`, 'info');
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
          description="The requested order was not found in the platform database."
          actionLabel="Back to Orders Log"
          onAction={() => (window.location.href = '/admin/orders')}
        />
      </div>
    );
  }

  const commission = ((Number(order.total) || 0) * 0.05).toFixed(2);
  const vendorPayout = ((Number(order.total) || 0) * 0.95).toFixed(2);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Master Orders
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Order Audit #{order.id}</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Placed on {new Date(order.createdAt || Date.now()).toLocaleDateString()} • Shop: {order.shopName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={order.status === 'Delivered' ? 'success' : 'warning'} size="md">
              {order.status}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              className="text-red-700 border-red-200 hover:bg-red-50"
              icon={RotateCcw}
              onClick={handleRefund}
            >
              Initiate Customer Refund
            </Button>
          </div>
        </div>
      </div>

      {/* Financial Settlement Breakdown */}
      <Card title="Financial Audit & Reconciliation">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-xs text-slate-400 block uppercase font-semibold">Total Paid by Customer</span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">₹{order.total}</span>
          </div>
          <div className="p-4 rounded-xl bg-purple-50 border border-purple-100">
            <span className="text-xs text-purple-700 block uppercase font-semibold">Platform Fee (5%)</span>
            <span className="text-2xl font-black text-purple-900 mt-1 block">₹{commission}</span>
          </div>
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-100">
            <span className="text-xs text-emerald-700 block uppercase font-semibold">Net Merchant Payout (95%)</span>
            <span className="text-2xl font-black text-emerald-900 mt-1 block">₹{vendorPayout}</span>
          </div>
        </div>
      </Card>

      {/* Order Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Customer & Delivery Particulars">
          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 block">Customer Name:</span>
              <span className="font-bold text-slate-900 text-sm">{order.customerName}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Contact Phone:</span>
              <span className="font-mono text-slate-800">{order.customerPhone}</span>
            </div>
            <div>
              <span className="text-slate-400 block">Delivery Address:</span>
              <p className="text-slate-700 leading-relaxed">{order.address}</p>
            </div>
          </div>
        </Card>

        <Card title="Ordered Delicacy Line Items">
          <div className="divide-y divide-slate-100 text-xs">
            {order.items?.map((item, idx) => (
              <div key={idx} className="py-2.5 flex justify-between">
                <span>
                  {item.quantity} × {item.name}
                </span>
                <span className="font-bold">₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="pt-3 flex justify-between font-bold text-sm text-slate-900">
              <span>Gross Order Total</span>
              <span>₹{order.total}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminOrderDetailsPage;
