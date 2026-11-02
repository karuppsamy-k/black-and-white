import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { MOCK_SHOPS, MOCK_PRODUCTS } from '../../../utils/mockData';
import { useApp } from '../../../context/AppContext';
import Button from '../../../components/common/Button';

export const ShopDetailsPage = () => {
  const { id } = useParams();
  const { addToCart, showToast } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fallback to first shop if id doesn't match
  const shop = MOCK_SHOPS.find((s) => s.id === id) || MOCK_SHOPS[0];
  const shopProducts = MOCK_PRODUCTS.filter((p) => p.shopId === shop.id || p.shopName === shop.name);
  const productsToDisplay = shopProducts.length > 0 ? shopProducts : MOCK_PRODUCTS.slice(0, 4);

  const categories = ['All', ...new Set(productsToDisplay.map((p) => p.category))];

  const filteredProducts =
    selectedCategory === 'All'
      ? productsToDisplay
      : productsToDisplay.filter((p) => p.category === selectedCategory);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Shop link copied to clipboard!', 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back link */}
      <div>
        <Link to="/user/shops" className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition">
          <ArrowLeft className="w-4 h-4" /> Back to All Sweet Shops
        </Link>
      </div>

      {/* Shop Hero Card */}
      <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-sm">
        <div className="relative h-64 sm:h-80 w-full overflow-hidden">
          <img src={shop.banner || shop.image} alt={shop.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-transparent"></div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={handleShare}
              className="p-2.5 rounded-full bg-stone-900/60 backdrop-blur-md text-white hover:bg-stone-900 transition"
              title="Share Shop"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
          <div className="absolute bottom-6 left-6 right-6 text-white flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="bg-amber-500 text-stone-900 text-xs font-black px-2.5 py-0.5 rounded-full flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-current" /> {shop.rating}
                </span>
                <span className="text-xs text-stone-300">({shop.reviewsCount} reviews)</span>
                <span className="text-xs text-emerald-400 font-medium flex items-center gap-1 ml-2">
                  <ShieldCheck className="w-3.5 h-3.5" /> FSSAI: {shop.fssai}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-black">{shop.name}</h1>
              <p className="text-stone-300 text-xs sm:text-sm mt-1 max-w-2xl">{shop.tagline}</p>
            </div>
            <div className="bg-stone-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-stone-700/80 text-xs text-stone-300 flex items-center gap-2 flex-shrink-0">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Delivers in {shop.deliveryTime}</span>
            </div>
          </div>
        </div>

        <div className="p-6 bg-stone-50/60 border-t border-stone-200/60 flex items-center gap-2 text-xs text-stone-600">
          <MapPin className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>{shop.location}</span>
        </div>
      </div>

      {/* Menu Header & Category Tabs */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-4">
          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900">Today's Fresh Batches</h2>
            <p className="text-xs text-stone-500">Prepared fresh this morning using pure desi ghee</p>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-amber-600 text-white shadow-sm'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <Link to={`/user/products/${prod.id}`} className="block relative h-48 overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-amber-100 text-amber-900 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                    {prod.category}
                  </span>
                </Link>
                <div className="p-4">
                  <Link to={`/user/products/${prod.id}`}>
                    <h3 className="font-semibold text-stone-900 text-sm hover:text-amber-700 transition line-clamp-1">
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
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShopDetailsPage;
