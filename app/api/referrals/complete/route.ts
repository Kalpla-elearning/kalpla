import { NextRequest, NextResponse } from 'next/server'
import { ReferralService } from '@/lib/referral-service'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// POST /api/referrals/complete - Complete a referral (when purchase is made)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { referralId, purchaseAmount } = body

    if (!referralId || !purchaseAmount) {
      return NextResponse.json({ 
        error: 'Referral ID and purchase amount are required' 
      }, { status: 400 })
    }

    const result = await ReferralService.completeReferral(referralId, purchaseAmount)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Referral completed successfully',
      referral: result.referral 
    })
  } catch (error: any) {
    console.error('Referral completion error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
