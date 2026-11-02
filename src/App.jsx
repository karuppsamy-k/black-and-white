import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <div className="min-h-screen bg-gray-50 text-gray-900">
            <AppRoutes />
          </div>
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
