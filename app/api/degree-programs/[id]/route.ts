import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// GET /api/degree-programs/[id] - Get specific degree program
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const program = await prisma.degreeProgram.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true,
            bio: true
          }
        },
        _count: {
          select: {
            enrollments: true,
            reviews: true
          }
        }
      }
    })

    if (!program) {
      return NextResponse.json(
        { success: false, error: 'Degree program not found' },
        { status: 404 }
      )
    }

    // Transform data for frontend
    const transformedProgram = {
      id: program.id,
      title: program.title,
      slug: program.slug,
      description: program.description,
      institution: program.institution,
      location: program.location,
      duration: program.duration,
      format: program.format,
      level: program.level,
      price: program.price,
      currency: program.currency,
      imageUrl: program.imageUrl,
      brochureUrl: program.brochureUrl,
      category: program.category,
      tags: program.tags ? JSON.parse(program.tags) : [],
      features: program.features ? JSON.parse(program.features) : [],
      requirements: program.requirements ? JSON.parse(program.requirements) : [],
      syllabus: program.syllabus ? JSON.parse(program.syllabus) : [],
      isFeatured: program.isFeatured,
      maxStudents: program.maxStudents,
      currentStudents: program.currentStudents,
      rating: program.rating,
      totalReviews: program.totalReviews,
      instructor: program.instructor,
      enrollmentCount: program._count.enrollments,
      reviewCount: program._count.reviews,
      status: program.status,
      createdAt: program.createdAt,
      updatedAt: program.updatedAt
    }

    return NextResponse.json({
      success: true,
      data: transformedProgram
    })

  } catch (error) {
    console.error('Error fetching degree program:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch degree program' },
      { status: 500 }
    )
  }
}

// PUT /api/degree-programs/[id] - Update degree program
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !['ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params
    const body = await request.json()

    // Check if program exists
    const existingProgram = await prisma.degreeProgram.findUnique({
      where: { id }
    })

    if (!existingProgram) {
      return NextResponse.json(
        { success: false, error: 'Degree program not found' },
        { status: 404 }
      )
    }

    // Check if instructor is authorized to edit this program
    if (session.user.role === 'INSTRUCTOR' && existingProgram.instructorId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'You can only edit your own programs' },
        { status: 403 }
      )
    }

    const {
      title,
      description,
      institution,
      location,
      duration,
      format,
      level,
      price,
      currency,
      category,
      tags,
      features,
      requirements,
      syllabus,
      imageUrl,
      brochureUrl,
      maxStudents,
      isFeatured,
      status
    } = body

    // Update program
    const updatedProgram = await prisma.degreeProgram.update({
      where: { id },
      data: {
        title,
        description,
        institution,
        location,
        duration,
        format,
        level,
        price: price ? parseFloat(price) : undefined,
        currency,
        category,
        tags: tags ? JSON.stringify(tags) : undefined,
        features: features ? JSON.stringify(features) : undefined,
        requirements: requirements ? JSON.stringify(requirements) : undefined,
        syllabus: syllabus ? JSON.stringify(syllabus) : undefined,
        imageUrl,
        brochureUrl,
        maxStudents: maxStudents ? parseInt(maxStudents) : undefined,
        isFeatured,
        status
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        id: updatedProgram.id,
        title: updatedProgram.title,
        slug: updatedProgram.slug,
        description: updatedProgram.description,
        institution: updatedProgram.institution,
        location: updatedProgram.location,
        duration: updatedProgram.duration,
        format: updatedProgram.format,
        level: updatedProgram.level,
        price: updatedProgram.price,
        currency: updatedProgram.currency,
        imageUrl: updatedProgram.imageUrl,
        category: updatedProgram.category,
        tags: updatedProgram.tags ? JSON.parse(updatedProgram.tags) : [],
        features: updatedProgram.features ? JSON.parse(updatedProgram.features) : [],
        requirements: updatedProgram.requirements ? JSON.parse(updatedProgram.requirements) : [],
        syllabus: updatedProgram.syllabus ? JSON.parse(updatedProgram.syllabus) : [],
        isFeatured: updatedProgram.isFeatured,
        maxStudents: updatedProgram.maxStudents,
        currentStudents: updatedProgram.currentStudents,
        rating: updatedProgram.rating,
        totalReviews: updatedProgram.totalReviews,
        instructor: updatedProgram.instructor,
        status: updatedProgram.status,
        createdAt: updatedProgram.createdAt,
        updatedAt: updatedProgram.updatedAt
      }
    })

  } catch (error) {
    console.error('Error updating degree program:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update degree program' },
      { status: 500 }
    )
  }
}

// DELETE /api/degree-programs/[id] - Delete degree program
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !['ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id } = params

    // Check if program exists
    const existingProgram = await prisma.degreeProgram.findUnique({
      where: { id }
    })

    if (!existingProgram) {
      return NextResponse.json(
        { success: false, error: 'Degree program not found' },
        { status: 404 }
      )
    }

    // Check if instructor is authorized to delete this program
    if (session.user.role === 'INSTRUCTOR' && existingProgram.instructorId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: 'You can only delete your own programs' },
        { status: 403 }
      )
    }

    // Check if there are any enrollments
    const enrollmentCount = await prisma.degreeEnrollment.count({
      where: { programId: id }
    })

    if (enrollmentCount > 0) {
      return NextResponse.json(
        { success: false, error: 'Cannot delete program with existing enrollments' },
        { status: 400 }
      )
    }

    // Delete program
    await prisma.degreeProgram.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Degree program deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting degree program:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete degree program' },
      { status: 500 }
    )
  }
}
