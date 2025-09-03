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

    // Get completed course enrollments
    const completedEnrollments = await prisma.enrollment.findMany({
      where: { 
        userId: session.user.id,
        status: 'COMPLETED'
      },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                name: true
              }
            }
          }
        }
      },
      orderBy: { completedAt: 'desc' }
    })

    // Transform enrollments into certificate objects
    const certificates = completedEnrollments.map((enrollment) => ({
      id: enrollment.id,
      courseTitle: enrollment.course.title,
      courseSlug: enrollment.course.slug || '',
      instructorName: enrollment.course.instructor.name,
      completedAt: enrollment.completedAt || enrollment.enrolledAt,
      certificateUrl: `/api/certificates/${enrollment.id}`,
      grade: Math.round(enrollment.progress), // Use progress as grade
      course: {
        id: enrollment.course.id,
        title: enrollment.course.title,
        slug: enrollment.course.slug || '',
        thumbnail: enrollment.course.thumbnail,
        instructor: {
          name: enrollment.course.instructor.name
        }
      }
    }))

    return NextResponse.json(certificates)
  } catch (error) {
    console.error('Error fetching certificates:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
