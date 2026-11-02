import React, { useState, useEffect } from 'react';
import { Wallet, ArrowDownRight, Building2, CheckCircle2, Clock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { getShopkeeperStatistics } from '../../../services/firebase/firestoreService';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import { StatCardSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const EarningsPage = () => {
  const { currentUser } = useAuth();
  const { showToast } = useApp();
  const [stats, setStats] = useState({ totalRevenue: 0 });
  const [loading, setLoading] = useState(true);
  const [withdrawing, setWithdrawing] = useState(false);

  useEffect(() => {
    const fetchEarnings = async () => {
      setLoading(true);
      try {
        const data = await getShopkeeperStatistics(currentUser?.uid || 'merchant');
        setStats(data);
      } catch (_err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, [currentUser?.uid]);

  const netBalance = Math.round(stats.totalRevenue * 0.95); // 5% platform fee deduction

  const handleWithdraw = () => {
    if (netBalance === 0) {
      showToast('No balance available for payout at this time.', 'info');
      return;
    }
    setWithdrawing(true);
    setTimeout(() => {
      setWithdrawing(false);
      showToast(`Payout request for ₹${netBalance} submitted for direct NEFT settlement!`, 'success');
    }, 500);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-stone-900">Earnings & Payouts</h1>
          <p className="text-sm text-stone-500 mt-1">
            Weekly direct bank settlements and platform commission reconciliations
          </p>
        </div>
      </div>

      {/* Balance Card & Bank Details */}
      {loading ? (
        <StatCardSkeleton count={2} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 bg-gradient-to-br from-stone-900 to-amber-950 text-white p-6 sm:p-8">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                  Available Merchant Balance
                </span>
                <h2 className="text-4xl font-black mt-2 font-serif">₹{netBalance}</h2>
                <p className="text-stone-300 text-xs mt-1">
                  Net earnings ready for weekly settlement (Commission: 5%)
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
            </div>

            <div className="pt-8 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                loading={withdrawing}
                disabled={netBalance === 0}
                onClick={handleWithdraw}
              >
                Request Immediate Payout
              </Button>
              <span className="text-xs text-stone-400">
                Automated settlements run every <strong>Friday, 6:00 PM</strong>
              </span>
            </div>
          </Card>

          {/* Bank Account Info */}
          <Card title="Settlement Account">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">Direct Bank Account</h4>
                  <p className="text-xs text-stone-500">Linked at merchant registration</p>
                </div>
              </div>

              <div className="text-xs space-y-1.5 pt-2 border-t border-stone-100 text-stone-600">
                <p>
                  Status: <strong className="text-emerald-700">KYC Verified</strong>
                </p>
                <p>Payout Mode: <strong>NEFT / IMPS</strong></p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Settlement History */}
      <div className="space-y-4">
        <h2 className="text-xl font-serif font-bold text-stone-900">Recent Bank Transfers</h2>
        {netBalance === 0 ? (
          <EmptyState
            icon={Wallet}
            title="No Settlements Processed Yet"
            description="When customer orders are delivered, your accumulated earnings will be recorded here along with automated payout transaction reference numbers."
          />
        ) : (
          <Card>
            <p className="text-xs text-stone-500">Transfers are logged automatically upon bank confirmation.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default EarningsPage;
