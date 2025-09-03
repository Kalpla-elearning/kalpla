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
    const level = searchParams.get('level') || ''
    const format = searchParams.get('format') || ''
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const order = searchParams.get('order') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { institution: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (status && status !== 'all') {
      where.status = status
    }
    
    if (category) {
      where.category = category
    }
    
    if (level) {
      where.level = level
    }
    
    if (format) {
      where.format = format
    }

    // Build orderBy clause
    const orderBy: any = {}
    orderBy[sortBy] = order

    const [programs, total] = await Promise.all([
      prisma.degreeProgram.findMany({
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
      prisma.degreeProgram.count({ where })
    ])

    // Calculate stats
    const stats = await prisma.degreeProgram.aggregate({
      _count: {
        id: true
      },
      _sum: {
        price: true
      }
    })

    const publishedCount = await prisma.degreeProgram.count({
      where: { status: 'PUBLISHED' }
    })

    const draftCount = await prisma.degreeProgram.count({
      where: { status: 'DRAFT' }
    })

    const featuredCount = await prisma.degreeProgram.count({
      where: { isFeatured: true }
    })

    const totalStudents = await prisma.degreeEnrollment.count()

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        programs: programs.map(program => ({
          ...program,
          enrollmentCount: program._count.enrollments,
          activeEnrollments: program._count.enrollments,
          currentStudents: program._count.enrollments,
          enrollmentPercentage: program.maxStudents 
            ? Math.round((program._count.enrollments / program.maxStudents) * 100)
            : 0
        })),
        stats: {
          totalPrograms: stats._count.id,
          totalStudents,
          totalRevenue: stats._sum.price || 0,
          publishedPrograms: publishedCount,
          draftPrograms: draftCount,
          featuredPrograms: featuredCount
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
    console.error('Error fetching degree programs:', error)
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

    // Validate required fields
    if (!title || !description || !institution || !duration || !format || !level || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const program = await prisma.degreeProgram.create({
      data: {
        title,
        description,
        institution,
        location: location || '',
        duration,
        format,
        level,
        price: parseFloat(price),
        currency: currency || 'INR',
        imageUrl,
        category,
        tags: tags || [],
        features: features || [],
        requirements: requirements || [],
        syllabus: syllabus || [],
        isFeatured: isFeatured || false,
        maxStudents: maxStudents ? parseInt(maxStudents) : null,
        instructorId: instructorId || null,
        status: status || 'DRAFT',
        slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }
    })

    return NextResponse.json({
      success: true,
      data: program
    })
  } catch (error) {
    console.error('Error creating degree program:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
