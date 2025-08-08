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
  city?: string
  state?: string
  pincode?: string
  dob?: string
  gender?: 'male' | 'female'
  profileImagePath?: string
  occupationField?: 'agriculture_and_allied' | 'industry_and_manufacturing' | 'trade_and_business' | 'government_and_public_services' | 'education_and_research' | 'healthcare' | 'media_and_entertainment' | 'corporate_sector' | 'legal_and_judiciary' | 'skilled_services' | 'transport_and_logistics' | 'hospitality_and_tourism' | 'freelancing_and_emerging_roles'
  occupation?: 'farmer' | 'fisherman' | 'livestock_rearer' | 'horticulturist' | 'factory_worker' | 'industrialist' | 'mechanic' | 'welder' | 'carpenter' | 'plumber' | 'shopkeeper' | 'entrepreneur' | 'wholesale_trader' | 'retail_salesperson' | 'small_business_owner' | 'government_employee' | 'police_officer' | 'soldier' | 'postman' | 'clerk' | 'teacher' | 'professor' | 'researcher' | 'tutor' | 'doctor' | 'nurse' | 'pharmacist' | 'medical_technician' | 'media_person_journalist' | 'actor' | 'singer' | 'photographer' | 'dancer' | 'engineer_it_civil_etc' | 'accountant' | 'hr_professional' | 'marketing_executive' | 'data_analyst' | 'lawyer' | 'judge' | 'barber' | 'tailor' | 'cobbler' | 'domestic_helper' | 'driver' | 'courier_delivery_agent' | 'chef' | 'hotel_manager' | 'tour_guide' | 'digital_marketer'
  role: 'member' | 'manager' | 'admin'
  createdAt: string
  updatedAt: string
}

interface UserProfile {
  firstName: string
  lastName: string
  phone?: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  dob?: string
  gender?: 'male' | 'female'
  occupationField?: 'agriculture_and_allied' | 'industry_and_manufacturing' | 'trade_and_business' | 'government_and_public_services' | 'education_and_research' | 'healthcare' | 'media_and_entertainment' | 'corporate_sector' | 'legal_and_judiciary' | 'skilled_services' | 'transport_and_logistics' | 'hospitality_and_tourism' | 'freelancing_and_emerging_roles'
  occupation?: 'farmer' | 'fisherman' | 'livestock_rearer' | 'horticulturist' | 'factory_worker' | 'industrialist' | 'mechanic' | 'welder' | 'carpenter' | 'plumber' | 'shopkeeper' | 'entrepreneur' | 'wholesale_trader' | 'retail_salesperson' | 'small_business_owner' | 'government_employee' | 'police_officer' | 'soldier' | 'postman' | 'clerk' | 'teacher' | 'professor' | 'researcher' | 'tutor' | 'doctor' | 'nurse' | 'pharmacist' | 'medical_technician' | 'media_person_journalist' | 'actor' | 'singer' | 'photographer' | 'dancer' | 'engineer_it_civil_etc' | 'accountant' | 'hr_professional' | 'marketing_executive' | 'data_analyst' | 'lawyer' | 'judge' | 'barber' | 'tailor' | 'cobbler' | 'domestic_helper' | 'driver' | 'courier_delivery_agent' | 'chef' | 'hotel_manager' | 'tour_guide' | 'digital_marketer'
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
  paymentMethod: 'online' | 'cash'
  donorId?: string
  date: string
  location?: string
  bankName?: string
  createdAt: string
  updatedAt: string
  donor?: {
    firstName: string
    lastName: string
    email: string
  }
}

interface DonationsWithPagination {
  donations: Donation[],
  totalDonationAmount: number,
  pagination: {
    currentPage: number
    hasNext: boolean
    hasPrev: boolean
    totalDonations: number
    totalPages: number
  }
}

interface CreateDonationData {
  amount: number
  purpose?: string
  paymentMethod: 'online' | 'cash'
  donorId?: string
  date?: string
  location?: string
  bankName?: string
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

  private async formRequest<T>(endpoint: string, formData: FormData, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // Import auth store dynamically to avoid circular dependency
    const { useAuthStore } = await import('@/store/auth')
    const token = useAuthStore.getState().token
    
    const config: RequestInit = {
      method: 'POST', // Default method for form requests
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't set Content-Type for FormData - let the browser set it with boundary
        ...options.headers,
      },
      body: formData,
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

  async register(firstName: string, lastName: string, email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ firstName, lastName, email, password })
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

  async profile (): Promise<ApiResponse<User>> {
    return this.request('/users/profile', {
      method: 'GET'
    })
  }

  async updateProfile(formData: FormData): Promise<ApiResponse<User>> {
    return this.formRequest('/users/profile', formData, {
      method: 'PUT'
    })
  }

  async searchUsers(searchText: string): Promise<ApiResponse<{ users: User[]; total: number; searchText: string }>> {
    return this.request('/users/search', {
      method: 'POST',
      body: JSON.stringify({ searchText })
    })
  }

  async createUser(formData: FormData): Promise<ApiResponse<User>> {
    return this.formRequest('/users', formData, {
      method: 'POST'
    })
  }

  async updateUser(id: bigint, formData: FormData): Promise<ApiResponse<User>> {
    return this.formRequest(`/users/${id}`, formData, {
      method: 'PUT'
    })
  }

  async deleteUser(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/users/${id}`, {
      method: 'DELETE'
    })
  }

  // Event endpoints
  async getAllEvents(page: number = 1, limit: number = 10): Promise<ApiResponse<EventsWithPagination>> {
    return this.request(`/events?page=${page}&limit=${limit}`)
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
    return this.formRequest('/events', formData, {
      method: 'POST'
    })
  }

  async updateEvent(id: string, data: Partial<CreateEventData>): Promise<ApiResponse<{ event: Event }>> {
    return this.request(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async updateEventWithImages(id: string, formData: FormData): Promise<ApiResponse<{ event: Event }>> {
    return this.formRequest(`/events/${id}`, formData, {
      method: 'PUT'
    })
  }

  async deleteEvent(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/events/${id}`, {
      method: 'DELETE'
    })
  }

  // Donation endpoints
  async getAllDonations(page: number = 1, limit: number = 10): Promise<ApiResponse<DonationsWithPagination>> {
    return this.request(`/donations?page=${page}&limit=${limit}`)
  }

  async getUserDonations(page: number = 1, limit: number = 10): Promise<ApiResponse<DonationsWithPagination>> {
    return this.request(`/donations/my?page=${page}&limit=${limit}`)
  }

  async createDonation(data: CreateDonationData): Promise<ApiResponse<{ donation: Donation }>> {
    return this.request('/donations', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async getDonationById(id: string): Promise<ApiResponse<Donation>> {
    return this.request(`/donations/${id}`)
  }

  async updateDonation(id: string, data: Partial<CreateDonationData>): Promise<ApiResponse<{ donation: Donation }>> {
    return this.request(`/donations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    })
  }

  async deleteDonation(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.request(`/donations/${id}`, {
      method: 'DELETE'
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