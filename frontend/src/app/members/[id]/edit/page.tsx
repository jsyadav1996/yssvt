'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  ArrowLeft, 
  Save, 
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { apiClient } from '@/lib/api';
import { User as UserType, UserRole } from '@/types';
import toast from 'react-hot-toast';

interface EditUserForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  role: UserRole;
  isActive: boolean;
}

export default function MemberEditPage() {
  const router = useRouter();
  const params = useParams();
  const { user: currentUser, isAuthenticated } = useAuthStore();
  const [member, setMember] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<EditUserForm>();

  useEffect(() => {
    // Check authentication state
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    
    if (params.id) {
      fetchMember(params.id as string);
    }
  }, [isAuthenticated, router, params.id]);

  const fetchMember = async (memberId: string) => {
    try {
      setIsLoading(true);
      const data = await apiClient.getUser(memberId);
      
      if (data.success && data.data) {
        const userData = data.data.user;
        setMember(userData);
        
        // Set form values
        setValue('firstName', userData.firstName || '');
        setValue('lastName', userData.lastName || '');
        setValue('email', userData.email || '');
        setValue('phone', userData.phone || '');
        setValue('address', userData.address || '');
        setValue('role', userData.role || UserRole.MEMBER);
        setValue('isActive', userData.isActive !== undefined ? userData.isActive : true);
      } else {
        toast.error('Failed to load member details');
        router.push('/members');
      }
    } catch (error) {
      toast.error('Failed to load member details');
      router.push('/members');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: EditUserForm) => {
    if (!member) return;

    setIsSaving(true);
    try {
      const response = await apiClient.updateUser(member._id, data);
      
      if (response.success && response.data) {
        toast.success('Member updated successfully!');
        router.push(`/members/${member._id}`);
      } else {
        toast.error(response.message || 'Failed to update member');
      }
    } catch (error: any) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update member');
    } finally {
      setIsSaving(false);
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'manager':
        return 'bg-blue-100 text-blue-800';
      case 'member':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Show loading while authentication is being determined
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Member not found</h3>
          <p className="text-gray-600 mb-4">
            The member you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => router.push('/members')}
            className="btn-primary"
          >
            Back to Members
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => router.push(`/members/${member._id}`)}
              className="flex items-center text-gray-600"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-lg font-bold text-gray-900">Edit Member</h1>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`badge ${getRoleColor(member.role)}`}>
              {member.role}
            </span>
            <span className={`badge ${member.isActive ? 'badge-success' : 'badge-error'}`}>
              {member.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="px-4 py-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">
                    First Name *
                  </label>
                  <input
                    id="firstName"
                    type="text"
                    className={`input ${errors.firstName ? 'input-error' : ''}`}
                    placeholder="Enter first name"
                    {...register('firstName', {
                      required: 'First name is required',
                      minLength: {
                        value: 2,
                        message: 'First name must be at least 2 characters'
                      }
                    })}
                  />
                  {errors.firstName && (
                    <p className="form-error">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">
                    Last Name *
                  </label>
                  <input
                    id="lastName"
                    type="text"
                    className={`input ${errors.lastName ? 'input-error' : ''}`}
                    placeholder="Enter last name"
                    {...register('lastName', {
                      required: 'Last name is required',
                      minLength: {
                        value: 2,
                        message: 'Last name must be at least 2 characters'
                      }
                    })}
                  />
                  {errors.lastName && (
                    <p className="form-error">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  className={`input ${errors.email ? 'input-error' : ''}`}
                  placeholder="Enter email address"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Please enter a valid email address'
                    }
                  })}
                />
                {errors.email && (
                  <p className="form-error">{errors.email.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="form-group">
                <label htmlFor="phone" className="form-label">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  className={`input ${errors.phone ? 'input-error' : ''}`}
                  placeholder="Enter phone number"
                  {...register('phone')}
                />
                {errors.phone && (
                  <p className="form-error">{errors.phone.message}</p>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="address" className="form-label">
                  Address
                </label>
                <textarea
                  id="address"
                  rows={3}
                  className={`input ${errors.address ? 'input-error' : ''}`}
                  placeholder="Enter address"
                  {...register('address')}
                />
                {errors.address && (
                  <p className="form-error">{errors.address.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Account Settings */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-semibold text-gray-900">Account Settings</h2>
            </div>
            <div className="card-body space-y-4">
              <div className="form-group">
                <label htmlFor="role" className="form-label">
                  Role *
                </label>
                <select
                  id="role"
                  className={`input ${errors.role ? 'input-error' : ''}`}
                  {...register('role', {
                    required: 'Role is required'
                  })}
                >
                  <option value={UserRole.MEMBER}>Member</option>
                  <option value={UserRole.MANAGER}>Manager</option>
                  <option value={UserRole.ADMIN}>Admin</option>
                </select>
                {errors.role && (
                  <p className="form-error">{errors.role.message}</p>
                )}
              </div>

              <div className="form-group">
                <label className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    {...register('isActive')}
                  />
                  <span className="text-sm font-medium text-gray-700">
                    Active Account
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Inactive accounts cannot log in to the system
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6">
            <button
              type="button"
              onClick={() => router.push(`/members/${member._id}`)}
              className="btn-outline"
              disabled={isSaving}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <div className="loading-spinner h-4 w-4 mr-2"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 