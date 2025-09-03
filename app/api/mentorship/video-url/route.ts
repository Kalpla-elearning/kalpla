import { NextRequest } from 'next/server'
import { generateSignedUrl } from '@/lib/aws-s3'
import { 
  requireAuth, 
  successResponse, 
  errorResponse, 
  withErrorHandling
} from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

export const POST = withErrorHandling(async (request: NextRequest) => {
  // Check authentication - students can access videos they're enrolled in
  const authResult = await requireAuth(['STUDENT', 'ADMIN', 'INSTRUCTOR'])
  if ('error' in authResult) {
    return errorResponse(authResult.error, authResult.status)
  }
  const { session } = authResult

  const { videoKey, lessonId } = await request.json()

  if (!videoKey) {
    return errorResponse('Video key is required', 400)
  }

  // For students, verify they have access to this lesson
  if (session.user.role === 'STUDENT') {
    if (!lessonId) {
      return errorResponse('Lesson ID is required for students', 400)
    }

    // Check if student is enrolled and has access to this lesson
    const enrollment = await prisma.mentorshipEnrollment.findFirst({
      where: {
        userId: session.user.id,
        status: {
          in: ['ENROLLED', 'ACTIVE']
        }
      },
      include: {
        program: {
          include: {
            phases: {
              include: {
                lessons: {
                  where: {
                    id: lessonId
                  }
                }
              }
            }
          }
        }
      }
    })

    if (!enrollment || enrollment.program.phases.length === 0) {
      return errorResponse('Access denied. You are not enrolled in this program or lesson.', 403)
    }

    // Check if lesson exists in any phase
    const lessonExists = enrollment.program.phases.some(phase => 
      phase.lessons.some(lesson => lesson.id === lessonId)
    )

    if (!lessonExists) {
      return errorResponse('Access denied. Lesson not found in your program.', 403)
    }
  }

  try {
    // Generate signed URL with 1 hour expiration
    const signedUrl = await generateSignedUrl(videoKey, 3600)

    return successResponse({
      url: signedUrl,
      expiresIn: 3600,
      videoKey: videoKey
    })
  } catch (error: any) {
    console.error('Error generating signed URL:', error)
    return errorResponse('Failed to generate video URL', 500)
  }
})
