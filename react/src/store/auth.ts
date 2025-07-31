import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User } from '@/lib/api'

interface AuthState {
  token: string | null
  user: User | null
  loading: boolean
  login: (user: User, token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      loading: false,
      login: (user: User, token: string) => {
        set({ token, user })
      },
      logout: () => {
        set({ token: null, user: null })
      },
      setLoading: (loading: boolean) => set({ loading }),
      updateUser: (user: User) => set({ user })
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ token: state.token, user: state.user })
    }
  )
) 