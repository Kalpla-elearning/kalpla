import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PaymentService } from '@/lib/payment'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')
    const type = searchParams.get('type')

    // Get user's payments
    const result = await PaymentService.getUserPayments(session.user.id, page, limit)

    // Filter by status if provided
    let filteredPayments = result.payments
    if (status && status !== 'ALL') {
      filteredPayments = result.payments.filter(payment => payment.status === status)
    }

    // Filter by type if provided
    if (type && type !== 'ALL') {
      filteredPayments = filteredPayments.filter(payment => payment.order.type === type)
    }

    return NextResponse.json({
      success: true,
      payments: filteredPayments,
      pagination: result.pagination,
    })
  } catch (error) {
    console.error('Error fetching payment history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payment history' },
      { status: 500 }
    )
  }
}
