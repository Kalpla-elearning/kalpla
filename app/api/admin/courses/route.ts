import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const category = searchParams.get('category') || ''
    const access = searchParams.get('access') || ''
    const instructorId = searchParams.get('instructorId') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

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

    // Build orderBy clause
    const orderBy: any = {}
    orderBy[sortBy] = order

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          _count: {
            select: {
              enrollments: true
            }
          }
        }
      }),
      prisma.course.count({ where })
    ])

    // Calculate stats
    const stats = await prisma.course.aggregate({
      _count: {
        id: true
      },
      _sum: {
        price: true
      }
    })

    const publishedCount = await prisma.course.count({
      where: { status: 'PUBLISHED' }
    })

    const draftCount = await prisma.course.count({
      where: { status: 'DRAFT' }
    })

    const featuredCount = await prisma.course.count({
      where: { isFeatured: true }
    })

    const totalEnrollments = await prisma.enrollment.count()

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        courses: courses.map(course => ({
          ...course,
          enrollmentCount: course._count.enrollments,
          totalLessons: 0, // TODO: Calculate from modules/contents
          totalDuration: course.duration || 0,
          averageRating: 0, // TODO: Calculate from reviews
          completionRate: 0, // TODO: Calculate completion rate
          access: course.price === 0 ? 'FREE' : 'PAID',
          currency: course.currency || 'INR',
          thumbnailUrl: course.thumbnail,
          videoUrl: null,
          subcategory: course.category,
          level: course.level || 'BEGINNER',
          tags: course.tags ? JSON.parse(course.tags) : [],
          requirements: [],
          learningOutcomes: [],
          isFeatured: false
        })),
        stats: {
          totalCourses: stats._count.id,
          totalEnrollments,
          totalRevenue: stats._sum.price || 0,
          publishedCourses: publishedCount,
          draftCourses: draftCount,
          featuredCourses: featuredCount
        },
        pagination: {
          page,
          limit,
          total,
          pages: totalPages
        }
      }
    })
  } catch (error) {
    console.error('Error fetching courses:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
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
    if (!title || !description || !category || !access || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const course = await prisma.course.create({
      data: {
        title,
        description,
        category,
        subcategory: subcategory || '',
        access,
        price: parseFloat(price),
        currency: currency || 'INR',
        thumbnailUrl,
        videoUrl,
        duration: duration ? parseInt(duration) : 0,
        level: level || 'BEGINNER',
        tags: tags || [],
        requirements: requirements || [],
        learningOutcomes: learningOutcomes || [],
        instructorId: instructorId || null,
        isFeatured: isFeatured || false,
        status: status || 'DRAFT',
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }
    })

    return NextResponse.json({
      success: true,
      data: course
    })
  } catch (error) {
    console.error('Error creating course:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
