import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth'
import HomePage from '@/pages/HomePage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import MembersPage from '@/pages/MembersPage'
import MemberDetailPage from '@/pages/MemberDetailPage'
import MemberEditPage from '@/pages/MemberEditPage'
import MemberAddPage from '@/pages/MemberAddPage'
import EventsPage from '@/pages/EventsPage'
import EventAddPage from '@/pages/EventAddPage'
import EventDetailPage from '@/pages/EventDetailPage'
import EventEditPage from '@/pages/EventEditPage'
import DonationsPage from '@/pages/DonationsPage'
import DonationAddPage from '@/pages/DonationAddPage'
import DonationDetailPage from '@/pages/DonationDetailPage'
import DonationEditPage from '@/pages/DonationEditPage'
import ProfilePage from '@/pages/ProfilePage'

// Simple route configuration for navigation
export const navigationRoutes = [
  { path: '/', title: 'Home', icon: '🏠', requiresAuth: false },
  { path: '/dashboard', title: 'Dashboard', icon: '🏠', requiresAuth: true },
  { path: '/members', title: 'Members', icon: '👥', requiresAuth: true },
  { path: '/events', title: 'Events', icon: '📅', requiresAuth: false },
  { path: '/donations', title: 'Donations', icon: '❤️', requiresAuth: true },
  { path: '/profile', title: 'Profile', icon: '👤', requiresAuth: true },
]

export function AppRoutes() {
  const { user } = useAuthStore()

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route 
        path="/login" 
        element={user ? <Navigate to="/dashboard" replace /> : <LoginPage />} 
      />
      <Route 
        path="/register" 
        element={user ? <Navigate to="/dashboard" replace /> : <RegisterPage />} 
      />

      {/* Public Routes */}
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route path="/members" element={<MembersPage />} />
      
      {/* Protected Routes - Check if user exists */}
      <Route 
        path="/dashboard" 
        element={user ? <DashboardPage /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/members/add" 
        element={user ? <MemberAddPage /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/members/:id" 
        element={user ? <MemberDetailPage /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/members/:id/edit" 
        element={user ? <MemberEditPage /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/events/add" 
        element={user ? <EventAddPage /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/events/:id/edit" 
        element={user ? <EventEditPage /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/donations" 
        element={user ? <DonationsPage /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/donations/add" 
        element={user ? <DonationAddPage /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/donations/:id/edit" 
        element={user ? <DonationEditPage /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/donations/:id" 
        element={user ? <DonationDetailPage /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/profile" 
        element={user ? <ProfilePage /> : <Navigate to="/login" replace />} 
      />
    </Routes>
  )
} 