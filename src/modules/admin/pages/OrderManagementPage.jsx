import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Filter, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { getAllOrders } from '../../../services/firebase/firestoreService';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';
import { TableSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (_err) {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = orders.filter((ord) => {
    const matchSearch =
      ord.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.shopName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === 'All' || ord.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Master Orders Log</h1>
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
            {['All', 'Placed', 'Preparing', 'Delivered'].map((st) => (
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

        {loading ? (
          <TableSkeleton rows={5} cols={6} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title={searchTerm ? 'No Orders Match Query' : 'No Orders Placed Yet'}
            description={
              searchTerm
                ? 'Try adjusting your search criteria.'
                : 'Customer orders across all sweet shop partners will appear here in the master ledger.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-3">Order ID</th>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Customer</th>
                  <th className="py-3 px-3">Sweet Shop</th>
                  <th className="py-3 px-3">Total Amount</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-900">{ord.id}</td>
                    <td className="py-3.5 px-3 text-slate-500">
                      {new Date(ord.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-900">{ord.customerName}</td>
                    <td className="py-3.5 px-3 text-slate-700">{ord.shopName}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">₹{ord.total}</td>
                    <td className="py-3.5 px-3">
                      <Badge variant={ord.status === 'Delivered' ? 'success' : 'warning'}>
                        {ord.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <Link to={`/admin/orders/${ord.id}`}>
                        <button className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100">
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};

export default OrderManagementPage;
