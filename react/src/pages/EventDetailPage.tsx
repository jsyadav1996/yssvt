import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Calendar, MapPin, X } from 'lucide-react'
import { apiClient, Event } from '@/lib/api'
import { useAuthStore } from '@/store/auth'

const EventDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user: currentUser } = useAuthStore()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return
      
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getEventById(id)
        
        if (response.success && response.data) {
          setEvent(response.data)
        } else {
          setError(response.message || 'Failed to fetch event')
        }
      } catch (err) {
        setError('Network error occurred')
        console.error('Error fetching event:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchEvent()
  }, [id])

  const handleEdit = () => {
    navigate(`/events/${id}/edit`)
  }

  const handleDelete = async () => {
    if (!event) return
    
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await apiClient.deleteEvent(event.id)
        if (response.success) {
          navigate('/events')
        } else {
          alert('Failed to delete event: ' + response.message)
        }
      } catch (error) {
        console.error('Error deleting event:', error)
        alert('An error occurred while deleting the event')
      }
    }
  }

  const handleImageClick = (imagePath: string) => {
    setSelectedImage(imagePath)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Check if user can edit/delete events
  const canManageEvents = currentUser?.role === 'admin' || currentUser?.role === 'manager'

  if (loading) {
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

       {/* Image Modal */}
       {selectedImage && (
         <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
           <div className="relative max-w-4xl max-h-full">
             <button
               onClick={closeImageModal}
               className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
             >
               <X className="h-6 w-6" />
             </button>
             <img
               src={selectedImage}
               alt="Event"
               className="max-w-full max-h-full object-contain rounded-lg"
             />
           </div>
         </div>
       )}
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Event Details</h1>
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
        <div className="flex items-center gap-3 sm:gap-4">
          <button
            onClick={() => navigate('/events')}
            className="p-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{event.title}</h1>
            <p className="text-sm sm:text-base text-gray-600">Event Details</p>
          </div>
        </div>
        
        {canManageEvents && (
          <div className="flex gap-2">
            <button
              onClick={handleEdit}
              className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-md hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Delete
            </button>
          </div>
        )}
      </div>

      {/* Event Details */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Event Info */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">{event.title}</h2>
            
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center text-xs sm:text-sm text-gray-600">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                <span>{formatDate(event.date)}</span>
              </div>
                            
              {event.location && (
                <div className="flex items-center text-xs sm:text-sm text-gray-600">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span>{event.location}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap">{event.description}</p>
          </div>

          {/* Event Images */}
          {event.event_media && event.event_media.length > 0 && (
            <div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3 sm:mb-4">Event Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-4">
                {event.event_media.map((media) => (
                  <div key={media.id} className="relative">
                    <img
                      src={media.path}
                      alt="Event"
                      className="w-full h-32 sm:h-48 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => handleImageClick(media.path)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={closeImageModal}
              className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10 p-1 sm:p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-75 transition-colors"
            >
              <X className="h-4 w-4 sm:h-6 sm:w-6" />
            </button>
            <img
              src={selectedImage}
              alt="Event"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default EventDetailPage 