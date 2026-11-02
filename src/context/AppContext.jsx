import { createContext, useContext, useState, useMemo, useCallback } from 'react';

/**
 * AppContext (Phase 2 Enhanced)
 * Provides application-wide state: Cart items, Active Toasts, and App Metadata.
 */
export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [appName] = useState('Black&White');
  const [theme, setTheme] = useState('light');
  const [toast, setToast] = useState(null); // { type, message }

  // Initial demo cart items
  const [cart, setCart] = useState([
    {
      id: 'prod-1',
      name: 'Special Tirunelveli Halwa',
      shopName: 'Heritage Sweets & Savouries',
      price: 240,
      weight: '500g',
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=300&auto=format&fit=crop&q=80',
    },
    {
      id: 'prod-2',
      name: 'Crispy Butter Murukku',
      shopName: 'Heritage Sweets & Savouries',
      price: 130,
      weight: '250g',
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=300&auto=format&fit=crop&q=80',
    },
  ]);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  }, []);

  const hideToast = useCallback(() => setToast(null), []);

  const addToCart = useCallback((product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
    showToast(`Added ${product.name} to cart!`, 'success');
  }, [showToast]);

  const updateQuantity = useCallback((productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  }, []);

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
    showToast('Item removed from cart', 'info');
  }, [showToast]);

  const clearCart = useCallback(() => setCart([]), []);

  const cartTotal = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const value = useMemo(
    () => ({
      appName,
      theme,
      setTheme,
      toast,
      showToast,
      hideToast,
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount,
    }),
    [
      appName,
      theme,
      toast,
      showToast,
      hideToast,
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartTotal,
      cartCount,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
