import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const bookSessionSchema = z.object({
  mentorId: z.string(),
  title: z.string().min(1, 'Session title is required'),
  description: z.string().min(1, 'Session description is required'),
  scheduledAt: z.string().datetime(),
  duration: z.number().min(15).max(180), // 15 minutes to 3 hours
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = bookSessionSchema.parse(body)

    // Check if mentor exists and is active
    const mentor = await prisma.mentor.findUnique({
      where: { id: validatedData.mentorId },
      include: { user: true }
    })

    if (!mentor || !mentor.isActive) {
      return NextResponse.json({ error: 'Mentor not found or inactive' }, { status: 404 })
    }

    // Check if user is enrolled in any mentorship program with this mentor
    const enrollment = await prisma.mentorshipEnrollment.findFirst({
      where: {
        userId: session.user.id,
        program: {
          mentorId: validatedData.mentorId
        },
        status: 'ACTIVE'
      }
    })

    if (!enrollment) {
      return NextResponse.json({ error: 'You must be enrolled in a mentorship program with this mentor to book sessions' }, { status: 400 })
    }

    // Check if the requested time is available (basic check - in a real app, you'd check mentor's calendar)
    const existingSession = await prisma.mentorshipSession.findFirst({
      where: {
        mentorId: validatedData.mentorId,
        scheduledAt: new Date(validatedData.scheduledAt),
        status: {
          in: ['SCHEDULED', 'IN_PROGRESS']
        }
      }
    })

    if (existingSession) {
      return NextResponse.json({ error: 'This time slot is not available' }, { status: 409 })
    }

    // Create the session
    const mentorshipSession = await prisma.mentorshipSession.create({
      data: {
        enrollmentId: enrollment.id,
        mentorId: validatedData.mentorId,
        title: validatedData.title,
        description: validatedData.description,
        scheduledAt: new Date(validatedData.scheduledAt),
        duration: validatedData.duration,
        status: 'SCHEDULED'
      },
      include: {
        mentor: {
          include: { user: true }
        },
        enrollment: {
          include: { program: true }
        }
      }
    })

    return NextResponse.json({
      message: 'Session booked successfully',
      session: mentorshipSession
    })

  } catch (error) {
    console.error('Error booking session:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
