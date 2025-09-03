import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// Standard API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Authentication utilities
export const requireAuth = async (): Promise<{ error: string; status: number } | { session: any }> => {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { error: 'Unauthorized', status: 401 }
  }
  return { session }
}

export const requireRole = async (allowedRoles: string[]): Promise<{ error: string; status: number } | { session: any }> => {
  const authResult = await requireAuth()
  if ('error' in authResult) return authResult

  const { session } = authResult
  if (!allowedRoles.includes(session.user.role)) {
    return { error: 'Insufficient permissions', status: 403 }
  }

  return { session }
}

// Response utilities
export const successResponse = <T>(data: T, message?: string) => {
  return NextResponse.json({
    success: true,
    data,
    message
  })
}

export const errorResponse = (error: string, status: number = 500) => {
  return NextResponse.json({
    success: false,
    error
  }, { status })
}

export const validationError = (field: string, message: string) => {
  return errorResponse(`${field}: ${message}`, 400)
}

export const notFoundError = (resource: string) => {
  return errorResponse(`${resource} not found`, 404)
}

export const unauthorizedError = () => {
  return errorResponse('Unauthorized', 401)
}

export const forbiddenError = () => {
  return errorResponse('Insufficient permissions', 403)
}

// Validation utilities
export const validateRequired = (data: any, fields: string[]) => {
  const missing = fields.filter(field => !data[field])
  if (missing.length > 0) {
    return { error: `Missing required fields: ${missing.join(', ')}` }
  }
  return null
}

export const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return { error: 'Invalid email format' }
  }
  return null
}

export const validateFile = (file: File, maxSize: number, allowedTypes: string[]) => {
  if (file.size > maxSize) {
    return { error: `File size exceeds maximum allowed size of ${maxSize / (1024 * 1024)}MB` }
  }

  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'))
  if (!allowedTypes.includes(fileExtension)) {
    return { error: `File type ${fileExtension} is not allowed` }
  }

  return null
}

// Database utilities
export const handleDatabaseError = (error: any) => {
  console.error('Database error:', error)
  
  if (error.code === 'P2002') {
    return errorResponse('Resource already exists', 409)
  }
  
  if (error.code === 'P2025') {
    return errorResponse('Resource not found', 404)
  }
  
  return errorResponse('Database operation failed', 500)
}

// File upload utilities
export const extractFileFromFormData = async (formData: FormData, fieldName: string): Promise<{ error: string } | { file: File }> => {
  const file = formData.get(fieldName) as File | null
  if (!file) {
    return { error: `No ${fieldName} provided` }
  }
  return { file }
}

export const convertFileToBuffer = async (file: File): Promise<{ error: string } | { buffer: Buffer }> => {
  try {
    const bytes = await file.arrayBuffer()
    return { buffer: Buffer.from(bytes) }
  } catch (error) {
    return { error: 'Failed to process file' }
  }
}

// Pagination utilities
export const getPaginationParams = (searchParams: URLSearchParams) => {
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const skip = (page - 1) * limit

  return {
    page: Math.max(1, page),
    limit: Math.min(100, Math.max(1, limit)),
    skip
  }
}

export const createPaginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) => {
  return successResponse({
    data,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1
    }
  })
}

// Search utilities
export const createSearchQuery = (searchTerm: string, fields: string[]) => {
  if (!searchTerm) return {}
  
  return {
    OR: fields.map(field => ({
      [field]: {
        contains: searchTerm,
        mode: 'insensitive' as const
      }
    }))
  }
}

// Sorting utilities
export const getSortParams = (searchParams: URLSearchParams, defaultSort: string = 'createdAt') => {
  const sortBy = searchParams.get('sortBy') || defaultSort
  const sortOrder = searchParams.get('sortOrder') || 'desc'
  
  return {
    [sortBy]: sortOrder === 'asc' ? 'asc' : 'desc'
  }
}

// Error handling wrapper
export const withErrorHandling = <T extends any[], R>(
  handler: (...args: T) => Promise<R>
) => {
  return async (...args: T): Promise<R> => {
    try {
      return await handler(...args)
    } catch (error) {
      console.error('API Error:', error)
      throw error
    }
  }
}

// Rate limiting utilities
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const requests = new Map<string, { count: number; resetTime: number }>()
  
  return (identifier: string) => {
    const now = Date.now()
    const userRequests = requests.get(identifier)
    
    if (!userRequests || now > userRequests.resetTime) {
      requests.set(identifier, { count: 1, resetTime: now + windowMs })
      return true
    }
    
    if (userRequests.count >= maxRequests) {
      return false
    }
    
    userRequests.count++
    return true
  }
}

// Cache utilities
export const createCache = <T>(ttl: number = 5 * 60 * 1000) => {
  const cache = new Map<string, { data: T; expiry: number }>()
  
  return {
    get: (key: string): T | null => {
      const item = cache.get(key)
      if (!item || Date.now() > item.expiry) {
        cache.delete(key)
        return null
      }
      return item.data
    },
    set: (key: string, data: T) => {
      cache.set(key, { data, expiry: Date.now() + ttl })
    },
    delete: (key: string) => {
      cache.delete(key)
    },
    clear: () => {
      cache.clear()
    }
  }
}
