import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowUpRight, Clock, FileText, CheckCircle2, ChevronRight, RefreshCw } from 'lucide-react';
import { getOrdersByCustomer } from '../../../services/firebase/firestoreService';
import { useAuth } from '../../../context/AuthContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { OrderListSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const MyOrdersPage = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('All');

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = currentUser?.uid ? await getOrdersByCustomer(currentUser.uid) : [];
      setOrders(data);
    } catch (_err) {
      setError('Unable to load your orders.');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter((ord) => {
    if (filterStatus === 'All') return true;
    return ord.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-stone-900">My Orders</h1>
          <p className="text-sm text-stone-500 mt-1">
            Track current deliveries and review your previous artisan orders
          </p>
        </div>

        {/* Status Filter */}
        <div className="flex gap-2 text-xs">
          {['All', 'Placed', 'Preparing', 'Delivered'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-full font-semibold transition ${
                filterStatus === status
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Content Rendering */}
      {error ? (
        <div className="p-8 rounded-3xl bg-red-50 text-red-700 border border-red-200 text-center space-y-3">
          <p className="text-sm font-medium">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchOrders} icon={RefreshCw}>
            Retry Loading Orders
          </Button>
        </div>
      ) : loading ? (
        <OrderListSkeleton count={3} />
      ) : filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title={filterStatus !== 'All' ? `No ${filterStatus} Orders` : 'No Orders Placed Yet'}
          description={
            filterStatus !== 'All'
              ? `You do not have any orders currently in "${filterStatus}" status.`
              : 'Taste authentic South Indian heritage sweets prepared with pure desi cow ghee. Browse delicious varieties and place your first order!'
          }
          actionLabel="Explore Delicacies"
          onAction={() => (window.location.href = '/user/products')}
        />
      ) : (
        <div className="space-y-6">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-stone-100 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-stone-900 text-sm">{order.id}</span>
                    <Badge variant={order.status === 'Delivered' ? 'success' : 'warning'}>
                      {order.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-500">
                    Placed on <strong className="text-stone-700">{new Date(order.createdAt || Date.now()).toLocaleDateString()}</strong> from{' '}
                    <strong className="text-stone-700">{order.shopName || 'Sweet Shop'}</strong>
                  </p>
                </div>

                <div className="flex items-center gap-4 self-end md:self-auto">
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">Total Amount</span>
                    <span className="text-base font-bold text-stone-900">₹{order.total}</span>
                  </div>
                  <Link to={`/user/orders/${order.id}`}>
                    <Button variant="outline" size="sm" icon={ChevronRight} iconPosition="right">
                      Track Order
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Order items summary */}
              <div className="pt-4 divide-y divide-stone-50">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="py-2 flex items-center justify-between text-xs text-stone-600">
                    <span className="font-medium text-stone-800">
                      {item.quantity} × {item.name}
                    </span>
                    <span className="font-bold">₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
