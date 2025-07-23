'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { Calendar, Users, Heart, Settings, LogOut, User } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const dashboardItems = [
    {
      icon: Calendar,
      title: 'Events',
      description: 'View and manage community events',
      href: '/events',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Heart,
      title: 'Donations',
      description: 'Make and track donations',
      href: '/donations',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      icon: Users,
      title: 'Members',
      description: 'Connect with community members',
      href: '/members',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: Settings,
      title: 'Profile',
      description: 'Manage your account settings',
      href: '/profile',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">
          Welcome back, {user?.firstName}! 👋
        </h2>
        <p className="text-gray-600 text-sm">
          Here's what's happening in your community today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="card p-3 text-center">
          <Calendar className="h-6 w-6 text-blue-600 mx-auto mb-2" />
          <p className="text-xs text-gray-500 mb-1">Events</p>
          <p className="text-lg font-bold text-gray-900">5</p>
        </div>
        
        <div className="card p-3 text-center">
          <Users className="h-6 w-6 text-green-600 mx-auto mb-2" />
          <p className="text-xs text-gray-500 mb-1">Members</p>
          <p className="text-lg font-bold text-gray-900">127</p>
        </div>
        
        <div className="card p-3 text-center">
          <Heart className="h-6 w-6 text-red-600 mx-auto mb-2" />
          <p className="text-xs text-gray-500 mb-1">Donations</p>
          <p className="text-lg font-bold text-gray-900">$12k</p>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {dashboardItems.map((item, index) => (
          <div
            key={index}
            className="card p-4 text-center active:bg-gray-50"
            onClick={() => router.push(item.href)}
          >
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-lg ${item.bgColor} mb-3`}>
              <item.icon className={`h-5 w-5 ${item.color}`} />
            </div>
            <h3 className="font-medium text-gray-900 text-sm mb-1">
              {item.title}
            </h3>
            <p className="text-gray-600 text-xs">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="p-4 border-b border-gray-100">
          <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  New event "Community Meetup" has been created
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-4 w-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Sarah Johnson joined the community
                </p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="h-4 w-4 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  Anonymous donation of $100 received
                </p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 