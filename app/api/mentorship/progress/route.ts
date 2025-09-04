import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const { lessonId, status, watchTime } = await request.json()

    if (!lessonId || !status) {
      return NextResponse.json(
        { error: 'Lesson ID and status are required' },
        { status: 400 }
      )
    }

    // Get user's mentorship enrollment
    const enrollment = await prisma.mentorshipEnrollment.findFirst({
      where: {
        userId: session.user.id,
        status: { in: ['ENROLLED', 'ACTIVE', 'COMPLETED'] }
      }
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'No active mentorship enrollment found' },
        { status: 404 }
      )
    }

    // Check if lesson exists and belongs to the user's program
    const lesson = await prisma.mentorshipLesson.findFirst({
      where: {
        id: lessonId,
        phase: {
          programId: enrollment.programId
        }
      }
    })

    if (!lesson) {
      return NextResponse.json(
        { error: 'Lesson not found' },
        { status: 404 }
      )
    }

    // Update or create progress record
    const progress = await prisma.mentorshipProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId: enrollment.id,
          lessonId: lessonId
        }
      },
      update: {
        status,
        watchTime: watchTime || 0,
        completedAt: status === 'COMPLETED' ? new Date() : null,
        updatedAt: new Date()
      },
      create: {
        enrollmentId: enrollment.id,
        lessonId: lessonId,
        status,
        watchTime: watchTime || 0,
        completedAt: status === 'COMPLETED' ? new Date() : null
      }
    })

    // Update overall enrollment progress
    const totalLessons = await prisma.lesson.count({
      where: {
        phase: {
          programId: enrollment.programId
        }
      }
    })

    const completedLessons = await prisma.mentorshipProgress.count({
      where: {
        enrollmentId: enrollment.id,
        status: 'COMPLETED'
      }
    })

    const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

    await prisma.mentorshipEnrollment.update({
      where: { id: enrollment.id },
      data: {
        progress: overallProgress,
        currentPhase: Math.ceil((completedLessons / totalLessons) * 12) || 1
      }
    })

    return NextResponse.json({
      success: true,
      progress: {
        id: progress.id,
        status: progress.status,
        watchTime: progress.watchTime,
        completedAt: progress.completedAt
      },
      overallProgress
    })

  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: 'Failed to update progress' },
      { status: 500 }
    )
  }
}
