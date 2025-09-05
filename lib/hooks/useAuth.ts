'use client'

import { useState, useEffect } from 'react'

interface User {
  id: string
  name: string
  email: string
  image?: string
  role?: string
}

interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock auth state for build time
    setUser(null)
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    // Mock sign in
    console.log('Sign in:', email)
  }

  const signOut = async () => {
    // Mock sign out
    setUser(null)
  }

  return {
    user,
    loading,
    signIn,
    signOut
  }
}

// Mock useSession for compatibility
export function useSession() {
  const auth = useAuth()
  return {
    data: auth.user ? { user: auth.user } : null,
    status: auth.loading ? 'loading' : auth.user ? 'authenticated' : 'unauthenticated'
  }
}
