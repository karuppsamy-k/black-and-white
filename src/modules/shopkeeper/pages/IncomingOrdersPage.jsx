import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BellRing, CheckCircle, XCircle, Clock, MapPin, Printer, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { getOrdersByShop, updateOrderStatus } from '../../../services/firebase/firestoreService';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { OrderListSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const IncomingOrdersPage = () => {
  const { currentUser } = useAuth();
  const { showToast } = useApp();
  const [incoming, setIncoming] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchIncoming = useCallback(async () => {
    setLoading(true);
    try {
      const data = currentUser?.uid ? await getOrdersByShop(currentUser.uid) : [];
      setIncoming(data.filter((o) => o.status === 'Placed' || o.status === 'Preparing'));
    } catch (_err) {
      setIncoming([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    fetchIncoming();
  }, [fetchIncoming]);

  const handleAccept = async (id) => {
    try {
      await updateOrderStatus(id, 'Preparing');
      setIncoming((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'Preparing' } : o)));
      showToast(`Order ${id} accepted and sent to sweet packing kitchen!`, 'success');
    } catch (_err) {
      showToast('Error updating order status', 'error');
    }
  };

  const handleDispatch = async (id) => {
    try {
      await updateOrderStatus(id, 'Delivered');
      setIncoming((prev) => prev.filter((o) => o.id !== id));
      showToast(`Order ${id} marked as dispatched!`, 'success');
    } catch (_err) {
      showToast('Error updating order status', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping"></span>
            <span>Live Kitchen Order Stream</span>
          </div>
          <h1 className="text-3xl font-serif font-black text-stone-900">Incoming Orders Queue</h1>
          <p className="text-sm text-stone-500 mt-1">
            Accept pending orders immediately to notify delivery executives for pickup
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={incoming.length > 0 ? 'danger' : 'success'} size="md">
            {incoming.length} Orders Pending Action
          </Badge>
        </div>
      </div>

      {loading ? (
        <OrderListSkeleton count={3} />
      ) : incoming.length === 0 ? (
        <EmptyState
          icon={BellRing}
          title="All Incoming Orders Cleared"
          description="Your kitchen queue is up to date! As soon as customers place new sweet orders, they will ping this real-time queue."
          actionLabel="View All Orders"
          onAction={() => (window.location.href = '/shopkeeper/orders/manage')}
        />
      ) : (
        <div className="space-y-6">
          {incoming.map((order) => (
            <Card key={order.id} className="border-l-4 border-l-red-500 overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-base font-bold text-stone-900">{order.id}</span>
                    <Badge variant={order.status === 'Preparing' ? 'warning' : 'danger'}>
                      {order.status === 'Preparing' ? 'In Kitchen Packing' : 'New Order • Action Required'}
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    Customer: <strong className="text-stone-800">{order.customerName}</strong> ({order.customerPhone})
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {order.status === 'Placed' ? (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={CheckCircle}
                      onClick={() => handleAccept(order.id)}
                    >
                      Accept Order
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      icon={CheckCircle}
                      onClick={() => handleDispatch(order.id)}
                    >
                      Mark Dispatched
                    </Button>
                  )}
                  <Link to={`/shopkeeper/orders/${order.id}`}>
                    <Button variant="outline" size="sm">
                      Details
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Items */}
              <div className="pt-4 divide-y divide-stone-50 text-xs">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-2 flex justify-between">
                    <span className="font-medium text-stone-800">
                      {item.quantity} × {item.name}
                    </span>
                    <span className="font-bold text-stone-900">₹{item.price * item.quantity}</span>
                  </div>
                ))}
                <div className="pt-2 flex justify-between font-bold text-sm text-stone-900">
                  <span>Total Amount</span>
                  <span>₹{order.total}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default IncomingOrdersPage;
