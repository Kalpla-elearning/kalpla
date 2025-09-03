import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user?.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { action, notes } = await request.json()

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    // Check if course exists and is pending review
    const course = await prisma.course.findUnique({
      where: { id: params.id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    if (course.status !== 'PENDING') {
      return NextResponse.json({ error: 'Course is not pending review' }, { status: 400 })
    }

    // Update course status
    const updatedCourse = await prisma.course.update({
      where: { id: params.id },
      data: {
        status: action === 'approve' ? 'PUBLISHED' : 'REJECTED',
      },
    })



    // Send email notification to instructor
    try {
      const { sendEmail } = require('@/lib/email')
      
      if (action === 'approve') {
        await sendEmail({
          to: course.instructor.email,
          subject: `Course Approved: ${course.title}`,
          template: 'course-approved',
          data: {
            instructorName: course.instructor.name,
            courseTitle: course.title,
            courseUrl: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.slug}`,
          },
        })
      } else {
        await sendEmail({
          to: course.instructor.email,
          subject: `Course Review Feedback: ${course.title}`,
          template: 'course-rejected',
          data: {
            instructorName: course.instructor.name,
            courseTitle: course.title,
            feedback: notes,
            editUrl: `${process.env.NEXT_PUBLIC_APP_URL}/instructor/courses/${course.id}/edit`,
          },
        })
      }
    } catch (emailError) {
      console.error('Failed to send email notification:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json({
      message: `Course ${action === 'approve' ? 'approved' : 'rejected'} successfully`,
      course: {
        id: updatedCourse.id,
        status: updatedCourse.status,
      },
    })

  } catch (error) {
    console.error('Error reviewing course:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
