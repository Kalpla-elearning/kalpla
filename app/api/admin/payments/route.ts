import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const paymentMethod = searchParams.get('paymentMethod') || ''
    const startDate = searchParams.get('startDate') || ''
    const endDate = searchParams.get('endDate') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { order: { orderNumber: { contains: search, mode: 'insensitive' } } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
        { gatewayPaymentId: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (paymentMethod) {
      where.paymentMethod = paymentMethod
    }
    
    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = new Date(startDate)
      if (endDate) where.createdAt.lte = new Date(endDate)
    }

    // Build orderBy clause
    const orderBy: any = {}
    orderBy[sortBy] = order

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          order: {
            select: {
              id: true,
              orderNumber: true,
              type: true,
              itemTitle: true,
              totalAmount: true
            }
          }
        }
      }),
      prisma.payment.count({ where })
    ])

    // Calculate stats
    const stats = await prisma.payment.aggregate({
      _count: {
        id: true
      },
      _sum: {
        amount: true
      }
    })

    const successCount = await prisma.payment.count({
      where: { status: 'SUCCESS' }
    })

    const pendingCount = await prisma.payment.count({
      where: { status: 'PENDING' }
    })

    const failedCount = await prisma.payment.count({
      where: { status: 'FAILED' }
    })

    const refundedCount = await prisma.payment.count({
      where: { status: 'REFUNDED' }
    })

    // Calculate revenue by status
    const revenueStats = await prisma.payment.groupBy({
      by: ['status'],
      _sum: {
        amount: true
      }
    })

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        payments,
        stats: {
          totalPayments: stats._count.id,
          totalRevenue: stats._sum.amount || 0,
          successPayments: successCount,
          pendingPayments: pendingCount,
          failedPayments: failedCount,
          refundedPayments: refundedCount,
          revenueByStatus: revenueStats
        },
        pagination: {
          page,
          limit,
          total,
          pages: totalPages
        }
      }
    })
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
