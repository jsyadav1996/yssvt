import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import { apiClient, Event } from '@/lib/api'
import { Calendar, Plus, MapPin, Edit, Trash2 } from 'lucide-react'

export default function EventsPage() {
  const navigate = useNavigate()
  const { user: currentUser } = useAuthStore()
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)


  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getAllEvents()
        
        if (response.success && response.data) {
          // Ensure response.data is an array
          const eventsArray = response.data.events
          setEvents(eventsArray)
          setFilteredEvents(eventsArray)
        } else {
          setError(response.message || 'Failed to fetch events')
          setEvents([])
          setFilteredEvents([])
        }
      } catch (err) {
        setError('Network error occurred')
        setEvents([])
        setFilteredEvents([])
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // Filter events
  useEffect(() => {
    if (!events) {
      setFilteredEvents([])
      return
    }
    
    setFilteredEvents(events)
  }, [events])

  // Check if user can create events
  const canCreateEvents = currentUser?.role === 'admin' || currentUser?.role === 'manager'

  // Check if there are any events
  const hasEvents = events && events.length > 0
  const hasFilteredEvents = filteredEvents && filteredEvents.length > 0

  // Get event counts for stats
  const eventCounts = {
    total: events?.length || 0
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleEditEvent = (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigate(`/events/${eventId}/edit`)
  }

  const handleDeleteEvent = async (eventId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await apiClient.deleteEvent(eventId)
        if (response.success) {
          // Refresh the events list
          window.location.reload()
        } else {
          alert('Failed to delete event: ' + response.message)
        }
      } catch (error) {
        console.error('Error deleting event:', error)
        alert('An error occurred while deleting the event')
      }
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Events</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage community events</p>
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
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Events</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage community events</p>
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
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-sm sm:text-base text-gray-600">
            {hasEvents ? `Manage ${eventCounts.total} community events` : 'Manage community events'}
          </p>
        </div>
        {canCreateEvents && (
          <button
            onClick={() => navigate('/events/add')}
            className="btn-primary flex items-center gap-2 text-sm sm:text-base"
          >
            <Plus className="h-4 w-4" />
            <span>Create Event</span>
          </button>
        )}
      </div>



      {/* Events List */}
      {hasEvents ? (
        hasFilteredEvents ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{event.title}</h3>
                  <div className="flex gap-1 sm:gap-2">
                    <button
                      onClick={(e) => handleEditEvent(event.id, e)}
                      className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      title="Edit event"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={(e) => handleDeleteEvent(event.id, e)}
                      className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                      title="Delete event"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2">{event.description}</p>
                
                <div className="space-y-2 sm:space-y-3">
                  <div className="flex items-center text-xs sm:text-sm text-gray-600">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  {event.location && 
                    <div className="flex items-center text-xs sm:text-sm text-gray-600">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  }                  
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-12 text-center">
            <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              No events found
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
              There are no events currently. Try creating a new event.
            </p>
            <div className="flex justify-center gap-2 sm:gap-3">
              {canCreateEvents && (
                <button
                  onClick={() => navigate('/events/add')}
                  className="btn-primary text-sm sm:text-base"
                >
                  Create Event
                </button>
              )}
            </div>
          </div>
        )
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-12 text-center">
          <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            No events yet
          </h3>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
            Get started by creating your first community event
          </p>
          {canCreateEvents && (
            <button
              onClick={() => navigate('/events/add')}
              className="btn-primary text-sm sm:text-base"
            >
              Create First Event
            </button>
          )}
        </div>
      )}
    </div>
  )
} 