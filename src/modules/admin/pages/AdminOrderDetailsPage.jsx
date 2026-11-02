import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Shield, MapPin, CreditCard, RotateCcw } from 'lucide-react';
import { MOCK_ORDERS } from '../../../utils/mockData';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';

export const AdminOrderDetailsPage = () => {
  const { id } = useParams();
  const { showToast } = useApp();
  const order = MOCK_ORDERS.find((o) => o.id === id) || MOCK_ORDERS[0];

  const commission = (order.total * 0.05).toFixed(2);
  const vendorPayout = (order.total * 0.95).toFixed(2);

  const handleRefund = () => {
    showToast(`Refund initiated for Order ${order.id}`, 'info');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Link to="/admin/orders" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Master Orders
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-3xl font-black text-slate-900">Order Audit #{order.id}</h1>
            <p className="text-xs text-slate-500 mt-0.5">Placed on {order.date} • Shop: {order.shopName}</p>
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
      <Card title="Financial Split & Commission">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block mb-1">Customer Paid Total</span>
            <span className="text-xl font-black text-slate-900">₹{order.total}</span>
            <span className="text-[10px] text-slate-500 block mt-1">Via {order.paymentMethod}</span>
          </div>

          <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
            <span className="text-purple-700 font-bold block mb-1">Platform Commission (5%)</span>
            <span className="text-xl font-black text-purple-900">₹{commission}</span>
            <span className="text-[10px] text-purple-600 block mt-1">Black&White Marketplace Revenue</span>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <span className="text-emerald-700 font-bold block mb-1">Merchant Net Settlement</span>
            <span className="text-xl font-black text-emerald-900">₹{vendorPayout}</span>
            <span className="text-[10px] text-emerald-600 block mt-1">Dispatched to {order.shopName}</span>
          </div>
        </div>
      </Card>

      {/* Delicacy Line Items */}
      <Card title="Line Items Ordered">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                <th className="py-2.5 px-2">Delicacy Item</th>
                <th className="py-2.5 px-2">Unit Price</th>
                <th className="py-2.5 px-2">Quantity</th>
                <th className="py-2.5 px-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {order.items?.map((item, i) => (
                <tr key={i}>
                  <td className="py-3 px-2 font-bold text-slate-800">{item.name}</td>
                  <td className="py-3 px-2 text-slate-600">₹{item.price}</td>
                  <td className="py-3 px-2 font-bold text-slate-900">{item.quantity}</td>
                  <td className="py-3 px-2 text-right font-black text-slate-900">
                    ₹{item.price * item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Customer & Address Details */}
      <Card title="Delivery & Fulfillment Coordinates">
        <div className="text-xs space-y-2">
          <p className="text-slate-700">Customer: <strong className="text-slate-900">{order.customer}</strong> ({order.phone})</p>
          <p className="text-slate-700">Doorstep Address: <strong className="text-slate-900">{order.address}</strong></p>
        </div>
      </Card>
    </div>
  );
};

export default AdminOrderDetailsPage;
