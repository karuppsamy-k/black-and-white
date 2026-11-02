import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, ArrowRight, Store, LogOut } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

export const UserLayout = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { cartCount, toast } = useApp();
  const { currentUser, isAuthenticated, logout } = useAuth();

  const navLinks = [
    { name: 'Home', path: '/user' },
    { name: 'Browse Shops', path: '/user/shops' },
    { name: 'All Delicacies', path: '/user/products' },
    { name: 'Search & Filter', path: '/user/search' },
    { name: 'My Orders', path: '/user/orders' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/user/login');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-stone-900 font-sans">
      {/* Toast Notification Alert */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-stone-900 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 border border-amber-500/30">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* Top Banner with Clean Shopkeeper Portal Entry (No Admin Links) */}
      <div className="bg-stone-900 text-stone-300 text-xs py-2 px-4 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase">
              Black & White
            </span>
            <span className="hidden sm:inline">Fresh Traditional Sweets, Halwa & Savouries Delivered Direct From Artisans</span>
          </div>
          <div className="flex items-center gap-4 ml-auto text-xs">
            <Link
              to="/shopkeeper/login"
              className="inline-flex items-center gap-1.5 text-amber-400 hover:text-amber-300 font-semibold transition px-2.5 py-1 rounded-md bg-stone-800/80 hover:bg-stone-800 border border-amber-500/30"
            >
              <Store className="w-3.5 h-3.5" />
              <span>Shopkeeper Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header / Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <Link to="/user" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-xl shadow-md group-hover:scale-105 transition-transform overflow-hidden border border-amber-700/30">
              <span className="font-serif tracking-tighter">B&W</span>
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-stone-900 block leading-tight font-serif">
                BLACK & WHITE
              </span>
              <span className="text-[10px] tracking-widest uppercase font-semibold text-amber-700 block">
                Sweets & Snacks
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-amber-50 text-amber-800 font-semibold'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            <Link
              to="/user/search"
              className="p-2.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition hidden sm:inline-flex"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              to="/user/cart"
              className="relative p-2.5 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] font-bold flex items-center justify-center animate-pulse">
                  {cartCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/user/dashboard"
                  className="inline-flex items-center gap-2 pl-3 pr-4 py-2 rounded-full border border-stone-200 hover:border-amber-500 bg-stone-50/50 hover:bg-white text-stone-800 text-sm font-medium transition"
                >
                  <div className="w-6 h-6 rounded-full bg-amber-600/10 text-amber-700 flex items-center justify-center font-bold text-xs">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <span className="max-w-[120px] truncate">{currentUser?.fullName || 'My Account'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-stone-400 hover:text-stone-700"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                to="/user/login"
                className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition shadow-xs"
              >
                <User className="w-3.5 h-3.5" />
                <span>Customer Login</span>
              </Link>
            )}

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-white px-4 py-4 space-y-2 shadow-lg">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
                  location.pathname === link.path
                    ? 'bg-amber-50 text-amber-800 font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-3 border-t border-stone-100 flex flex-col gap-2">
              <Link
                to="/shopkeeper/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 text-sm font-bold text-amber-900 bg-amber-50 rounded-lg border border-amber-200/60"
              >
                <span className="flex items-center gap-2">
                  <Store className="w-4 h-4 text-amber-700" /> Shopkeeper Portal
                </span>
                <ArrowRight className="w-4 h-4 text-amber-700" />
              </Link>

              {isAuthenticated ? (
                <>
                  <Link
                    to="/user/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 text-sm font-medium text-stone-700 bg-stone-50 rounded-lg"
                  >
                    <span>Customer Dashboard ({currentUser?.fullName})</span>
                    <ArrowRight className="w-4 h-4 text-stone-400" />
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="block text-center px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/user/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-center px-4 py-2 text-sm font-medium text-amber-800 bg-amber-100/70 rounded-lg"
                >
                  Customer Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer (No Admin Links) */}
      <footer className="bg-stone-900 text-stone-400 text-sm mt-16 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-serif font-bold text-sm">
                  B&W
                </div>
                <span className="font-serif font-bold text-white text-base">BLACK & WHITE</span>
              </div>
              <p className="text-stone-400 text-xs leading-relaxed">
                Celebrating South India's culinary craft with authentic sweets, slow-stirred halwa, and artisan crisps prepared by master sweetmakers.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li><Link to="/user" className="hover:text-amber-400 transition">Customer Home</Link></li>
                <li><Link to="/user/shops" className="hover:text-amber-400 transition">Authentic Sweet Shops</Link></li>
                <li><Link to="/user/products" className="hover:text-amber-400 transition">Traditional Halwa & Murukku</Link></li>
                <li><Link to="/user/orders" className="hover:text-amber-400 transition">Track My Order</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Sweet Shop Partners</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <Link to="/shopkeeper/login" className="text-amber-400 hover:text-amber-300 font-semibold transition flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5" />
                    <span>Shopkeeper Portal (Partner Login)</span>
                  </Link>
                </li>
                <li><Link to="/shopkeeper/register" className="hover:text-amber-400 transition">Register Your Sweet Shop</Link></li>
                <li><Link to="/user/settings" className="hover:text-amber-400 transition">Customer Preferences</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 text-xs uppercase tracking-wider">Quality Assurance</h4>
              <p className="text-xs text-stone-400 leading-relaxed mb-3">
                100% pure ghee, natural palm jaggery, and certified FSSAI artisanal standards.
              </p>
              <div className="bg-stone-800/80 p-3 rounded-lg border border-stone-700/60 text-stone-300 text-xs">
                <p className="font-medium text-amber-400">Black & White Express Delivery</p>
                <p className="text-[11px] text-stone-400">Available across Tamil Nadu & Southern Hubs</p>
              </div>
            </div>
          </div>
          <div className="pt-8 border-t border-stone-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
            <p>© 2026 Black and White Sweets and Snacks. All rights reserved.</p>
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>FSSAI Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
