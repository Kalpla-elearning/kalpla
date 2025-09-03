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
    const role = searchParams.get('role') || ''
    const verificationStatus = searchParams.get('verificationStatus') || ''
    const sortField = searchParams.get('sortField') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    }
    
    if (role) {
      where.role = role
    }
    
    if (verificationStatus) {
      where.isVerified = verificationStatus === 'verified'
    }

    // Build orderBy clause
    const orderBy: any = {}
    orderBy[sortField] = sortOrder

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          isVerified: true,
          createdAt: true,
          updatedAt: true,
          phone: true,
          bio: true,
          location: true,
          website: true,
          college: true,
          yearOfStudy: true,
          _count: {
            select: {
              enrollments: true,
              degreeEnrollments: true,
              mentorshipEnrollments: true
            }
          }
        }
      }),
      prisma.user.count({ where })
    ])

    // Calculate stats
    const stats = await prisma.user.aggregate({
      _count: {
        id: true
      }
    })

    const studentCount = await prisma.user.count({
      where: { role: 'STUDENT' }
    })

    const instructorCount = await prisma.user.count({
      where: { role: 'INSTRUCTOR' }
    })

    const adminCount = await prisma.user.count({
      where: { role: 'ADMIN' }
    })

    const verifiedCount = await prisma.user.count({
      where: { isVerified: true }
    })

    const totalPages = Math.ceil(total / limit)

    return NextResponse.json({
      success: true,
      data: {
        users: users.map(user => ({
          ...user,
          totalEnrollments: user._count.enrollments + user._count.degreeEnrollments + user._count.mentorshipEnrollments
        })),
        stats: {
          totalUsers: stats._count.id,
          students: studentCount,
          instructors: instructorCount,
          admins: adminCount,
          verified: verifiedCount
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
    console.error('Error fetching users:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, role, isVerified, isActive } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user
    const updateData: any = {}
    if (role) updateData.role = role
    if (typeof isVerified === 'boolean') updateData.isVerified = isVerified
    if (typeof isActive === 'boolean') updateData.isActive = isActive

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isVerified: true,
        isActive: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedUser
    })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
