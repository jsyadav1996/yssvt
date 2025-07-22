export enum UserRole {
  MEMBER = 'member',
  MANAGER = 'manager',
  ADMIN = 'admin'
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone?: string;
  address?: string;
  profileImage?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: User;
  maxParticipants?: number;
  currentParticipants: number;
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Donation {
  _id: string;
  donor: User;
  amount: number;
  currency: string;
  purpose?: string;
  anonymous: boolean;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  location: string;
  maxParticipants?: number;
  image?: string;
}

export interface CreateDonationData {
  amount: number;
  currency: string;
  purpose?: string;
  anonymous: boolean;
  paymentMethod: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface EventsResponse {
  events: Event[];
  pagination: PaginationInfo;
}

export interface DonationsResponse {
  donations: Donation[];
  pagination: PaginationInfo;
} 