import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

// GET /api/degree-programs - Fetch degree programs with advanced filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const category = searchParams.get('category') || ''
    const level = searchParams.get('level') || ''
    const format = searchParams.get('format') || ''
    const instructorId = searchParams.get('instructorId') || ''
    const isFeatured = searchParams.get('isFeatured') || ''
    const enrollmentStatus = searchParams.get('enrollmentStatus') || '' // OPEN, CLOSED, FULL

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
    
    if (instructorId) {
      where.instructorId = instructorId
    }
    
    if (isFeatured) {
      where.isFeatured = isFeatured === 'true'
    }

    // Handle enrollment status filtering
    if (enrollmentStatus) {
      switch (enrollmentStatus) {
        case 'OPEN':
          where.OR = [
            { maxStudents: null },
            { currentStudents: { lt: { maxStudents: true } } }
          ]
          break
        case 'CLOSED':
          where.status = 'ARCHIVED'
          break
        case 'FULL':
          where.currentStudents = { gte: { maxStudents: true } }
          break
      }
    }

    // Get programs with pagination and related data
    const [programs, total] = await Promise.all([
      prisma.degreeProgram.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          enrollments: {
            select: {
              id: true,
              status: true,
              paymentStatus: true,
              enrolledAt: true
            }
          },
          reviews: {
            select: {
              id: true,
              rating: true,
              comment: true
            }
          }
        }
      }),
      prisma.degreeProgram.count({ where })
    ])

    // Calculate additional stats
    const stats = await prisma.degreeProgram.aggregate({
      _count: {
        id: true
      },
      _sum: {
        currentStudents: true,
        price: true
      },
      where: {
        status: 'PUBLISHED'
      }
    })

    // Transform programs to include calculated fields
    const transformedPrograms = programs.map(program => ({
      ...program,
      enrollmentCount: program.enrollments.length,
      activeEnrollments: program.enrollments.filter(e => e.status === 'ACTIVE').length,
      pendingPayments: program.enrollments.filter(e => e.paymentStatus === 'PENDING').length,
      averageRating: program.reviews.length > 0 
        ? program.reviews.reduce((acc, review) => acc + review.rating, 0) / program.reviews.length 
        : 0,
      isEnrollmentOpen: !program.maxStudents || program.currentStudents < program.maxStudents,
      enrollmentPercentage: program.maxStudents 
        ? Math.round((program.currentStudents / program.maxStudents) * 100) 
        : 0
    }))

    return NextResponse.json({
      success: true,
      data: {
        programs: transformedPrograms,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        stats: {
          totalPrograms: stats._count.id,
          totalStudents: stats._sum.currentStudents || 0,
          totalRevenue: stats._sum.price || 0
        }
      }
    })
  } catch (error) {
    console.error('Error fetching degree programs:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch degree programs' },
      { status: 500 }
    )
  }
}

// POST /api/degree-programs - Create new degree program
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
      category,
      tags,
      features,
      requirements,
      syllabus,
      imageUrl,
      brochureUrl,
      maxStudents,
      instructorId,
      isFeatured,
      startDate,
      endDate
    } = body

    // Validate required fields
    if (!title || !description || !institution || !duration || !price) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    // Check if slug already exists
    const existingProgram = await prisma.degreeProgram.findUnique({
      where: { slug }
    })

    if (existingProgram) {
      return NextResponse.json(
        { error: 'A program with this title already exists' },
        { status: 400 }
      )
    }

    // Create program
    const program = await prisma.degreeProgram.create({
      data: {
        title,
        slug,
        description,
        institution,
        location,
        duration,
        format,
        level,
        price: parseFloat(price),
        currency,
        category,
        tags: JSON.stringify(tags || []),
        features: JSON.stringify(features || []),
        requirements: JSON.stringify(requirements || []),
        syllabus: JSON.stringify(syllabus || []),
        imageUrl,
        brochureUrl,
        maxStudents: maxStudents ? parseInt(maxStudents) : null,
        instructorId,
        isFeatured: isFeatured || false,

        status: 'DRAFT'
      },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: { program }
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating degree program:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create degree program' },
      { status: 500 }
    )
  }
}

// PUT /api/degree-programs - Update degree program
export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { error: 'Program ID is required' },
        { status: 400 }
      )
    }

    // Check if program exists
    const existingProgram = await prisma.degreeProgram.findUnique({
      where: { id }
    })

    if (!existingProgram) {
      return NextResponse.json(
        { error: 'Program not found' },
        { status: 404 }
      )
    }

    // Handle JSON fields
    if (updateData.tags) {
      updateData.tags = JSON.stringify(updateData.tags)
    }
    if (updateData.features) {
      updateData.features = JSON.stringify(updateData.features)
    }
    if (updateData.requirements) {
      updateData.requirements = JSON.stringify(updateData.requirements)
    }
    if (updateData.syllabus) {
      updateData.syllabus = JSON.stringify(updateData.syllabus)
    }

    // Handle numeric fields
    if (updateData.price) {
      updateData.price = parseFloat(updateData.price)
    }
    if (updateData.maxStudents) {
      updateData.maxStudents = parseInt(updateData.maxStudents)
    }

    // Update program
    const program = await prisma.degreeProgram.update({
      where: { id },
      data: updateData,
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    return NextResponse.json({
      success: true,
      data: { program }
    })
  } catch (error) {
    console.error('Error updating degree program:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update degree program' },
      { status: 500 }
    )
  }
}


