import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle,
  Truck,
  Phone,
  MapPin,
  Clock,
  Printer,
  ShieldCheck,
} from 'lucide-react';
import { MOCK_ORDERS } from '../../../utils/mockData';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';

export const OrderDetailsPage = () => {
  const { id } = useParams();
  const { showToast } = useApp();
  const order = MOCK_ORDERS.find((o) => o.id === id) || MOCK_ORDERS[0];
  const [currentStatus, setCurrentStatus] = useState(order.status);

  const handleUpdateStatus = (newStatus) => {
    setCurrentStatus(newStatus);
    showToast(`Order status updated to: ${newStatus}`, 'success');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <Link to="/shopkeeper/orders/manage" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition">
          <ArrowLeft className="w-4 h-4" /> Back to Orders
        </Link>
        <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
          <div>
            <h1 className="text-3xl font-serif font-black text-stone-900">Order #{order.id}</h1>
            <p className="text-xs text-stone-500 mt-0.5">Placed on {order.date} • Customer: {order.customer}</p>
          </div>
          <Badge variant={currentStatus === 'Delivered' ? 'success' : 'warning'} size="md">
            {currentStatus}
          </Badge>
        </div>
      </div>

      {/* Stage Controller */}
      <Card title="Update Kitchen & Packing Stage">
        <div className="flex flex-wrap items-center gap-3">
          <Button
            size="sm"
            variant={currentStatus === 'Preparing' ? 'primary' : 'outline'}
            onClick={() => handleUpdateStatus('Preparing')}
          >
            1. Preparing Batch
          </Button>
          <Button
            size="sm"
            variant={currentStatus === 'Ready for Pickup' ? 'primary' : 'outline'}
            onClick={() => handleUpdateStatus('Ready for Pickup')}
          >
            2. Packed & Ready
          </Button>
          <Button
            size="sm"
            variant={currentStatus === 'Out for Delivery' ? 'primary' : 'outline'}
            onClick={() => handleUpdateStatus('Out for Delivery')}
          >
            3. Handed to Rider
          </Button>
          <Button
            size="sm"
            variant={currentStatus === 'Delivered' ? 'success' : 'outline'}
            onClick={() => handleUpdateStatus('Delivered')}
          >
            4. Delivered
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer & Shipping */}
        <Card title="Customer Information">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <span className="text-stone-400">Full Name</span>
              <span className="font-bold text-stone-800">{order.customer}</span>
            </div>
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <span className="text-stone-400">Phone</span>
              <span className="font-semibold text-stone-800">{order.phone}</span>
            </div>
            <div className="pt-1">
              <span className="text-stone-400 block mb-1">Doorstep Address</span>
              <p className="text-stone-800 font-medium leading-relaxed">{order.address}</p>
            </div>
          </div>
        </Card>

        {/* Payment Summary */}
        <Card title="Payment & Billing">
          <div className="space-y-3 text-xs">
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <span className="text-stone-400">Payment Gateway</span>
              <span className="font-bold text-stone-800">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <span className="text-stone-400">Payment Status</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                {order.paymentStatus}
              </span>
            </div>
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <span className="text-stone-400">Subtotal</span>
              <span className="font-semibold text-stone-800">₹{order.subtotal}</span>
            </div>
            <div className="flex justify-between border-b border-stone-100 pb-2">
              <span className="text-stone-400">Packaging / Delivery</span>
              <span className="font-semibold text-stone-800">₹{order.deliveryFee}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-stone-900 pt-1">
              <span>Grand Total</span>
              <span className="text-amber-800 font-black">₹{order.total}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Items Breakdown Table */}
      <Card title="Delicacy Items Ordered">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 uppercase font-semibold">
                <th className="py-2.5 px-2">Item Name</th>
                <th className="py-2.5 px-2">Unit Price</th>
                <th className="py-2.5 px-2">Quantity</th>
                <th className="py-2.5 px-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {order.items?.map((item, i) => (
                <tr key={i}>
                  <td className="py-3 px-2 font-bold text-stone-800">{item.name}</td>
                  <td className="py-3 px-2 text-stone-600">₹{item.price}</td>
                  <td className="py-3 px-2 font-bold text-stone-900">{item.quantity}</td>
                  <td className="py-3 px-2 text-right font-black text-stone-900">
                    ₹{item.price * item.quantity}
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

export default OrderDetailsPage;
