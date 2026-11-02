import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Store, Search, ShieldCheck, Eye, MapPin } from 'lucide-react';
import { MOCK_SHOPKEEPERS } from '../../../utils/mockData';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';

export const ShopkeeperManagementPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const shopkeepers = MOCK_SHOPKEEPERS.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900">Shopkeeper Directory</h1>
          <p className="text-sm text-slate-500 mt-1">
            Registered sweet shop proprietors, verified licenses, and commercial revenue
          </p>
        </div>
        <Link
          to="/admin/shop-approvals"
          className="text-xs font-bold text-purple-700 bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-200"
        >
          Check 1 Pending Approval
        </Link>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-80">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeholder="Search shop or merchant name..."
            />
          </div>
          <span className="text-xs text-slate-400">Total Merchants: {shopkeepers.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-2">Sweet Shop Trade Name</th>
                <th className="py-3 px-2">Proprietor</th>
                <th className="py-3 px-2">City</th>
                <th className="py-3 px-2">FSSAI License</th>
                <th className="py-3 px-2">Active Catalog</th>
                <th className="py-3 px-2">Revenue Generated</th>
                <th className="py-3 px-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shopkeepers.map((sk) => (
                <tr key={sk.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                        <Store className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900">{sk.shopName}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">ID: {sk.id}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 font-medium text-slate-800">{sk.name}</td>
                  <td className="py-3.5 px-2 text-slate-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-400" /> {sk.city}
                  </td>
                  <td className="py-3.5 px-2 font-mono text-slate-600">{sk.fssai}</td>
                  <td className="py-3.5 px-2 font-bold text-slate-800">{sk.productsCount} SKUs</td>
                  <td className="py-3.5 px-2 font-black text-amber-800">{sk.revenue}</td>
                  <td className="py-3.5 px-2">
                    <Badge variant={sk.status === 'Verified' ? 'success' : 'warning'}>
                      {sk.status}
                    </Badge>
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

export default ShopkeeperManagementPage;
