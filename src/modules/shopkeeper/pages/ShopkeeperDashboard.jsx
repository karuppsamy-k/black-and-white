import React from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  TrendingUp,
  Clock,
  AlertTriangle,
  PlusCircle,
  ArrowUpRight,
  Package,
  CheckCircle,
  XCircle,
  BellRing,
} from 'lucide-react';
import { MOCK_ORDERS, MOCK_PRODUCTS } from '../../../utils/mockData';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';

export const ShopkeeperDashboard = () => {
  const { showToast } = useApp();
  const recentOrders = MOCK_ORDERS;
  const lowStockItems = MOCK_PRODUCTS.filter((p) => p.stock < 30);

  const handleAcceptOrder = (id) => {
    showToast(`Order ${id} accepted and sent to kitchen!`, 'success');
  };

  const handleRejectOrder = (id) => {
    showToast(`Order ${id} rejected`, 'info');
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div>
          <span className="text-amber-700 text-xs font-bold uppercase tracking-wider">
            Madurai Meenakshi Sweets
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 mt-1">
            Store Performance Overview
          </h1>
          <p className="text-stone-500 text-xs sm:text-sm mt-1">
            Live operations, pending morning fresh batches, and retail metrics
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
              Incoming Queue (3)
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="border-l-4 border-l-amber-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Today's Revenue</p>
              <h3 className="text-2xl font-black text-stone-900 mt-1">₹18,450</h3>
              <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +14.2% vs yesterday
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-lg">
              ₹
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Total Orders Today</p>
              <h3 className="text-2xl font-black text-stone-900 mt-1">32 Orders</h3>
              <p className="text-[11px] text-stone-500 mt-1">29 Completed, 3 In Prep</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-sky-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Active Inventory</p>
              <h3 className="text-2xl font-black text-stone-900 mt-1">38 SKUs</h3>
              <p className="text-[11px] text-stone-500 mt-1">Sweets, Murukku, Halwa</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-l-4 border-l-rose-600">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Low Stock Warning</p>
              <h3 className="text-2xl font-black text-rose-600 mt-1">2 Items</h3>
              <p className="text-[11px] text-stone-500 mt-1">Restock required</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Incoming Orders Alert Table */}
      <Card
        title="Live Orders Requiring Preparation"
        subtitle="Accept immediately to alert dispatch riders for doorstep pickup"
        actions={
          <Link to="/shopkeeper/orders/manage" className="text-xs font-bold text-amber-700 hover:underline">
            View All Master Orders
          </Link>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 font-semibold uppercase">
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Items to Pack</th>
                <th className="py-3 px-2">Amount</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Kitchen Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-stone-50/60 transition">
                  <td className="py-3.5 px-2 font-mono font-bold text-stone-900">{ord.id}</td>
                  <td className="py-3.5 px-2 font-medium text-stone-800">{ord.customer}</td>
                  <td className="py-3.5 px-2 text-stone-600">
                    {ord.items.map((i) => `${i.name} (×${i.quantity})`).join(', ')}
                  </td>
                  <td className="py-3.5 px-2 font-black text-stone-900">₹{ord.total}</td>
                  <td className="py-3.5 px-2">
                    <Badge variant={ord.status === 'Delivered' ? 'success' : 'warning'}>
                      {ord.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => handleAcceptOrder(ord.id)}
                        className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition"
                        title="Accept Order"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleRejectOrder(ord.id)}
                        className="p-1.5 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition"
                        title="Reject Order"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/shopkeeper/orders/${ord.id}`}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-stone-800"
                        title="View Details"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Low Stock Alert and Top Sellers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Restock Attention Needed" subtitle="Items reaching threshold limit">
          <div className="space-y-3">
            {lowStockItems.map((prod) => (
              <div key={prod.id} className="flex items-center justify-between p-3 rounded-xl bg-stone-50 border border-stone-200/60 text-xs">
                <div className="flex items-center gap-3">
                  <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover" />
                  <div>
                    <h5 className="font-bold text-stone-900">{prod.name}</h5>
                    <p className="text-[10px] text-stone-500">Category: {prod.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-rose-600 block">Only {prod.stock} left</span>
                  <Link to={`/shopkeeper/products/edit/${prod.id}`} className="text-[11px] text-amber-700 hover:underline font-semibold">
                    Update Stock
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Shopkeeper Quick Navigation" subtitle="Direct access to store features">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <Link
              to="/shopkeeper/shop-profile"
              className="p-3.5 rounded-xl border border-stone-200 hover:border-amber-500 hover:bg-amber-50/20 transition flex flex-col justify-between"
            >
              <span className="font-bold text-stone-900">Shop Profile</span>
              <span className="text-stone-500 mt-1 text-[11px]">Banners, hours & FSSAI info</span>
            </Link>
            <Link
              to="/shopkeeper/sales"
              className="p-3.5 rounded-xl border border-stone-200 hover:border-amber-500 hover:bg-amber-50/20 transition flex flex-col justify-between"
            >
              <span className="font-bold text-stone-900">Sales Analytics</span>
              <span className="text-stone-500 mt-1 text-[11px]">Revenue charts & weekly orders</span>
            </Link>
            <Link
              to="/shopkeeper/earnings"
              className="p-3.5 rounded-xl border border-stone-200 hover:border-amber-500 hover:bg-amber-50/20 transition flex flex-col justify-between"
            >
              <span className="font-bold text-stone-900">Bank Payouts</span>
              <span className="text-stone-500 mt-1 text-[11px]">Withdrawals & tax reports</span>
            </Link>
            <Link
              to="/shopkeeper/settings"
              className="p-3.5 rounded-xl border border-stone-200 hover:border-amber-500 hover:bg-amber-50/20 transition flex flex-col justify-between"
            >
              <span className="font-bold text-stone-900">Store Settings</span>
              <span className="text-stone-500 mt-1 text-[11px]">Delivery radius & packaging</span>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ShopkeeperDashboard;
