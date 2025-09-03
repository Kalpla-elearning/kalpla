import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

// GET /api/admin/instructors - Fetch all instructors
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const instructors = await prisma.user.findMany({
      where: { role: 'INSTRUCTOR' },
      select: {
        id: true,
        name: true,
        email: true,
        isVerified: true,
        _count: {
          select: {
            courses: true
          }
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json({ instructors })
  } catch (error) {
    console.error('Error fetching instructors:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
