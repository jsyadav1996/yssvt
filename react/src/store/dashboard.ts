import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DashboardOverview } from '@/lib/api'

interface DashboardState {
  overview: DashboardOverview
  // recentActivities: {
  //   id: string
  //   activityType: string
  //   description: string
  //   date: string
  // }[]
  updateOverview: (overview: DashboardOverview) => void
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      overview: {
        totalEvents: 0,
        totalDonations: 0,
        totalMembers: 0,
        totalDonationAmount: 0
      },
      updateOverview: (overview: DashboardOverview) => set({ overview })
    }),
    {
      name: 'dashboard-storage',
      partialize: (state) => ({ overview: state.overview })
    }
  )
) 