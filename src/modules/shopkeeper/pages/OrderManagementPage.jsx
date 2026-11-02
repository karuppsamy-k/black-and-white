import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Filter, ArrowUpRight } from 'lucide-react';
import { MOCK_ORDERS } from '../../../utils/mockData';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';

export const OrderManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filtered = MOCK_ORDERS.filter((ord) => {
    const matchSearch =
      ord.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || ord.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-stone-900">Order Management</h1>
          <p className="text-sm text-stone-500 mt-1">
            Complete fulfillment log of all customer sweet orders
          </p>
        </div>
      </div>

      <Card>
        {/* Filter controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-80">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeholder="Search by Order ID or Customer..."
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-xs w-full sm:w-auto">
            {['All', 'Preparing', 'Delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  statusFilter === st
                    ? 'bg-amber-600 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 uppercase font-semibold">
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Items Summary</th>
                <th className="py-3 px-2">Payment</th>
                <th className="py-3 px-2">Total</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((ord) => (
                <tr key={ord.id} className="hover:bg-stone-50/60 transition">
                  <td className="py-3.5 px-2 font-mono font-bold text-stone-900">{ord.id}</td>
                  <td className="py-3.5 px-2 text-stone-500">{ord.date}</td>
                  <td className="py-3.5 px-2 font-medium text-stone-800">{ord.customer}</td>
                  <td className="py-3.5 px-2 text-stone-600">
                    {ord.items.map((i) => `${i.name} (×${i.quantity})`).join(', ')}
                  </td>
                  <td className="py-3.5 px-2 font-medium text-stone-700">{ord.paymentMethod}</td>
                  <td className="py-3.5 px-2 font-black text-stone-900">₹{ord.total}</td>
                  <td className="py-3.5 px-2">
                    <Badge variant={ord.status === 'Delivered' ? 'success' : 'warning'}>
                      {ord.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <Link
                      to={`/shopkeeper/orders/${ord.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-amber-700 hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" /> Details
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

export default OrderManagementPage;
