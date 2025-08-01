'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { User, Mail, Phone, MapPin, Calendar, Shield, ArrowLeft, Edit } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { apiClient } from '@/lib/api';
import { User as UserType } from '@/types';
import toast from 'react-hot-toast';

export default function MemberDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { user, isAuthenticated } = useAuthStore();
  const [member, setMember] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        setMember(data.data.user);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
              onClick={() => router.back()}
              className="text-gray-500 active:text-gray-700 p-1"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-lg font-bold text-gray-900">Member Profile</h1>
          </div>
          {(user?.role === 'admin' || user?.role === 'manager') && (
            <button
              onClick={() => router.push(`/members/${member._id}/edit`)}
              className="btn-primary btn-sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-6 pb-20">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-primary-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900">
                {member.firstName} {member.lastName}
              </h2>
              <p className="text-gray-600 text-sm">{member.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(member.role)} capitalize`}>
                  {member.role}
                </span>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  member.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {member.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{member.email}</p>
              </div>
            </div>

            {member.phone && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Phone className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{member.phone}</p>
                </div>
              </div>
            )}

            {member.address && (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-900">{member.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Account Information */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Shield className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Role</p>
                  <p className="text-sm text-gray-600 capitalize">{member.role}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Member Since</p>
                  <p className="text-sm text-gray-600">{formatDate(member.createdAt)}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Email Verification</p>
                  <p className="text-sm text-gray-600">
                    {member.emailVerified ? 'Verified' : 'Not verified'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions</h3>
          
          <div className="space-y-3">
            {(user?.role === 'admin' || user?.role === 'manager') && (
              <button 
                onClick={() => router.push(`/members/${member._id}/edit`)}
                className="w-full text-left px-4 py-3 text-sm text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Member
              </button>
            )}
            <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              Send Message
            </button>
            <button className="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              View Activity
            </button>
            {user?.role === 'admin' && (
              <button className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                Manage Account
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 