import React, { useState } from 'react';
import { Download, MapPin, FileSpreadsheet } from 'lucide-react';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';

export const ReportsAnalyticsPage = () => {
  const { showToast } = useApp();
  const [selectedRange, setSelectedRange] = useState('Quarter 4 (2026)');

  const regions = [
    { city: 'Madurai Hub', volume: '₹2,84,000', orders: 840, share: 42 },
    { city: 'Tirunelveli Hub', volume: '₹1,96,000', orders: 512, share: 29 },
    { city: 'Chennai Hub', volume: '₹1,24,000', orders: 380, share: 19 },
    { city: 'Karaikudi Hub', volume: '₹64,200', orders: 208, share: 10 },
  ];

  const handleExport = (format) => {
    showToast(`Generating ${format} report for ${selectedRange}... Ready for download!`, 'success');
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Platform Reports & Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">
            Regional performance metrics, sales volume distribution, and tax reconciliation
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value)}
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-800"
          >
            <option value="Quarter 4 (2026)">Quarter 4 (2026)</option>
            <option value="Quarter 3 (2026)">Quarter 3 (2026)</option>
            <option value="Full Year 2026">Full Year 2026</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            icon={FileSpreadsheet}
            onClick={() => handleExport('CSV')}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="bg-purple-600 hover:bg-purple-700"
            icon={Download}
            onClick={() => handleExport('PDF')}
          >
            Download PDF
          </Button>
        </div>
      </div>

      {/* Regional Performance Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Regional Hub Distribution">
          <div className="space-y-4">
            {regions.map((reg, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-purple-600" /> {reg.city}
                  </span>
                  <span className="font-bold text-slate-800">
                    {reg.volume} ({reg.orders} orders)
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{ width: `${reg.share}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Delicacy Category Revenue Share">
          <div className="space-y-4">
            {[
              { cat: 'Traditional Wheat Halwa', share: '38%', color: 'bg-amber-600' },
              { cat: 'Pure Ghee Sweets & Mysorepak', share: '32%', color: 'bg-purple-600' },
              { cat: 'Chettinad Murukku & Savouries', share: '20%', color: 'bg-emerald-600' },
              { cat: 'Dry Fruits Confectionery', share: '10%', color: 'bg-sky-600' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`w-3 h-3 rounded-full ${item.color}`}></span>
                  <span className="font-bold text-slate-900">{item.cat}</span>
                </div>
                <span className="font-black text-slate-800">{item.share}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary KPI Footnote */}
      <Card title="Quarterly Tax & Compliance Reconciliations">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block mb-0.5">Total GST Collected (5%)</span>
            <span className="text-lg font-black text-slate-900">₹33,410</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block mb-0.5">Platform Net Commission (5%)</span>
            <span className="text-lg font-black text-purple-700">₹33,410</span>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <span className="text-slate-400 block mb-0.5">Disbursed to Sweet Artisans</span>
            <span className="text-lg font-black text-emerald-700">₹6,01,380</span>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ReportsAnalyticsPage;
