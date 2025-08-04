import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useLocation } from 'react-router-dom';
import { SidebarDrawer } from './SidebarDrawer';
import { apiClient } from '@/lib/api';
import { navigationRoutes } from '@/routes';


interface Page {
  children: React.ReactNode;
}

export function Layout({ children }: Page) {
  const { user, login, setLoading } = useAuthStore();
  const location = useLocation();

  // Initialize authentication state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      // Check if we're in a browser environment
      if (typeof window === 'undefined') {
        return;
      }
      
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (token && userData) {
        try {
          setLoading(true);
          // Verify token is still valid by calling the API
          const response = await apiClient.getCurrentUser();
          if (response.success && response.data) {
            login(response.data, token);
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('auth-storage');
          }
        } catch (error) {
          // Token is invalid, clear storage
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          localStorage.removeItem('auth-storage');
        } finally {
          setLoading(false);
        }
      }
    };

    initializeAuth();
  }, [login, setLoading]);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - Always show */}
      <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {/* Show sidebar for all users */}
            <SidebarDrawer />
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {getPageTitle(location.pathname)}
              </h1>
              <p className="text-xs text-gray-500">YSSVT Community</p>
            </div>
          </div>
          {/* Show user avatar only for authenticated users */}
          {user && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600">
                  {user?.firstName?.charAt(0)?.toUpperCase() + user?.lastName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
            </div>
          )}
        </div>
      </header>
      
      {/* Main Content */}
      <main className="px-4 py-4">
        {children}
      </main>
    </div>
  );
}

function getPageTitle(pathname: string): string {
  const route = Object.values(navigationRoutes).find(r => 
    r.path === pathname || 
    (r.path.includes(':') && pathname.startsWith(r.path.split(':')[0]))
  );
  return route?.title || 'YSSVT Community';
} 