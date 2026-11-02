import { createContext, useContext, useState, useMemo } from 'react';

/**
 * AppContext (Phase 1 Placeholder)
 * Manages shared application-level state (e.g., theme, global notifications, module status).
 */
export const AppContext = createContext({
  appName: 'Black&White',
  theme: 'light',
});

export const AppProvider = ({ children }) => {
  const [appName] = useState('Black&White');
  const [theme] = useState('light');

  const value = useMemo(
    () => ({
      appName,
      theme,
    }),
    [appName, theme]
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
