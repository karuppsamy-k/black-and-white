import React, { useState } from 'react';
import { Store, Star, MapPin, Search, Settings } from 'lucide-react';
import { MOCK_SHOPS } from '../../../utils/mockData';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';

export const ShopManagementPage = () => {
  const { showToast } = useApp();
  const [shops, setShops] = useState(MOCK_SHOPS);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = shops.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleShopStatus = (id) => {
    setShops(
      shops.map((s) => {
        if (s.id === id) {
          const next = s.status === 'Active' ? 'Disabled' : 'Active';
          showToast(`Shop "${s.name}" status updated to ${next}`, 'info');
          return { ...s, status: next };
        }
        return s;
      })
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Shop Management</h1>
        <p className="text-sm text-slate-500 mt-1">
          Platform-wide retail control, commission fee structures, and merchant status
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

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-2">Store Details</th>
                <th className="py-3 px-2">City</th>
                <th className="py-3 px-2">Rating & Reviews</th>
                <th className="py-3 px-2">Commission %</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((shop) => (
                <tr key={shop.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-3">
                      <img src={shop.image} alt={shop.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-slate-900">{shop.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">FSSAI: {shop.fssai}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 font-medium text-slate-700">{shop.city}</td>
                  <td className="py-3.5 px-2 text-amber-700 font-bold">
                    ★ {shop.rating} ({shop.reviewsCount})
                  </td>
                  <td className="py-3.5 px-2 font-mono font-bold text-slate-900">5.0% Standard</td>
                  <td className="py-3.5 px-2">
                    <Badge variant={shop.status === 'Active' ? 'success' : 'danger'}>
                      {shop.status}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <button
                      onClick={() => handleToggleShopStatus(shop.id)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${
                        shop.status === 'Active'
                          ? 'text-red-700 border-red-200 hover:bg-red-50'
                          : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                      }`}
                    >
                      {shop.status === 'Active' ? 'Disable' : 'Enable'}
                    </button>
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

export default ShopManagementPage;
