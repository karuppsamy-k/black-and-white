import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  Store,
  ShoppingBag,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle,
  Package,
  Building,
} from 'lucide-react';
import { getAdminStatistics } from '../../../services/firebase/firestoreService';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { StatCardSkeleton, TableSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    customerCount: 0,
    shopCount: 0,
    pendingShopCount: 0,
    productCount: 0,
    orderCount: 0,
    grossVolume: 0,
    recentOrders: [],
    recentShops: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      setLoading(true);
      try {
        const data = await getAdminStatistics();
        setStats(data);
      } catch (_err) {
        // Zero count fallback
      } finally {
        setLoading(false);
      }
    };
    fetchAdminData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
        <div>
          <span className="text-purple-400 text-xs font-bold uppercase tracking-wider">
            Super Administrator Control
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">Platform Master Overview</h1>
          <p className="text-slate-400 text-xs sm:text-sm mt-1">
            Monitoring multi-module operations across Tamil Nadu sweet shop hubs
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/shop-approvals">
            <Button variant="primary" className="bg-purple-600 hover:bg-purple-700" icon={ShieldAlert}>
              Shop Approvals ({stats.pendingShopCount})
            </Button>
          </Link>
          <Link to="/admin/reports">
            <Button variant="outline" className="border-slate-700 text-slate-200 bg-slate-800 hover:bg-slate-700">
              Platform Analytics
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      {loading ? (
        <StatCardSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <Card className="border-l-4 border-l-purple-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Platform Volume</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">₹{stats.grossVolume}</h3>
                <p className="text-[11px] text-slate-400 mt-1">From live customer transactions</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg">
                ₹
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-amber-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Verified Shops</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.shopCount} Shops</h3>
                <p className="text-[11px] text-amber-700 font-bold mt-1">{stats.pendingShopCount} pending approval</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
                <Store className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-emerald-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Active Customers</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.customerCount}</h3>
                <p className="text-[11px] text-slate-400 mt-1">Registered mobile accounts</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-sky-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Orders Logged</p>
                <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.orderCount}</h3>
                <p className="text-[11px] text-slate-400 mt-1">Across all merchant partners</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Customer Orders</h2>
            {stats.recentOrders.length > 0 && (
              <Link to="/admin/orders" className="text-xs font-semibold text-purple-600 hover:underline">
                View All Orders
              </Link>
            )}
          </div>

          {loading ? (
            <TableSkeleton rows={3} cols={3} />
          ) : stats.recentOrders.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="No Customer Orders Yet"
              description="Orders placed by customers will be recorded here with delivery tracking and payment validation."
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="divide-y divide-slate-100">
                {stats.recentOrders.map((ord) => (
                  <div key={ord.id} className="p-4 flex items-center justify-between">
                    <div>
                      <span className="font-mono text-sm font-bold text-slate-900">{ord.id}</span>
                      <p className="text-xs text-slate-500">{ord.customerName} • {ord.shopName}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant={ord.status === 'Delivered' ? 'success' : 'warning'}>
                        {ord.status}
                      </Badge>
                      <span className="font-bold text-sm text-slate-900">₹{ord.total}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Recent Shopkeeper Registrations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Recent Merchant Registrations</h2>
            {stats.recentShops.length > 0 && (
              <Link to="/admin/shopkeepers" className="text-xs font-semibold text-purple-600 hover:underline">
                Manage Merchants
              </Link>
            )}
          </div>

          {loading ? (
            <TableSkeleton rows={3} cols={3} />
          ) : stats.recentShops.length === 0 ? (
            <EmptyState
              icon={Store}
              title="No Registered Merchants Yet"
              description="Sweet shops and confectioneries registering on the platform will appear here for FSSAI auditing and approval."
            />
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="divide-y divide-slate-100">
                {stats.recentShops.map((shop) => (
                  <div key={shop.uid || shop.id} className="p-4 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-slate-900">{shop.shopName || shop.fullName}</span>
                      <p className="text-xs text-slate-500">{shop.city} • +91 {shop.mobileNumber}</p>
                    </div>
                    <Badge variant={shop.approvalStatus === 'Approved' ? 'success' : 'warning'}>
                      {shop.approvalStatus}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
