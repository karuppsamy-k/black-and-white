import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Search, Package, Star } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../../utils/mockData';
import { useApp } from '../../../context/AppContext';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import SearchBar from '../../../components/common/SearchBar';
import ConfirmDialog from '../../../components/common/ConfirmDialog';

export const ProductManagementPage = () => {
  const { showToast } = useApp();
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = () => {
    setProducts(products.filter((p) => p.id !== deleteId));
    setDeleteId(null);
    showToast('Delicacy removed from inventory', 'info');
  };

  const handleToggleStock = (id) => {
    setProducts(
      products.map((p) => {
        if (p.id === id) {
          const nextStatus = p.status === 'In Stock' ? 'Out of Stock' : 'In Stock';
          showToast(`Updated ${p.name} status to ${nextStatus}`, 'success');
          return { ...p, status: nextStatus };
        }
        return p;
      })
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-stone-900">Inventory Management</h1>
          <p className="text-sm text-stone-500 mt-1">
            Monitor product stocks, price points, and active batch availability
          </p>
        </div>
        <Link to="/shopkeeper/products/add">
          <Button variant="primary" icon={PlusCircle}>
            Add New Delicacy
          </Button>
        </Link>
      </div>

      <Card>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
          <div className="w-full sm:w-80">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeholder="Filter by name or category..."
            />
          </div>
          <span className="text-xs text-stone-400">Total items: {filtered.length}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-100 text-stone-400 font-semibold uppercase">
                <th className="py-3 px-2">Delicacy</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Price</th>
                <th className="py-3 px-2">Weight</th>
                <th className="py-3 px-2">Stock Units</th>
                <th className="py-3 px-2">Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((prod) => (
                <tr key={prod.id} className="hover:bg-stone-50/60 transition">
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-3">
                      <img src={prod.image} alt={prod.name} className="w-9 h-9 rounded-lg object-cover flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-stone-900 line-clamp-1">{prod.name}</h4>
                        <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5">
                          <Star className="w-2.5 h-2.5 fill-current" /> {prod.rating} ({prod.reviews})
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 px-2 font-medium text-stone-700">{prod.category}</td>
                  <td className="py-3.5 px-2 font-black text-stone-900">₹{prod.price}</td>
                  <td className="py-3.5 px-2 text-stone-500">{prod.weight}</td>
                  <td className="py-3.5 px-2 font-semibold">
                    <span className={prod.stock < 20 ? 'text-rose-600' : 'text-stone-800'}>
                      {prod.stock} units
                    </span>
                  </td>
                  <td className="py-3.5 px-2">
                    <button
                      onClick={() => handleToggleStock(prod.id)}
                      className="cursor-pointer"
                      title="Click to toggle availability"
                    >
                      <Badge
                        variant={
                          prod.status === 'In Stock'
                            ? 'success'
                            : prod.status === 'Low Stock'
                            ? 'warning'
                            : 'danger'
                        }
                      >
                        {prod.status}
                      </Badge>
                    </button>
                  </td>
                  <td className="py-3.5 px-2 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        to={`/shopkeeper/products/edit/${prod.id}`}
                        className="p-1.5 rounded-lg text-stone-500 hover:text-amber-700 hover:bg-stone-100 transition"
                        title="Edit product"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(prod.id)}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-stone-100 transition"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Delicacy from Inventory?"
        message="This item will no longer appear on your public store menu for customers to purchase."
      />
    </div>
  );
};

export default ProductManagementPage;
