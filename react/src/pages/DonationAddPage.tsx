import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, X, Search, User } from 'lucide-react'
import { apiClient, User as UserType } from '@/lib/api'

const DonationAddPage: React.FC = () => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    amount: '',
    purpose: '',
    paymentMethod: 'online' as 'online' | 'cash',
    donorId: '',
    date: new Date().toISOString().split('T')[0],
    location: '',
    bankName: ''
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<UserType[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedDonor, setSelectedDonor] = useState<UserType | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  // Search donors on typing
  useEffect(() => {
    const searchDonors = async () => {
      if (searchQuery.trim().length < 2) {
        setSearchResults([])
        setShowDropdown(false)
        return
      }

      // Don't search if a donor is already selected and the search query matches the selected donor
      if (selectedDonor && searchQuery === `${selectedDonor.firstName} ${selectedDonor.lastName}`) {
        return
      }

      try {
        setIsSearching(true)
        const response = await apiClient.searchUsers(searchQuery.trim())
        
        if (response.success && response.data) {
          setSearchResults(response.data.users)
          setShowDropdown(true)
        } else {
          setSearchResults([])
          setShowDropdown(false)
        }
      } catch (err) {
        console.error('Error searching donors:', err)
        setSearchResults([])
        setShowDropdown(false)
      } finally {
        setIsSearching(false)
      }
    }

    const debounceTimer = setTimeout(searchDonors, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery, selectedDonor])

  const handleDonorSelect = (donor: UserType) => {
    setSelectedDonor(donor)
    setFormData(prev => ({ ...prev, donorId: donor.id }))
    setSearchQuery(`${donor.firstName} ${donor.lastName}`)
    setShowDropdown(false)
  }

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (!e.target.value) {
      setSelectedDonor(null)
      setFormData(prev => ({ ...prev, donorId: '' }))
    }
  }

  const clearDonorSelection = () => {
    setSelectedDonor(null)
    setFormData(prev => ({ ...prev, donorId: '' }))
    setSearchQuery('')
    setShowDropdown(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const donationData = {
        amount: parseFloat(formData.amount),
        purpose: formData.purpose || undefined,
        paymentMethod: formData.paymentMethod,
        donorId: formData.donorId || undefined,
        date: formData.date,
        location: formData.location || undefined,
        bankName: formData.bankName || undefined
      }

      const response = await apiClient.createDonation(donationData)
      
      if (response.success) {
        navigate('/donations')
      } else {
        setError(response.message || 'Failed to create donation')
      }
    } catch (err) {
      setError('An error occurred while creating the donation')
      console.error('Error creating donation:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate('/donations')
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => navigate('/donations')}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Make Donation</h1>
          <p className="text-sm sm:text-base text-gray-600">Support our community</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 sm:px-4 py-2 sm:py-3 rounded-md text-sm sm:text-base">
              {error}
            </div>
          )}

          {/* Amount */}
          <div>
            <label htmlFor="amount" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Amount (₹) *
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              required
              min="1"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter amount"
            />
          </div>

          {/* Donor Selection */}
          <div>
            <label htmlFor="donorSearch" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Donor (Optional)
            </label>
            <div className="relative">
              <div className="relative">
                <input
                  type="text"
                  id="donorSearch"
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="w-full px-3 py-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Search for a donor..."
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                {selectedDonor && (
                  <button
                    type="button"
                    onClick={clearDonorSelection}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              
              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                  {isSearching ? (
                    <div className="px-3 py-2 text-sm text-gray-500">Searching...</div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((donor) => (
                      <button
                        key={donor.id}
                        type="button"
                        onClick={() => handleDonorSelect(donor)}
                        className="w-full px-3 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {donor.firstName} {donor.lastName}
                            </div>
                            {donor.email && (
                              <div className="text-xs text-gray-500">{donor.email}</div>
                            )}
                          </div>
                        </div>
                      </button>
                    ))
                  ) : searchQuery.trim().length >= 2 ? (
                    <div className="px-3 py-2 text-sm text-gray-500">No donors found</div>
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {/* Purpose */}
          <div>
            <label htmlFor="purpose" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Purpose
            </label>
            <textarea
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="What is this donation for? (optional)"
            />
          </div>

          {/* Payment Method */}
          <div>
            <label htmlFor="paymentMethod" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Payment Method *
            </label>
            <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="online">Online</option>
              <option value="cash">Cash</option>
            </select>
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Donation Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Location
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Where was this donation made? (optional)"
            />
          </div>

          {/* Bank Name */}
          <div>
            <label htmlFor="bankName" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Bank Name
            </label>
            <input
              type="text"
              id="bankName"
              name="bankName"
              value={formData.bankName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Bank name (optional)"
            />
          </div>



          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <X className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              {isLoading ? 'Creating...' : 'Create Donation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DonationAddPage 