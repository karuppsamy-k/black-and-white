import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ShoppingBag, X } from 'lucide-react';
import { getAllProducts } from '../../../services/firebase/firestoreService';
import { useApp } from '../../../context/AppContext';
import Button from '../../../components/common/Button';
import SearchBar from '../../../components/common/SearchBar';
import { CardSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const SearchFilterPage = () => {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(1000);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useApp();

  const categories = ['All', 'Halwa', 'Sweets', 'Savouries', 'Mixture', 'Murukku'];

  useEffect(() => {
    const fetchCatalog = async () => {
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
    fetchCatalog();
  }, []);

  const filtered = products.filter((prod) => {
    const name = prod.name || '';
    const desc = prod.description || '';
    const shop = prod.shopName || '';
    const category = prod.category || '';
    const matchKeyword =
      name.toLowerCase().includes(keyword.toLowerCase()) ||
      desc.toLowerCase().includes(keyword.toLowerCase()) ||
      shop.toLowerCase().includes(keyword.toLowerCase());
    const matchCategory =
      selectedCategory === 'All' || category.toLowerCase() === selectedCategory.toLowerCase();
    const matchPrice = (Number(prod.price) || 0) <= maxPrice;
    return matchKeyword && matchCategory && matchPrice;
  });

  const handleReset = () => {
    setKeyword('');
    setSelectedCategory('All');
    setMaxPrice(1000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-serif font-black text-stone-900">Search & Filter Delicacies</h1>
        <p className="text-sm text-stone-500 mt-1">
          Find your exact traditional sweet or savoury preference by taste, price, and shop
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Filters Sidebar */}
        <div className="lg:col-span-4 bg-white rounded-3xl border border-stone-200/80 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
              <Filter className="w-4 h-4 text-amber-600" />
              <span>Filters</span>
            </div>
            <button
              onClick={handleReset}
              className="text-xs font-semibold text-amber-700 hover:underline"
            >
              Reset All
            </button>
          </div>

          {/* Search Input */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Search Keyword</label>
            <SearchBar
              value={keyword}
              onChange={setKeyword}
              onClear={() => setKeyword('')}
              placeholder="e.g. Halwa, Murukku..."
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-400 uppercase tracking-wider">Category</label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                    selectedCategory.toLowerCase() === cat.toLowerCase()
                      ? 'bg-amber-600 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-stone-400 uppercase tracking-wider">Max Price</span>
              <span className="font-bold text-stone-900">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="50"
              max="1500"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400">
              <span>₹50</span>
              <span>₹1500</span>
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-200">
            <span>
              Showing <strong>{filtered.length}</strong> delicacies
            </span>
            {(keyword || selectedCategory !== 'All' || maxPrice < 1000) && (
              <button
                onClick={handleReset}
                className="text-amber-700 font-semibold hover:underline flex items-center gap-1"
              >
                Clear all filters <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {loading ? (
            <CardSkeleton count={6} className="lg:grid-cols-2" />
          ) : filtered.length === 0 ? (
            <EmptyState
              icon={Search}
              title={products.length === 0 ? 'No Delicacies Listed Yet' : 'No Delicacies Match Your Filter'}
              description={
                products.length === 0
                  ? 'Our artisan confectioneries are currently adding their specialty items. Check back soon!'
                  : 'Try adjusting your search keyword or increasing your maximum price budget.'
              }
              actionLabel={products.length === 0 ? 'Explore Sweet Shops' : 'Reset Filters'}
              onAction={products.length === 0 ? () => (window.location.href = '/user/shops') : handleReset}
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filtered.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
                >
                  <div>
                    <Link to={`/user/products/${prod.id}`} className="block relative h-48 overflow-hidden bg-stone-100">
                      <img
                        src={prod.image || 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=500&auto=format&fit=crop&q=80'}
                        alt={prod.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                      <span className="absolute top-3 left-3 bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {prod.category}
                      </span>
                    </Link>
                    <div className="p-4 space-y-2">
                      <p className="text-[11px] text-stone-400 font-medium">{prod.shopName}</p>
                      <Link to={`/user/products/${prod.id}`}>
                        <h3 className="font-semibold text-stone-900 text-sm hover:text-amber-700 transition line-clamp-1">
                          {prod.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-stone-500 line-clamp-2">{prod.description}</p>
                      <div className="flex items-baseline justify-between pt-2">
                        <span className="text-base font-bold text-stone-900">₹{prod.price}</span>
                        {prod.weight && <span className="text-xs text-stone-400">{prod.weight}</span>}
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
      </div>
    </div>
  );
};

export default SearchFilterPage;
