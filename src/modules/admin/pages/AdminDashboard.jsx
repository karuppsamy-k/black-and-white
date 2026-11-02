import React from 'react';
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
import { MOCK_ORDERS, MOCK_USERS, MOCK_SHOPKEEPERS } from '../../../utils/mockData';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';

export const AdminDashboard = () => {
  const pendingShops = MOCK_SHOPKEEPERS.filter((s) => s.status === 'Pending Approval');

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
              Shop Approvals ({pendingShops.length})
            </Button>
          </Link>
          <Link to="/admin/reports">
            <Button variant="outline" className="border-slate-700 text-slate-200 bg-slate-800 hover:bg-slate-700">
              Download Platform Report
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Gross Platform Volume</p>
              <h3 className="text-2xl font-black text-slate-900 mt-1">₹6,68,200</h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +24.8% this month
              </p>
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
              <h3 className="text-2xl font-black text-slate-900 mt-1">18 Shops</h3>
              <p className="text-[11px] text-amber-700 font-bold mt-1">1 pending inspection</p>
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
              <h3 className="text-2xl font-black text-slate-900 mt-1">4,280</h3>
              <p className="text-[11px] text-slate-500 mt-1">+142 new this week</p>
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
              <h3 className="text-2xl font-black text-slate-900 mt-1">1,940</h3>
              <p className="text-[11px] text-slate-500 mt-1">Avg delivery 31 mins</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Approvals Callout */}
      {pendingShops.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-sm">
                New Merchant Application: {pendingShops[0].shopName}
              </h4>
              <p className="text-xs text-slate-600">
                City: {pendingShops[0].city} • FSSAI: {pendingShops[0].fssai} • Waiting for compliance verification
              </p>
            </div>
          </div>
          <Link to="/admin/shop-approvals">
            <Button size="sm" variant="primary" className="bg-amber-700 hover:bg-amber-800">
              Review Application
            </Button>
          </Link>
        </div>
      )}

      {/* Recent Orders Across Platform */}
      <Card
        title="Live Master Order Stream"
        subtitle="Real-time orders across all affiliated sweet shops"
        actions={
          <Link to="/admin/orders" className="text-xs font-bold text-purple-700 hover:underline">
            View All Master Orders
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase">
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Shopkeeper Store</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Payment</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_ORDERS.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-2 font-mono font-bold text-slate-900">{ord.id}</td>
                  <td className="py-3.5 px-2 font-medium text-slate-800">{ord.customer}</td>
                  <td className="py-3.5 px-2 text-slate-700 font-medium">{ord.shopName}</td>
                  <td className="py-3.5 px-2 font-black text-slate-900">₹{ord.total}</td>
                  <td className="py-3.5 px-2 text-slate-600">{ord.paymentMethod}</td>
                  <td className="py-3.5 px-2">
                    <Badge variant={ord.status === 'Delivered' ? 'success' : 'warning'}>
                      {ord.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <Link to={`/admin/orders/${ord.id}`} className="text-purple-700 font-bold hover:underline">
                      View Audit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
