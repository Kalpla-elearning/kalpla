'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { AmplifyAuthService, AuthUser } from '@/lib/amplify-auth'

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string; userId?: string }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  confirmSignUp: (email: string, code: string) => Promise<{ success: boolean; error?: string }>
  resendVerificationCode: (email: string) => Promise<{ success: boolean; error?: string }>
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await AmplifyAuthService.getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await AmplifyAuthService.signIn({ email, password })
      if (result.success && result.user) {
        setUser(result.user)
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, name: string) => {
    setLoading(true)
    try {
      const result = await AmplifyAuthService.signUp({ email, password, name })
      return result
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    setLoading(true)
    try {
      const result = await AmplifyAuthService.signOut()
      if (result.success) {
        setUser(null)
      }
      return result
    } finally {
      setLoading(false)
    }
  }

  const confirmSignUp = async (email: string, code: string) => {
    setLoading(true)
    try {
      const result = await AmplifyAuthService.confirmSignUp(email, code)
      return result
    } finally {
      setLoading(false)
    }
  }

  const resendVerificationCode = async (email: string) => {
    setLoading(true)
    try {
      const result = await AmplifyAuthService.resendVerificationCode(email)
      return result
    } finally {
      setLoading(false)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    confirmSignUp,
    resendVerificationCode,
    isAuthenticated: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
