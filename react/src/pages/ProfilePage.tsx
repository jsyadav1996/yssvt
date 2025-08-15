import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { ArrowLeft } from 'lucide-react'
import UserForm from '@/components/UserForm'

export default function ProfilePage () {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  return (
    <div className="bg-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Profile</h1>
            <p className="text-xs sm:text-sm text-gray-600">Manage your account settings</p>
          </div>
        </div>

        {/* User Form Component */}
        <UserForm 
          mode="profile"
          user={user}
        />
      </div>
    </div>
  )
}