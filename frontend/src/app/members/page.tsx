'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Users, Search, User, Shield, Calendar, Mail, Phone } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import { apiClient } from '@/lib/api';
import { User as UserType } from '@/types';
import toast from 'react-hot-toast';

export default function MembersPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [members, setMembers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Check if we have a token in localStorage
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    
    // If we have a token but not authenticated yet, wait a bit
    if (!isAuthenticated && token) {
      return;
    }
    
    fetchMembers();
  }, [isAuthenticated, router]);

  const fetchMembers = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getUsers();
      
      if (data.success && data.data) {
        setMembers(data.data.users);
      } else {
        toast.error('Failed to load members');
      }
    } catch (error) {
      toast.error('Failed to load members');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredMembers = members.filter(member => {
    const searchLower = searchTerm.toLowerCase();
    return (
      member.firstName.toLowerCase().includes(searchLower) ||
      member.lastName.toLowerCase().includes(searchLower) ||
      member.email.toLowerCase().includes(searchLower) ||
      member.role.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  // Check if we have a token in localStorage
  const token = localStorage.getItem('token');
  if (!token) {
    return null;
  }

  // Show loading while authentication is being determined
  if (!isAuthenticated && token) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center py-12">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Search Bar */}
      <div className="px-4 py-3 bg-white border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="px-4 py-6 pb-20">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="card p-3 text-center">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500 mb-1">Total Members</p>
            <p className="text-lg font-bold text-gray-900">{members.length}</p>
          </div>
          
          <div className="card p-3 text-center">
            <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500 mb-1">Active</p>
            <p className="text-lg font-bold text-gray-900">
              {members.filter(m => m.isActive).length}
            </p>
          </div>
          
          <div className="card p-3 text-center">
            <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500 mb-1">This Month</p>
            <p className="text-lg font-bold text-gray-900">
              {members.filter(m => {
                const memberDate = new Date(m.createdAt);
                const now = new Date();
                return memberDate.getMonth() === now.getMonth() && 
                       memberDate.getFullYear() === now.getFullYear();
              }).length}
            </p>
          </div>
        </div>

        {/* Members List */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Community Members</h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="loading-spinner"></div>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No members found</h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search terms.' : 'No members in the community yet.'}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredMembers.map((member) => (
                <div key={member._id} className="card active:bg-gray-50">
                  <div className="p-4">
                    <div className="flex items-center space-x-4">
                      {/* Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary-600" />
                        </div>
                      </div>
                      
                      {/* Member Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {member.firstName} {member.lastName}
                          </h4>
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
                        
                        <div className="space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            <span className="truncate">{member.email}</span>
                          </div>
                          
                          {member.phone && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-2 text-gray-400" />
                              <span>{member.phone}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                            <span>Joined {formatDate(member.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        <button
                          onClick={() => router.push(`/members/${member._id}`)}
                          className="text-primary-600 hover:text-primary-700 p-2 rounded-lg hover:bg-primary-50 transition-colors"
                        >
                          <User className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 