import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ShoppingBag, Star, Filter } from 'lucide-react';
import { MOCK_PRODUCTS } from '../../../utils/mockData';
import { useApp } from '../../../context/AppContext';
import Button from '../../../components/common/Button';
import SearchBar from '../../../components/common/SearchBar';

export const ProductListingPage = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('popularity');
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useApp();

  const categories = ['All', 'Halwa', 'Sweets', 'Savouries'];

  const filteredProducts = MOCK_PRODUCTS.filter((prod) => {
    const matchesCategory = selectedCategory === 'All' || prod.category === selectedCategory;
    const matchesSearch =
      prod.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.shopName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'rating') return b.rating - a.rating;
    return b.reviews - a.reviews;
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
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-xs'
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
            className="bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 font-medium outline-none focus:border-amber-600"
          >
            <option value="popularity">Most Popular</option>
            <option value="rating">Highest Rated</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              <Link to={`/user/products/${prod.id}`} className="block relative h-52 overflow-hidden">
                <img
                  src={prod.image}
                  alt={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {prod.category}
                </span>
                <span className="absolute top-3 right-3 bg-amber-500 text-stone-900 text-xs font-black px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="w-3 h-3 fill-current" /> {prod.rating}
                </span>
              </Link>

              <div className="p-5">
                <p className="text-[11px] text-stone-400 font-medium truncate">{prod.shopName}</p>
                <Link to={`/user/products/${prod.id}`}>
                  <h3 className="font-serif font-bold text-stone-900 text-base mt-1 group-hover:text-amber-700 transition line-clamp-1">
                    {prod.name}
                  </h3>
                </Link>
                <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">{prod.description}</p>
                <div className="mt-4 flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold text-stone-900">₹{prod.price}</span>
                    {prod.originalPrice && (
                      <span className="text-xs text-stone-400 line-through">₹{prod.originalPrice}</span>
                    )}
                  </div>
                  <span className="text-xs font-medium text-stone-500">{prod.weight}</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <Button
                fullWidth
                variant="primary"
                size="md"
                onClick={() => addToCart(prod)}
                icon={ShoppingBag}
              >
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductListingPage;
