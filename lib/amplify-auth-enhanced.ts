import { Auth } from 'aws-amplify'
import { Amplify } from 'aws-amplify'
import amplifyConfig from './amplify-config'

// Configure Amplify on the client side
if (typeof window !== 'undefined') {
  Amplify.configure(amplifyConfig)
}

export interface User {
  id: string
  email: string
  name: string
  role: 'STUDENT' | 'MENTOR' | 'ADMIN'
  cohort?: string
  points?: number
  mentorId?: string
  picture?: string
  isVerified: boolean
}

export interface SignUpData {
  email: string
  password: string
  name: string
  role: 'STUDENT' | 'MENTOR' | 'ADMIN'
  cohort?: string
}

export const AmplifyAuthService = {
  async signUp(data: SignUpData) {
    try {
      const { user } = await Auth.signUp({
        username: data.email,
        password: data.password,
        attributes: {
          email: data.email,
          name: data.name,
          'custom:role': data.role,
          'custom:cohort': data.cohort || '',
          'custom:points': '0',
        },
      })
      console.log('Sign up success:', user)
      return { success: true, user }
    } catch (error: any) {
      console.error('Error signing up:', error)
      return { success: false, error: error.message || 'Sign up failed' }
    }
  },

  async confirmSignUp(username: string, code: string) {
    try {
      await Auth.confirmSignUp(username, code)
      console.log('Confirm sign up success')
      return { success: true }
    } catch (error: any) {
      console.error('Error confirming sign up:', error)
      return { success: false, error: error.message || 'Confirmation failed' }
    }
  },

  async signIn(username: string, password: string) {
    try {
      const user = await Auth.signIn(username, password)
      console.log('Sign in success:', user)
      return { success: true, user }
    } catch (error: any) {
      console.error('Error signing in:', error)
      return { success: false, error: error.message || 'Sign in failed' }
    }
  },

  async signOut() {
    try {
      await Auth.signOut()
      console.log('Sign out success')
      return { success: true }
    } catch (error: any) {
      console.error('Error signing out:', error)
      return { success: false, error: error.message || 'Sign out failed' }
    }
  },

  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await Auth.currentAuthenticatedUser()
      return this.formatUser(user)
    } catch (error) {
      console.log('No authenticated user:', error)
      return null
    }
  },

  async updateUserAttributes(attributes: Partial<User>) {
    try {
      const user = await Auth.currentAuthenticatedUser()
      const updateData: any = {}
      
      if (attributes.name) updateData.name = attributes.name
      if (attributes.cohort) updateData['custom:cohort'] = attributes.cohort
      if (attributes.points !== undefined) updateData['custom:points'] = attributes.points.toString()
      if (attributes.mentorId) updateData['custom:mentorId'] = attributes.mentorId

      await Auth.updateUserAttributes(user, updateData)
      console.log('User attributes updated successfully')
      return { success: true }
    } catch (error: any) {
      console.error('Error updating user attributes:', error)
      return { success: false, error: error.message || 'Update failed' }
    }
  },

  async resendSignUpCode(username: string) {
    try {
      await Auth.resendSignUpCode(username)
      console.log('Code resent successfully')
      return { success: true }
    } catch (error: any) {
      console.error('Error resending code:', error)
      return { success: false, error: error.message || 'Failed to resend code' }
    }
  },

  async forgotPassword(username: string) {
    try {
      await Auth.forgotPassword(username)
      console.log('Forgot password code sent successfully')
      return { success: true }
    } catch (error: any) {
      console.error('Error sending forgot password code:', error)
      return { success: false, error: error.message || 'Failed to send forgot password code' }
    }
  },

  async forgotPasswordSubmit(username: string, code: string, newPassword: string) {
    try {
      await Auth.forgotPasswordSubmit(username, code, newPassword)
      console.log('Password reset successfully')
      return { success: true }
    } catch (error: any) {
      console.error('Error resetting password:', error)
      return { success: false, error: error.message || 'Failed to reset password' }
    }
  },

  formatUser(cognitoUser: any): User {
    const attributes = cognitoUser.attributes || {}
    return {
      id: cognitoUser.username,
      email: attributes.email || '',
      name: attributes.name || '',
      role: (attributes['custom:role'] as 'STUDENT' | 'MENTOR' | 'ADMIN') || 'STUDENT',
      cohort: attributes['custom:cohort'] || undefined,
      points: parseInt(attributes['custom:points'] || '0'),
      mentorId: attributes['custom:mentorId'] || undefined,
      picture: attributes.picture || undefined,
      isVerified: attributes.email_verified || false,
    }
  },

  // Role-based access control helpers
  hasRole(user: User | null, requiredRole: 'STUDENT' | 'MENTOR' | 'ADMIN'): boolean {
    if (!user) return false
    
    const roleHierarchy = {
      'STUDENT': 1,
      'MENTOR': 2,
      'ADMIN': 3,
    }
    
    return roleHierarchy[user.role] >= roleHierarchy[requiredRole]
  },

  canAccess(user: User | null, resource: string): boolean {
    if (!user) return false
    
    const permissions = {
      'STUDENT': ['dashboard', 'courses', 'assignments', 'leaderboard', 'profile'],
      'MENTOR': ['dashboard', 'courses', 'assignments', 'students', 'grading', 'profile'],
      'ADMIN': ['dashboard', 'users', 'courses', 'assignments', 'analytics', 'settings', 'profile'],
    }
    
    return permissions[user.role]?.includes(resource) || false
  },

  getRedirectPath(user: User): string {
    switch (user.role) {
      case 'STUDENT':
        return '/dashboard'
      case 'MENTOR':
        return '/mentor/dashboard'
      case 'ADMIN':
        return '/admin/dashboard'
      default:
        return '/'
    }
  },
}
