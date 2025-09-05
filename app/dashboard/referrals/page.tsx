'use client'

import { ReferralDashboard } from '@/components/referrals/ReferralDashboard'
import { ReferralLeaderboard } from '@/components/referrals/ReferralLeaderboard'

export default function ReferralsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Referral Program</h1>
        <p className="text-gray-600 mt-1">
          Invite friends and earn rewards for every successful referral
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReferralDashboard />
        </div>
        
        <div className="lg:col-span-1">
          <ReferralLeaderboard />
        </div>
      </div>
    </div>
  )
}
