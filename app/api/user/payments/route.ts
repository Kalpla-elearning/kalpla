import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Since the Enrollment model doesn't have payment fields, we'll create a mock payment history
    // based on the course enrollments. In a real application, you'd have a separate Payment model.
    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.user.id },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
            thumbnail: true,
            price: true
          }
        }
      },
      orderBy: { enrolledAt: 'desc' }
    })

    // Transform enrollments into payment-like objects
    const payments = enrollments.map((enrollment) => ({
      id: enrollment.id,
      amount: enrollment.course.price,
      currency: 'INR',
      status: 'SUCCESS', // Mock status - in real app this would come from payment gateway
      paymentMethod: 'Online Payment',
      paymentId: `PAY_${enrollment.id.slice(-8).toUpperCase()}`,
      enrolledAt: enrollment.enrolledAt,
      course: enrollment.course
    }))

    return NextResponse.json(payments)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
