import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  Users,
  Store,
  CheckCircle,
  Package,
  ShoppingBag,
  BarChart3,
  Settings,
  Shield,
  Menu,
  X,
  LogOut,
  ExternalLink,
  Building,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { switchRole, logout } = useAuth();

  const adminNav = [
    { name: 'Overview Dashboard', path: '/admin/dashboard', icon: LayoutGrid },
    { name: 'Shop Approvals', path: '/admin/shop-approvals', icon: CheckCircle, badge: '1 Pending' },
    { name: 'Shopkeeper Directory', path: '/admin/shopkeepers', icon: Store },
    { name: 'Shop Management', path: '/admin/shops', icon: Building },
    { name: 'User Management', path: '/admin/users', icon: Users },
    { name: 'Product Catalog Audit', path: '/admin/products', icon: Package },
    { name: 'Master Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Reports & Analytics', path: '/admin/reports', icon: BarChart3 },
    { name: 'Admin Profile', path: '/admin/profile', icon: Shield },
    { name: 'System Settings', path: '/admin/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row font-sans text-slate-900">
      {/* Mobile Drawer Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Admin Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 z-50 h-screen w-72 bg-slate-900 text-slate-300 flex flex-col justify-between
          transition-transform duration-300 ease-in-out border-r border-slate-800
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div>
          {/* Brand & Superadmin Title */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <h1 className="font-bold text-white text-sm tracking-tight leading-tight">
                  Admin Command
                </h1>
                <p className="text-[11px] text-purple-400 font-medium">QuickConnect Master Control</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Platform Status */}
          <div className="px-5 py-2.5 bg-slate-800/60 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-400">System Status:</span>
            <span className="inline-flex items-center gap-1.5 text-emerald-400 font-medium text-[11px]">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              All Services Operational
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-210px)] text-sm">
            {adminNav.map((item) => {
              const active = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium transition-all ${
                    active
                      ? 'bg-purple-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="bg-amber-500 text-slate-900 text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Portal Switcher */}
        <div className="p-4 border-t border-slate-800 space-y-2 bg-slate-950/40">
          <button
            onClick={() => {
              switchRole('user');
              navigate('/user');
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Customer Storefront</span>
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium text-red-400 hover:bg-red-950/40 transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Admin Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">Master Admin Console</h2>
              <p className="text-xs text-slate-500">Global control of Black&White multi-vendor operations</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold text-xs">
                SA
              </div>
              <div className="text-left text-xs">
                <p className="font-semibold text-slate-800">Super Administrator</p>
                <p className="text-purple-600 font-medium text-[10px]">Full Access</p>
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

export default AdminLayout;
