import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Store, Star, Clock, MapPin, Search, ArrowRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { getAllShops } from '../../../services/firebase/firestoreService';
import SearchBar from '../../../components/common/SearchBar';
import Button from '../../../components/common/Button';
import { CardSkeleton } from '../../../components/common/Skeleton';
import EmptyState from '../../../components/common/EmptyState';

export const ShopListingPage = () => {
  const [shops, setShops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');

  const cities = ['All', 'Madurai', 'Tirunelveli', 'Karaikudi', 'Chennai', 'Coimbatore'];

  const fetchShops = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllShops();
      setShops(data);
    } catch (_err) {
      setError('Failed to fetch artisanal sweet shops. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, []);

  const filteredShops = shops.filter((shop) => {
    const name = shop.shopName || shop.name || '';
    const tagline = shop.tagline || '';
    const city = shop.city || '';
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
      city.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCity = selectedCity === 'All' || city.toLowerCase() === selectedCity.toLowerCase();
    return matchesSearch && matchesCity;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-black text-stone-900">Artisanal Sweet Shops</h1>
          <p className="text-sm text-stone-500 mt-1">
            Order authentic delicacies straight from certified South Indian heritage confectioneries
          </p>
        </div>
        <div className="w-full md:w-80">
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            placeholder="Search shops or locations..."
          />
        </div>
      </div>

      {/* City Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-stone-400 uppercase tracking-wider mr-2">City:</span>
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              selectedCity === city
                ? 'bg-amber-600 text-white shadow-sm'
                : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Content Rendering */}
      {error ? (
        <div className="p-8 rounded-3xl bg-red-50 text-red-700 border border-red-200 text-center space-y-3">
          <p className="text-sm font-medium">{error}</p>
          <Button variant="outline" size="sm" onClick={fetchShops} icon={RefreshCw}>
            Retry Loading Shops
          </Button>
        </div>
      ) : loading ? (
        <CardSkeleton count={6} />
      ) : filteredShops.length === 0 ? (
        <EmptyState
          icon={Store}
          title={searchTerm || selectedCity !== 'All' ? 'No Matching Sweet Shops' : 'No Sweet Shops Registered Yet'}
          description={
            searchTerm || selectedCity !== 'All'
              ? 'Try selecting a different city or clearing your search term.'
              : 'Our regional artisan confectionery network is onboarding now. Are you a sweet shop owner? Register to sell on Black & White!'
          }
          actionLabel={searchTerm || selectedCity !== 'All' ? 'Reset Filters' : 'Register Shop'}
          onAction={() => {
            if (searchTerm || selectedCity !== 'All') {
              setSearchTerm('');
              setSelectedCity('All');
            } else {
              window.location.href = '/shopkeeper/register';
            }
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <div
              key={shop.id || shop.uid}
              className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-52 overflow-hidden bg-stone-100">
                  <img
                    src={shop.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&auto=format&fit=crop&q=80'}
                    alt={shop.shopName || shop.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-xs font-medium px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>{shop.deliveryTime || '30-45 mins'}</span>
                  </div>
                  <div className="absolute top-3 right-3 bg-amber-500 text-stone-900 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{shop.rating || '5.0'}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold mb-1">
                    <ShieldCheck className="w-4 h-4" />
                    <span>FSSAI Certified Sweetmaker</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-stone-900 group-hover:text-amber-700 transition">
                    {shop.shopName || shop.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
                    {shop.tagline || 'Artisan South Indian Sweets & Savouries'}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-stone-500 mt-4">
                    <MapPin className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span className="truncate">{shop.location || shop.city}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-stone-100 flex items-center justify-between mt-4">
                <span className="text-xs text-stone-400">{shop.reviewsCount || 0} reviews</span>
                <Link to={`/user/shops/${shop.id || shop.uid}`}>
                  <Button variant="outline" size="sm" icon={ArrowRight} iconPosition="right">
                    View Shop Menu
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

export default ShopListingPage;
