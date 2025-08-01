import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';
import { 
  Menu, 
  X, 
  LogOut,
  Download
} from 'lucide-react';
import { navigationRoutes } from '@/routes';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function SidebarDrawer() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);

  const navItems = navigationRoutes.filter(item => item.requiresAuth ? !!user : true);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      console.log('🎉 Install prompt available!');
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Listen for appinstalled event
    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
      console.log('✅ PWA installed successfully!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const isActive = (href: string) => {
    if (href === '/dashboard' && location.pathname === '/dashboard') return true;
    if (href === '/events' && location.pathname.startsWith('/events')) return true;
    if (href === '/donations' && location.pathname.startsWith('/donations')) return true;
    if (href === '/members' && location.pathname.startsWith('/members')) return true;
    if (href === '/profile' && location.pathname.startsWith('/profile')) return true;
    if (href === '/' && location.pathname === '/') return true;
    if (href === '/login' && location.pathname === '/login') return true;
    if (href === '/register' && location.pathname === '/register') return true;
    return false;
  };

  const handleNavigation = (href: string) => {
    navigate(href);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleInstallApp = async () => {
    if (!deferredPrompt) {
      console.log('No install prompt available');
      return;
    }

    try {
      console.log('🚀 Showing install prompt...');
      await deferredPrompt.prompt();

      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === 'accepted') {
        console.log('✅ User accepted the install prompt');
        setIsInstalled(true);
      } else {
        console.log('❌ User dismissed the install prompt');
      }

      setDeferredPrompt(null);
    } catch (error) {
      console.error('❌ Error during installation:', error);
    }
  };

  return (
    <>
      {/* Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-500 active:text-gray-700 p-2"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out pointer-events-none ${
        isOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full'
      }`}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {user && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {user?.firstName?.charAt(0)?.toUpperCase() + user?.lastName?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">
                  {`${user?.firstName} ${user?.lastName}`}
                </h2>
                <p className="text-sm text-gray-600">
                  {user?.email}
                </p>
                <p className="text-sm text-gray-600">
                  { user.role?.charAt(0).toUpperCase() + user.role?.slice(1) }
                </p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 active:text-gray-700 p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Install App Button - Show when available and not installed */}
        {deferredPrompt && !isInstalled && (
          <div className="p-4 border-b border-gray-200">
            <button
              onClick={handleInstallApp}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left bg-green-50 text-green-700 hover:bg-green-100 transition-colors border border-green-200"
            >
              <Download className="h-5 w-5" />
              <span className="font-medium">Install App</span>
            </button>
          </div>
        )}

        {/* Navigation Items - Same for all users */}
        <nav className="p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <span className={`h-5 w-5 flex items-center justify-center ${
                  isActive(item.path) ? 'text-primary-600' : 'text-gray-500'
                }`}>
                  {navigationRoutes.find(r => r.path === item.path)?.icon || '📄'}
                </span>
                <span className="font-medium">{item.title}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Logout Button - Only for authenticated users */}
        {user ? (
          <div className="p-4 border-t border-gray-200 mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Sign Out</span>
            </button>
          </div>
        ) : (
          <div className="p-4 border-t border-gray-200 mt-auto">
            <button
              onClick={() => handleNavigation('/login')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-green-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Login</span>
            </button>
            <button
              onClick={() => handleNavigation('/register')}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-green-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Register</span>
            </button>
          </div>
        )}
      </div>
    </>
  );
} 