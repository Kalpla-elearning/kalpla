import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Get user's mentorship enrollment
    const enrollment = await prisma.mentorshipEnrollment.findFirst({
      where: {
        userId: session.user.id,
        status: { in: ['ENROLLED', 'ACTIVE', 'COMPLETED'] }
      },
      include: {
        program: true,
        progressRecords: {
          include: {
            lesson: {
              include: {
                phase: true
              }
            }
          }
        }
      }
    })

    if (!enrollment) {
      return NextResponse.json(
        { error: 'No active mentorship enrollment found' },
        { status: 404 }
      )
    }

    // Get all phases with lessons
    const phases = await prisma.phase.findMany({
      where: {
        programId: enrollment.programId
      },
      include: {
        lessons: {
          orderBy: {
            order: 'asc'
          }
        }
      },
      orderBy: {
        order: 'asc'
      }
    })

    // Calculate progress for each phase and lesson
    const phasesWithProgress = phases.map(phase => {
      const phaseLessons = phase.lessons
      const completedLessons = phaseLessons.filter(lesson => {
        const progress = enrollment.progressRecords.find(p => p.lessonId === lesson.id)
        return progress?.status === 'COMPLETED'
      })
      
      const progressPercentage = phaseLessons.length > 0 
        ? (completedLessons.length / phaseLessons.length) * 100 
        : 0

      // Add progress status to each lesson
      const lessonsWithProgress = phaseLessons.map(lesson => {
        const progress = enrollment.progressRecords.find(p => p.lessonId === lesson.id)
        return {
          ...lesson,
          status: progress?.status || 'NOT_STARTED',
          watchTime: progress?.watchTime || 0
        }
      })

      return {
        ...phase,
        lessons: lessonsWithProgress,
        progress: progressPercentage
      }
    })

    // Calculate overall progress
    const totalLessons = phases.reduce((sum, phase) => sum + phase.lessons.length, 0)
    const completedLessons = enrollment.progressRecords.filter(p => p.status === 'COMPLETED').length
    const overallProgress = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0

    // Determine current phase (first incomplete phase)
    const currentPhase = phasesWithProgress.findIndex(phase => phase.progress < 100) + 1

    return NextResponse.json({
      enrollment: {
        id: enrollment.id,
        status: enrollment.status,
        progress: overallProgress,
        currentPhase: currentPhase || 1,
        enrolledAt: enrollment.enrolledAt.toISOString()
      },
      program: {
        title: enrollment.program.title,
        description: enrollment.program.description,
        duration: enrollment.program.duration
      },
      phases: phasesWithProgress
    })

  } catch (error) {
    console.error('Error fetching mentorship dashboard:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    )
  }
}
