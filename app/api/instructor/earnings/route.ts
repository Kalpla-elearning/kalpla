import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const range = searchParams.get('range') || '30d'

    // Calculate date range
    const now = new Date()
    let startDate: Date
    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000)
        break
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    }

    const [
      totalEarnings,
      totalCourses,
      totalStudents,
      averageRating,
      courseEarnings,
      recentTransactions
    ] = await Promise.all([
      // Total earnings
      prisma.enrollment.aggregate({
        where: {
          course: {
            instructorId: session.user.id
          },
          enrolledAt: {
            gte: startDate
          }
        },
        _sum: {
          // Since we don't have amount field, we'll calculate from course prices
        }
      }),
      // Total courses
      prisma.course.count({
        where: { instructorId: session.user.id }
      }),
      // Total students
      prisma.enrollment.count({
        where: {
          course: {
            instructorId: session.user.id
          },
          enrolledAt: {
            gte: startDate
          }
        }
      }),
      // Average rating
      prisma.review.aggregate({
        where: {
          course: {
            instructorId: session.user.id
          }
        },
        _avg: {
          rating: true
        }
      }),
      // Course earnings
      prisma.course.findMany({
        where: { instructorId: session.user.id },
        include: {
          _count: {
            select: {
              enrollments: true,
              reviews: true
            }
          },
          reviews: {
            select: {
              rating: true
            }
          }
        }
      }),
      // Recent transactions (mock data for now)
      Promise.resolve([])
    ])

    // Calculate total earnings from course prices and enrollments
    const totalEarningsAmount = courseEarnings.reduce((sum, course) => {
      return sum + (course.price * course._count.enrollments)
    }, 0)

    // Generate monthly earnings data (mock data for demonstration)
    const monthlyEarnings = []
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    for (let i = 0; i < 6; i++) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1)
      monthlyEarnings.unshift({
        month: months[month.getMonth()],
        earnings: Math.floor(Math.random() * 50000) + 10000,
        students: Math.floor(Math.random() * 100) + 10
      })
    }

    // Transform course earnings data
    const transformedCourseEarnings = courseEarnings.map(course => ({
      courseId: course.id,
      courseTitle: course.title,
      earnings: course.price * course._count.enrollments,
      students: course._count.enrollments,
      rating: course.reviews.length > 0 
        ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
        : 0
    }))

    // Mock recent transactions
    const mockTransactions = [
      {
        id: '1',
        courseTitle: 'Complete Web Development Bootcamp',
        studentName: 'John Doe',
        amount: 999,
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'SUCCESS'
      },
      {
        id: '2',
        courseTitle: 'Python for Data Science',
        studentName: 'Jane Smith',
        amount: 799,
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'SUCCESS'
      },
      {
        id: '3',
        courseTitle: 'Digital Marketing Masterclass',
        studentName: 'Mike Johnson',
        amount: 599,
        date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'PENDING'
      }
    ]

    const earningsData = {
      totalEarnings: totalEarningsAmount,
      totalCourses,
      totalStudents,
      averageRating: averageRating._avg.rating || 0,
      monthlyEarnings,
      courseEarnings: transformedCourseEarnings,
      recentTransactions: mockTransactions
    }

    return NextResponse.json(earningsData)
  } catch (error) {
    console.error('Error fetching earnings data:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
