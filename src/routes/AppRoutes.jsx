import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import UserLayout from '../layouts/UserLayout';
import ShopkeeperLayout from '../layouts/ShopkeeperLayout';
import AdminLayout from '../layouts/AdminLayout';
import NotFoundPage from '../pages/NotFoundPage';
import ProtectedRoute from './ProtectedRoute';

// Module route arrays
import { userRoutes } from '../modules/user/routes/userRoutes';
import { shopkeeperRoutes } from '../modules/shopkeeper/routes/shopkeeperRoutes';
import { adminRoutes } from '../modules/admin/routes/adminRoutes';

// Standalone Auth Pages
import { ShopkeeperLoginPage } from '../modules/shopkeeper/pages/ShopkeeperLoginPage';
import { ShopkeeperRegisterPage } from '../modules/shopkeeper/pages/ShopkeeperRegisterPage';
import { AdminLoginPage } from '../modules/admin/pages/AdminLoginPage';

/**
 * AppRoutes (Phase 3 Strict RBAC & Session Protection)
 * - Customer Module: Public & customer authenticated navigation
 * - Shopkeeper Module: Requires approved and active shopkeeper credentials
 * - Admin Module: Accessible exclusively via /admin/login for authorized superadministrators
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root redirect to Customer Storefront */}
      <Route path="/" element={<Navigate to="/user" replace />} />

      {/* 1. CUSTOMER MODULE (16 Pages) */}
      <Route path="/user" element={<UserLayout />}>
        {userRoutes.map((r, i) => (
          <Route key={i} path={r.path} element={r.element} />
        ))}
      </Route>

      {/* Standalone Shopkeeper Auth Entry Routes */}
      <Route path="/shopkeeper/login" element={<ShopkeeperLoginPage />} />
      <Route path="/shopkeeper/register" element={<ShopkeeperRegisterPage />} />

      {/* 2. SHOPKEEPER MODULE (Protected Dashboard & Inventory Routes) */}
      <Route element={<ProtectedRoute requiredRole="shopkeeper" redirectPath="/shopkeeper/login" />}>
        <Route path="/shopkeeper" element={<ShopkeeperLayout />}>
          {shopkeeperRoutes.map((r, i) => (
            <Route key={i} path={r.path} element={r.element} />
          ))}
        </Route>
      </Route>

      {/* Standalone Admin Auth Entry Route */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* 3. ADMIN MODULE (Protected Governance & Approvals Console) */}
      <Route element={<ProtectedRoute requiredRole="admin" redirectPath="/admin/login" />}>
        <Route path="/admin" element={<AdminLayout />}>
          {adminRoutes.map((r, i) => (
            <Route key={i} path={r.path} element={r.element} />
          ))}
        </Route>
      </Route>

      {/* 404 NOT FOUND ROUTE */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
