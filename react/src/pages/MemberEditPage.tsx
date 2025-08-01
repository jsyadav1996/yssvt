import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import UserForm from '@/components/UserForm'

const MemberEditPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const handleSuccess = () => {
    // Navigate back to member detail page after successful update
    navigate(`/members/${id}`)
  }

  const handleCancel = () => {
    navigate(`/members/${id}`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(`/members/${id}`)}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Member</h1>
          <p className="text-gray-600">Update member information</p>
        </div>
      </div>

      {/* User Form Component */}
      <UserForm 
        mode="edit"
        userId={id}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}

export default MemberEditPage 