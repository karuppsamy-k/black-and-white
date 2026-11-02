import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  registerCustomer as apiRegisterCustomer,
  loginCustomer as apiLoginCustomer,
  registerShopkeeper as apiRegisterShopkeeper,
  loginShopkeeper as apiLoginShopkeeper,
  loginAdmin as apiLoginAdmin,
  logoutUser as apiLogoutUser,
  subscribeToAuthChanges,
  getStoredSession,
} from '../services/firebase/authService';

/**
 * AuthContext (Phase 3 Complete Authentication & Session Control)
 * Connects Firebase Auth & Firestore with role separation:
 * - Customer ('customer')
 * - Shopkeeper ('shopkeeper')
 * - Admin ('admin')
 */
export const AuthContext = createContext({
  currentUser: null,
  userRole: null,
  isAuthenticated: false,
  loading: true,
  customerRegister: async () => {},
  customerLogin: async () => {},
  shopkeeperLogin: async () => {},
  shopkeeperRegister: async () => {},
  adminLogin: async () => {},
  logout: async () => {},
});

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => getStoredSession());
  const [loading, setLoading] = useState(true);

  // Sync auth state listener on mount
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((user) => {
      setCurrentUser(user);
      setLoading(false);
    });
    return () => unsubscribe && unsubscribe();
  }, []);

  const customerRegister = useCallback(async (data) => {
    setLoading(true);
    try {
      const user = await apiRegisterCustomer(data);
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  }, []);

  const customerLogin = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const user = await apiLoginCustomer(credentials);
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  }, []);

  const shopkeeperLogin = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const user = await apiLoginShopkeeper(credentials);
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  }, []);

  const shopkeeperRegister = useCallback(async (data) => {
    setLoading(true);
    try {
      const user = await apiRegisterShopkeeper(data);
      return user;
    } finally {
      setLoading(false);
    }
  }, []);

  const adminLogin = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const user = await apiLoginAdmin(credentials);
      setCurrentUser(user);
      return user;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await apiLogoutUser();
      setCurrentUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const userRole = currentUser?.role || null;

  const value = useMemo(
    () => ({
      currentUser,
      userRole,
      isAuthenticated: Boolean(currentUser),
      loading,
      customerRegister,
      customerLogin,
      shopkeeperLogin,
      shopkeeperRegister,
      adminLogin,
      logout,
    }),
    [
      currentUser,
      userRole,
      loading,
      customerRegister,
      customerLogin,
      shopkeeperLogin,
      shopkeeperRegister,
      adminLogin,
      logout,
    ]
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
