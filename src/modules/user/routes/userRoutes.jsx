import React from 'react';
import {
  HomePage,
  RegisterPage,
  LoginPage,
  UserDashboard,
  ShopListingPage,
  ShopDetailsPage,
  ProductListingPage,
  ProductDetailsPage,
  SearchFilterPage,
  CartPage,
  CheckoutPage,
  MyOrdersPage,
  OrderTrackingPage,
  UserProfilePage,
  AddressManagementPage,
  SettingsPage,
} from '../pages';

/**
 * User Module Routes (16 Pages)
 */
export const userRoutes = [
  { path: '', element: <HomePage /> },
  { path: 'register', element: <RegisterPage /> },
  { path: 'login', element: <LoginPage /> },
  { path: 'dashboard', element: <UserDashboard /> },
  { path: 'shops', element: <ShopListingPage /> },
  { path: 'shops/:id', element: <ShopDetailsPage /> },
  { path: 'products', element: <ProductListingPage /> },
  { path: 'products/:id', element: <ProductDetailsPage /> },
  { path: 'search', element: <SearchFilterPage /> },
  { path: 'cart', element: <CartPage /> },
  { path: 'checkout', element: <CheckoutPage /> },
  { path: 'orders', element: <MyOrdersPage /> },
  { path: 'orders/:id/track', element: <OrderTrackingPage /> },
  { path: 'order-tracking', element: <OrderTrackingPage /> },
  { path: 'profile', element: <UserProfilePage /> },
  { path: 'addresses', element: <AddressManagementPage /> },
  { path: 'settings', element: <SettingsPage /> },
];

export default userRoutes;
