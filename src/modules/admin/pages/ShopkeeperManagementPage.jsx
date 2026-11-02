import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Store, Eye, Phone, MapPin, RefreshCw } from 'lucide-react';
import { getAllShopkeepers, updateShopkeeperStatus } from '../../../services/firebase/firestoreService';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';
import Modal from '../../../components/common/Modal';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export const ShopkeeperManagementPage = () => {
  const { showToast } = useApp();
  const [shopkeepers, setShopkeepers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShopkeeper, setSelectedShopkeeper] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const fetchShopkeepers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAllShopkeepers();
      setShopkeepers(data);
    } catch (_err) {
      showToast('Error loading shopkeeper records from Firestore', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchShopkeepers();
  }, [fetchShopkeepers]);

  const filtered = shopkeepers.filter((s) => {
    const term = searchTerm.toLowerCase();
    const matchShop = s.shopName?.toLowerCase().includes(term);
    const matchName = s.fullName?.toLowerCase().includes(term);
    const matchMobile = s.mobileNumber?.includes(term);
    const matchCity = s.city?.toLowerCase().includes(term);
    return matchShop || matchName || matchMobile || matchCity;
  });

  const handleToggleStatus = async (uid, currentStatus, name) => {
    const nextStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
    setUpdatingId(uid);
    try {
      await updateShopkeeperStatus(uid, nextStatus);
      setShopkeepers((prev) =>
        prev.map((s) => (s.uid === uid ? { ...s, accountStatus: nextStatus } : s))
      );
      if (selectedShopkeeper && selectedShopkeeper.uid === uid) {
        setSelectedShopkeeper((prev) => ({ ...prev, accountStatus: nextStatus }));
      }
      showToast(`Shopkeeper "${name}" status updated to ${nextStatus}`, 'success');
    } catch (_err) {
      showToast('Failed to update shopkeeper status', 'error');
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Shopkeeper Directory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Registered sweet shop proprietors, verified mobile numbers, and FSSAI credentials (Firestore shopkeepers collection)
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/shop-approvals"
            className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200 hover:bg-purple-100 transition"
          >
            Review Pending Approvals
          </Link>
          <button
            onClick={fetchShopkeepers}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-96">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeholder="Search by shop name, proprietor, or mobile number..."
            />
          </div>
          <span className="text-xs text-slate-400">
            Total Merchants: <strong className="text-slate-800">{filtered.length}</strong>
          </span>
        </div>

        {loading ? (
          <div className="py-16">
            <LoadingSpinner text="Fetching shopkeeper records from Firestore..." />
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            No shopkeeper records found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-3">Sweet Shop Trade Name</th>
                  <th className="py-3 px-3">Proprietor Name</th>
                  <th className="py-3 px-3">Registered Mobile Number</th>
                  <th className="py-3 px-3">City / Hub</th>
                  <th className="py-3 px-3">FSSAI License</th>
                  <th className="py-3 px-3">Approval</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((sk) => (
                  <tr key={sk.uid} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs flex-shrink-0">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{sk.shopName}</h4>
                          <span className="text-[10px] text-slate-400 font-mono">UID: {sk.uid}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-800">{sk.fullName}</td>
                    <td className="py-3.5 px-3 font-mono font-medium text-amber-800 flex items-center gap-1.5 pt-4">
                      <Phone className="w-3.5 h-3.5 text-amber-600" />
                      <span>{sk.mobileNumber}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {sk.city || 'N/A'}
                    </td>
                    <td className="py-3.5 px-3 font-mono text-slate-600">{sk.fssai || 'N/A'}</td>
                    <td className="py-3.5 px-3">
                      <Badge
                        variant={
                          sk.approvalStatus === 'Approved'
                            ? 'success'
                            : sk.approvalStatus === 'Pending'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {sk.approvalStatus || 'Pending'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge variant={sk.accountStatus === 'Active' ? 'success' : 'danger'}>
                        {sk.accountStatus || 'Active'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedShopkeeper(sk)}
                          className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg font-semibold inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" /> View
                        </button>
                        <button
                          disabled={updatingId === sk.uid}
                          onClick={() => handleToggleStatus(sk.uid, sk.accountStatus, sk.shopName)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${
                            sk.accountStatus === 'Active'
                              ? 'text-red-700 border-red-200 hover:bg-red-50'
                              : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                          }`}
                        >
                          {sk.accountStatus === 'Active' ? 'Deactivate' : 'Activate'}
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

      {/* Shopkeeper Details Modal */}
      <Modal
        isOpen={Boolean(selectedShopkeeper)}
        onClose={() => setSelectedShopkeeper(null)}
        title="Sweet Shop Proprietor Details"
      >
        {selectedShopkeeper && (
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-500">Shop Trade Name</span>
                <span className="font-bold text-slate-900">{selectedShopkeeper.shopName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Proprietor Name</span>
                <span className="font-bold text-slate-900">{selectedShopkeeper.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Registered Mobile Number</span>
                <span className="font-mono font-bold text-amber-800">{selectedShopkeeper.mobileNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">City / Regional Hub</span>
                <span className="text-slate-800">{selectedShopkeeper.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">FSSAI License ID</span>
                <span className="font-mono font-semibold text-slate-800">{selectedShopkeeper.fssai || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Approval Status</span>
                <Badge
                  variant={
                    selectedShopkeeper.approvalStatus === 'Approved'
                      ? 'success'
                      : selectedShopkeeper.approvalStatus === 'Pending'
                      ? 'warning'
                      : 'danger'
                  }
                >
                  {selectedShopkeeper.approvalStatus}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Account Operational Status</span>
                <Badge variant={selectedShopkeeper.accountStatus === 'Active' ? 'success' : 'danger'}>
                  {selectedShopkeeper.accountStatus}
                </Badge>
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-xl text-amber-900 text-[11px] leading-relaxed">
              <strong>Merchant Credential Security:</strong> Passwords are encrypted directly in Firebase Authentication and are never stored in Firestore or exposed to administrators.
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setSelectedShopkeeper(null)}
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

export default ShopkeeperManagementPage;
