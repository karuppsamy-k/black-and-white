import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Store, MapPin, Phone, RefreshCw } from 'lucide-react';
import { getAllShopkeepers, updateShopkeeperApproval } from '../../../services/firebase/firestoreService';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export const ShopApprovalPage = () => {
  const { showToast } = useApp();
  const [pendingList, setPendingList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const fetchPendingShops = useCallback(async () => {
    setLoading(true);
    try {
      const all = await getAllShopkeepers();
      setPendingList(all.filter((s) => s.approvalStatus === 'Pending'));
    } catch (_err) {
      showToast('Error loading pending approvals from Firestore', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchPendingShops();
  }, [fetchPendingShops]);

  const handleApprove = async (uid, name) => {
    setActionId(uid);
    try {
      await updateShopkeeperApproval(uid, 'Approved', 'Active');
      setPendingList((prev) => prev.filter((s) => s.uid !== uid));
      showToast(`Sweet shop "${name}" approved! Merchant can now sign in to Dashboard.`, 'success');
    } catch (_err) {
      showToast('Failed to approve shopkeeper in Firestore', 'error');
    } finally {
      setActionId(null);
    }
  };

  const handleReject = async (uid, name) => {
    setActionId(uid);
    try {
      await updateShopkeeperApproval(uid, 'Rejected', 'Inactive');
      setPendingList((prev) => prev.filter((s) => s.uid !== uid));
      showToast(`Application for "${name}" rejected.`, 'info');
    } catch (_err) {
      showToast('Failed to reject application', 'error');
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Merchant Shop Approvals</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review incoming sweet shop proprietor registrations, mobile numbers, and FSSAI license compliance
          </p>
        </div>
        <button
          onClick={fetchPendingShops}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {loading ? (
        <div className="py-16">
          <LoadingSpinner text="Checking pending shopkeeper applications in Firestore..." />
        </div>
      ) : pendingList.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No Pending Merchant Approvals</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All registered confectioneries and sweet vendors have been reviewed and verified. New registrations will appear here in real-time.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {pendingList.map((shop) => (
            <Card key={shop.uid} className="border-amber-300 ring-1 ring-amber-200">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{shop.shopName}</h3>
                    <p className="text-xs text-slate-500">
                      Proprietor: <strong className="text-slate-700">{shop.fullName}</strong> • Mobile:{' '}
                      <strong className="text-amber-800 font-mono">{shop.mobileNumber}</strong>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={actionId === shop.uid}
                    className="text-red-700 border-red-200 hover:bg-red-50"
                    onClick={() => handleReject(shop.uid, shop.shopName)}
                  >
                    Reject Application
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    disabled={actionId === shop.uid}
                    className="bg-emerald-600 hover:bg-emerald-700"
                    icon={CheckCircle2}
                    onClick={() => handleApprove(shop.uid, shop.shopName)}
                  >
                    Approve & Issue Merchant Access
                  </Button>
                </div>
              </div>

              {/* Inspection Grid */}
              <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block mb-0.5">FSSAI Registration ID</span>
                  <p className="font-mono font-bold text-slate-800">{shop.fssai || 'N/A'}</p>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">FSSAI Certified</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block mb-0.5">Location & Hub</span>
                  <p className="font-bold text-slate-800">{shop.city || 'Tamil Nadu'}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">Registered on {new Date(shop.createdAt).toLocaleDateString()}</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block mb-0.5">Contact Verification</span>
                  <p className="font-mono font-bold text-slate-800">{shop.mobileNumber}</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">UID: {shop.uid}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopApprovalPage;
