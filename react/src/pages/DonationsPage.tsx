import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { apiClient, Donation } from '@/lib/api'
import { Heart, Plus, IndianRupee, Edit, Trash2 } from 'lucide-react'

export default function DonationsPage() {
  const navigate = useNavigate()
  const { user: currentUser } = useAuthStore()
  const [donations, setDonations] = useState<Donation[]>([])
  const [totalDonationAmount, setTotalDonationAmount] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  // Fetch donations based on user role
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        setLoading(true)
        setError(null)
        
        let response
        if (currentUser?.role === 'admin' || currentUser?.role === 'manager') {
          // Admins and managers see all donations
          response = await apiClient.getAllDonations()
        } else {
          // Regular users see only their donations
          response = await apiClient.getUserDonations()
        }
        
        if (response.success && response.data) {
          setDonations(response.data.donations)
          setTotalDonationAmount(response.data.totalDonationAmount)
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
  }, [currentUser?.role])



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
          <button 
            onClick={() => window.location.reload()}
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Donations</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage community donations</p>
        </div>
        <button
          onClick={() => navigate('/donations/add')}
          className="btn-primary flex items-center gap-2 text-sm sm:text-base"
        >
          <Plus className="h-4 w-4" />
          <span>Make Donation</span>
        </button>
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
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => handleEdit(e, donation.id)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Edit donation"
                  >
                    <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, donation.id)}
                    disabled={deletingId === donation.id}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                    title="Delete donation"
                  >
                    <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                  </button>
                </div>
              </div>
              
              {donation.donor && (
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4">
                  {donation.donor.firstName} {donation.donor.lastName}
                </p>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-gray-900">{formatDate(donation.date || donation.createdAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-12 text-center">
          <Heart className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            No donations yet
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Be the first to make a donation to support our community
          </p>
          <button
            onClick={() => navigate('/donations/new')}
            className="btn-primary text-sm sm:text-base"
          >
            Make First Donation
          </button>
        </div>
      )}
    </div>
  )
} 