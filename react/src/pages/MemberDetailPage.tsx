import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { apiClient, User } from '@/lib/api'
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, Shield, Users } from 'lucide-react'

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user: currentUser } = useAuthStore()
  const [member, setMember] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMember = async () => {
      if (!id) {
        setError('Member ID not found')
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const response = await apiClient.getUserById(id)
        
        if (response.success && response.data) {
          setMember(response.data)
        } else {
          setError(response.message || 'Failed to load member details')
        }
      } catch (err) {
        setError('Network error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchMember()
  }, [id])

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'manager': return 'bg-blue-100 text-blue-800'
      case 'member': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const canEdit = currentUser?.role === 'admin' || currentUser?.role === 'manager' || currentUser?.id === id

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Member Details</h1>
            <p className="text-sm sm:text-base text-gray-600">Loading member information...</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="animate-pulse space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 sm:h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !member) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Member Details</h1>
            <p className="text-sm sm:text-base text-gray-600">Error loading member</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 text-center">
          <p className="text-red-600 mb-3 sm:mb-4 text-sm sm:text-base">{error || 'Member not found'}</p>
          <button 
            onClick={() => navigate(-1)}
            className="btn-primary text-sm sm:text-base"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Member Details</h1>
            <p className="text-sm sm:text-base text-gray-600">View member information</p>
          </div>
        </div>
        
        {canEdit && (
          <button
            onClick={() => navigate(`/members/${id}/edit`)}
            className="btn-primary flex items-center gap-2 text-sm sm:text-base"
          >
            <Edit className="h-4 w-4" />
            <span>Edit Member</span>
          </button>
        )}
      </div>

      {/* Member Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
        {/* Profile Header */}
        <div className="flex items-center gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary-100 rounded-full flex items-center justify-center">
            <span className="text-primary-600 text-lg sm:text-2xl font-bold">
              {member.firstName.charAt(0)}{member.lastName.charAt(0)}
            </span>
          </div>
          <div className="flex-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              {member.firstName} {member.lastName}
            </h2>
            <p className="text-sm sm:text-base text-gray-600">{member.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${getRoleColor(member.role)}`}>
                <Shield className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary-600" />
              Contact Information
            </h3>
            
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                <div>
                  <p className="text-xs sm:text-sm text-gray-600">Email</p>
                  <p className="text-sm sm:text-base text-gray-900">{member.email}</p>
                </div>
              </div>
              
              {member.phone && (
                <div className="flex items-center gap-2 sm:gap-3">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Phone</p>
                    <p className="text-sm sm:text-base text-gray-900">{member.phone}</p>
                  </div>
                </div>
              )}
              
              {member.address && (
                <div className="flex items-start gap-2 sm:gap-3">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600">Address</p>
                    <p className="text-sm sm:text-base text-gray-900">{member.address}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-primary-600" />
              Account Information
            </h3>
            
            <div className="space-y-2 sm:space-y-3">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Member ID</p>
                <p className="text-sm sm:text-base text-gray-900 font-mono">{member.id}</p>
              </div>
              
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Role</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </span>
              </div>
              
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Joined</p>
                <p className="text-sm sm:text-base text-gray-900">{formatDate(member.createdAt)}</p>
              </div>
              
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Last Updated</p>
                <p className="text-sm sm:text-base text-gray-900">{formatDate(member.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-4 pt-4 sm:pt-6 border-t border-gray-200 mt-6 sm:mt-8">
          <button
            onClick={() => navigate(-1)}
            className="px-4 sm:px-6 py-2 sm:py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
          >
            Back to Members
          </button>
          
          {canEdit && (
            <button
              onClick={() => navigate(`/members/${id}/edit`)}
              className="btn-primary flex items-center gap-2 text-sm sm:text-base"
            >
              <Edit className="h-4 w-4" />
              <span>Edit Member</span>
            </button>
          )}
        </div>
      </div>
    </div>
  )
} 