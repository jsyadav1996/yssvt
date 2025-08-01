import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { ArrowLeft } from 'lucide-react'
import UserForm from '@/components/UserForm'

export default function ProfilePage () {
  const navigate = useNavigate()
  const { user } = useAuthStore()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600">Manage your account settings</p>
        </div>
      </div>

      {/* User Form Component */}
      <UserForm 
        mode="profile"
        userId={user?._id}
      />
    </div>
  )
}