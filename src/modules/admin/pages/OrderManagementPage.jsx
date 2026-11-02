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
      ord.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.shopName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || ord.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Master Order Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Full audit trail of all customer transactions, commission cuts, and fulfillment states
        </p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-80">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeholder="Search by order ID, vendor, or customer..."
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto text-xs">
            {['All', 'Preparing', 'Delivered'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-semibold transition ${
                  statusFilter === st
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-2">Order ID</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Customer</th>
                <th className="py-3 px-2">Merchant Vendor</th>
                <th className="py-3 px-2">Total Amount</th>
                <th className="py-3 px-2">Commission (5%)</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((ord) => {
                const commission = (ord.total * 0.05).toFixed(1);
                return (
                  <tr key={ord.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-2 font-mono font-bold text-slate-900">{ord.id}</td>
                    <td className="py-3.5 px-2 text-slate-500">{ord.date}</td>
                    <td className="py-3.5 px-2 font-medium text-slate-800">{ord.customer}</td>
                    <td className="py-3.5 px-2 text-slate-700 font-medium">{ord.shopName}</td>
                    <td className="py-3.5 px-2 font-black text-slate-900">₹{ord.total}</td>
                    <td className="py-3.5 px-2 font-mono font-bold text-purple-700">₹{commission}</td>
                    <td className="py-3.5 px-2">
                      <Badge variant={ord.status === 'Delivered' ? 'success' : 'warning'}>
                        {ord.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      <Link
                        to={`/admin/orders/${ord.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-purple-700 hover:underline"
                      >
                        <Eye className="w-3.5 h-3.5" /> Inspect
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default OrderManagementPage;
