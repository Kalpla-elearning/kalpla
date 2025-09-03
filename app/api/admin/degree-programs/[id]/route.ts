import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const program = await prisma.degreeProgram.findUnique({
      where: { id: params.id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        enrollments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    })

    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: program
    })
  } catch (error) {
    console.error('Error fetching degree program:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
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
      imageUrl,
      category,
      tags,
      features,
      requirements,
      syllabus,
      isFeatured,
      maxStudents,
      instructorId,
      status
    } = body

    // Check if program exists
    const existingProgram = await prisma.degreeProgram.findUnique({
      where: { id: params.id }
    })

    if (!existingProgram) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }

    // Update program
    const updatedProgram = await prisma.degreeProgram.update({
      where: { id: params.id },
      data: {
        title,
        description,
        institution,
        location,
        duration,
        format,
        level,
        price: parseFloat(price),
        currency,
        imageUrl,
        category,
        tags,
        features,
        requirements,
        syllabus,
        isFeatured,
        maxStudents: maxStudents ? parseInt(maxStudents) : null,
        instructorId: instructorId || null,
        status,
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedProgram
    })
  } catch (error) {
    console.error('Error updating degree program:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if program exists
    const existingProgram = await prisma.degreeProgram.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            enrollments: true
          }
        }
      }
    })

    if (!existingProgram) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }

    // Check if there are enrollments
    if (existingProgram._count.enrollments > 0) {
      return NextResponse.json(
        { error: 'Cannot delete program with existing enrollments' },
        { status: 400 }
      )
    }

    // Delete program
    await prisma.degreeProgram.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Program deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting degree program:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
