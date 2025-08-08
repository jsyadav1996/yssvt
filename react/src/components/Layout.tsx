import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';
import { useLocation } from 'react-router-dom';
import { SidebarDrawer } from './SidebarDrawer';
import { apiClient, User } from '@/lib/api';
import { navigationRoutes } from '@/routes';


interface Page {
  children: React.ReactNode;
}

export function Layout({ children }: Page) {
  const { user, updateUser } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    const reloadProfile = async () => {
      const isReload = performance.navigation.type === 1 || (performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming)?.type === "reload";
      if (isReload && user) {
        // ✅ This block runs only on page reload
        const response = await apiClient.profile()
        updateUser(response.data as User)
      }
    }
    reloadProfile()
  }, []);


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header - Always show */}
      <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
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
              {user.profileImagePath ? (
                <img 
                  src={user.profileImagePath} 
                  alt={`${user.firstName} ${user.lastName}`}
                  className="w-10 h-10 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-primary-200"
                />
              ) : (
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-600">
                    {user?.firstName?.charAt(0)?.toUpperCase() + user?.lastName?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
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