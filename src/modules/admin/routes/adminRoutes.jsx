import React from 'react';
import {
  AdminLoginPage,
  AdminDashboard,
  UserManagementPage,
  ShopkeeperManagementPage,
  ShopApprovalPage,
  ShopManagementPage,
  ProductManagementPage,
  OrderManagementPage,
  AdminOrderDetailsPage,
  ReportsAnalyticsPage,
  AdminProfilePage,
  AdminSettingsPage,
} from '../pages';

/**
 * Admin Module Routes (12 Pages)
 */
export const adminRoutes = [
  { path: '', element: <AdminDashboard /> },
  { path: 'dashboard', element: <AdminDashboard /> },
  { path: 'users', element: <UserManagementPage /> },
  { path: 'shopkeepers', element: <ShopkeeperManagementPage /> },
  { path: 'shop-approvals', element: <ShopApprovalPage /> },
  { path: 'shops', element: <ShopManagementPage /> },
  { path: 'products', element: <ProductManagementPage /> },
  { path: 'orders', element: <OrderManagementPage /> },
  { path: 'orders/:id', element: <AdminOrderDetailsPage /> },
  { path: 'reports', element: <ReportsAnalyticsPage /> },
  { path: 'profile', element: <AdminProfilePage /> },
  { path: 'settings', element: <AdminSettingsPage /> },
];

export default adminRoutes;
