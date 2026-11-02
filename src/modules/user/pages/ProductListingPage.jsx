import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Star, Filter, RefreshCw } from 'lucide-react';
import { getAllProducts } from '../../../services/firebase/firestoreService';
import { useApp } from '../../../context/AppContext';
import Button from '../../../components/common/Button';
import SearchBar from '../../../components/common/SearchBar';
import { CardSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const ProductListingPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('price-low');
  const [searchTerm, setSearchTerm] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useApp();

  const categories = ['All', 'Halwa', 'Sweets', 'Savouries', 'Mixture', 'Murukku'];

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (_err) {
      setError('Unable to load sweets and savouries catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter((prod) => {
      const name = prod.name || '';
      const shopName = prod.shopName || '';
      const category = prod.category || '';
      const matchesCategory =
        selectedCategory === 'All' || category.toLowerCase() === selectedCategory.toLowerCase();
      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'price-high') return (b.price || 0) - (a.price || 0);
      return (b.rating || 0) - (a.rating || 0);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-stone-900">Traditional Sweets & Snacks</h1>
          <p className="text-sm text-stone-500 mt-1">
            Browse our artisanal catalog of pure ghee sweets, crispy murukku, and slow-stirred halwa
          </p>
        </div>
        <div className="w-full md:w-80">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            placeholder="Search sweets, murukku, halwa..."
          />
        </div>
      </div>

      {/* Filter and Sort Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-amber-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-stone-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
          >
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {error ? (
        <div className="p-8 rounded-3xl bg-red-50 text-red-700 border border-red-200 text-center space-y-3">
          <p className="text-sm font-medium">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchProducts} icon={RefreshCw}>
            Retry Loading Products
          </Button>
        </div>
      ) : loading ? (
        <CardSkeleton count={8} className="lg:grid-cols-4" />
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title={searchTerm || selectedCategory !== 'All' ? 'No Matching Delicacies' : 'No Delicacies Listed Yet'}
          description={
            searchTerm || selectedCategory !== 'All'
              ? 'Try adjusting your search keywords or switching category.'
              : 'Our onboarded confectionery kitchens are preparing their recipes. Products will appear here once listed by merchants!'
          }
          actionLabel={searchTerm || selectedCategory !== 'All' ? 'Reset Filters' : 'Explore Sweet Shops'}
          onAction={() => {
            if (searchTerm || selectedCategory !== 'All') {
              setSearchTerm('');
              setSelectedCategory('All');
            } else {
              window.location.href = '/user/shops';
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <Link to={`/user/products/${prod.id}`} className="block relative h-48 overflow-hidden bg-stone-100">
                  <img
                    src={prod.image || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80'}
                    alt={prod.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {prod.category}
                  </span>
                  {prod.stock <= 5 && prod.stock > 0 && (
                    <span className="absolute top-3 right-3 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                      Only {prod.stock} left
                    </span>
                  )}
                </Link>

                <div className="p-4">
                  <p className="text-[11px] text-stone-400 font-medium">{prod.shopName}</p>
                  <Link to={`/user/products/${prod.id}`}>
                    <h3 className="font-semibold text-stone-900 text-sm mt-1 hover:text-amber-700 transition line-clamp-1">
                      {prod.name}
                    </h3>
                  </Link>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2">{prod.description}</p>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-base font-bold text-stone-900">₹{prod.price}</span>
                    {prod.originalPrice && (
                      <span className="text-xs text-stone-400 line-through">₹{prod.originalPrice}</span>
                    )}
                    <span className="text-[11px] text-stone-500 ml-auto font-medium">{prod.weight}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0">
                <Button
                  fullWidth
                  variant="primary"
                  size="sm"
                  onClick={() => addToCart(prod)}
                  icon={ShoppingBag}
                  disabled={prod.stock === 0}
                >
                  {prod.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductListingPage;
