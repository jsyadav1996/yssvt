import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import UserForm from '@/components/UserForm'
import { apiClient, User } from '@/lib/api'

const MemberEditPage: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const handleSuccess = () => {
  }

  const handleCancel = () => {
    navigate(`/members/${id}`)
  }

  useEffect(() => {
    const fetchUserData = async () => {  
      if (!id) {
        navigate('/members')
        return
      }
      setError(null)
      const response = await apiClient.getUserById(id)
      try {
        if (response.success && response.data) {
          setUser(response.data)
        } else {
          setError(response.message || 'Failed to load user data')
        }
      } catch (err) {
        setError('Network error occurred')
      } finally {
      }
    }

    fetchUserData()
  }, [])

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => navigate(`/members/${id}`)}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Member</h1>
          <p className="text-sm sm:text-base text-gray-600">Update member information</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
          <p className="text-red-600 text-sm sm:text-base">{error}</p>
        </div>
      )}

      {/* User Form Component */}
      <UserForm 
        mode="edit"
        user={user}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default MemberEditPage 