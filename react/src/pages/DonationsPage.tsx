import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { apiClient, Donation } from '@/lib/api'
import { Heart, Plus, DollarSign, Calendar, Filter, TrendingUp } from 'lucide-react'

export default function DonationsPage() {
  const navigate = useNavigate()
  const { user: currentUser } = useAuthStore()
  const [donations, setDonations] = useState<Donation[]>([])
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed' | 'failed'>('all')

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
          setDonations(response.data)
          setFilteredDonations(response.data)
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

  // Filter donations
  useEffect(() => {
    if (filter === 'all') {
      setFilteredDonations(donations)
    } else {
      setFilteredDonations(donations.filter(donation => donation.status === filter))
    }
  }, [filter, donations])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'credit_card': return '💳'
      case 'debit_card': return '💳'
      case 'bank_transfer': return '🏦'
      case 'paypal': return '📱'
      case 'cash': return '💵'
      default: return '💰'
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateTotalAmount = (donations: Donation[]) => {
    return donations.reduce((total, donation) => {
      // Convert all currencies to USD for calculation (simplified)
      if (donation.status === 'completed') {
        return total + donation.amount
      }
      return total
    }, 0)
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
            <p className="text-gray-600">Manage community donations</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
            <p className="text-gray-600">Manage community donations</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Donations</h1>
          <p className="text-gray-600">Manage community donations</p>
        </div>
        <button
          onClick={() => navigate('/donations/new')}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Make Donation</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Donations</p>
              <p className="text-2xl font-bold text-gray-900">{donations.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Amount</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(calculateTotalAmount(donations), 'USD')}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {donations.filter(d => d.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {donations.filter(d => d.status === 'pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'all'
              ? 'bg-primary-100 text-primary-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Donations
        </button>
        <button
          onClick={() => setFilter('pending')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'pending'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Pending
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'completed'
              ? 'bg-green-100 text-green-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
        <button
          onClick={() => setFilter('failed')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filter === 'failed'
              ? 'bg-red-100 text-red-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Failed
        </button>
      </div>

      {/* Donations List */}
      {filteredDonations.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonations.map((donation) => (
            <div
              key={donation.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/donations/${donation.id}`)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getPaymentMethodIcon(donation.paymentMethod)}</span>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {formatCurrency(donation.amount, donation.currency)}
                    </h3>
                    <p className="text-sm text-gray-600 capitalize">
                      {donation.paymentMethod.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(donation.status)}`}>
                  {donation.status}
                </span>
              </div>
              
              {donation.purpose && (
                <p className="text-gray-600 text-sm mb-4">{donation.purpose}</p>
              )}
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Anonymous:</span>
                  <span className={donation.anonymous ? 'text-green-600' : 'text-gray-900'}>
                    {donation.anonymous ? 'Yes' : 'No'}
                  </span>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span className="text-gray-900">{formatDate(donation.createdAt)}</span>
                </div>
                
                {donation.transactionId && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="text-gray-900 font-mono text-xs">
                      {donation.transactionId.slice(0, 8)}...
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filter === 'all' ? 'No donations yet' : `No ${filter} donations`}
          </h3>
          <p className="text-gray-600 mb-6">
            {filter === 'all' 
              ? 'Be the first to make a donation to support our community'
              : `No donations are currently ${filter}`
            }
          </p>
          {filter === 'all' && (
            <button
              onClick={() => navigate('/donations/new')}
              className="btn-primary"
            >
              Make First Donation
            </button>
          )}
        </div>
      )}
    </div>
  )
} 