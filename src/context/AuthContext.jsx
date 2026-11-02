import { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { auth } from '../services/firebase/firebaseConfig';

/**
 * AuthContext (Phase 2 Enhanced)
 * Manages active user authentication state, current role, and demo role switcher.
 */
export const AuthContext = createContext({
  currentUser: null,
  userRole: null,
  isAuthenticated: false,
  loading: false,
  login: () => {},
  logout: () => {},
  switchRole: () => {},
});

export const AuthProvider = ({ children }) => {
  // Default to a demo user for smooth UI inspection, or allow switching roles
  const [currentUser, setCurrentUser] = useState({
    uid: 'demo-user-101',
    displayName: 'Karuppasamy',
    email: 'karuppu@blackandwhite.in',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    role: 'user',
  });
  const [userRole, setUserRole] = useState('user'); // 'user' | 'shopkeeper' | 'admin'
  const [loading, setLoading] = useState(false);

  const login = useCallback((role = 'user', email = 'karuppu@blackandwhite.in') => {
    setLoading(true);
    setTimeout(() => {
      const newUser = {
        uid: `${role}-101`,
        displayName:
          role === 'admin'
            ? 'Super Administrator'
            : role === 'shopkeeper'
            ? 'Madurai Meenakshi Sweets'
            : 'Karuppasamy',
        email,
        role,
      };
      setCurrentUser(newUser);
      setUserRole(role);
      setLoading(false);
    }, 200);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setUserRole(null);
  }, []);

  const switchRole = useCallback((role) => {
    setUserRole(role);
    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        role,
        displayName:
          role === 'admin'
            ? 'Super Administrator'
            : role === 'shopkeeper'
            ? 'Madurai Meenakshi Sweets'
            : 'Karuppasamy',
      };
    });
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      userRole,
      isAuthenticated: Boolean(currentUser),
      loading,
      login,
      logout,
      switchRole,
      firebaseAuth: auth,
    }),
    [currentUser, userRole, loading, login, logout, switchRole]
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
