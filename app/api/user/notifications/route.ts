import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Mock notifications - in a real application, these would come from a database
    const mockNotifications = [
      {
        id: '1',
        type: 'course_update' as const,
        title: 'Course Updated',
        message: 'The "Complete Web Development Bootcamp" course has been updated with new content.',
        isRead: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        actionUrl: '/courses/complete-web-development-bootcamp',
        priority: 'medium' as const
      },
      {
        id: '2',
        type: 'achievement' as const,
        title: 'Certificate Earned!',
        message: 'Congratulations! You\'ve earned a certificate for completing "JavaScript Fundamentals".',
        isRead: false,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        actionUrl: '/dashboard/certificates',
        priority: 'high' as const
      },
      {
        id: '3',
        type: 'payment' as const,
        title: 'Payment Successful',
        message: 'Your payment of ₹999 for "Python for Data Science" has been processed successfully.',
        isRead: true,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
        actionUrl: '/dashboard/payments',
        priority: 'low' as const
      },
      {
        id: '4',
        type: 'reminder' as const,
        title: 'Continue Learning',
        message: 'You haven\'t logged in for a while. Continue your learning journey!',
        isRead: true,
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
        actionUrl: '/dashboard/courses',
        priority: 'medium' as const
      },
      {
        id: '5',
        type: 'system' as const,
        title: 'Welcome to Kalpla!',
        message: 'Welcome to Kalpla! Start your learning journey by exploring our courses.',
        isRead: true,
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
        actionUrl: '/courses',
        priority: 'low' as const
      }
    ]

    return NextResponse.json(mockNotifications)
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
