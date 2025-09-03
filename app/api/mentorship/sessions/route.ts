import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Build where clause
    const where: any = {
      enrollment: {
        userId: session.user.id
      }
    }

    if (status && status !== 'ALL') {
      where.status = status
    }

    // Fetch sessions with pagination
    const [sessions, totalCount] = await Promise.all([
      prisma.mentorshipSession.findMany({
        where,
        include: {
          mentor: {
            include: {
              user: {
                select: {
                  name: true,
                  email: true,
                  avatar: true
                }
              }
            }
          },
          enrollment: {
            include: {
              program: {
                select: {
                  title: true,
                  slug: true
                }
              }
            }
          }
        },
        orderBy: { scheduledAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.mentorshipSession.count({ where })
    ])

    // Calculate stats
    const stats = await Promise.all([
      prisma.mentorshipSession.count({
        where: {
          enrollment: { userId: session.user.id },
          status: 'SCHEDULED'
        }
      }),
      prisma.mentorshipSession.count({
        where: {
          enrollment: { userId: session.user.id },
          status: 'COMPLETED'
        }
      }),
      prisma.mentorshipSession.count({
        where: {
          enrollment: { userId: session.user.id },
          status: 'CANCELLED'
        }
      }),
      prisma.mentor.count({
        where: {
          sessions: {
            some: {
              enrollment: { userId: session.user.id }
            }
          }
        }
      })
    ])

    return NextResponse.json({
      sessions,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      },
      stats: {
        total: totalCount,
        upcoming: stats[0],
        completed: stats[1],
        cancelled: stats[2],
        mentors: stats[3]
      }
    })

  } catch (error) {
    console.error('Error fetching sessions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
