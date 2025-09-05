import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/amplify-config'

export async function GET() {
  try {
    const limit = 4
    const category = null

    // Build the filter
    const filter: any = {
      status: { eq: 'published' }
    }

    if (category) {
      filter.category = { eq: category }
    }

    // Fetch featured courses
    const { data: courses } = await client.models.Course.list({
      filter,
      limit,
    })

    // Transform the data to match the expected format
    const transformedCourses = courses.map(course => ({
      id: course.id,
      title: course.title,
      description: course.description,
      slug: course.title?.toLowerCase().replace(/\s+/g, '-'),
      price: course.price || 0,
      currency: course.currency || 'INR',
      category: course.category,
      difficulty: course.difficulty,
      thumbnail: course.thumbnail,
      instructor: {
        id: course.instructorId,
        name: 'Instructor', // Will be fetched from User model
        avatar: null
      },
      modules: [], // Will be fetched separately
      reviews: [], // Will be fetched separately
      _count: {
        enrollments: 0,
        reviews: 0
      },
      avgRating: 0,
      isFeatured: true,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt
    }))

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
