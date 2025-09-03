import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// GET /api/courses - Fetch courses with advanced filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const category = searchParams.get('category') || ''
    const access = searchParams.get('access') || '' // FREE, PAID, PREMIUM
    const instructorId = searchParams.get('instructorId') || ''
    const isFeatured = searchParams.get('isFeatured') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (category) {
      where.category = category
    }
    
    if (access) {
      where.access = access
    }
    
    if (instructorId) {
      where.instructorId = instructorId
    }
    
    if (isFeatured) {
      where.isFeatured = isFeatured === 'true'
    }

    // Get courses with pagination and related data
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          modules: {
            include: {
              contents: {
                select: {
                  id: true,
                  type: true,
                  title: true,
                  duration: true
                }
              }
            }
          },
          enrollments: {
            select: {
              id: true,
              status: true,
              progress: true,
              enrolledAt: true
            }
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true
            }
          }
        }
      }),
      prisma.course.count({ where })
    ])

    // Calculate additional stats
    const stats = await prisma.course.aggregate({
      _count: {
        id: true
      },
      _sum: {
        price: true
      },
      where: {
        status: 'PUBLISHED'
      }
    })

    // Transform courses to include calculated fields
    const transformedCourses = courses.map(course => {
      const totalDuration = course.modules.reduce((moduleTotal, module) => {
        return moduleTotal + module.contents.reduce((contentTotal, content) => {
          return contentTotal + (content.duration || 0)
        }, 0)
      }, 0)

      const totalLessons = course.modules.reduce((total, module) => {
        return total + module.contents.length
      }, 0)

      const averageRating = course.reviews.length > 0 
        ? course.reviews.reduce((acc, review) => acc + review.rating, 0) / course.reviews.length 
        : 0

      const enrollmentCount = course.enrollments.length
      const completedEnrollments = course.enrollments.filter(e => e.progress === 100).length
      const completionRate = enrollmentCount > 0 ? Math.round((completedEnrollments / enrollmentCount) * 100) : 0

      return {
        ...course,
        totalDuration,
        totalLessons,
        averageRating,
        enrollmentCount,
        completedEnrollments,
        completionRate
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        courses: transformedCourses,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats: {
          totalCourses: stats._count.id,
          totalRevenue: stats._sum.price || 0
        }
      }
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch courses' },
      { status: 500 }
    )
  }
}

// POST /api/courses - Create new course
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      title,
      description,
      category,
      subcategory,
      access,
      price,
      currency,
      thumbnailUrl,
      videoUrl,
      duration,
      level,
      tags,
      requirements,
      learningOutcomes,
      instructorId,
      isFeatured,
      status
    } = body

    // Validate required fields
    if (!title || !description || !category || !access) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existingCourse = await prisma.course.findUnique({
      where: { slug }
    })

    if (existingCourse) {
      return NextResponse.json(
        { error: 'A course with this title already exists' },
        { status: 400 }
      )
    }

    // Create course
    const course = await prisma.course.create({
      data: {
        title,
        slug,
        description,
        category,
        subcategory,
        access,
        price: price ? parseFloat(price) : 0,
        currency: currency || 'INR',
        thumbnailUrl,
        videoUrl,
        duration: duration || 0,
        level,
        tags: JSON.stringify(tags || []),
        requirements: JSON.stringify(requirements || []),
        learningOutcomes: JSON.stringify(learningOutcomes || []),
        instructorId: instructorId || session.user.id,
        isFeatured: isFeatured || false,
        status: status || 'DRAFT'
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: { course }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create course' },
      { status: 500 }
    )
  }
}

// PUT /api/courses - Update course
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !['ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Course ID is required' },
        { status: 400 }
      )
    }

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({
      where: { id }
    })

    if (!existingCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      )
    }

    // Check if user has permission to edit this course
    if (session.user.role === 'INSTRUCTOR' && existingCourse.instructorId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own courses' },
        { status: 403 }
      )
    }

    // Handle JSON fields
    if (updateData.tags) {
      updateData.tags = JSON.stringify(updateData.tags)
    }
    if (updateData.requirements) {
      updateData.requirements = JSON.stringify(updateData.requirements)
    }
    if (updateData.learningOutcomes) {
      updateData.learningOutcomes = JSON.stringify(updateData.learningOutcomes)
    }

    // Handle numeric fields
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price)
    }
    if (updateData.duration) {
      updateData.duration = parseInt(updateData.duration)
    }

    // Update course
    const course = await prisma.course.update({
      where: { id },
      data: updateData,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: { course }
    })
  } catch (error) {
    console.error('Error updating course:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update course' },
      { status: 500 }
    )
  }
}
