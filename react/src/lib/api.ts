interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  errors?: any[]
}

// Pagination interfaces
interface PaginationInfo {
  currentPage: number
  totalPages: number
  totalUsers: number
  hasNextPage: boolean
  hasPrevPage: boolean
  limit: number
}

interface PaginatedUsersResponse {
  users: User[]
  pagination: PaginationInfo
  filters: {
    search: string
    role: string
    isActive: string
  }
}

// User interfaces
interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  role: 'member' | 'manager' | 'admin'
  createdAt: string
  updatedAt: string
}

interface UserProfile {
  firstName: string
  lastName: string
  phone?: string
  address?: string
}

// Event interfaces
interface EventMedia {
  id: number
  eventId: number
  path: string
  createdAt: string
}

interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  createdAt: string
  updatedAt: string
  event_media?: EventMedia[]
}

interface EventsWithPagination {
  events: Event[]
  pagination: {
    currentPage: number
    hasNext: boolean
    hasPrev: boolean
    totalEvents: number
    totalPages: number
  }
}

interface CreateEventData {
  title: string
  description: string
  date: string
  location: string
}

// Donation interfaces
interface Donation {
  id: string
  amount: number
  purpose?: string
  anonymous: boolean
  paymentMethod: 'online' | 'cash'
  status: 'pending' | 'completed' | 'failed'
  transactionId?: string
  userId: string
  createdAt: string
  updatedAt: string
}

interface CreateDonationData {
  amount: number
  purpose?: string
  anonymous: boolean
  paymentMethod: 'online' | 'cash'
}

class ApiClient {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // Import auth store dynamically to avoid circular dependency
    const { useAuthStore } = await import('@/store/auth')
    const token = useAuthStore.getState().token
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, config)
      const data = await response.json()
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Request failed',
          errors: data.errors
        }
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: 'Network error'
      }
    }
  }

  // Auth endpoints
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request('/users/me')
  }

  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
  }

  async register(name: string, email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password })
    })
  }

  // User endpoints with pagination
  async getAllUsers(page: number = 1, limit: number = 10, search?: string, role?: string, isActive?: string): Promise<ApiResponse<PaginatedUsersResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    if (search) params.append('search', search)
    if (role) params.append('role', role)
    if (isActive !== undefined) params.append('isActive', isActive.toString())
    
    return this.request(`/users?${params.toString()}`)
  }

  async getUserById(id: string): Promise<ApiResponse<User>> {
    return this.request(`/users/${id}`)
  }

  async updateProfile(data: UserProfile): Promise<ApiResponse<{ user: User }>> {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async searchUsers(searchText: string): Promise<ApiResponse<{ users: User[]; total: number; searchText: string }>> {
    return this.request('/users/search', {
      method: 'POST',
      body: JSON.stringify({ searchText })
    })
  }

  async createUser(data: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateUser(id: bigint, data: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteUser(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/users/${id}`, {
      method: 'DELETE'
    })
  }

  // Event endpoints
  async getAllEvents(): Promise<ApiResponse<EventsWithPagination>> {
    return this.request('/events')
  }

  async getEventById(id: string): Promise<ApiResponse<Event>> {
    return this.request(`/events/${id}`)
  }

  async createEvent(data: CreateEventData): Promise<ApiResponse<{ event: Event }>> {
    return this.request('/events', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async createEventWithImages(formData: FormData): Promise<ApiResponse<{ event: Event }>> {
    // Import auth store dynamically to avoid circular dependency
    const { useAuthStore } = await import('@/store/auth')
    const token = useAuthStore.getState().token
    
    const config: RequestInit = {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData - let the browser set it with boundary
      },
      body: formData
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/events`, config)
      const data = await response.json()
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Request failed',
          errors: data.errors
        }
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: 'Network error'
      }
    }
  }

  async updateEvent(id: string, data: Partial<CreateEventData>): Promise<ApiResponse<{ event: Event }>> {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async updateEventWithImages(id: string, formData: FormData): Promise<ApiResponse<{ event: Event }>> {
    // Import auth store dynamically to avoid circular dependency
    const { useAuthStore } = await import('@/store/auth')
    const token = useAuthStore.getState().token
    
    const config: RequestInit = {
      method: 'PUT',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData - let the browser set it with boundary
      },
      body: formData
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/events/${id}`, config)
      const data = await response.json()
      
      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Request failed',
          errors: data.errors
        }
      }
      
      return data
    } catch (error) {
      return {
        success: false,
        message: 'Network error'
      }
    }
  }

  async deleteEvent(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/events/${id}`, {
      method: 'DELETE'
    })
  }

  // Donation endpoints
  async getAllDonations(): Promise<ApiResponse<Donation[]>> {
    return this.request('/donations')
  }

  async getUserDonations(): Promise<ApiResponse<Donation[]>> {
    return this.request('/donations/my')
  }

  async createDonation(data: CreateDonationData): Promise<ApiResponse<{ donation: Donation }>> {
    return this.request('/donations', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async updateDonationStatus(id: string, status: 'pending' | 'completed' | 'failed', transactionId?: string): Promise<ApiResponse<{ donation: Donation }>> {
    return this.request(`/donations/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, transactionId })
    })
  }
}

export const apiClient = new ApiClient()

// Export types for use in components
export type { 
  User, 
  Event, 
  EventMedia,
  Donation, 
  CreateEventData, 
  CreateDonationData, 
  UserProfile,
  PaginationInfo,
  PaginatedUsersResponse
} 