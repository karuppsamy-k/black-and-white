import React, { useState } from 'react';
import { TrendingUp, Calendar, ArrowUpRight, Award, DollarSign } from 'lucide-react';
import Card from '../../../components/common/Card';

export const SalesOverviewPage = () => {
  const [timeframe, setTimeframe] = useState('month');

  const salesByDelicacy = [
    { name: 'Special Tirunelveli Halwa', revenue: '₹48,200', units: '210 boxes', percent: 85 },
    { name: 'Melt-in-Mouth Ghee Mysorepak', revenue: '₹34,800', units: '120 boxes', percent: 68 },
    { name: 'Crispy Butter Murukku', revenue: '₹22,400', units: '172 packs', percent: 52 },
    { name: 'Karaikudi Special Mixture', revenue: '₹14,900', units: '106 packs', percent: 38 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-stone-900">Sales Overview</h1>
          <p className="text-sm text-stone-500 mt-1">
            Revenue trends, popular sweet categories, and peak order hours
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-stone-200">
          {['week', 'month', 'year'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                timeframe === tf ? 'bg-amber-600 text-white' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card>
          <p className="text-xs font-semibold text-stone-400 uppercase">Gross Sales</p>
          <h3 className="text-2xl font-black text-stone-900 mt-1">₹1,45,200</h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% from last period
          </p>
        </Card>

        <Card>
          <p className="text-xs font-semibold text-stone-400 uppercase">Orders Completed</p>
          <h3 className="text-2xl font-black text-stone-900 mt-1">284 Orders</h3>
          <p className="text-[11px] text-stone-500 mt-1">98.5% on-time fulfillment</p>
        </Card>

        <Card>
          <p className="text-xs font-semibold text-stone-400 uppercase">Avg Order Value</p>
          <h3 className="text-2xl font-black text-stone-900 mt-1">₹511</h3>
          <p className="text-[11px] text-stone-500 mt-1">~2.4 boxes per order</p>
        </Card>

        <Card>
          <p className="text-xs font-semibold text-stone-400 uppercase">Repeat Patrons</p>
          <h3 className="text-2xl font-black text-stone-900 mt-1">64%</h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">High customer loyalty</p>
        </Card>
      </div>

      {/* Visual Chart Bars */}
      <Card title="Monthly Revenue Trajectory (₹ in Thousands)">
        <div className="h-64 flex items-end justify-between gap-2 pt-8 px-2 sm:px-6">
          {[
            { month: 'Jun', val: 75, height: '45%' },
            { month: 'Jul', val: 88, height: '52%' },
            { month: 'Aug', val: 110, height: '65%' },
            { month: 'Sep', val: 132, height: '78%' },
            { month: 'Oct', val: 165, height: '95%' },
            { month: 'Nov', val: 145, height: '85%' },
          ].map((bar, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-[10px] font-bold text-stone-600">₹{bar.val}k</span>
              <div
                style={{ height: bar.height }}
                className="w-full max-w-[48px] bg-gradient-to-t from-amber-600 to-amber-400 rounded-t-xl transition-all hover:opacity-90"
              ></div>
              <span className="text-xs font-bold text-stone-700">{bar.month}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Top Performing Delicacies */}
      <Card title="Top Performing Delicacies" subtitle="Ranked by gross sales volume">
        <div className="space-y-4">
          {salesByDelicacy.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-stone-900">{item.name}</span>
                <span className="font-black text-amber-800">{item.revenue} ({item.units})</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-amber-600 h-2.5 rounded-full"
                  style={{ width: `${item.percent}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SalesOverviewPage;
