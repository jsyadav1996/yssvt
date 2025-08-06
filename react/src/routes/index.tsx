import { Routes, Route } from 'react-router-dom'
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
  { path: '/donations', title: 'Donations', icon: '❤️', requiresAuth: false },
  { path: '/profile', title: 'Profile', icon: '👤', requiresAuth: true },
]

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/members" element={<MembersPage />} />
      <Route path="/members/add" element={<MemberAddPage />} />
      <Route path="/members/:id" element={<MemberDetailPage />} />
      <Route path="/members/:id/edit" element={<MemberEditPage />} />
      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/add" element={<EventAddPage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />
      <Route path="/events/:id/edit" element={<EventEditPage />} />
      <Route path="/donations" element={<DonationsPage />} />
      <Route path="/donations/add" element={<DonationAddPage />} />
      <Route path="/donations/:id" element={<DonationDetailPage />} />
      <Route path="/donations/:id/edit" element={<DonationEditPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  )
} 