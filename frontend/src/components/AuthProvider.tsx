'use client';

import { useAuthStore } from '@/store/auth';
import { usePathname } from 'next/navigation';
import { SidebarDrawer } from './SidebarDrawer';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { isAuthenticated, user } = useAuthStore();
  const pathname = usePathname();

  // Public pages that don't need the sidebar
  const publicPages = ['/', '/login', '/register', '/reset-password', '/verify-email'];
  const isPublicPage = publicPages.includes(pathname);

  // Show sidebar only on authenticated pages
  const shouldShowSidebar = isAuthenticated && !isPublicPage;

  if (shouldShowSidebar) {
    return (
      <div className="min-h-screen bg-gray-50 overflow-x-hidden">
        {/* Mobile Header with Sidebar */}
        <header className="sticky top-0 bg-white border-b border-gray-200 px-4 py-4 z-10">
          <div className="flex items-center space-x-3">
            <SidebarDrawer />
            <h1 className="text-lg font-bold text-gray-900">
              {getPageTitle(pathname)}
            </h1>
          </div>
        </header>
        
        {/* Main Content */}
        <main className="px-4 py-6 pb-20">
          {children}
        </main>
      </div>
    );
  }

  // Public pages without sidebar
  return <>{children}</>;
}

function getPageTitle(pathname: string): string {
  if (pathname === '/dashboard') return 'YSSVT Community';
  if (pathname.startsWith('/events')) return 'Events';
  if (pathname.startsWith('/donations')) return 'Donations';
  if (pathname.startsWith('/members')) return 'Members';
  if (pathname.startsWith('/profile')) return 'Profile';
  if (pathname.startsWith('/settings')) return 'Settings';
  return 'YSSVT Community';
} 