import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '4')
    const category = searchParams.get('category')

    // Build the where clause
    const whereClause: any = {
      status: 'PUBLISHED',
      isFeatured: true
    }

    if (category) {
      whereClause.category = category
    }

    // Fetch featured courses with related data
    const featuredCourses = await prisma.course.findMany({
      where: whereClause,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            image: true,
            avatar: true
          }
        },
        modules: {
          include: {
            contents: {
              select: {
                duration: true
              }
            }
          }
        },
        reviews: {
          select: {
            rating: true
          }
        },
        enrollments: {
          select: {
            id: true
          }
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true
          }
        }
      },
      orderBy: [
        { isFeatured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: limit
    })

    // Transform the data to match the expected format
    const transformedCourses = featuredCourses.map(course => {
      // Calculate total duration from modules
      const totalDuration = course.modules.reduce((total, module) => {
        return total + module.contents.reduce((moduleTotal, content) => {
          return moduleTotal + (content.duration || 0)
        }, 0)
      }, 0)

      // Calculate average rating
      const avgRating = course.reviews.length > 0 
        ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course.reviews.length
        : 0

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        slug: course.slug,
        price: course.price,
        currency: course.currency,
        category: course.category,
        subcategory: course.subcategory,
        level: course.level,
        duration: totalDuration,
        thumbnail: course.thumbnail,
        thumbnailUrl: course.thumbnailUrl,
        instructor: {
          id: course.instructor.id,
          name: course.instructor.name,
          image: course.instructor.image || course.instructor.avatar
        },
        modules: course.modules.map(module => ({
          id: module.id,
          title: module.title,
          description: module.description,
          order: module.order,
          contents: module.contents.map(content => ({
            duration: content.duration
          }))
        })),
        reviews: course.reviews.map(review => ({
          rating: review.rating
        })),
        _count: {
          enrollments: course._count.enrollments,
          reviews: course._count.reviews
        },
        avgRating: Math.round(avgRating * 10) / 10,
        isFeatured: course.isFeatured,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt
      }
    })

    return NextResponse.json({
      success: true,
      data: transformedCourses,
      count: transformedCourses.length
    })

  } catch (error) {
    console.error('Error fetching featured courses:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch featured courses',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
