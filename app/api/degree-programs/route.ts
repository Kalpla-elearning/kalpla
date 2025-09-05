import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/amplify-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')

    // Build the filter
    const filter: any = {
      status: { eq: 'published' }
    }

    if (category) {
      filter.category = { eq: category }
    }

    // Fetch degree programs
    const { data: degreePrograms } = await client.models.DegreeProgram.list({
      filter,
      limit,
    })

    // Transform the data to match the expected format
    const transformedPrograms = degreePrograms.map(program => ({
      id: program.id,
      title: program.title,
      description: program.description,
      slug: program.title?.toLowerCase().replace(/\s+/g, '-'),
      duration: program.duration || '2 years',
      credits: program.credits || 120,
      category: program.category,
      level: program.level || 'Bachelor',
      thumbnail: program.thumbnail,
      price: program.price || 0,
      currency: program.currency || 'INR',
      requirements: program.requirements || [],
      curriculum: program.curriculum || [],
      _count: {
        courses: 0,
        enrollments: 0
      },
      isActive: true,
      createdAt: program.createdAt,
      updatedAt: program.updatedAt
    }))

    return NextResponse.json({
      success: true,
      data: transformedPrograms,
      count: transformedPrograms.length
    })

  } catch (error) {
    console.error('Error fetching degree programs:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch degree programs',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
