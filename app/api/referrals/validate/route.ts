import { NextRequest, NextResponse } from 'next/server'
import { ReferralService } from '@/lib/referral-service'

// POST /api/referrals/validate - Validate a referral code
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code } = body

    if (!code) {
      return NextResponse.json({ 
        error: 'Referral code is required' 
      }, { status: 400 })
    }

    const result = await ReferralService.validateReferralCode(code)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('Referral validation error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
