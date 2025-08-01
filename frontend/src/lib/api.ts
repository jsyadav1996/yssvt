import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { 
  ApiResponse, 
  LoginCredentials, 
  RegisterData, 
  User, 
  Event, 
  Donation,
  CreateEventData,
  CreateDonationData,
  EventsResponse,
  DonationsResponse
} from '@/types';

// Function to get token from localStorage (for backward compatibility)
const getTokenFromStorage = (): string | null => {
  // Check if we're in a browser environment
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    // First try to get from localStorage directly
    const token = localStorage.getItem('token');
    if (token) return token;
    
    // If not found, try to get from Zustand persist storage
    const authStorage = localStorage.getItem('auth-storage');
    if (authStorage) {
      const parsed = JSON.parse(authStorage);
      return parsed.state?.token || null;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting token from storage:', error);
    return null;
  }
};

class ApiClient {
  private client: AxiosInstance;
  private currentToken: string | null = null;

  constructor() {
    // Check if we're in a browser environment
    const isBrowser = typeof window !== 'undefined';
    
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Only set up interceptors in browser environment
    if (isBrowser) {
      // Request interceptor to add auth token
      this.client.interceptors.request.use(
        (config) => {
          // Use currentToken if set, otherwise get from storage
          const token = this.currentToken || getTokenFromStorage();
          console.log('API Request - Token found:', !!token);
          
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
          return config;
        },
        (error) => {
          return Promise.reject(error);
        }
      );

      // Response interceptor to handle errors
      this.client.interceptors.response.use(
        (response) => response,
        (error) => {
          if (error.response?.status === 401) {
            // Clear both localStorage and Zustand persist storage
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              localStorage.removeItem('auth-storage');
            }
            // window.location.href = '/login';
          }
          return Promise.reject(error);
        }
      );
    }
  }

  // Token management
  setToken(token: string | null) {
    this.currentToken = token;
  }

  getToken(): string | null {
    return this.currentToken || getTokenFromStorage();
  }

  // Debug method to check token status
  debugTokenStatus() {
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
      console.log('=== Token Debug Info ===');
      console.log('Running on server side - no localStorage available');
      console.log('========================');
      return {
        directToken: false,
        authStorage: false,
        currentToken: !!this.currentToken,
        storageToken: false
      };
    }
    
    const directToken = localStorage.getItem('token');
    const authStorage = localStorage.getItem('auth-storage');
    const currentToken = this.currentToken;
    const storageToken = getTokenFromStorage();
    
    console.log('=== Token Debug Info ===');
    console.log('Direct localStorage token:', !!directToken);
    console.log('Zustand auth-storage exists:', !!authStorage);
    console.log('Current API client token:', !!currentToken);
    console.log('Storage function token:', !!storageToken);
    console.log('========================');
    
    return {
      directToken: !!directToken,
      authStorage: !!authStorage,
      currentToken: !!currentToken,
      storageToken: !!storageToken
    };
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = 
      await this.client.post('/auth/login', credentials);
    return response.data;
  }

  async register(data: RegisterData): Promise<ApiResponse<{ user: User; token: string }>> {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = 
      await this.client.post('/auth/register', data);
    return response.data;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = 
      await this.client.get('/auth/me');
    return response.data;
  }

  // User endpoints
  async getUsers(): Promise<ApiResponse<{ users: User[] }>> {
    const response: AxiosResponse<ApiResponse<{ users: User[] }>> = 
      await this.client.get('/users');
    return response.data;
  }

  async getUser(id: string): Promise<ApiResponse<{ user: User }>> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = 
      await this.client.get(`/users/${id}`);
    return response.data;
  }

  async updateProfile(data: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = 
      await this.client.put('/users/profile', data);
    return response.data;
  }

  async updateUser(id: string, data: Partial<User>): Promise<ApiResponse<{ user: User }>> {
    const response: AxiosResponse<ApiResponse<{ user: User }>> = 
      await this.client.put(`/users/${id}`, data);
    return response.data;
  }

  // Event endpoints
  async getEvents(page = 1, limit = 10, active?: boolean): Promise<ApiResponse<EventsResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (active !== undefined) {
      params.append('active', active.toString());
    }
    
    const response: AxiosResponse<ApiResponse<EventsResponse>> = 
      await this.client.get(`/events?${params.toString()}`);
    return response.data;
  }

  async getEvent(id: string): Promise<ApiResponse<{ event: Event }>> {
    const response: AxiosResponse<ApiResponse<{ event: Event }>> = 
      await this.client.get(`/events/${id}`);
    return response.data;
  }

  async createEvent(data: CreateEventData): Promise<ApiResponse<{ event: Event }>> {
    const response: AxiosResponse<ApiResponse<{ event: Event }>> = 
      await this.client.post('/events', data);
    return response.data;
  }

  async updateEvent(id: string, data: Partial<CreateEventData>): Promise<ApiResponse<{ event: Event }>> {
    const response: AxiosResponse<ApiResponse<{ event: Event }>> = 
      await this.client.put(`/events/${id}`, data);
    return response.data;
  }

  async deleteEvent(id: string): Promise<ApiResponse<{}>> {
    const response: AxiosResponse<ApiResponse<{}>> = 
      await this.client.delete(`/events/${id}`);
    return response.data;
  }

  // Donation endpoints
  async getDonations(page = 1, limit = 10, status?: string): Promise<ApiResponse<DonationsResponse>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });
    if (status) {
      params.append('status', status);
    }
    
    const response: AxiosResponse<ApiResponse<DonationsResponse>> = 
      await this.client.get(`/donations?${params.toString()}`);
    return response.data;
  }

  async getMyDonations(): Promise<ApiResponse<{ donations: Donation[] }>> {
    const response: AxiosResponse<ApiResponse<{ donations: Donation[] }>> = 
      await this.client.get('/donations/my');
    return response.data;
  }

  async createDonation(data: CreateDonationData): Promise<ApiResponse<{ donation: Donation }>> {
    const response: AxiosResponse<ApiResponse<{ donation: Donation }>> = 
      await this.client.post('/donations', data);
    return response.data;
  }

  async updateDonationStatus(id: string, status: string, transactionId?: string): Promise<ApiResponse<{ donation: Donation }>> {
    const response: AxiosResponse<ApiResponse<{ donation: Donation }>> = 
      await this.client.put(`/donations/${id}/status`, { status, transactionId });
    return response.data;
  }
}

export const apiClient = new ApiClient(); 