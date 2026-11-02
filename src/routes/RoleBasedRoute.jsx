import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * RoleBasedRoute (Placeholder - Phase 1)
 * Enforces role-based access control (RBAC) across User, Shopkeeper, and Admin modules.
 */
export const RoleBasedRoute = ({ allowedRoles = [], redirectPath = '/' }) => {
  const { userRole, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Phase 1 placeholder check
  if (allowedRoles.length > 0 && userRole && !allowedRoles.includes(userRole)) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
