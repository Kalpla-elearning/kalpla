import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const reviewSchema = z.object({
  mentorId: z.string(),
  programId: z.string(),
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Review must be at least 10 characters long').max(500, 'Review must be less than 500 characters')
})

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = reviewSchema.parse(body)

    // Check if mentor exists
    const mentor = await prisma.mentor.findUnique({
      where: { id: validatedData.mentorId }
    })

    if (!mentor) {
      return NextResponse.json({ error: 'Mentor not found' }, { status: 404 })
    }

    // Check if program exists
    const program = await prisma.mentorshipProgram.findUnique({
      where: { id: validatedData.programId }
    })

    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }

    // Check if user is enrolled in this program
    const enrollment = await prisma.mentorshipEnrollment.findFirst({
      where: {
        userId: session.user.id,
        programId: validatedData.programId,
        status: 'ACTIVE'
      }
    })

    if (!enrollment) {
      return NextResponse.json({ error: 'You must be enrolled in this program to submit a review' }, { status: 400 })
    }

    // Check if user has completed sessions with this mentor
    const completedSessions = await prisma.mentorshipSession.findFirst({
      where: {
        enrollmentId: enrollment.id,
        mentorId: validatedData.mentorId,
        status: 'COMPLETED'
      }
    })

    if (!completedSessions) {
      return NextResponse.json({ error: 'You must have completed at least one session with this mentor to submit a review' }, { status: 400 })
    }

    // Check if user has already reviewed this mentor for this program
    const existingReview = await prisma.mentorReview.findFirst({
      where: {
        userId: session.user.id,
        mentorId: validatedData.mentorId,
        programId: validatedData.programId
      }
    })

    if (existingReview) {
      return NextResponse.json({ error: 'You have already reviewed this mentor for this program' }, { status: 400 })
    }

    // Create the review
    const review = await prisma.mentorReview.create({
      data: {
        userId: session.user.id,
        mentorId: validatedData.mentorId,
        programId: validatedData.programId,
        rating: validatedData.rating,
        comment: validatedData.comment
      },
      include: {
        user: {
          select: {
            name: true,
            avatar: true
          }
        },
        mentor: {
          include: {
            user: {
              select: {
                name: true
              }
            }
          }
        },
        program: {
          select: {
            title: true
          }
        }
      }
    })

    // Update mentor's average rating
    const mentorReviews = await prisma.mentorReview.findMany({
      where: { mentorId: validatedData.mentorId },
      select: { rating: true }
    })

    const averageRating = mentorReviews.reduce((sum, review) => sum + review.rating, 0) / mentorReviews.length

    await prisma.mentor.update({
      where: { id: validatedData.mentorId },
      data: {
        rating: averageRating,
        totalSessions: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      message: 'Review submitted successfully',
      review
    })

  } catch (error) {
    console.error('Error submitting review:', error)
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
