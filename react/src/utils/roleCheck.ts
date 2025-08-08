import { useAuthStore } from '@/store/auth'

// Simple role check hook
export const useRoleCheck = () => {
  const { user } = useAuthStore()
  
  return {
    user,
    isSystemAdmin: user?.role === 'system_admin',
    isAdmin: user?.role === 'admin' || user?.role === 'system_admin',
    isManager: user?.role === 'manager' || user?.role === 'admin' || user?.role === 'system_admin',
    isMember: user?.role === 'member' || user?.role === 'manager' || user?.role === 'admin' || user?.role === 'system_admin',
    isAuthenticated: !!user
  }
}

// Simple standalone functions
export const checkRole = (userRole: string | undefined, requiredRole: string): boolean => {
  if (!userRole) return false
  
  const roleHierarchy = {
    member: 1,
    manager: 2,
    admin: 3,
    system_admin: 4
  }
  
  return roleHierarchy[userRole as keyof typeof roleHierarchy] >= roleHierarchy[requiredRole as keyof typeof roleHierarchy]
}

export const requireAdmin = (userRole: string | undefined): boolean => ['admin', 'system_admin'].includes(userRole || '')
export const requireManager = (userRole: string | undefined): boolean => ['admin', 'manager', 'system_admin'].includes(userRole || '')
export const requireMember = (userRole: string | undefined): boolean => ['admin', 'manager', 'member', 'system_admin'].includes(userRole || '')
