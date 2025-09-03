import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/degree-programs/[id]/enrollments - Get enrollments for a program
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status') || ''
    const paymentStatus = searchParams.get('paymentStatus') || ''

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {
      programId: params.id
    }

    if (status) {
      where.status = status
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus
    }

    // Get enrollments with user details
    const [enrollments, total] = await Promise.all([
      prisma.degreeEnrollment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { enrolledAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              avatar: true
            }
          },
          program: {
            select: {
              id: true,
              title: true,
              price: true,
              currency: true,
              maxStudents: true,
              currentStudents: true
            }
          }
        }
      }),
      prisma.degreeEnrollment.count({ where })
    ])

    // Calculate enrollment statistics
    const stats = await prisma.degreeEnrollment.aggregate({
      _count: {
        id: true
      },
      where: {
        programId: params.id
      }
    })

    const statusStats = await prisma.degreeEnrollment.groupBy({
      by: ['status'],
      _count: {
        id: true
      },
      where: {
        programId: params.id
      }
    })

    const paymentStats = await prisma.degreeEnrollment.groupBy({
      by: ['paymentStatus'],
      _count: {
        id: true
      },
      where: {
        programId: params.id
      }
    })

    return NextResponse.json({
      success: true,
      data: {
        enrollments,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats: {
          totalEnrollments: stats._count.id,
          statusBreakdown: statusStats,
          paymentBreakdown: paymentStats
        }
      }
    })
  } catch (error) {
    console.error('Error fetching enrollments:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enrollments' },
      { status: 500 }
    )
  }
}

// POST /api/degree-programs/[id]/enrollments - Create manual enrollment
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, status = 'ACTIVE', paymentStatus = 'SUCCESS', notes } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if program exists and has available seats
    const program = await prisma.degreeProgram.findUnique({
      where: { id: params.id }
    })

    if (!program) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      )
    }

    // Check if user is already enrolled
    const existingEnrollment = await prisma.degreeEnrollment.findUnique({
      where: {
        userId_programId: {
          userId,
          programId: params.id
        }
      }
    })

    if (existingEnrollment) {
      return NextResponse.json(
        { error: 'User is already enrolled in this program' },
        { status: 400 }
      )
    }

    // Check seat availability
    if (program.maxStudents && program.currentStudents >= program.maxStudents) {
      return NextResponse.json(
        { error: 'Program is full' },
        { status: 400 }
      )
    }

    // Create enrollment
    const enrollment = await prisma.degreeEnrollment.create({
      data: {
        userId,
        programId: params.id,
        status,
        paymentStatus,
        enrolledAt: new Date(),
        progress: 0,
        currentSemester: 1,
        totalSemesters: program.duration ? parseInt(program.duration.split(' ')[0]) : null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        program: {
          select: {
            id: true,
            title: true,
            price: true,
            currency: true
          }
        }
      }
    })

    // Update program student count
    await prisma.degreeProgram.update({
      where: { id: params.id },
      data: {
        currentStudents: {
          increment: 1
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: { enrollment }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating enrollment:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create enrollment' },
      { status: 500 }
    )
  }
}
