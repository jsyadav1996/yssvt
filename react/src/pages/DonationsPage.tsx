import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient, Donation } from '@/lib/api'
import { Heart, Plus, IndianRupee, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRoleCheck } from '@/utils/roleCheck'

export default function DonationsPage() {
  const navigate = useNavigate()
  const { isAdmin, isSystemAdmin } = useRoleCheck()
  const [donations, setDonations] = useState<Donation[]>([])
  const [totalDonationAmount, setTotalDonationAmount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalDonations, setTotalDonations] = useState(0)
  const [pageSize] = useState(10)

  // Fetch donations based on user role
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let response
        response = await apiClient.getAllDonations(currentPage, pageSize)
        
        if (response.success && response.data) {
          setDonations(response.data.donations)
          setTotalDonationAmount(response.data.totalDonationAmount || 0)
          setTotalPages(response.data.pagination.totalPages)
          setTotalDonations(response.data.pagination.totalDonations)
        } else {
          setError(response.message || 'Failed to fetch donations')
        }
      } catch (err) {
        setError('Network error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchDonations()
  }, [currentPage])



  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'online': return '💳'
      case 'cash': return '💵'
      default: return '💰'
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleEdit = (e: React.MouseEvent, donationId: string) => {
    e.stopPropagation()
    navigate(`/donations/${donationId}/edit`)
  }

  const handleDelete = async (e: React.MouseEvent, donationId: string) => {
    e.stopPropagation()
    
    if (!confirm('Are you sure you want to delete this donation?')) {
      return
    }

    try {
      setDeletingId(donationId)
      const response = await apiClient.deleteDonation(donationId)
      
      if (response.success) {
        setDonations(prev => prev.filter(donation => donation.id !== donationId))
      } else {
        setError(response.message || 'Failed to delete donation')
      }
    } catch (err) {
      setError('An error occurred while deleting the donation')
      console.error('Error deleting donation:', err)
    } finally {
      setDeletingId(null)
    }
  }

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    return pages
  }

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Donations</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage community donations</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 animate-pulse">
              <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
              <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-2 sm:h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Donations</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage community donations</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 sm:p-6 text-center">
          <p className="text-red-600 mb-3 sm:mb-4 text-sm sm:text-base">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Donations</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage community donations</p>
        </div>
        {(isAdmin || isSystemAdmin) && (
          <button
            onClick={() => navigate('/donations/add')}
            className="btn-primary flex items-center gap-2 text-sm sm:text-base"
          >
            <Plus className="h-4 w-4" />
            <span>Make Donation</span>
          </button>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">{donations.length}</p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Heart className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900">
                {formatCurrency(totalDonationAmount)}
              </p>
            </div>
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-full flex items-center justify-center">
              <IndianRupee className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>



      {/* Donations List */}
      {donations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {donations.map((donation) => (
            <div
              key={donation.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/donations/${donation.id}`)}
            >
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl sm:text-2xl">{getPaymentMethodIcon(donation.paymentMethod)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                      {formatCurrency(donation.amount)}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 capitalize">
                      {donation.paymentMethod.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                {(isAdmin || isSystemAdmin) && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleEdit(e, donation.id)}
                      className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-blue-200 hover:border-blue-300"
                      title="Edit donation"
                    >
                      <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, donation.id)}
                      disabled={deletingId === donation.id}
                      className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-red-200 hover:border-red-300 disabled:opacity-50"
                      title="Delete donation"
                    >
                      <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                )}
              </div>
              
              {donation.donor && (
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                  {donation.donor.firstName} {donation.donor.lastName}
                </p>
              )}
              
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-12 text-center">
          <Heart className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            No donations yet
          </h3>
        </div>
      )}

      {/* Sticky Bottom Bar with Pagination */}
      {donations.length > 0 && totalPages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-0">
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              {/* Page Info */}
              <div className="text-xs sm:text-sm text-gray-600">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalDonations)} of {totalDonations} donations
              </div>

              {/* Pagination Controls */}
              <div className="flex items-center gap-1 sm:gap-2">
                {/* Previous Button */}
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-2 sm:px-3 py-1 sm:py-2 text-xs sm:text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
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
      {donations.length > 0 && totalPages > 1 && (
        <div className="h-16 sm:h-20"></div>
      )}
    </div>
  )
} 