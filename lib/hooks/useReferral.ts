import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'

interface ReferralStats {
  totalReferrals: number
  successfulReferrals: number
  totalEarnings: number
  conversionRate: number
}

interface ReferralCode {
  code: string
  discount: number
  reward: number
}

interface ReferralHistory {
  id: string
  status: string
  createdAt: string
  referee: {
    name: string
    email: string
    avatar?: string
  }
  rewardAmount?: number
  discountAmount?: number
}

export function useReferral() {
  const { user } = useAuth()
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null)
  const [history, setHistory] = useState<ReferralHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch referral stats
  const fetchStats = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/referrals?type=stats')
      const data = await response.json()
      
      if (data.success) {
        setStats(data.stats)
      } else {
        setError(data.error || 'Failed to fetch stats')
      }
    } catch (err) {
      setError('Failed to fetch referral stats')
    } finally {
      setLoading(false)
    }
  }

  // Fetch referral code
  const fetchReferralCode = async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/referrals?type=code')
      const data = await response.json()
      
      if (data.success) {
        setReferralCode({
          code: data.referralCode.code,
          discount: data.referralCode.discount || 0,
          reward: data.referralCode.reward || 0,
        })
      } else {
        setError(data.error || 'Failed to fetch referral code')
      }
    } catch (err) {
      setError('Failed to fetch referral code')
    } finally {
      setLoading(false)
    }
  }

  // Fetch referral history
  const fetchHistory = async (limit: number = 20) => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch(`/api/referrals?type=history&limit=${limit}`)
      const data = await response.json()
      
      if (data.success) {
        setHistory(data.referrals)
      } else {
        setError(data.error || 'Failed to fetch history')
      }
    } catch (err) {
      setError('Failed to fetch referral history')
    } finally {
      setLoading(false)
    }
  }

  // Process a referral
  const processReferral = async (refereeId: string, referralCode: string, metadata?: any) => {
    if (!user) return { success: false, error: 'User not authenticated' }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refereeId,
          referralCode,
          metadata,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        // Refresh stats after successful referral
        await fetchStats()
        return { success: true, referral: data.referral }
      } else {
        setError(data.error || 'Failed to process referral')
        return { success: false, error: data.error }
      }
    } catch (err) {
      const errorMsg = 'Failed to process referral'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Validate referral code
  const validateReferralCode = async (code: string) => {
    try {
      setError(null)
      
      const response = await fetch('/api/referrals/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }),
      })

      const data = await response.json()
      return data
    } catch (err) {
      return { success: false, error: 'Failed to validate referral code' }
    }
  }

  // Complete a referral (when purchase is made)
  const completeReferral = async (referralId: string, purchaseAmount: number) => {
    if (!user) return { success: false, error: 'User not authenticated' }

    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/referrals/complete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          referralId,
          purchaseAmount,
        }),
      })

      const data = await response.json()
      
      if (data.success) {
        // Refresh stats after successful completion
        await fetchStats()
        return { success: true, referral: data.referral }
      } else {
        setError(data.error || 'Failed to complete referral')
        return { success: false, error: data.error }
      }
    } catch (err) {
      const errorMsg = 'Failed to complete referral'
      setError(errorMsg)
      return { success: false, error: errorMsg }
    } finally {
      setLoading(false)
    }
  }

  // Get referral URL
  const getReferralUrl = (code?: string) => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''
    const referralCode = code || referralCode?.code
    return referralCode ? `${baseUrl}?ref=${referralCode}` : baseUrl
  }

  // Copy referral URL to clipboard
  const copyReferralUrl = async (code?: string) => {
    try {
      const url = getReferralUrl(code)
      await navigator.clipboard.writeText(url)
      return { success: true }
    } catch (err) {
      return { success: false, error: 'Failed to copy URL' }
    }
  }

  // Share referral
  const shareReferral = async (code?: string) => {
    try {
      const url = getReferralUrl(code)
      const shareText = `Join me on Kalpla! Use my referral code ${code || referralCode?.code} to get ${referralCode?.discount || 10}% off your first course. I'll also get ₹${referralCode?.reward || 500} when you sign up!`
      
      if (navigator.share) {
        await navigator.share({
          title: 'Join Kalpla with my referral',
          text: shareText,
          url: url,
        })
        return { success: true }
      } else {
        // Fallback to copying
        await navigator.clipboard.writeText(`${shareText}\n\n${url}`)
        return { success: true, message: 'Referral text copied to clipboard' }
      }
    } catch (err) {
      return { success: false, error: 'Failed to share referral' }
    }
  }

  // Load all referral data
  const loadReferralData = async () => {
    if (!user) return

    await Promise.all([
      fetchStats(),
      fetchReferralCode(),
      fetchHistory(),
    ])
  }

  // Auto-load data when user changes
  useEffect(() => {
    if (user) {
      loadReferralData()
    }
  }, [user])

  return {
    // Data
    stats,
    referralCode,
    history,
    loading,
    error,
    
    // Actions
    fetchStats,
    fetchReferralCode,
    fetchHistory,
    processReferral,
    validateReferralCode,
    completeReferral,
    getReferralUrl,
    copyReferralUrl,
    shareReferral,
    loadReferralData,
    
    // Utilities
    clearError: () => setError(null),
  }
}
