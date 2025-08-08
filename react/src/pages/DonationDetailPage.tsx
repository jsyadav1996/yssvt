import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, IndianRupee, Calendar, MapPin, Building, User, CreditCard, DollarSign } from 'lucide-react'
import { apiClient, Donation } from '@/lib/api'
import { useRoleCheck } from '@/utils/roleCheck'

const DonationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { isAdmin, isSystemAdmin } = useRoleCheck()
  const [donation, setDonation] = useState<Donation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Fetch donation data
  useEffect(() => {
    const fetchDonation = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getDonationById(id)
        
        if (response.success && response.data) {
          setDonation(response.data)
        } else {
          setError(response.message || 'Failed to fetch donation')
        }
      } catch (err) {
        setError('Network error occurred')
        console.error('Error fetching donation:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDonation()
  }, [id])

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
      month: 'long',
      day: 'numeric'
    })
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'online': return <CreditCard className="h-4 w-4" />
      case 'cash': return <DollarSign className="h-4 w-4" />
      default: return <IndianRupee className="h-4 w-4" />
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'online': return 'Online Payment'
      case 'cash': return 'Cash'
      default: return method
    }
  }

  const handleEdit = () => {
    navigate(`/donations/${id}/edit`)
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this donation? This action cannot be undone.')) {
      return
    }

    try {
      setDeleting(true)
      const response = await apiClient.deleteDonation(id!)
      
      if (response.success) {
        navigate('/donations')
      } else {
        setError(response.message || 'Failed to delete donation')
      }
    } catch (err) {
      setError('An error occurred while deleting the donation')
      console.error('Error deleting donation:', err)
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/donations')}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div className="animate-pulse">
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-48 sm:w-64 mb-2"></div>
            <div className="h-3 sm:h-4 bg-gray-200 rounded w-24 sm:w-32"></div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 animate-pulse">
          <div className="h-4 sm:h-6 bg-gray-200 rounded w-3/4 mb-3 sm:mb-4"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-3 sm:h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    )
  }

  if (error || !donation) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/donations')}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Donation Details</h1>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center">
          <p className="text-red-600 mb-3 sm:mb-4 text-sm sm:text-base">{error || 'Donation not found'}</p>
          <button 
            onClick={() => navigate('/donations')}
            className="btn-primary text-sm sm:text-base"
          >
            Back to Donations
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/donations')}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-xl font-bold text-gray-900">Donation Details</h1>
          </div>
        </div>

        {/* Action Buttons */}
        {(isAdmin || isSystemAdmin) && (
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-sm sm:text-base">
          {error}
        </div>
      )}

      {/* Donation Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6">
          {/* Amount Section */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center">
                <IndianRupee className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-2xl font-bold text-gray-900">
                  {formatCurrency(donation.amount)}
                </h2>
                <p className="text-sm sm:text-base text-gray-600">Donation Amount</p>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Payment Method */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                {getPaymentMethodIcon(donation.paymentMethod)}
                <h3 className="text-xs sm:text-sm font-medium text-gray-700">Payment Method</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-900 capitalize">
                {getPaymentMethodLabel(donation.paymentMethod)}
              </p>
            </div>

            {/* Date */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <h3 className="text-xs sm:text-sm font-medium text-gray-700">Donation Date</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-900">
                {formatDate(donation.date)}
              </p>
            </div>

            {/* Donor */}
            {donation.donor && (
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700">Donor</h3>
                </div>
                <div>
                  <p className="text-sm sm:text-base text-gray-900 font-medium">
                    {donation.donor.firstName} {donation.donor.lastName}
                  </p>
                  {donation.donor.email && (
                    <p className="text-xs sm:text-sm text-gray-600">{donation.donor.email}</p>
                  )}
                </div>
              </div>
            )}

            {/* Location */}
            {donation.location && (
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700">Location</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-900">{donation.location}</p>
              </div>
            )}

            {/* Bank Name */}
            {donation.bankName && (
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <div className="flex items-center gap-2 mb-1 sm:mb-2">
                  <Building className="h-4 w-4 text-gray-500" />
                  <h3 className="text-xs sm:text-sm font-medium text-gray-700">Bank</h3>
                </div>
                <p className="text-sm sm:text-base text-gray-900">{donation.bankName}</p>
              </div>
            )}

            {/* Created Date */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1 sm:mb-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <h3 className="text-xs sm:text-sm font-medium text-gray-700">Created</h3>
              </div>
              <p className="text-sm sm:text-base text-gray-900">
                {formatDate(donation.createdAt)}
              </p>
            </div>
          </div>

          {/* Purpose */}
          {donation.purpose && (
            <div className="mt-6 sm:mt-8">
              <h3 className="text-sm sm:text-base font-medium text-gray-700 mb-2 sm:mb-3">Purpose</h3>
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <p className="text-sm sm:text-base text-gray-900">{donation.purpose}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DonationDetailPage 