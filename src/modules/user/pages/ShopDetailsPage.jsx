import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Clock,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  ArrowLeft,
  Share2,
  Store,
  RefreshCw,
} from 'lucide-react';
import { getShopById, getProductsByShop } from '../../../services/firebase/firestoreService';
import { useApp } from '../../../context/AppContext';
import Button from '../../../components/common/Button';
import { DetailSkeleton, CardSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const ShopDetailsPage = () => {
  const { id } = useParams();
  const { addToCart, showToast } = useApp();
  const [shop, setShop] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchShopData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [shopData, shopProducts] = await Promise.all([
        getShopById(id),
        getProductsByShop(id),
      ]);
      setShop(shopData);
      setProducts(shopProducts);
    } catch (_err) {
      setError('Error loading sweet shop details.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchShopData();
  }, [fetchShopData]);

  const categories = ['All', ...new Set(products.map((p) => p.category).filter(Boolean))];

  const filteredProducts =
    selectedCategory === 'All'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Shop link copied to clipboard!', 'info');
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DetailSkeleton />
      </div>
    );
  }

  if (error || !shop) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={Store}
          title="Sweet Shop Not Found"
          description={error || "The requested sweet shop is currently not available on Black & White."}
          actionLabel="Browse All Sweet Shops"
          onAction={() => (window.location.href = '/user/shops')}
        />
      </div>
    );
  }

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
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-900">
          <img
            src={shop.banner || shop.image || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80'}
            alt={shop.shopName || shop.name}
            className="w-full h-full object-cover"
          />
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

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>FSSAI Certified: {shop.fssai || 'Compliant'}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-serif font-black">{shop.shopName || shop.name}</h1>
              <p className="text-sm text-stone-300 max-w-xl">{shop.tagline}</p>
              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-300 pt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" /> {shop.location || shop.city}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-amber-400" /> Delivery: {shop.deliveryTime || '30-45 mins'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-stone-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-stone-700/60 self-start sm:self-auto">
              <Star className="w-5 h-5 text-amber-400 fill-current" />
              <div>
                <span className="font-black text-base">{shop.rating || '5.0'}</span>
                <span className="text-xs text-stone-400 ml-1">({shop.reviewsCount || 0} reviews)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      {categories.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Products Menu Section */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-serif font-bold text-stone-900">Artisan Menu & Delicacies</h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Freshly prepared daily in certified sanitary kitchens
          </p>
        </div>

        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="No Delicacies Listed Yet"
            description="This confectionery is preparing their recipe batches. Check back soon!"
            actionLabel="Browse Other Sweet Shops"
            onAction={() => (window.location.href = '/user/shops')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((prod) => (
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
                    <Link to={`/user/products/${prod.id}`}>
                      <h3 className="font-semibold text-stone-900 text-sm hover:text-amber-700 transition">
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
  );
};

export default ShopDetailsPage;
