import React, { useState } from 'react';
import { Package, Search, Star, ShieldAlert, Check } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../../utils/mockData';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';

export const ProductManagementPage = () => {
  const { showToast } = useApp();
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleModeration = (id) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          const isFlagged = p.flagged;
          showToast(`Product ${p.name} ${isFlagged ? 'approved' : 'flagged for ingredient review'}`, 'info');
          return { ...p, flagged: !isFlagged };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Product Moderation</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review all sweets, savouries, and halwa listed by merchant partners across the network
        </p>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-80">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeholder="Search product or vendor..."
            />
          </div>
          <span className="text-xs text-slate-400">Total catalog items: {filtered.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                <th className="py-3 px-2">Delicacy Item</th>
                <th className="py-3 px-2">Sweet Shop Vendor</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Price</th>
                <th className="py-3 px-2">Quality Rating</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Compliance Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-slate-50/60 transition">
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-slate-900">{prod.name}</h4>
                        <span className="text-[10px] text-slate-400">{prod.weight} pack</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 font-medium text-slate-800">{prod.shopName}</td>
                  <td className="py-3.5 px-2 text-slate-600">{prod.category}</td>
                  <td className="py-3.5 px-2 font-black text-slate-900">₹{prod.price}</td>
                  <td className="py-3.5 px-2 text-amber-700 font-bold">★ {prod.rating}</td>
                  <td className="py-3.5 px-2">
                    <Badge variant={prod.flagged ? 'danger' : 'success'}>
                      {prod.flagged ? 'Flagged' : 'Approved'}
                    </Badge>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <button
                      onClick={() => handleToggleModeration(prod.id)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition ${
                        prod.flagged
                          ? 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                          : 'text-amber-700 border-amber-200 hover:bg-amber-50'
                      }`}
                    >
                      {prod.flagged ? 'Clear Flag' : 'Flag Quality'}
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

export default ProductManagementPage;
