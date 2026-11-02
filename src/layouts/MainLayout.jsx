import { Outlet } from 'react-router-dom';

/**
 * MainLayout (Phase 1 Placeholder)
 */
export const MainLayout = () => {
  return (
    <div className="app-container">
      <Outlet />
    </div>
  );
};

export default MainLayout;
