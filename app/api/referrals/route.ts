import { NextRequest, NextResponse } from 'next/server'
import { ReferralService } from '@/lib/referral-service'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/referrals - Get user's referral data
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'stats'

    switch (type) {
      case 'stats':
        const stats = await ReferralService.getUserReferralStats(session.user.id)
        return NextResponse.json({ success: true, stats })

      case 'history':
        const limit = parseInt(searchParams.get('limit') || '20')
        const history = await ReferralService.getUserReferralHistory(session.user.id, limit)
        return NextResponse.json(history)

      case 'code':
        const codeData = await ReferralService.getOrCreateReferralCode(session.user.id)
        return NextResponse.json(codeData)

      case 'leaderboard':
        const leaderboardLimit = parseInt(searchParams.get('limit') || '10')
        const leaderboard = await ReferralService.getReferralLeaderboard(leaderboardLimit)
        return NextResponse.json(leaderboard)

      default:
        return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 })
    }
  } catch (error: any) {
    console.error('Referral API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/referrals - Process a referral
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { referralCode, refereeId, metadata } = body

    if (!referralCode || !refereeId) {
      return NextResponse.json({ 
        error: 'Referral code and referee ID are required' 
      }, { status: 400 })
    }

    const result = await ReferralService.processReferral({
      referrerId: session.user.id,
      refereeId,
      referralCode,
      metadata,
    })

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Referral processed successfully',
      referral: result.referral 
    })
  } catch (error: any) {
    console.error('Referral processing error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
