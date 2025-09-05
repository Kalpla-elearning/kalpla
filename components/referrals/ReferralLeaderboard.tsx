'use client'

import { useState, useEffect } from 'react'
import { TrophyIcon, UserIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline'

interface LeaderboardUser {
  id: string
  name: string
  email: string
  avatar?: string
  totalReferrals: number
  successfulReferrals: number
  totalEarnings: number
  rank: number
}

export function ReferralLeaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/referrals?type=leaderboard&limit=10')
      const data = await response.json()
      
      if (data.success) {
        setLeaderboard(data.leaderboard)
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center">
          <TrophyIcon className="h-6 w-6 text-yellow-500 mr-2" />
          <h3 className="text-lg font-semibold">Referral Leaderboard</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Top referrers this month
        </p>
      </div>
      
      <div className="p-6">
        {leaderboard.length > 0 ? (
          <div className="space-y-4">
            {leaderboard.map((user, index) => (
              <div 
                key={user.id} 
                className={`flex items-center justify-between p-4 rounded-lg ${
                  index < 3 
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' 
                    : 'bg-gray-50'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                    index === 0 
                      ? 'bg-yellow-500' 
                      : index === 1 
                        ? 'bg-gray-400' 
                        : index === 2 
                          ? 'bg-orange-500' 
                          : 'bg-primary-500'
                  }`}>
                    {index < 3 ? (
                      <TrophyIcon className="h-5 w-5" />
                    ) : (
                      <span className="text-sm">#{user.rank}</span>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      {index < 3 && (
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                          index === 0 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : index === 1 
                              ? 'bg-gray-100 text-gray-800' 
                              : 'bg-orange-100 text-orange-800'
                        }`}>
                          {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <UserIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">{user.successfulReferrals}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">₹{user.totalEarnings.toFixed(0)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {user.totalReferrals} total referrals
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <TrophyIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No referrals yet. Be the first to refer someone!</p>
          </div>
        )}
      </div>
    </div>
  )
}
