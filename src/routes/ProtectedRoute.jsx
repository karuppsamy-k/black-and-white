import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute (Placeholder - Phase 1)
 * Protects routes requiring authentication.
 */
export const ProtectedRoute = ({ redirectPath = '/login' }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  // Phase 1 placeholder allows pass-through by default if auth not yet configured
  if (!isAuthenticated && redirectPath === null) {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
