import { createContext, useContext, useState, useMemo } from 'react';

/**
 * AuthContext (Phase 1 Placeholder)
 * Manages global authentication state, active user, and role.
 */
export const AuthContext = createContext({
  currentUser: null,
  userRole: null,
  isAuthenticated: false,
  loading: false,
});

export const AuthProvider = ({ children }) => {
  const [currentUser] = useState(null);
  const [userRole] = useState(null); // 'user' | 'shopkeeper' | 'admin'
  const [loading] = useState(false);

  const value = useMemo(
    () => ({
      currentUser,
      userRole,
      isAuthenticated: Boolean(currentUser),
      loading,
    }),
    [currentUser, userRole, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
