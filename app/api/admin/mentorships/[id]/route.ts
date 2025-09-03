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

    const program = await prisma.mentorshipProgram.findUnique({
      where: { id: params.id },
      include: {
        mentor: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
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
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    })

    if (!program) {
      return NextResponse.json({ error: 'Mentorship program not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: program
    })
  } catch (error) {
    console.error('Error fetching mentorship program:', error)
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
      category,
      duration,
      price,
      maxStudents,
      mentorId,
      isActive
    } = body

    // Check if program exists
    const existingProgram = await prisma.mentorshipProgram.findUnique({
      where: { id: params.id }
    })

    if (!existingProgram) {
      return NextResponse.json({ error: 'Mentorship program not found' }, { status: 404 })
    }

    // Update program
    const updatedProgram = await prisma.mentorshipProgram.update({
      where: { id: params.id },
      data: {
        title,
        description,
        category,
        duration: duration ? parseInt(duration) : existingProgram.duration,
        price: price ? parseFloat(price) : existingProgram.price,
        maxStudents: maxStudents ? parseInt(maxStudents) : existingProgram.maxStudents,
        mentorId: mentorId || existingProgram.mentorId,
        isActive: isActive !== undefined ? isActive : existingProgram.isActive
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedProgram
    })
  } catch (error) {
    console.error('Error updating mentorship program:', error)
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
    const existingProgram = await prisma.mentorshipProgram.findUnique({
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
      return NextResponse.json({ error: 'Mentorship program not found' }, { status: 404 })
    }

    // Check if there are enrollments
    if (existingProgram._count.enrollments > 0) {
      return NextResponse.json(
        { error: 'Cannot delete mentorship program with existing enrollments' },
        { status: 400 }
      )
    }

    // Delete program
    await prisma.mentorshipProgram.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Mentorship program deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting mentorship program:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
