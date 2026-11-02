import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Package, Search } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import { getProductsByShop } from '../../../services/firebase/firestoreService';
import Button from '../../../components/common/Button';
import Badge from '../../../components/common/Badge';
import SearchBar from '../../../components/common/SearchBar';
import { CardSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const ProductListingPage = () => {
  const { currentUser } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCatalog = async () => {
      setLoading(true);
      try {
        const data = currentUser?.uid ? await getProductsByShop(currentUser.uid) : [];
        setProducts(data);
      } catch (_err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCatalog();
  }, [currentUser?.uid]);

  const filtered = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-stone-900">Product Catalog</h1>
          <p className="text-sm text-stone-500 mt-1">
            Visual showcase of all traditional delicacies published under your store
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/shopkeeper/products/add">
            <Button variant="primary" icon={PlusCircle}>
              Add Product
            </Button>
          </Link>
        </div>
      </div>

      <div className="w-full sm:w-80">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Search products..."
        />
      </div>

      {/* Grid of Store Products */}
      {loading ? (
        <CardSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title={searchTerm ? 'No Matching Products' : 'Catalog is Currently Empty'}
          description={
            searchTerm
              ? 'Try searching with another keyword.'
              : 'You have not added any traditional sweets or snacks to your store catalog yet.'
          }
          actionLabel={searchTerm ? 'Clear Search' : 'Add First Delicacy'}
          onAction={() => (searchTerm ? setSearchTerm('') : (window.location.href = '/shopkeeper/products/add'))}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={prod.image || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80'}
                    alt={prod.name}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                    {prod.category}
                  </span>
                </div>
                <div className="p-5 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif font-bold text-base text-stone-900">{prod.name}</h3>
                    <Badge variant={prod.status === 'In Stock' ? 'success' : 'danger'}>
                      {prod.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-stone-500 line-clamp-2">{prod.description}</p>
                  <div className="pt-2 flex items-baseline justify-between">
                    <span className="text-lg font-black text-stone-900">₹{prod.price}</span>
                    <span className="text-xs text-stone-400 font-medium">Stock: {prod.stock}</span>
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between mt-4">
                <span className="text-xs text-stone-400 font-medium">{prod.weight || '500g'} pack</span>
                <Link to={`/shopkeeper/products/edit/${prod.id}`}>
                  <Button size="sm" variant="outline" icon={Edit}>
                    Edit
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;
