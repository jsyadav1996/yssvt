import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import UserForm from '@/components/UserForm'

const MemberAddPage: React.FC = () => {
  const navigate = useNavigate()

  const handleSuccess = () => {
    // Navigate back to members list after successful creation
    navigate('/members')
  }

  const handleCancel = () => {
    navigate('/members')
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => navigate('/members')}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Add New Member</h1>
          <p className="text-sm sm:text-base text-gray-600">Create a new community member</p>
        </div>
      </div>

      {/* User Form Component */}
      <UserForm 
        mode="add"
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default MemberAddPage 