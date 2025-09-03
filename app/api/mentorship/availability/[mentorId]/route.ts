import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { mentorId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date') // Format: YYYY-MM-DD

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }

    // Check if mentor exists and is active
    const mentor = await prisma.mentor.findUnique({
      where: { id: params.mentorId },
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
          mentorId: params.mentorId
        },
        status: 'ACTIVE'
      }
    })

    if (!enrollment) {
      return NextResponse.json({ error: 'You must be enrolled in a mentorship program with this mentor to view availability' }, { status: 400 })
    }

    // Get the start and end of the requested date
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)
    
    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    // Get existing sessions for this mentor on the requested date
    const existingSessions = await prisma.mentorshipSession.findMany({
      where: {
        mentorId: params.mentorId,
        scheduledAt: {
          gte: startOfDay,
          lte: endOfDay
        },
        status: {
          in: ['SCHEDULED', 'IN_PROGRESS']
        }
      },
      select: {
        scheduledAt: true,
        duration: true
      }
    })

    // Generate available time slots (9 AM to 6 PM, 1-hour slots)
    const availableSlots = []
    const startHour = 9
    const endHour = 18
    const slotDuration = 60 // minutes

    for (let hour = startHour; hour < endHour; hour++) {
      const slotStart = new Date(startOfDay)
      slotStart.setHours(hour, 0, 0, 0)
      
      const slotEnd = new Date(slotStart)
      slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration)

      // Check if this slot conflicts with existing sessions
      const isConflict = existingSessions.some(session => {
        const sessionStart = session.scheduledAt
        const sessionEnd = new Date(sessionStart)
        sessionEnd.setMinutes(sessionEnd.getMinutes() + session.duration)
        
        return (
          (slotStart >= sessionStart && slotStart < sessionEnd) ||
          (slotEnd > sessionStart && slotEnd <= sessionEnd) ||
          (slotStart <= sessionStart && slotEnd >= sessionEnd)
        )
      })

      if (!isConflict) {
        availableSlots.push({
          startTime: slotStart.toISOString(),
          endTime: slotEnd.toISOString(),
          duration: slotDuration,
          formattedTime: slotStart.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          })
        })
      }
    }

    return NextResponse.json({
      mentor: {
        id: mentor.id,
        name: mentor.user.name,
        hourlyRate: mentor.hourlyRate
      },
      date,
      availableSlots,
      totalSlots: availableSlots.length
    })

  } catch (error) {
    console.error('Error fetching availability:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
