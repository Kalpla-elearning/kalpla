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
    const category = searchParams.get('category') || ''
    const status = searchParams.get('status') || ''
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
    
    if (category) {
      where.category = category
    }
    
    if (status) {
      where.isActive = status === 'active'
    }

    // Build orderBy clause
    const orderBy: any = {}
    orderBy[sortBy] = order

    const [programs, total] = await Promise.all([
      prisma.mentorshipProgram.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          mentor: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  avatar: true
                }
              }
            }
          },
          _count: {
            select: {
              enrollments: true,
              reviews: true
            }
          }
        }
      }),
      prisma.mentorshipProgram.count({ where })
    ])

    // Calculate stats
    const stats = await prisma.mentorshipProgram.aggregate({
      _count: {
        id: true
      },
      _sum: {
        price: true
      }
    })

    const activeCount = await prisma.mentorshipProgram.count({
      where: { isActive: true }
    })

    const inactiveCount = await prisma.mentorshipProgram.count({
      where: { isActive: false }
    })

    const totalEnrollments = await prisma.mentorshipEnrollment.count()

    const totalMentors = await prisma.mentor.count()

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        programs: programs.map(program => ({
          ...program,
          enrollmentCount: program._count.enrollments,
          reviewCount: program._count.reviews,
          mentorName: program.mentor.user.name
        })),
        stats: {
          totalPrograms: stats._count.id,
          totalMentors,
          totalEnrollments,
          totalRevenue: stats._sum.price || 0,
          activePrograms: activeCount,
          inactivePrograms: inactiveCount
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
    console.error('Error fetching mentorship programs:', error)
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
      duration,
      price,
      maxStudents,
      mentorId,
      isActive
    } = body

    // Validate required fields
    if (!title || !description || !category || !duration || !price || !mentorId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if mentor exists
    const mentor = await prisma.mentor.findUnique({
      where: { id: mentorId }
    })

    if (!mentor) {
      return NextResponse.json(
        { error: 'Mentor not found' },
        { status: 404 }
      )
    }

    const program = await prisma.mentorshipProgram.create({
      data: {
        title,
        description,
        category,
        duration: parseInt(duration),
        price: parseFloat(price),
        maxStudents: parseInt(maxStudents),
        mentorId,
        isActive: isActive !== false
      }
    })

    return NextResponse.json({
      success: true,
      data: program
    })
  } catch (error) {
    console.error('Error creating mentorship program:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
