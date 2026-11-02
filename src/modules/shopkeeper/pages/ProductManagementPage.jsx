import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Search, Package, RefreshCw } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { useApp } from '../../../context/AppContext';
import { getProductsByShop, deleteProduct, updateProduct } from '../../../services/firebase/firestoreService';
import Card from '../../../components/common/Card';
import Badge from '../../../components/common/Badge';
import Button from '../../../components/common/Button';
import SearchBar from '../../../components/common/SearchBar';
import ConfirmDialog from '../../../components/common/ConfirmDialog';
import { TableSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const ProductManagementPage = () => {
  const { currentUser } = useAuth();
  const { showToast } = useApp();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = currentUser?.uid ? await getProductsByShop(currentUser.uid) : [];
      setProducts(data);
    } catch (_err) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.uid]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteProduct(deleteId);
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      showToast('Delicacy removed from inventory', 'info');
    } catch (_err) {
      showToast('Failed to delete product', 'error');
    } finally {
      setDeleteId(null);
    }
  };

  const handleToggleStock = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'In Stock' ? 'Out of Stock' : 'In Stock';
    try {
      await updateProduct(id, { status: nextStatus });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: nextStatus } : p))
      );
      showToast(`Updated status to ${nextStatus}`, 'success');
    } catch (_err) {
      showToast('Error updating stock status', 'error');
    }
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
        <div className="flex items-center gap-3">
          <Link to="/shopkeeper/products/add">
            <Button variant="primary" icon={PlusCircle}>
              Add New Delicacy
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="w-full sm:w-80">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            placeholder="Search items by name or category..."
          />
        </div>
        <span className="text-xs font-semibold text-stone-400">
          {filtered.length} Items Listed
        </span>
      </div>

      {/* Product Table */}
      {loading ? (
        <TableSkeleton rows={5} cols={5} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title={searchTerm ? 'No Matching Products' : 'No Delicacies in Inventory'}
          description={
            searchTerm
              ? 'Try searching with a different term.'
              : 'You have not added any products yet. Click "Add New Delicacy" to list your first sweet or snack!'
          }
          actionLabel={searchTerm ? 'Clear Search' : 'Add First Delicacy'}
          onAction={() => (searchTerm ? setSearchTerm('') : (window.location.href = '/shopkeeper/products/add'))}
        />
      ) : (
        <Card className="overflow-hidden p-0 border border-stone-200/80">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-stone-700">
              <thead className="bg-stone-50 text-xs uppercase font-bold text-stone-500 border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Delicacy</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price / Pack</th>
                  <th className="py-3 px-4">Available Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filtered.map((prod) => (
                  <tr key={prod.id} className="hover:bg-stone-50/60 transition">
                    <td className="py-3.5 px-4 font-semibold text-stone-900 flex items-center gap-3">
                      <img
                        src={prod.image || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=100&auto=format&fit=crop&q=80'}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover border border-stone-200"
                      />
                      <div>
                        <span>{prod.name}</span>
                        <span className="block text-[11px] text-stone-400 font-normal">{prod.weight || '500g'}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">{prod.category}</td>
                    <td className="py-3.5 px-4 font-bold text-stone-900">₹{prod.price}</td>
                    <td className="py-3.5 px-4">{prod.stock} units</td>
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStock(prod.id, prod.status)}
                        className="cursor-pointer"
                        title="Click to toggle status"
                      >
                        <Badge variant={prod.status === 'In Stock' ? 'success' : 'danger'}>
                          {prod.status}
                        </Badge>
                      </button>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link to={`/shopkeeper/products/edit/${prod.id}`}>
                        <button className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100">
                          <Edit className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => setDeleteId(prod.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Remove Delicacy"
        message="Are you sure you want to permanently delete this product from your inventory catalog?"
        confirmText="Delete"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
};

export default ProductManagementPage;
