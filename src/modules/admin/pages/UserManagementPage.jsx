import React, { useState, useEffect, useCallback } from 'react';
import { Phone, Eye, RefreshCw } from 'lucide-react';
import { getAllCustomers, updateCustomerStatus } from '../../../services/firebase/firestoreService';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';
import Modal from '../../../components/common/Modal';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export const UserManagementPage = () => {
  const { showToast } = useApp();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllCustomers();
      setCustomers(data);
    } catch (_err) {
      showToast('Error loading customer records from Firestore', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filtered = customers.filter((c) => {
    const term = searchTerm.toLowerCase();
    const matchName = c.fullName?.toLowerCase().includes(term);
    const matchMobile = c.mobileNumber?.includes(term);
    return matchName || matchMobile;
  });

  const handleToggleStatus = async (uid, currentStatus, name) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setUpdatingId(uid);
    try {
      await updateCustomerStatus(uid, nextStatus);
      setCustomers((prev) =>
        prev.map((c) => (c.uid === uid ? { ...c, accountStatus: nextStatus } : c))
      );
      if (selectedCustomer && selectedCustomer.uid === uid) {
        setSelectedCustomer((prev) => ({ ...prev, accountStatus: nextStatus }));
      }
      showToast(`Customer "${name}" status updated to ${nextStatus}`, 'success');
    } catch (_err) {
      showToast('Failed to update customer status in Firestore', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Customer Management</h1>
          <p className="text-sm text-slate-500 mt-1">
            Registered customer accounts, mobile numbers, and account status controls (Firestore users collection)
          </p>
        </div>
        <button
          onClick={fetchCustomers}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Records</span>
        </button>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-96">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeholder="Search by customer name or mobile number..."
            />
          </div>
          <span className="text-xs text-slate-400">
            Total Customers: <strong className="text-slate-800">{filtered.length}</strong>
          </span>
        </div>

        {loading ? (
          <div className="py-16">
            <LoadingSpinner text="Fetching customer records from Firestore..." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No customer accounts found matching your query.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-3">Customer Name</th>
                  <th className="py-3 px-3">Registered Mobile Number</th>
                  <th className="py-3 px-3">Registration Date</th>
                  <th className="py-3 px-3">Account Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((user) => (
                  <tr key={user.uid} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center font-bold text-xs">
                          {user.fullName?.charAt(0) || 'C'}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{user.fullName}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">UID: {user.uid}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-mono font-medium text-slate-800 flex items-center gap-1.5 pt-4">
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      <span>{user.mobileNumber}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge variant={user.accountStatus === 'Active' ? 'success' : 'danger'}>
                        {user.accountStatus || 'Active'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedCustomer(user)}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> Details
                        </button>
                        <button
                          disabled={updatingId === user.uid}
                          onClick={() => handleToggleStatus(user.uid, user.accountStatus, user.fullName)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${
                            user.accountStatus === 'Active'
                              ? 'text-red-700 border-red-200 hover:bg-red-50'
                              : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                          }`}
                        >
                          {user.accountStatus === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Customer Details Modal */}
      <Modal
        isOpen={Boolean(selectedCustomer)}
        onClose={() => setSelectedCustomer(null)}
        title="Customer Profile Details"
      >
        {selectedCustomer && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Full Name</span>
                <span className="font-bold text-slate-900">{selectedCustomer.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Mobile Number</span>
                <span className="font-mono font-bold text-amber-800">{selectedCustomer.mobileNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account Role</span>
                <span className="font-mono text-purple-700 font-bold uppercase">{selectedCustomer.role || 'customer'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account Status</span>
                <Badge variant={selectedCustomer.accountStatus === 'Active' ? 'success' : 'danger'}>
                  {selectedCustomer.accountStatus || 'Active'}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registered On</span>
                <span className="text-slate-700">{selectedCustomer.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Firestore UID</span>
                <span className="font-mono text-slate-500 text-[10px]">{selectedCustomer.uid}</span>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl text-amber-900 text-[11px] leading-relaxed">
              <strong>Security Protocol:</strong> Authentication credentials and passwords are encrypted and managed exclusively via Firebase Authentication. No passwords or cryptographic hashes are stored in Firestore or accessible to administrators.
            </div>

            <div className="pt-2 flex justify-between items-center">
              <button
                onClick={() =>
                  handleToggleStatus(selectedCustomer.uid, selectedCustomer.accountStatus, selectedCustomer.fullName)
                }
                className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition ${
                  selectedCustomer.accountStatus === 'Active'
                    ? 'text-red-700 border-red-200 hover:bg-red-50'
                    : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                {selectedCustomer.accountStatus === 'Active' ? 'Deactivate Customer' : 'Activate Customer'}
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-medium text-xs"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserManagementPage;
