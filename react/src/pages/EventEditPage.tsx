import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, X, Upload, X as XIcon } from 'lucide-react'
import { apiClient, Event } from '@/lib/api'

const EventEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [event, setEvent] = useState<Event | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  })
  
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])

  // Fetch existing event data
  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return
      
      try {
        setFetchLoading(true)
        setError(null)
        const response = await apiClient.getEventById(id)
        
        if (response.success && response.data) {
          const eventData = response.data
          setEvent(eventData)
          
          // Set form data
          setFormData({
            title: eventData.title,
            description: eventData.description,
            date: eventData.date.split('T')[0], // Convert to date-only format
            location: eventData.location || ''
          })
          
          // Set existing images
          if (eventData.event_media && eventData.event_media.length > 0) {
            setExistingImages(eventData.event_media.map(media => media.path))
          }
        } else {
          setError(response.message || 'Failed to fetch event')
        }
      } catch (err) {
        setError('Network error occurred')
        console.error('Error fetching event:', err)
      } finally {
        setFetchLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      // Limit to 20 images total (existing + new)
      const maxNewImages = 20 - existingImages.length - selectedImages.length
      const newFiles = files.slice(0, maxNewImages)
      setSelectedImages(prev => [...prev, ...newFiles])
      
      // Create preview URLs for new files
      newFiles.forEach(file => {
        const reader = new FileReader()
        reader.onload = (e) => {
          setImagePreviews(prev => [...prev, e.target?.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeNewImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
    setImagePreviews(prev => prev.filter((_, i) => i !== index))
  }

  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Create FormData for file upload
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('date', formData.date)
      formDataToSend.append('location', formData.location)
      
      if (selectedImages.length > 0) {
        selectedImages.forEach((image) => {
          formDataToSend.append('images', image)
        })
      }

      const response = await apiClient.updateEventWithImages(id!, formDataToSend)
      
      if (response.success) {
        navigate(`/events/${id}`)
      } else {
        setError(response.message || 'Failed to update event')
      }
    } catch (err) {
      setError('An error occurred while updating the event')
      console.error('Error updating event:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    navigate(`/events/${id}`)
  }

  if (fetchLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/events')}
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

  if (error || !event) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/events')}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Event</h1>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 text-center">
          <p className="text-red-600 mb-3 sm:mb-4 text-sm sm:text-base">{error || 'Event not found'}</p>
          <button 
            onClick={() => navigate('/events')}
            className="btn-primary text-sm sm:text-base"
          >
            Back to Events
          </button>
        </div>
      </div>
    )
  }

  const totalImages = existingImages.length + selectedImages.length

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={() => navigate(`/events/${id}`)}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        </button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Edit Event</h1>
          <p className="text-sm sm:text-base text-gray-600">Update event details</p>
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

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter event title"
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
              placeholder="Enter event description"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Date *
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
              placeholder="Enter event location"
            />
          </div>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Existing Images
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">
                {existingImages.map((imagePath, index) => (
                  <div key={index} className="relative">
                    <img
                      src={imagePath}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-24 sm:h-32 object-cover rounded-md border border-gray-300"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 sm:top-2 right-1 sm:right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <XIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Upload */}
          {totalImages < 20 && (
            <div>
              <label htmlFor="images" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                Add New Images (Max 20 total)
              </label>
              
              {/* New Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-4 mb-3 sm:mb-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-24 sm:h-32 object-cover rounded-md border border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className="absolute top-1 sm:top-2 right-1 sm:right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                      >
                        <XIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 sm:p-6 text-center hover:border-gray-400 transition-colors">
                <input
                  type="file"
                  id="images"
                  name="images"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label htmlFor="images" className="cursor-pointer">
                  <Upload className="mx-auto h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                  <p className="mt-2 text-xs sm:text-sm text-gray-600">
                    Click to upload images
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF up to 5MB each ({totalImages}/20)
                  </p>
                </label>
              </div>
            </div>
          )}

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
              {isLoading ? 'Updating...' : 'Update Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventEditPage 