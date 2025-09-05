'use client'

import { useState, useEffect } from 'react'
import { 
  ShareIcon, 
  TrophyIcon, 
  CurrencyDollarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/outline'

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

export function ReferralDashboard() {
  // Mock user data for now
  const user = { id: '1', name: 'John Doe', email: 'john@example.com' }
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [referralCode, setReferralCode] = useState<ReferralCode | null>(null)
  const [history, setHistory] = useState<ReferralHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    try {
      setLoading(true)
      
      // Fetch stats
      const statsResponse = await fetch('/api/referrals?type=stats')
      const statsData = await statsResponse.json()
      if (statsData.success) {
        setStats(statsData.stats)
      }

      // Fetch referral code
      const codeResponse = await fetch('/api/referrals?type=code')
      const codeData = await codeResponse.json()
      if (codeData.success) {
        setReferralCode({
          code: codeData.referralCode.code,
          discount: codeData.referralCode.discount || 0,
          reward: codeData.referralCode.reward || 0,
        })
      }

      // Fetch history
      const historyResponse = await fetch('/api/referrals?type=history&limit=10')
      const historyData = await historyResponse.json()
      if (historyData.success) {
        setHistory(historyData.referrals)
      }
    } catch (error) {
      console.error('Error fetching referral data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralCode = async () => {
    if (referralCode) {
      const referralUrl = `${window.location.origin}?ref=${referralCode.code}`
      await navigator.clipboard.writeText(referralUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareReferral = async () => {
    if (referralCode) {
      const referralUrl = `${window.location.origin}?ref=${referralCode.code}`
      const shareText = `Join me on Kalpla! Use my referral code ${referralCode.code} to get ${referralCode.discount}% off your first course. I'll also get ₹${referralCode.reward} when you sign up!`
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Join Kalpla with my referral',
            text: shareText,
            url: referralUrl,
          })
        } catch (error) {
          console.log('Error sharing:', error)
        }
      } else {
        // Fallback to copying
        await navigator.clipboard.writeText(`${shareText}\n\n${referralUrl}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Referral Program</h2>
        <p className="text-primary-100">
          Invite friends and earn rewards! Share your referral code and get ₹{referralCode?.reward || 500} for each successful referral.
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <UserGroupIcon className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalReferrals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <TrophyIcon className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-gray-900">{stats.successfulReferrals}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings.toFixed(0)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.conversionRate.toFixed(1)}%</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Referral Code Section */}
      {referralCode && (
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Your Referral Code</h3>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="bg-gray-50 rounded-lg p-4 border-2 border-dashed border-gray-300">
                <p className="text-sm text-gray-600 mb-2">Share this code with friends:</p>
                <div className="flex items-center space-x-2">
                  <code className="text-2xl font-bold text-primary-600">{referralCode.code}</code>
                  <button
                    onClick={copyReferralCode}
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <ClipboardDocumentIcon className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Friends get {referralCode.discount}% off • You earn ₹{referralCode.reward}
                </p>
              </div>
            </div>
            <div className="flex flex-col space-y-2">
              <button
                onClick={copyReferralCode}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={shareReferral}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <ShareIcon className="h-4 w-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Referral History */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Recent Referrals</h3>
        </div>
        <div className="p-6">
          {history.length > 0 ? (
            <div className="space-y-4">
              {history.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <span className="text-primary-600 font-semibold">
                        {referral.referee.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{referral.referee.name}</p>
                      <p className="text-sm text-gray-500">{referral.referee.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      referral.status === 'COMPLETED' 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {referral.status}
                    </span>
                    {referral.rewardAmount && (
                      <p className="text-sm text-green-600 font-medium mt-1">
                        +₹{referral.rewardAmount}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No referrals yet. Start sharing your code!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
