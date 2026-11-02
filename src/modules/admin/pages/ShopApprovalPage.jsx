import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Store, MapPin, FileText } from 'lucide-react';
import { MOCK_SHOPKEEPERS } from '../../../utils/mockData';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';

export const ShopApprovalPage = () => {
  const { showToast } = useApp();
  const [pendingList, setPendingList] = useState(
    MOCK_SHOPKEEPERS.filter((s) => s.status === 'Pending Approval')
  );

  const handleApprove = (id, name) => {
    setPendingList(pendingList.filter((s) => s.id !== id));
    showToast(`Shop "${name}" has been approved and published to public marketplace!`, 'success');
  };

  const handleReject = (id, name) => {
    setPendingList(pendingList.filter((s) => s.id !== id));
    showToast(`Application for "${name}" rejected`, 'info');
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Merchant Shop Approvals</h1>
        <p className="text-sm text-slate-500 mt-1">
          Verify FSSAI certificates, regional authenticity, and food hygiene compliance
        </p>
      </div>

      {pendingList.length === 0 ? (
        <Card className="p-12 text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
            ✓
          </div>
          <h3 className="font-bold text-slate-900 text-lg">No Pending Approvals</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            All registered confectioneries and sweet vendors have been reviewed and verified.
          </p>
        </Card>
      ) : (
        <div className="space-y-6">
          {pendingList.map((shop) => (
            <Card key={shop.id} className="border-amber-300 ring-1 ring-amber-200">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{shop.shopName}</h3>
                    <p className="text-xs text-slate-500">Proprietor: {shop.name} • {shop.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-700 border-red-200 hover:bg-red-50"
                    onClick={() => handleReject(shop.id, shop.shopName)}
                  >
                    Reject Application
                  </Button>
                  <Button
                    variant="primary"
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700"
                    icon={CheckCircle2}
                    onClick={() => handleApprove(shop.id, shop.shopName)}
                  >
                    Approve & Issue Merchant Badge
                  </Button>
                </div>
              </div>

              {/* Inspection Grid */}
              <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block mb-0.5">FSSAI Registration ID</span>
                  <p className="font-mono font-bold text-slate-800">{shop.fssai}</p>
                  <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Valid through 2029</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block mb-0.5">Location & Hub</span>
                  <p className="font-bold text-slate-800">{shop.city}, Tamil Nadu</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">Hub Code: TN-CBE-04</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-slate-400 block mb-0.5">Initial Catalog Upload</span>
                  <p className="font-bold text-slate-800">{shop.productsCount} Traditional Sweet SKUs</p>
                  <span className="text-[10px] text-slate-500 mt-1 block">Kadalai Mittai, Ellu Urundai</span>
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
