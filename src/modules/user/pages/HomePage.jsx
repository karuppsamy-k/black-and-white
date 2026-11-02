import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Star,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HeartHandshake,
  Store,
  RefreshCw,
} from 'lucide-react';
import { getAllShops, getAllProducts } from '../../../services/firebase/firestoreService';
import { useApp } from '../../../context/AppContext';
import Button from '../../../components/common/Button';
import { CardSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const HomePage = () => {
  const { addToCart } = useApp();
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Traditional Indian confectionery slideshow images
  const slides = [
    {
      title: 'Tirunelveli Ghee Halwa',
      subtitle: 'Slow-simmered Samba Wheat with pure country ghee',
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Authentic Chettinad Kai Murukku',
      subtitle: 'Handmade spiral savouries using stone-ground rice & butter',
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop&q=80',
    },
    {
      title: 'Royal Ghee Mysorepak',
      subtitle: 'Golden roasted gram flour dissolving in pure cow ghee',
      image: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?w=800&auto=format&fit=crop&q=80',
    },
  ];

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(slideTimer);
  }, [slides.length]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedShops, fetchedProducts] = await Promise.all([
        getAllShops(),
        getAllProducts(),
      ]);
      setShops(fetchedShops);
      setProducts(fetchedProducts);
    } catch (_err) {
      setError('Unable to load latest sweets and shops. Please check connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const categories = [
    { name: 'Traditional Halwa', count: 'Explore', icon: '🍯' },
    { name: 'Pure Ghee Sweets', count: 'Explore', icon: '🥮' },
    { name: 'Chettinad Murukku', count: 'Explore', icon: '🥨' },
    { name: 'Spicy Mixtures', count: 'Explore', icon: '🌶️' },
    { name: 'Dry Fruit Delights', count: 'Explore', icon: '🥜' },
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Banner with Traditional Confectionery Slideshow */}
      <section className="relative overflow-hidden bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 text-white py-16 lg:py-24 px-4 sm:px-6 lg:px-8 rounded-b-3xl shadow-xl">
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold tracking-wider uppercase border border-amber-500/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Authentic Heritage Confectionery Platform</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight">
              South India's Finest <br />
              <span className="text-amber-400">Sweets & Snacks</span> Direct to Your Door.
            </h1>
            <p className="text-stone-300 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Discover artisan Tirunelveli wheat halwa, handmade Chettinad kai murukku, and pure ghee Mysorepak straight from regional master sweetmakers.
            </p>
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <Link to="/user/products">
                <Button variant="primary" size="lg" icon={ShoppingBag}>
                  Explore Sweets Catalog
                </Button>
              </Link>
              <Link to="/user/shops">
                <Button variant="outline" size="lg" className="border-stone-600 text-stone-200 bg-stone-800/80 hover:bg-stone-800 hover:text-white">
                  Browse Sweet Shops
                </Button>
              </Link>
            </div>
            <div className="pt-6 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-stone-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>100% Pure Desi Ghee</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>Zero Preservatives</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400" />
                <span>FSSAI Certified Makers</span>
              </div>
            </div>
          </div>

          {/* Traditional Image Slideshow */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-500 to-amber-700 rounded-3xl blur-lg opacity-40"></div>
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-500/30 bg-stone-900">
                <div className="relative h-80 overflow-hidden">
                  {slides.map((slide, idx) => (
                    <div
                      key={idx}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                      }`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                  ))}
                </div>
                <div className="p-5 bg-stone-900/95 backdrop-blur-md border-t border-stone-800 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif font-bold text-white text-base">
                      {slides[currentSlide].title}
                    </h3>
                    <p className="text-amber-400 text-xs">
                      {slides[currentSlide].subtitle}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setCurrentSlide(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${
                          i === currentSlide ? 'bg-amber-400 w-5' : 'bg-stone-600'
                        }`}
                        aria-label={`Slide ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">Explore by Category</h2>
            <p className="text-sm text-stone-500">Handcrafted South Indian delicacies sorted by tradition</p>
          </div>
          <Link to="/user/products" className="text-amber-700 text-sm font-semibold hover:underline flex items-center gap-1">
            View All Categories <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/user/products?category=${encodeURIComponent(cat.name)}`}
              className="p-4 rounded-2xl bg-white border border-stone-200/80 hover:border-amber-500 hover:shadow-md transition-all group text-center"
            >
              <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">{cat.icon}</div>
              <h4 className="font-bold text-sm text-stone-800 group-hover:text-amber-700">{cat.name}</h4>
              <p className="text-xs text-stone-400 mt-0.5">{cat.count}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Sweet Shops Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">Iconic Heritage Sweet Shops</h2>
            <p className="text-sm text-stone-500">Family-run confectioneries renowned across Tamil Nadu</p>
          </div>
          <Link to="/user/shops" className="text-amber-700 text-sm font-semibold hover:underline flex items-center gap-1">
            Browse All Shops <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {error ? (
          <div className="p-6 rounded-2xl bg-red-50 text-red-700 border border-red-200 flex items-center justify-between">
            <p className="text-sm">{error}</p>
            <Button size="sm" variant="outline" onClick={loadData} icon={RefreshCw}>
              Retry
            </Button>
          </div>
        ) : loading ? (
          <CardSkeleton count={3} />
        ) : shops.length === 0 ? (
          <EmptyState
            icon={Store}
            title="No Sweet Shops Registered Yet"
            description="Our artisan onboarding is currently active. Are you a traditional sweetmaker or confectionery owner? Register your shop today!"
            actionLabel="Register as Shopkeeper"
            onAction={() => (window.location.href = '/shopkeeper/register')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {shops.slice(0, 3).map((shop) => (
              <div
                key={shop.id || shop.uid}
                className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    <img
                      src={shop.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80'}
                      alt={shop.shopName || shop.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      <span>{shop.deliveryTime || '30-45 mins'}</span>
                    </div>
                    <div className="absolute top-3 right-3 bg-amber-500 text-stone-900 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{shop.rating || '5.0'}</span>
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-serif font-bold text-stone-900 group-hover:text-amber-700 transition">
                      {shop.shopName || shop.name}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">{shop.tagline}</p>
                    <p className="text-xs text-amber-800 font-medium mt-3">{shop.location || shop.city}</p>
                  </div>
                </div>
                <div className="p-5 pt-0 border-t border-stone-100 flex items-center justify-between mt-4">
                  <span className="text-xs text-stone-400">{shop.reviewsCount || 0} reviews</span>
                  <Link to={`/user/shops/${shop.id || shop.uid}`}>
                    <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                      View Shop
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-serif font-bold text-stone-900">Today's Trending Delicacies</h2>
            <p className="text-sm text-stone-500">Fresh daily batches prepared with authentic heritage recipes</p>
          </div>
          <Link to="/user/products" className="text-amber-700 text-sm font-semibold hover:underline flex items-center gap-1">
            View All Products <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <CardSkeleton count={4} className="lg:grid-cols-4" />
        ) : products.length === 0 ? (
          <EmptyState
            icon={ShoppingBag}
            title="Catalog Launching Soon"
            description="Our approved confectioneries are preparing their batch recipes. Check back shortly to order delicious sweets and savouries!"
            actionLabel="Explore Sweet Shops"
            onAction={() => (window.location.href = '/user/shops')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((prod) => (
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
                      {prod.weight && (
                        <span className="text-[11px] text-stone-500 ml-auto font-medium">{prod.weight}</span>
                      )}
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
      </section>

      {/* Quality Standards Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-amber-900/90 text-white rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <span className="text-amber-300 text-xs font-bold uppercase tracking-widest">
              The Black & White Artisan Guarantee
            </span>
            <h2 className="text-3xl font-serif font-black">
              Pure Traditional Recipes, Zero Compromise.
            </h2>
            <p className="text-amber-100 text-sm leading-relaxed">
              Every sweet, halwa, and savoury is dispatched straight from certified master craftsmen using stone-ground flours, cold-pressed oils, and farm-fresh pure cow ghee.
            </p>
            <div className="pt-4 flex flex-wrap gap-6 text-xs text-amber-200">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>FSSAI Quality Tested</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-amber-400" />
                <span>Empowering Regional Halwais</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
