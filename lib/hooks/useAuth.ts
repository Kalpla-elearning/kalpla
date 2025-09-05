'use client'

import { useAuth as useAmplifyAuth } from '@/components/providers/AuthProvider'

interface User {
  id: string
  name: string
  email: string
  image?: string
  role?: string
}

interface Session {
  user: User
}

interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

// Amplify Auth hook
export function useAuth(): AuthState {
  const amplifyAuth = useAmplifyAuth()
  
  return {
    user: amplifyAuth.user ? {
      id: amplifyAuth.user.id,
      name: amplifyAuth.user.name || '',
      email: amplifyAuth.user.email,
      role: amplifyAuth.user.role?.toLowerCase()
    } : null,
    loading: amplifyAuth.loading,
    signIn: async (email: string, password: string) => {
      const result = await amplifyAuth.signIn(email, password)
      if (!result.success) {
        throw new Error(result.error || 'Sign in failed')
      }
    },
    signOut: async () => {
      const result = await amplifyAuth.signOut()
      if (!result.success) {
        throw new Error(result.error || 'Sign out failed')
      }
    }
  }
}

// NextAuth-compatible useSession hook
export function useSession() {
  const auth = useAuth()
  
  return {
    data: auth.user ? { user: auth.user } : null,
    status: auth.loading ? 'loading' : auth.user ? 'authenticated' : 'unauthenticated'
  }
}

// NextAuth-compatible signIn function
export async function signIn(provider: string, options?: any) {
  if (provider === 'credentials' && options?.email && options?.password) {
    const auth = useAuth()
    await auth.signIn(options.email, options.password)
  }
}

// NextAuth-compatible getSession function
export async function getSession() {
  const auth = useAuth()
  return auth.user ? { user: auth.user } : null
}
