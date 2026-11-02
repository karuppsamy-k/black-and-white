import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

/**
 * RoleBasedRoute (Phase 3 Strict RBAC Guard)
 * Strictly separates:
 * - 'customer'
 * - 'shopkeeper'
 * - 'admin'
 */
export const RoleBasedRoute = ({ allowedRoles = [], redirectPath = '/user' }) => {
  const { currentUser, userRole, loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage text="Verifying permissions..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectPath} replace />;
  }

  // Check if role is allowed
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to={redirectPath} replace />;
  }

  // Shopkeeper status check
  if (userRole === 'shopkeeper') {
    if (currentUser?.approvalStatus !== 'Approved' || currentUser?.accountStatus !== 'Active') {
      return <Navigate to="/shopkeeper/login" replace />;
    }
  }

  return <Outlet />;
};

export default RoleBasedRoute;
