import { Request } from 'express';

export enum UserRole {
  MEMBER = 'member',
  MANAGER = 'manager',
  ADMIN = 'admin'
}

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  address?: string;
  profileImage?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IEvent {
  _id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string | IUser;
  maxParticipants?: number;
  currentParticipants: number;
  image?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IDonation {
  _id: string;
  donor: string | IUser;
  amount: number;
  currency: string;
  purpose?: string;
  anonymous: boolean;
  paymentMethod: string;
  status: 'pending' | 'completed' | 'failed';
  transactionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthRequest extends Request {
  user?: IUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  date: string;
  location: string;
  maxParticipants?: number;
  image?: string;
}

export interface CreateDonationRequest {
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