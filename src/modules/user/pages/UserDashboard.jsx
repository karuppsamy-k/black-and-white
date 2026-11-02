import React from 'react';
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
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { MOCK_ORDERS } from '../../../utils/mockData';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';

export const UserDashboard = () => {
  const { currentUser } = useAuth();
  const recentOrders = MOCK_ORDERS;
  const activeOrder = MOCK_ORDERS.find((o) => o.status === 'Preparing' || o.status === 'Placed');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-stone-900 to-amber-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
            Customer Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black">
            Vanakkam, {currentUser?.displayName || 'Karuppasamy'}!
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-amber-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Orders</p>
              <h3 className="text-2xl font-bold text-stone-900 mt-1">14</h3>
              <p className="text-[11px] text-emerald-600 font-medium mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +2 this month
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Active Delivery</p>
              <h3 className="text-2xl font-bold text-stone-900 mt-1">1 In Progress</h3>
              <p className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3 text-amber-600" /> Approx 35 mins
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-sky-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Sweet Points</p>
              <h3 className="text-2xl font-bold text-stone-900 mt-1">420 pts</h3>
              <p className="text-[11px] text-stone-500 mt-1">Worth ₹42 on next order</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Saved Addresses</p>
              <h3 className="text-2xl font-bold text-stone-900 mt-1">2 Locations</h3>
              <p className="text-[11px] text-stone-500 mt-1">Home, Office (Madurai)</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Active Order Spotlight Banner */}
      {activeOrder && (
        <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-600 text-white flex items-center justify-center font-bold flex-shrink-0 animate-pulse">
              🚚
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-bold text-stone-900 text-base">Active Order: {activeOrder.id}</h4>
                <Badge variant="warning">{activeOrder.status}</Badge>
              </div>
              <p className="text-xs text-stone-600 mt-0.5">
                From <span className="font-semibold text-stone-800">{activeOrder.shopName}</span> • Total: ₹{activeOrder.total}
              </p>
              <p className="text-xs text-amber-800 font-medium mt-1">
                Currently: Packing Fresh Tirunelveli Halwa at master sweet kitchen
              </p>
            </div>
          </div>
          <Link to={`/user/orders/${activeOrder.id}/track`}>
            <Button variant="primary" size="sm" icon={ArrowUpRight} iconPosition="right">
              Live Order Tracking
            </Button>
          </Link>
        </div>
      )}

      {/* Recent Orders Section */}
      <Card
        title="Recent Orders"
        subtitle="Review order history, download invoices, or re-order favourites"
        actions={
          <Link to="/user/orders" className="text-xs font-bold text-amber-700 hover:underline flex items-center gap-1">
            View All Orders <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-100 text-xs font-semibold text-stone-400 uppercase">
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Shop</th>
                <th className="py-3 px-2">Items</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-stone-50/60 transition">
                  <td className="py-3.5 px-2 font-mono font-medium text-xs text-stone-800">{ord.id}</td>
                  <td className="py-3.5 px-2 text-xs text-stone-500">{ord.date}</td>
                  <td className="py-3.5 px-2 font-medium text-stone-800 text-xs">{ord.shopName}</td>
                  <td className="py-3.5 px-2 text-xs text-stone-500">
                    {ord.items.map((i) => `${i.name} (x${i.quantity})`).join(', ')}
                  </td>
                  <td className="py-3.5 px-2 font-bold text-stone-900 text-xs">₹{ord.total}</td>
                  <td className="py-3.5 px-2">
                    <Badge variant={ord.status === 'Delivered' ? 'success' : 'warning'}>
                      {ord.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <Link to={`/user/orders/${ord.id}/track`}>
                      <button className="text-xs font-semibold text-amber-700 hover:underline">
                        Track
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Link
          to="/user/addresses"
          className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-amber-500 hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm">Delivery Addresses</h4>
            <p className="text-xs text-stone-500">Manage home and office drop-off locations</p>
          </div>
        </Link>

        <Link
          to="/user/profile"
          className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-amber-500 hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm">Customer Profile</h4>
            <p className="text-xs text-stone-500">Update phone, email, and preferences</p>
          </div>
        </Link>

        <Link
          to="/user/settings"
          className="p-5 rounded-2xl bg-white border border-stone-200 hover:border-amber-500 hover:shadow-md transition flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-stone-900 text-sm">Account Settings</h4>
            <p className="text-xs text-stone-500">Notification and security preferences</p>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboard;
