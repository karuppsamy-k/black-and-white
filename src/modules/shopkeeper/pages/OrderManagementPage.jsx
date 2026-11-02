import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye, Filter, ArrowUpRight, ShoppingBag } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getOrdersByShop } from '../../../services/firebase/firestoreService';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';
import Button from '../../../components/common/Button';
import { TableSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const OrderManagementPage = () => {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const data = currentUser?.uid ? await getOrdersByShop(currentUser.uid) : [];
        setOrders(data);
      } catch (_err) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [currentUser?.uid]);

  const filtered = orders.filter((ord) => {
    const matchSearch =
      ord.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ord.customerName?.toLowerCase().includes(searchTerm.toLowerCase());
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
            {['All', 'Placed', 'Preparing', 'Delivered'].map((st) => (
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

        {/* Content */}
        {loading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title={searchTerm ? 'No Matching Orders' : 'No Orders Recorded Yet'}
            description={
              searchTerm
                ? 'Try adjusting your search criteria.'
                : 'Orders received from customers will appear here in your fulfillment log.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="bg-stone-50 text-xs uppercase font-bold text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Items Count</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{ord.id}</td>
                    <td className="py-3.5 px-4 text-xs text-stone-500">
                      {new Date(ord.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-900">{ord.customerName}</td>
                    <td className="py-3.5 px-4 text-xs">{ord.items?.length || 0} items</td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">₹{ord.total}</td>
                    <td className="py-3.5 px-4">
                      <Badge variant={ord.status === 'Delivered' ? 'success' : 'warning'}>
                        {ord.status}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <Link to={`/shopkeeper/orders/${ord.id}`}>
                        <button className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100">
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
