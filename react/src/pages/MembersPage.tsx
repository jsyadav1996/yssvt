import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { apiClient, User, PaginationInfo } from '@/lib/api'
import { Search, Plus, Users, MapPin, ChevronLeft, ChevronRight, Edit } from 'lucide-react'

export default function MembersPage() {
  const navigate = useNavigate()
  const { user: currentUser } = useAuthStore()
  const [members, setMembers] = useState<User[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pageSize] = useState(10)

  // Fetch members with pagination
  const fetchMembers = async (page: number = 1, search?: string) => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiClient.getAllUsers(page, pageSize, search)
      
      if (response.success && response.data) {
        setMembers(response.data.users)
        setPagination(response.data.pagination)
      } else {
        setError(response.message || 'Failed to fetch members')
      }
    } catch (err) {
      setError('Network error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    fetchMembers(1)
  }, [])

  // Handle search with debouncing
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchMembers(1, searchTerm.trim())
      } else {
        fetchMembers(1)
      }
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= (pagination?.totalPages || 1)) {
      fetchMembers(page, searchTerm.trim() || undefined)
    }
  }

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
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading && members.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Members</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage community members</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-pulse">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error && members.length === 0) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Members</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage community members</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 text-center">
          <p className="text-red-600 mb-3 sm:mb-4 text-sm sm:text-base">{error}</p>
          <button 
            onClick={() => fetchMembers(1)}
            className="btn-primary text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage community members</p>
        </div>
        {(currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
          <button
            onClick={() => navigate('/members/add')}
            className="btn-primary flex items-center gap-2 text-sm sm:text-base"
          >
            <Plus className="h-4 w-4" />
            <span>Add Member</span>
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search members by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-8 sm:pl-10 pr-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm sm:text-base"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{pagination?.totalUsers || 0}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Members List */}
      {members.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow relative group"
              >
                {/* Edit Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/members/${member.id}/edit`)
                  }}
                  className="absolute top-3 sm:top-4 right-3 sm:right-4 p-1 sm:p-2 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                  title="Edit member"
                >
                  <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>

                <div 
                  className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 cursor-pointer"
                  onClick={() => navigate(`/members/${member.id}`)}
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <span className="text-primary-600 font-semibold text-sm sm:text-base">
                      {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600">{member.email}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  {member.phone && (
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <span className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2">📞</span>
                      {member.phone}
                    </div>
                  )}
                  
                  {member.address && (
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="truncate">{member.address}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)}`}>
                      {member.role}
                    </span>
                    <span className="text-xs text-gray-500">
                      Joined {formatDate(member.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>


        </>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-12 text-center">
          <Users className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'No members found' : 'No members yet'}
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Get started by adding your first community member'
            }
          </p>
          {!searchTerm && (currentUser?.role === 'admin' || currentUser?.role === 'manager') && (
            <button
              onClick={() => navigate('/members/new')}
              className="btn-primary text-sm sm:text-base"
            >
              Add First Member
            </button>
          )}
        </div>
      )}

      {/* Sticky Bottom Bar with Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-0">
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              {/* Page Info */}
              <div className="text-xs sm:text-sm text-gray-600">
                Showing {((pagination.currentPage - 1) * pagination.limit) + 1} to {Math.min(pagination.currentPage * pagination.limit, pagination.totalUsers)} of {pagination.totalUsers} members
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage - 1)}
                  disabled={!pagination.hasPrevPage}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                          page === pagination.currentPage
                            ? 'bg-blue-600 text-white'
                            : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  })}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(pagination.currentPage + 1)}
                  disabled={!pagination.hasNextPage}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom padding to prevent content from being hidden behind sticky bar */}
      {pagination && pagination.totalPages > 1 && (
        <div className="h-16 sm:h-20"></div>
      )}
    </div>
  )
} 