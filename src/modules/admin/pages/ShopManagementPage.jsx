import React, { useState, useEffect } from 'react';
import { Store, Star, MapPin, Search, Settings } from 'lucide-react';
import { getAllShopkeepers, updateShopkeeperStatus } from '../../../services/firebase/firestoreService';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';
import { TableSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const ShopManagementPage = () => {
  const { showToast } = useApp();
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchShops = async () => {
    setLoading(true);
    try {
      const data = await getAllShopkeepers();
      setShops(data);
    } catch (_err) {
      setShops([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const filtered = shops.filter((s) => {
    const name = s.shopName || s.fullName || '';
    const city = s.city || '';
    return (
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const handleToggleShopStatus = async (uid, currentStatus, shopName) => {
    const next = currentStatus === 'Active' ? 'Inactive' : 'Active';
    try {
      await updateShopkeeperStatus(uid, next);
      setShops((prev) =>
        prev.map((s) => (s.uid === uid ? { ...s, accountStatus: next } : s))
      );
      showToast(`Shop "${shopName}" status updated to ${next}`, 'info');
    } catch (_err) {
      showToast('Error updating shop status', 'error');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Shop Operations & Controls</h1>
        <p className="text-sm text-slate-500 mt-1">
          Platform-wide retail control, status toggles, and operating hubs
        </p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-80">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeholder="Search store name or city..."
            />
          </div>
          <span className="text-xs text-slate-400">Total Live Stores: {filtered.length}</span>
        </div>

        {loading ? (
          <TableSkeleton rows={4} cols={5} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Store}
            title={searchTerm ? 'No Stores Match Query' : 'No Stores Registered Yet'}
            description={
              searchTerm
                ? 'Try adjusting your search criteria.'
                : 'Confectioneries and sweet shops joining the platform will appear here.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-3">Store Details</th>
                  <th className="py-3 px-3">City / Hub</th>
                  <th className="py-3 px-3">Contact</th>
                  <th className="py-3 px-3">Approval</th>
                  <th className="py-3 px-3">Operating Status</th>
                  <th className="py-3 px-3 text-right">Toggle Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((shop) => (
                  <tr key={shop.uid || shop.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
                          <Store className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{shop.shopName || shop.fullName}</h4>
                          <span className="text-[10px] text-slate-400">{shop.fssai ? `FSSAI: ${shop.fssai}` : 'FSSAI Verified'}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 font-medium text-slate-700">{shop.city}</td>
                    <td className="py-3.5 px-3 font-mono text-slate-600">+91 {shop.mobileNumber}</td>
                    <td className="py-3.5 px-3">
                      <Badge variant={shop.approvalStatus === 'Approved' ? 'success' : 'warning'}>
                        {shop.approvalStatus}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3">
                      <Badge variant={shop.accountStatus === 'Active' ? 'success' : 'danger'}>
                        {shop.accountStatus || 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      <button
                        onClick={() => handleToggleShopStatus(shop.uid || shop.id, shop.accountStatus, shop.shopName)}
                        className="text-xs font-semibold text-purple-600 hover:text-purple-800 transition"
                      >
                        Toggle {shop.accountStatus === 'Active' ? 'Deactivate' : 'Activate'}
                      </button>
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

export default ShopManagementPage;
