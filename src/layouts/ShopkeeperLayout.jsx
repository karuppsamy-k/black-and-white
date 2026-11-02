import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Store,
  Package,
  PlusCircle,
  ListOrdered,
  BellRing,
  TrendingUp,
  Wallet,
  Settings,
  User,
  Menu,
  X,
  LogOut,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ShopkeeperLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [shopOnline, setShopOnline] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, switchRole, logout } = useAuth();

  const menuItems = [
    { name: 'Dashboard', path: '/shopkeeper/dashboard', icon: LayoutDashboard },
    { name: 'Shop Profile', path: '/shopkeeper/shop-profile', icon: Store },
    { name: 'Incoming Orders', path: '/shopkeeper/orders/incoming', icon: BellRing, badge: '3 New' },
    { name: 'Order Management', path: '/shopkeeper/orders/manage', icon: ListOrdered },
    { name: 'Product Catalog', path: '/shopkeeper/products', icon: Package },
    { name: 'Manage Inventory', path: '/shopkeeper/products/manage', icon: Package },
    { name: 'Add New Product', path: '/shopkeeper/products/add', icon: PlusCircle },
    { name: 'Sales Overview', path: '/shopkeeper/sales', icon: TrendingUp },
    { name: 'Earnings & Payouts', path: '/shopkeeper/earnings', icon: Wallet },
    { name: 'Shop Settings', path: '/shopkeeper/settings', icon: Settings },
    { name: 'Owner Profile', path: '/shopkeeper/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
    navigate('/shopkeeper/login');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col md:flex-row font-sans text-stone-900">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 z-50 h-screen w-72 bg-stone-900 text-stone-300 flex flex-col justify-between
          transition-transform duration-300 ease-in-out border-r border-stone-800
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div>
          {/* Brand & Shop Info */}
          <div className="p-5 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-serif font-black text-lg shadow-md">
                B&W
              </div>
              <div>
                <h1 className="font-serif font-bold text-white text-sm tracking-tight leading-tight">
                  Merchant Hub
                </h1>
                <p className="text-[11px] text-amber-400 font-medium">Black&White Partner</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Active Store Indicator */}
          <div className="px-5 py-3 bg-stone-800/60 border-b border-stone-800 flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-semibold text-stone-200 truncate">
                {currentUser?.displayName || 'Madurai Meenakshi Sweets'}
              </p>
              <p className="text-[10px] text-stone-400">FSSAI: 12421008000451</p>
            </div>
            <button
              onClick={() => setShopOnline(!shopOnline)}
              className={`text-[11px] px-2 py-0.5 rounded-full font-medium transition ${
                shopOnline
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/20 text-red-400 border border-red-500/30'
              }`}
            >
              {shopOnline ? 'Online' : 'Closed'}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-220px)] text-sm">
            {menuItems.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                    active
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Portal Switcher */}
        <div className="p-4 border-t border-stone-800 space-y-2 bg-stone-950/40">
          <button
            onClick={() => {
              switchRole('user');
              navigate('/user');
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Switch to Customer Store</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/40 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-stone-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-stone-600 hover:bg-stone-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-base font-bold text-stone-900 leading-tight">Shopkeeper Portal</h2>
              <p className="text-xs text-stone-500">Manage orders, fresh batches, and retail revenue</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/shopkeeper/orders/incoming"
              className="relative p-2 rounded-xl text-stone-600 hover:bg-stone-100 transition"
              title="Incoming Orders"
            >
              <BellRing className="w-5 h-5 text-amber-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-600 ring-2 ring-white"></span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-stone-200">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs">
                MS
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-stone-800">Madurai Sweets</p>
                <p className="text-stone-400 text-[10px]">Verified Merchant</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ShopkeeperLayout;
