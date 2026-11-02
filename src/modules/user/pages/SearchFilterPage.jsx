import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, ShoppingBag, X } from 'lucide-react';
import { MOCK_PRODUCTS, MOCK_SHOPS } from '../../../utils/mockData';
import { useApp } from '../../../context/AppContext';
import Button from '../../../components/common/Button';
import SearchBar from '../../../components/common/SearchBar';

export const SearchFilterPage = () => {
  const [keyword, setKeyword] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [maxPrice, setMaxPrice] = useState(500);
  const [minRating, setMinRating] = useState(0);
  const { addToCart } = useApp();

  const categories = ['All', 'Halwa', 'Sweets', 'Savouries'];

  const filtered = MOCK_PRODUCTS.filter((prod) => {
    const matchKeyword =
      prod.name.toLowerCase().includes(keyword.toLowerCase()) ||
      prod.description.toLowerCase().includes(keyword.toLowerCase()) ||
      prod.shopName.toLowerCase().includes(keyword.toLowerCase());
    const matchCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchPrice = prod.price <= maxPrice;
    const matchRating = prod.rating >= minRating;
    return matchKeyword && matchCategory && matchPrice && matchRating;
  });

  const handleReset = () => {
    setKeyword('');
    setSelectedCategory('All');
    setMaxPrice(500);
    setMinRating(0);
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

          {/* Search bar */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Search Keyword</label>
            <SearchBar
              value={keyword}
              onChange={setKeyword}
              onClear={() => setKeyword('')}
              placeholder="e.g. Halwa, Mysorepak, Murukku..."
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Category</label>
            <div className="space-y-1.5">
              {categories.map((cat) => (
                <label key={cat} className="flex items-center gap-2.5 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    checked={selectedCategory === cat}
                    onChange={() => setSelectedCategory(cat)}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <span>{cat}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-stone-700 uppercase tracking-wider">
              <span>Max Price</span>
              <span className="text-amber-700">₹{maxPrice}</span>
            </div>
            <input
              type="range"
              min="100"
              max="600"
              step="20"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400">
              <span>₹100</span>
              <span>₹600</span>
            </div>
          </div>

          {/* Minimum Rating */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">Minimum Rating</label>
            <div className="flex gap-2">
              {[0, 4.5, 4.7, 4.8].map((rt) => (
                <button
                  key={rt}
                  onClick={() => setMinRating(rt)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 border transition ${
                    minRating === rt
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                  }`}
                >
                  <Star className="w-3 h-3 fill-current" />
                  <span>{rt === 0 ? 'All' : `${rt}+`}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>
              Showing <strong className="text-stone-900">{filtered.length}</strong> delicacies found
            </span>
            {(keyword || selectedCategory !== 'All' || maxPrice < 500 || minRating > 0) && (
              <span className="text-amber-700 font-medium">Filters Applied</span>
            )}
          </div>

          {filtered.length === 0 ? (
            <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center space-y-3">
              <div className="text-3xl">🔍</div>
              <h3 className="font-bold text-stone-800 text-base">No delicacies match your filter criteria</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                Try widening your price range or resetting filters to browse all available traditional items.
              </p>
              <Button size="sm" variant="outline" onClick={handleReset}>
                Reset Search Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg transition flex flex-col justify-between"
                >
                  <div>
                    <Link to={`/user/products/${prod.id}`} className="block relative h-44 overflow-hidden">
                      <img src={prod.image} alt={prod.name} className="w-full h-full object-cover" />
                      <span className="absolute top-2.5 right-2.5 bg-amber-500 text-stone-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3 fill-current" /> {prod.rating}
                      </span>
                    </Link>
                    <div className="p-4">
                      <p className="text-[10px] text-stone-400 font-medium truncate">{prod.shopName}</p>
                      <Link to={`/user/products/${prod.id}`}>
                        <h4 className="font-semibold text-stone-900 text-sm mt-0.5 hover:text-amber-700 line-clamp-1">
                          {prod.name}
                        </h4>
                      </Link>
                      <div className="mt-2.5 flex items-baseline justify-between">
                        <span className="text-base font-bold text-stone-900">₹{prod.price}</span>
                        <span className="text-xs text-stone-400">{prod.weight}</span>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 pt-0">
                    <Button
                      fullWidth
                      size="sm"
                      variant="primary"
                      onClick={() => addToCart(prod)}
                      icon={ShoppingBag}
                    >
                      Add to Cart
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
