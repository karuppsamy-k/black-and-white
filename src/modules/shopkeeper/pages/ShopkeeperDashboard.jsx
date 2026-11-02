import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  AlertTriangle,
  PlusCircle,
  Package,
  CheckCircle,
  XCircle,
  BellRing,
  Store,
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getShopkeeperStatistics } from '../../../services/firebase/firestoreService';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { StatCardSkeleton, TableSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const ShopkeeperDashboard = () => {
  const { currentUser } = useAuth();
  const [stats, setStats] = useState({
    totalRevenue: 0,
    orderCount: 0,
    completedOrderCount: 0,
    pendingOrderCount: 0,
    productCount: 0,
    lowStockCount: 0,
    recentOrders: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const data = await getShopkeeperStatistics(currentUser?.uid || 'merchant');
        setStats(data);
      } catch (_err) {
        // Fallback to zero counts
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [currentUser?.uid]);

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div>
          <span className="text-amber-700 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
            <Store className="w-4 h-4" />
            {currentUser?.shopName || 'Registered Sweet Shop'}
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 mt-1">
            Store Performance Overview
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Live orders, kitchen fulfillment queues, and sales metrics
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link to="/shopkeeper/products/add">
            <Button variant="primary" icon={PlusCircle}>
              Add New Delicacy
            </Button>
          </Link>
          <Link to="/shopkeeper/orders/incoming">
            <Button variant="outline" icon={BellRing}>
              Incoming Queue ({stats.pendingOrderCount})
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <StatCardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="border-l-4 border-l-amber-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Gross Revenue</p>
                <h3 className="text-2xl font-black text-stone-900 mt-1">₹{stats.totalRevenue}</h3>
                <p className="text-[11px] text-stone-400 mt-1">From completed orders</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg">
                ₹
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Orders</p>
                <h3 className="text-2xl font-black text-stone-900 mt-1">{stats.orderCount}</h3>
                <p className="text-[11px] text-stone-400 mt-1">{stats.pendingOrderCount} pending kitchen action</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-blue-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Active Products</p>
                <h3 className="text-2xl font-black text-stone-900 mt-1">{stats.productCount}</h3>
                <p className="text-[11px] text-stone-400 mt-1">Listed in catalog</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-rose-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Low Stock Items</p>
                <h3 className="text-2xl font-black text-stone-900 mt-1">{stats.lowStockCount}</h3>
                <p className="text-[11px] text-stone-400 mt-1">Require replenishment</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-serif font-bold text-stone-900">Live Kitchen & Customer Orders</h2>
          {stats.recentOrders.length > 0 && (
            <Link to="/shopkeeper/orders/manage" className="text-xs font-semibold text-amber-700 hover:underline">
              View All Orders
            </Link>
          )}
        </div>

        {loading ? (
          <TableSkeleton rows={3} cols={4} />
        ) : stats.recentOrders.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No Orders Received Yet"
            description="When customers place orders from your store, they will appear here instantly for kitchen preparation and dispatch."
            actionLabel="Add Delicacies to Catalog"
            onAction={() => (window.location.href = '/shopkeeper/products/add')}
          />
        ) : (
          <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden">
            <div className="divide-y divide-stone-100">
              {stats.recentOrders.map((order) => (
                <div key={order.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="font-mono font-bold text-sm text-stone-900">{order.id}</span>
                    <p className="text-xs text-stone-500">{order.customerName} • {order.items?.length || 0} items</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={order.status === 'Delivered' ? 'success' : 'warning'}>
                      {order.status}
                    </Badge>
                    <span className="font-bold text-sm text-stone-900">₹{order.total}</span>
                    <Link to={`/shopkeeper/orders/${order.id}`}>
                      <Button size="sm" variant="outline">
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShopkeeperDashboard;
