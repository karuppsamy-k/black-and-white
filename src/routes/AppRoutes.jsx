import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import ShopkeeperLayout from '../layouts/ShopkeeperLayout';
import AdminLayout from '../layouts/AdminLayout';
import NotFoundPage from '../pages/NotFoundPage';

// Module route arrays
import { userRoutes } from '../modules/user/routes/userRoutes';
import { shopkeeperRoutes } from '../modules/shopkeeper/routes/shopkeeperRoutes';
import { adminRoutes } from '../modules/admin/routes/adminRoutes';

// Standalone Auth Pages
import { ShopkeeperLoginPage } from '../modules/shopkeeper/pages/ShopkeeperLoginPage';
import { ShopkeeperRegisterPage } from '../modules/shopkeeper/pages/ShopkeeperRegisterPage';
import { AdminLoginPage } from '../modules/admin/pages/AdminLoginPage';

/**
 * AppRoutes (Phase 2 Central Navigation)
 * Connects 43 distinct pages across User, Shopkeeper, and Admin modules with Vercel SPA routing.
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect to Customer Storefront */}
      <Route path="/" element={<Navigate to="/user" replace />} />

      {/* 1. USER MODULE (16 Pages) */}
      <Route path="/user" element={<UserLayout />}>
        {userRoutes.map((r, i) => (
          <Route key={i} path={r.path} element={r.element} />
        ))}
      </Route>

      {/* Standalone Shopkeeper Auth Routes */}
      <Route path="/shopkeeper/login" element={<ShopkeeperLoginPage />} />
      <Route path="/shopkeeper/register" element={<ShopkeeperRegisterPage />} />

      {/* 2. SHOPKEEPER MODULE (Dashboard & Management Pages) */}
      <Route path="/shopkeeper" element={<ShopkeeperLayout />}>
        {shopkeeperRoutes.map((r, i) => (
          <Route key={i} path={r.path} element={r.element} />
        ))}
      </Route>

      {/* Standalone Admin Auth Route */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* 3. ADMIN MODULE (Dashboard & Platform Governance) */}
      <Route path="/admin" element={<AdminLayout />}>
        {adminRoutes.map((r, i) => (
          <Route key={i} path={r.path} element={r.element} />
        ))}
      </Route>

      {/* 404 NOT FOUND ROUTE */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
