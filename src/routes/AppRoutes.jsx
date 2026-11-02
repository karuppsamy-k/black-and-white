import { Routes, Route, Link } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleBasedRoute from './RoleBasedRoute';

/**
 * AppRoutes (Phase 1 Routing Configuration)
 * Configures central route hierarchy and module placeholders.
 */
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Root / Home placeholder */}
      <Route
        path="/"
        element={
          <div className="p-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Black&White - Sweets and Snacks</h1>
            <p className="text-gray-600 mb-6">Phase 1: Project Initialization & Architecture</p>
            <div className="flex justify-center gap-4">
              <Link to="/user" className="px-4 py-2 bg-blue-500 text-white rounded">
                User Module
              </Link>
              <Link to="/shopkeeper" className="px-4 py-2 bg-green-500 text-white rounded">
                Shopkeeper Module
              </Link>
              <Link to="/admin" className="px-4 py-2 bg-purple-500 text-white rounded">
                Admin Module
              </Link>
            </div>
          </div>
        }
      />

      {/* Module Placeholders */}
      <Route element={<ProtectedRoute />}>
        {/* User Module */}
        <Route element={<RoleBasedRoute allowedRoles={['user', 'admin']} />}>
          <Route
            path="/user/*"
            element={
              <div className="p-8">
                <h2 className="text-2xl font-semibold">User Module Placeholder</h2>
                <p className="text-gray-600">Routes: Browse shops, products, cart, orders, profile</p>
                <Link to="/" className="text-blue-500 underline mt-4 inline-block">Back Home</Link>
              </div>
            }
          />
        </Route>

        {/* Shopkeeper Module */}
        <Route element={<RoleBasedRoute allowedRoles={['shopkeeper', 'admin']} />}>
          <Route
            path="/shopkeeper/*"
            element={
              <div className="p-8">
                <h2 className="text-2xl font-semibold">Shopkeeper Module Placeholder</h2>
                <p className="text-gray-600">Routes: Shop, products, orders, sales & earnings</p>
                <Link to="/" className="text-blue-500 underline mt-4 inline-block">Back Home</Link>
              </div>
            }
          />
        </Route>

        {/* Admin Module */}
        <Route element={<RoleBasedRoute allowedRoles={['admin']} />}>
          <Route
            path="/admin/*"
            element={
              <div className="p-8">
                <h2 className="text-2xl font-semibold">Admin Module Placeholder</h2>
                <p className="text-gray-600">Routes: User & shopkeeper management, approvals, analytics</p>
                <Link to="/" className="text-blue-500 underline mt-4 inline-block">Back Home</Link>
              </div>
            }
          />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route
        path="*"
        element={
          <div className="p-8 text-center">
            <h2 className="text-xl font-bold">404 - Page Not Found</h2>
            <Link to="/" className="text-blue-500 underline mt-2 inline-block">Back to Home</Link>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
