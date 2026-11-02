import React from 'react';
import {
  ShopkeeperLoginPage,
  ShopkeeperRegisterPage,
  ShopkeeperDashboard,
  ShopProfilePage,
  AddProductPage,
  EditProductPage,
  ProductManagementPage,
  ProductListingPage,
  IncomingOrdersPage,
  OrderDetailsPage,
  OrderManagementPage,
  SalesOverviewPage,
  EarningsPage,
  ShopSettingsPage,
  ShopkeeperProfilePage,
} from '../pages';

/**
 * Shopkeeper Module Routes (15 Pages)
 */
export const shopkeeperRoutes = [
  { path: '', element: <ShopkeeperDashboard /> },
  { path: 'dashboard', element: <ShopkeeperDashboard /> },
  { path: 'shop-profile', element: <ShopProfilePage /> },
  { path: 'products', element: <ProductListingPage /> },
  { path: 'products/manage', element: <ProductManagementPage /> },
  { path: 'products/add', element: <AddProductPage /> },
  { path: 'products/edit/:id', element: <EditProductPage /> },
  { path: 'orders/incoming', element: <IncomingOrdersPage /> },
  { path: 'orders/manage', element: <OrderManagementPage /> },
  { path: 'orders/:id', element: <OrderDetailsPage /> },
  { path: 'sales', element: <SalesOverviewPage /> },
  { path: 'earnings', element: <EarningsPage /> },
  { path: 'settings', element: <ShopSettingsPage /> },
  { path: 'profile', element: <ShopkeeperProfilePage /> },
];

export default shopkeeperRoutes;
