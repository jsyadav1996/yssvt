import { useAuthStore } from '@/store/auth'
import { Calendar, Users, Heart, Settings } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useDashboardStore } from '@/store/dashboard'

export default function DashboardPage() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const { overview } = useDashboardStore()

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const dashboardItems = [
    {
      icon: Calendar,
      title: 'Events',
      description: ['system_admin'].includes(user?.role || '') ? 'View and manage community events' : 'View community events',
      href: '/events',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Heart,
      title: 'Donations',
      description: ['system_admin', 'admin'].includes(user?.role || '') ? 'Make and track donations' : 'View donations',
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
  ]

  return (
    <>
      {/* Welcome Section */}
      <div className="mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
          Welcome back, {user?.firstName || 'Member'}! 👋
        </h2>
        <p className="text-xs sm:text-sm text-gray-600">
          Here's what's happening in your community today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-4 sm:mb-6">
        <div className="card p-2 sm:p-3 text-center">
          <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600 mx-auto mb-1 sm:mb-2" />
          <p className="text-xs text-gray-500 mb-1">Events</p>
          <p className="text-sm sm:text-lg font-bold text-gray-900">{overview.totalEvents}</p>
        </div>
        
        <div className="card p-2 sm:p-3 text-center">
          <Users className="h-4 w-4 sm:h-6 sm:w-6 text-green-600 mx-auto mb-1 sm:mb-2" />
          <p className="text-xs text-gray-500 mb-1">Members</p>
          <p className="text-sm sm:text-lg font-bold text-gray-900">{overview.totalMembers}</p>
        </div>
        
        <div className="card p-2 sm:p-3 text-center">
          <Heart className="h-4 w-4 sm:h-6 sm:w-6 text-red-600 mx-auto mb-1 sm:mb-2" />
          <p className="text-xs text-gray-500 mb-1">Donations</p>
          <p className="text-sm sm:text-lg font-bold text-gray-900">{formatCurrency(overview.totalDonationAmount)}</p>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
        {dashboardItems.map((item, index) => (
          <div
            key={index}
            className="card p-3 sm:p-4 text-center active:bg-gray-50"
            onClick={() => navigate(item.href)}
          >
            <div className={`inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-lg ${item.bgColor} mb-2 sm:mb-3`}>
              <item.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${item.color}`} />
            </div>
            <h3 className="font-medium text-gray-900 text-xs sm:text-sm mb-1">
              {item.title}
            </h3>
            <p className="text-gray-600 text-xs">
              {item.description}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      {/* <div className="card">
        <div className="p-3 sm:p-4 border-b border-gray-100">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-3 sm:p-4">
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-900">
                  New event "Community Meetup" has been created
                </p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-900">
                  Sarah Johnson joined the community
                </p>
                <p className="text-xs text-gray-500">4 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex-shrink-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                </div>
              </div>
              <div className="flex-1">
                <p className="text-xs sm:text-sm text-gray-900">
                  Anonymous donation of $100 received
                </p>
                <p className="text-xs text-gray-500">1 day ago</p>
              </div>
            </div>
          </div>
        </div>
      </div> */}
    </>
  )
} 