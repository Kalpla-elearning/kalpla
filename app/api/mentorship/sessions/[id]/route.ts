import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const updateSessionSchema = z.object({
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']).optional(),
  notes: z.string().optional(),
  meetingUrl: z.string().url().optional()
})

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = updateSessionSchema.parse(body)

    // Check if session exists and belongs to the user
    const existingSession = await prisma.mentorshipSession.findFirst({
      where: {
        id: params.id,
        enrollment: {
          userId: session.user.id
        }
      },
      include: {
        mentor: {
          include: { user: true }
        }
      }
    })

    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Only allow certain status changes
    if (validatedData.status) {
      const currentStatus = existingSession.status
      
      // Prevent changing completed or cancelled sessions
      if (currentStatus === 'COMPLETED' || currentStatus === 'CANCELLED') {
        return NextResponse.json({ error: 'Cannot modify completed or cancelled sessions' }, { status: 400 })
      }

      // Only allow cancellation if session is scheduled
      if (validatedData.status === 'CANCELLED' && currentStatus !== 'SCHEDULED') {
        return NextResponse.json({ error: 'Can only cancel scheduled sessions' }, { status: 400 })
      }
    }

    // Update the session
    const updatedSession = await prisma.mentorshipSession.update({
      where: { id: params.id },
      data: {
        ...validatedData,
        ...(validatedData.status === 'CANCELLED' && { cancelledAt: new Date() }),
        ...(validatedData.status === 'COMPLETED' && { completedAt: new Date() })
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
      message: 'Session updated successfully',
      session: updatedSession
    })

  } catch (error) {
    console.error('Error updating session:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if session exists and belongs to the user
    const existingSession = await prisma.mentorshipSession.findFirst({
      where: {
        id: params.id,
        enrollment: {
          userId: session.user.id
        }
      }
    })

    if (!existingSession) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Only allow deletion of scheduled sessions
    if (existingSession.status !== 'SCHEDULED') {
      return NextResponse.json({ error: 'Can only delete scheduled sessions' }, { status: 400 })
    }

    // Delete the session
    await prisma.mentorshipSession.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      message: 'Session deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting session:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
