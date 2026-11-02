import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Clock,
  MapPin,
  ChevronRight,
  TrendingUp,
  Package,
  Heart,
  Settings,
  ArrowUpRight,
  User,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getOrdersByCustomer } from '../../../services/firebase/firestoreService';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { StatCardSkeleton, OrderListSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const UserDashboard = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserOrders = async () => {
      setLoading(true);
      try {
        const data = currentUser?.uid ? await getOrdersByCustomer(currentUser.uid) : [];
        setOrders(data);
      } catch (_err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUserOrders();
  }, [currentUser?.uid]);

  const activeOrders = orders.filter((o) => o.status === 'Placed' || o.status === 'Preparing');
  const totalSpent = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black">
            Vanakkam, {currentUser?.fullName || 'Valued Customer'}!
          </h1>
          <p className="text-stone-300 text-sm max-w-xl">
            Track your freshly dispatched traditional halwa, view loyalty rewards, and manage your delivery addresses.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/user/products">
            <Button variant="primary" icon={ShoppingBag}>
              Order Fresh Sweets
            </Button>
          </Link>
          <Link to="/user/profile">
            <Button variant="outline" className="border-stone-600 text-stone-200 bg-stone-800 hover:bg-stone-700">
              Edit Profile
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      {loading ? (
        <StatCardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="border-l-4 border-l-amber-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Orders</p>
                <h3 className="text-2xl font-bold text-stone-900 mt-1">{orders.length}</h3>
                <p className="text-[11px] text-stone-400 mt-1">Platform lifetime</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Spent</p>
                <h3 className="text-2xl font-bold text-stone-900 mt-1">₹{totalSpent}</h3>
                <p className="text-[11px] text-emerald-600 font-bold mt-1">Verified orders</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">
                ₹
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Active Deliveries</p>
                <h3 className="text-2xl font-bold text-stone-900 mt-1">{activeOrders.length}</h3>
                <p className="text-[11px] text-stone-400 mt-1">Freshly dispatched</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Clock className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Account Status</p>
                <h3 className="text-lg font-bold text-emerald-600 mt-1">Active</h3>
                <p className="text-[11px] text-stone-400 mt-1">Verified mobile login</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Orders List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-stone-900">Recent Artisan Orders</h2>
          {orders.length > 0 && (
            <Link to="/user/orders" className="text-xs font-semibold text-amber-700 hover:underline">
              View All Orders
            </Link>
          )}
        </div>

        {loading ? (
          <OrderListSkeleton count={2} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No Recent Orders"
            description="You haven't ordered any sweets or snacks yet. Browse our handcrafted selections and enjoy traditional flavors delivered fresh!"
            actionLabel="Browse Sweets Catalog"
            onAction={() => (window.location.href = '/user/products')}
          />
        ) : (
          <div className="space-y-4">
            {orders.slice(0, 3).map((order) => (
              <Card key={order.id} className="p-4 flex items-center justify-between">
                <div>
                  <span className="font-mono text-sm font-bold text-stone-900">{order.id}</span>
                  <p className="text-xs text-stone-500 mt-0.5">{order.shopName} • ₹{order.total}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={order.status === 'Delivered' ? 'success' : 'warning'}>
                    {order.status}
                  </Badge>
                  <Link to={`/user/orders/${order.id}`}>
                    <Button size="sm" variant="outline">
                      View
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
