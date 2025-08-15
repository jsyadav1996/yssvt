import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient, Event } from '@/lib/api'
import { Calendar, Plus, MapPin, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useRoleCheck } from '@/utils/roleCheck'

export default function EventsPage() {
  const navigate = useNavigate()
  const { isSystemAdmin } = useRoleCheck()
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalEvents, setTotalEvents] = useState(0)
  const [pageSize] = useState(10)


  // Fetch all events
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await apiClient.getAllEvents(currentPage, pageSize)
        
        if (response.success && response.data) {
          // Ensure response.data is an array
          const eventsArray = response.data.events
          setEvents(eventsArray)
          setFilteredEvents(eventsArray)
          setTotalPages(response.data.pagination.totalPages)
          setTotalEvents(response.data.pagination.totalEvents)
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
  }, [currentPage])

  // Filter events
  useEffect(() => {
    if (!events) {
      setFilteredEvents([])
      return
    }
    
    setFilteredEvents(events)
  }, [events])

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
        {(isSystemAdmin) && (
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
        hasFilteredEvents && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <h3 className="font-semibold text-gray-900 text-base sm:text-lg">{event.title}</h3>
                    {(isSystemAdmin) && (
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => handleEditEvent(event.id, e)}
                        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-blue-50 hover:bg-blue-100 text-blue-600 hover:text-blue-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-blue-200 hover:border-blue-300"
                        title="Edit event"
                        >
                        <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteEvent(event.id, e)}
                        className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md border border-red-200 hover:border-red-300"
                        title="Delete event"
                        >
                        <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      </button>
                    </div>
                    )}
                </div>
                                
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
        )
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-12 text-center">
          <Calendar className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            No events yet
          </h3>
        </div>
      )}

      {/* Sticky Bottom Bar with Pagination */}
      {events.length > 0 && totalPages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-0">
          <div className="px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              {/* Page Info */}
              <div className="text-xs sm:text-sm text-gray-600">
                Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalEvents)} of {totalEvents} events
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
      {events.length > 0 && totalPages > 1 && (
        <div className="h-16 sm:h-20"></div>
      )}
    </div>
  )
} 