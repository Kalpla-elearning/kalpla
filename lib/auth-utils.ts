import { AmplifyAuthService, User } from './amplify-auth-enhanced'

export type UserRole = 'STUDENT' | 'MENTOR' | 'ADMIN'

export interface AuthState {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  role: UserRole | null
}

export const getRedirectPath = (role: UserRole): string => {
  switch (role) {
    case 'STUDENT':
      return '/dashboard/student'
    case 'MENTOR':
      return '/dashboard/mentor'
    case 'ADMIN':
      return '/dashboard/admin'
    default:
      return '/'
  }
}

export const hasPermission = (userRole: UserRole | null, requiredRole: UserRole): boolean => {
  if (!userRole) return false
  
  const roleHierarchy = {
    'STUDENT': 1,
    'MENTOR': 2,
    'ADMIN': 3,
  }
  
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

export const canAccessResource = (userRole: UserRole | null, resource: string): boolean => {
  if (!userRole) return false
  
  const permissions = {
    'STUDENT': [
      'dashboard', 'courses', 'assignments', 'leaderboard', 
      'profile', 'notifications', 'mentorship-program'
    ],
    'MENTOR': [
      'dashboard', 'students', 'assignments', 'grading', 
      'content-management', 'reports', 'profile'
    ],
    'ADMIN': [
      'dashboard', 'users', 'courses', 'assignments', 
      'leaderboard-control', 'payments', 'analytics', 
      'settings', 'profile'
    ],
  }
  
  return permissions[userRole]?.includes(resource) || false
}

export const getRoleDisplayName = (role: UserRole): string => {
  switch (role) {
    case 'STUDENT':
      return 'Student'
    case 'MENTOR':
      return 'Mentor'
    case 'ADMIN':
      return 'Administrator'
    default:
      return 'User'
  }
}

export const getRoleColor = (role: UserRole): string => {
  switch (role) {
    case 'STUDENT':
      return 'bg-blue-100 text-blue-800'
    case 'MENTOR':
      return 'bg-purple-100 text-purple-800'
    case 'ADMIN':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
