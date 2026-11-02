import React, { useState, useEffect } from 'react';
import { Package, Search, Star, ShieldAlert, Check } from 'lucide-react';
import { getAllProducts } from '../../../services/firebase/firestoreService';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';
import { TableSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (_err) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Product Catalog Audit</h1>
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
          <span className="text-xs text-slate-400">Total Delicacies: {filtered.length}</span>
        </div>

        {loading ? (
          <TableSkeleton rows={5} cols={5} />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Package}
            title={searchTerm ? 'No Products Match Query' : 'No Delicacies Listed in Catalog'}
            description={
              searchTerm
                ? 'Try a different keyword.'
                : 'Products added by approved shopkeepers will appear here for quality auditing.'
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 uppercase font-semibold">
                  <th className="py-3 px-3">Delicacy Name</th>
                  <th className="py-3 px-3">Merchant / Shop</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Price</th>
                  <th className="py-3 px-3">Stock Units</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3.5 px-3 font-bold text-slate-900 flex items-center gap-2.5">
                      <img
                        src={prod.image || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=80&auto=format&fit=crop&q=80'}
                        alt={prod.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                      <span>{prod.name}</span>
                    </td>
                    <td className="py-3.5 px-3 text-slate-600 font-medium">{prod.shopName}</td>
                    <td className="py-3.5 px-3">{prod.category}</td>
                    <td className="py-3.5 px-3 font-bold text-slate-900">₹{prod.price}</td>
                    <td className="py-3.5 px-3">{prod.stock}</td>
                    <td className="py-3.5 px-3">
                      <Badge variant={prod.status === 'In Stock' ? 'success' : 'danger'}>
                        {prod.status}
                      </Badge>
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

export default ProductManagementPage;
