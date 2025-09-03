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
    const period = searchParams.get('period') || '30' // days
    const type = searchParams.get('type') || 'overview'

    const days = parseInt(period)
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    if (type === 'overview') {
      // Get overview analytics
      const [
        totalUsers,
        totalCourses,
        totalRevenue,
        totalEnrollments,
        userGrowth,
        revenueGrowth,
        enrollmentGrowth,
        courseGrowth,
        recentUsers,
        recentPayments,
        topCourses,
        userStats,
        paymentStats
      ] = await Promise.all([
        // Total counts
        prisma.user.count(),
        prisma.course.count(),
        prisma.payment.aggregate({
          where: { status: 'SUCCESS' },
          _sum: { amount: true }
        }),
        prisma.enrollment.count(),

        // Growth calculations
        prisma.user.count({
          where: { createdAt: { gte: startDate } }
        }),
        prisma.payment.aggregate({
          where: { 
            status: 'SUCCESS',
            createdAt: { gte: startDate }
          },
          _sum: { amount: true }
        }),
        prisma.enrollment.count({
          where: { enrolledAt: { gte: startDate } }
        }),
        prisma.course.count({
          where: { createdAt: { gte: startDate } }
        }),

        // Recent activity
        prisma.user.findMany({
          where: { createdAt: { gte: startDate } },
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
          }
        }),
        prisma.payment.findMany({
          where: { 
            status: 'SUCCESS',
            createdAt: { gte: startDate }
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: {
            user: { select: { name: true, email: true } },
            order: { select: { itemTitle: true } }
          }
        }),

        // Top courses by enrollment
        prisma.course.findMany({
          include: {
            _count: {
              select: { enrollments: true }
            },
            instructor: {
              select: { name: true }
            }
          },
          orderBy: {
            enrollments: { _count: 'desc' }
          },
          take: 10
        }),

        // User statistics
        prisma.user.groupBy({
          by: ['role'],
          _count: { id: true }
        }),

        // Payment statistics
        prisma.payment.groupBy({
          by: ['status'],
          _count: { id: true },
          _sum: { amount: true }
        })
      ])

      return NextResponse.json({
        success: true,
        data: {
          overview: {
            totalUsers,
            totalCourses,
            totalRevenue: totalRevenue._sum.amount || 0,
            totalEnrollments,
            userGrowth,
            revenueGrowth: revenueGrowth._sum.amount || 0,
            enrollmentGrowth,
            courseGrowth
          },
          recentActivity: {
            users: recentUsers,
            payments: recentPayments
          },
          topCourses: topCourses.map(course => ({
            ...course,
            enrollmentCount: course._count.enrollments
          })),
          userStats,
          paymentStats
        }
      })
    }

    if (type === 'revenue') {
      // Get revenue analytics
      const [
        totalRevenue,
        monthlyRevenue,
        dailyRevenue,
        revenueByStatus,
        revenueByType
      ] = await Promise.all([
        prisma.payment.aggregate({
          where: { status: 'SUCCESS' },
          _sum: { amount: true }
        }),

        // Monthly revenue for last 12 months
        prisma.$queryRaw`
          SELECT 
            DATE_TRUNC('month', "createdAt") as month,
            SUM(amount) as revenue
          FROM "payments" 
          WHERE status = 'SUCCESS' 
            AND "createdAt" >= NOW() - INTERVAL '12 months'
          GROUP BY DATE_TRUNC('month', "createdAt")
          ORDER BY month DESC
        `,

        // Daily revenue for last 30 days
        prisma.$queryRaw`
          SELECT 
            DATE_TRUNC('day', "createdAt") as day,
            SUM(amount) as revenue
          FROM "payments" 
          WHERE status = 'SUCCESS' 
            AND "createdAt" >= NOW() - INTERVAL '30 days'
          GROUP BY DATE_TRUNC('day', "createdAt")
          ORDER BY day DESC
        `,

        // Revenue by status
        prisma.payment.groupBy({
          by: ['status'],
          _sum: { amount: true },
          _count: { id: true }
        }),

        // Revenue by order type
        prisma.payment.groupBy({
          by: ['order'],
          _sum: { amount: true },
          _count: { id: true }
        })
      ])

      return NextResponse.json({
        success: true,
        data: {
          totalRevenue: totalRevenue._sum.amount || 0,
          monthlyRevenue,
          dailyRevenue,
          revenueByStatus,
          revenueByType
        }
      })
    }

    if (type === 'users') {
      // Get user analytics
      const [
        totalUsers,
        userGrowth,
        userByRole,
        userByVerification,
        userRegistrationTrend
      ] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
          where: { createdAt: { gte: startDate } }
        }),
        prisma.user.groupBy({
          by: ['role'],
          _count: { id: true }
        }),
        prisma.user.groupBy({
          by: ['isVerified'],
          _count: { id: true }
        }),
        prisma.$queryRaw`
          SELECT 
            DATE_TRUNC('day', "createdAt") as day,
            COUNT(*) as count
          FROM "users" 
          WHERE "createdAt" >= NOW() - INTERVAL '30 days'
          GROUP BY DATE_TRUNC('day', "createdAt")
          ORDER BY day DESC
        `
      ])

      return NextResponse.json({
        success: true,
        data: {
          totalUsers,
          userGrowth,
          userByRole,
          userByVerification,
          userRegistrationTrend
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid analytics type' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
