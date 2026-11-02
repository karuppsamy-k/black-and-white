import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * ProtectedRoute (Phase 3 Authentication Guard)
 * Ensures user is authenticated before accessing private module areas.
 */
export const ProtectedRoute = ({ redirectPath, requiredRole }) => {
  const { currentUser, isAuthenticated, userRole, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullPage text="Checking authentication status..." />;
  }

  // Determine fallback redirect path based on target path if not explicitly provided
  const fallback =
    redirectPath ||
    (location.pathname.startsWith('/shopkeeper')
      ? '/shopkeeper/login'
      : location.pathname.startsWith('/admin')
      ? '/admin/login'
      : '/user/login');

  if (!isAuthenticated) {
    return <Navigate to={fallback} state={{ from: location }} replace />;
  }

  // If a specific role is required
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to={fallback} replace />;
  }

  // If accessing shopkeeper routes, enforce approval and account status
  if (userRole === 'shopkeeper') {
    if (currentUser?.approvalStatus !== 'Approved' || currentUser?.accountStatus !== 'Active') {
      return <Navigate to="/shopkeeper/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
