'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { 
  Calendar, 
  Heart, 
  Users, 
  User, 
  Menu, 
  X, 
  LogOut,
  Home
} from 'lucide-react';

export function SidebarDrawer() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      icon: Home,
      label: 'Dashboard',
      href: '/dashboard',
    },
    {
      icon: Calendar,
      label: 'Events',
      href: '/events',
    },
    {
      icon: Heart,
      label: 'Donations',
      href: '/donations',
    },
    {
      icon: Users,
      label: 'Members',
      href: '/members',
    },
    {
      icon: User,
      label: 'Profile',
      href: '/profile',
    },
  ];

  const isActive = (href: string) => {
    if (href === '/dashboard' && pathname === '/dashboard') return true;
    if (href === '/events' && pathname.startsWith('/events')) return true;
    if (href === '/donations' && pathname.startsWith('/donations')) return true;
    if (href === '/members' && pathname.startsWith('/members')) return true;
    if (href === '/profile' && pathname.startsWith('/profile')) return true;
    return false;
  };

  const handleNavigation = (href: string) => {
    router.push(href);
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
    setIsOpen(false);
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
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-primary-600" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-sm text-gray-600">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 active:text-gray-700 p-1"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-4">
          <div className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.href}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                  isActive(item.href)
                    ? 'bg-primary-50 text-primary-700 border border-primary-200'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => handleNavigation(item.href)}
              >
                <item.icon className={`h-5 w-5 ${
                  isActive(item.href) ? 'text-primary-600' : 'text-gray-500'
                }`} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* User Role */}
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Role</span>
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </>
  );
} 