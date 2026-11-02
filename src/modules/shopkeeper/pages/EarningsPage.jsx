import React, { useState } from 'react';
import { Wallet, ArrowDownRight, Building2, CheckCircle2, Clock } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';

export const EarningsPage = () => {
  const { showToast } = useApp();
  const [loading, setLoading] = useState(false);

  const settlements = [
    { id: 'PAY-8841', date: '2026-10-31', amount: '₹42,800', status: 'Settled', bank: 'HDFC Bank ****4102' },
    { id: 'PAY-8210', date: '2026-10-24', amount: '₹38,200', status: 'Settled', bank: 'HDFC Bank ****4102' },
    { id: 'PAY-7901', date: '2026-10-17', amount: '₹35,100', status: 'Settled', bank: 'HDFC Bank ****4102' },
  ];

  const handleWithdraw = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Payout request for ₹28,450 submitted for direct NEFT settlement!', 'success');
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-gradient-to-br from-stone-900 to-amber-950 text-white p-6 sm:p-8">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                Available Merchant Balance
              </span>
              <h2 className="text-4xl font-black mt-2 font-serif">₹28,450</h2>
              <p className="text-stone-300 text-xs mt-1">
                Net earnings ready for weekly settlement (Commission deducted: 5%)
              </p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center">
              <Wallet className="w-6 h-6" />
            </div>
          </div>

          <div className="pt-8 flex flex-wrap items-center gap-4">
            <Button variant="primary" loading={loading} onClick={handleWithdraw}>
              Request Immediate Payout
            </Button>
            <span className="text-xs text-stone-400">
              Next scheduled automated payout: <strong>Friday, 6:00 PM</strong>
            </span>
          </div>
        </Card>

        <Card title="Settlement Bank Account">
          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2 text-stone-900 font-bold">
              <Building2 className="w-4 h-4 text-amber-700" />
              <span>HDFC Bank Ltd.</span>
            </div>
            <p className="text-stone-600">Account No: <strong>501004294102</strong></p>
            <p className="text-stone-600">IFSC Code: <strong>HDFC0000122</strong></p>
            <p className="text-stone-600">Branch: <strong>Madurai Main Branch</strong></p>
            <div className="pt-2">
              <Badge variant="success">Verified for Automated NEFT</Badge>
            </div>
          </div>
        </Card>
      </div>

      {/* Settlement History Table */}
      <Card title="Settlement Payout History">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 uppercase font-semibold">
                <th className="py-3 px-2">Payout Reference</th>
                <th className="py-3 px-2">Date</th>
                <th className="py-3 px-2">Settlement Target</th>
                <th className="py-3 px-2">Transferred Amount</th>
                <th className="py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {settlements.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/60 transition">
                  <td className="py-3.5 px-2 font-mono font-bold text-stone-900">{item.id}</td>
                  <td className="py-3.5 px-2 text-stone-500">{item.date}</td>
                  <td className="py-3.5 px-2 text-stone-700">{item.bank}</td>
                  <td className="py-3.5 px-2 font-black text-emerald-700">{item.amount}</td>
                  <td className="py-3.5 px-2">
                    <Badge variant="success">{item.status}</Badge>
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

export default EarningsPage;
