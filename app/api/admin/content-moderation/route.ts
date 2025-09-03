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
    const type = searchParams.get('type') || 'all' // all, flagged, pending, reviewed
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const skip = (page - 1) * limit

    // Build where clause based on type
    let where: any = {}
    
    if (type === 'flagged') {
      where.isFlagged = true
    } else if (type === 'pending') {
      where.isReviewed = false
    } else if (type === 'reviewed') {
      where.isReviewed = true
    }

    // Get flagged content from different tables
    const [flaggedPosts, flaggedComments, flaggedReviews, flaggedContent] = await Promise.all([
      // Flagged blog posts
      prisma.post.findMany({
        where: { isFlagged: true },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Flagged comments
      prisma.comment.findMany({
        where: { isFlagged: true },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          post: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Flagged reviews
      prisma.review.findMany({
        where: { isFlagged: true },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          course: {
            select: {
              id: true,
              title: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      }),

      // Flagged course content
      prisma.content.findMany({
        where: { isFlagged: true },
        include: {
          module: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true
                }
              }
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
      })
    ])

    // Get moderation stats
    const [
      totalFlaggedPosts,
      totalFlaggedComments,
      totalFlaggedReviews,
      totalFlaggedContent,
      pendingReviews,
      totalReports
    ] = await Promise.all([
      prisma.post.count({ where: { isFlagged: true } }),
      prisma.comment.count({ where: { isFlagged: true } }),
      prisma.review.count({ where: { isFlagged: true } }),
      prisma.content.count({ where: { isFlagged: true } }),
      prisma.review.count({ where: { isReviewed: false } }),
      prisma.post.count({ where: { isFlagged: true } }) + 
      prisma.comment.count({ where: { isFlagged: true } }) +
      prisma.review.count({ where: { isFlagged: true } }) +
      prisma.content.count({ where: { isFlagged: true } })
    ])

    return NextResponse.json({
      success: true,
      data: {
        flaggedContent: {
          posts: flaggedPosts,
          comments: flaggedComments,
          reviews: flaggedReviews,
          content: flaggedContent
        },
        stats: {
          totalFlaggedPosts,
          totalFlaggedComments,
          totalFlaggedReviews,
          totalFlaggedContent,
          pendingReviews,
          totalReports
        }
      }
    })
  } catch (error) {
    console.error('Error fetching content moderation data:', error)
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
    const { type, id, action, reason } = body

    // Validate required fields
    if (!type || !id || !action) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    let result

    switch (type) {
      case 'post':
        if (action === 'approve') {
          result = await prisma.post.update({
            where: { id },
            data: { 
              isFlagged: false,
              isReviewed: true,
              status: 'PUBLISHED'
            }
          })
        } else if (action === 'reject') {
          result = await prisma.post.update({
            where: { id },
            data: { 
              isFlagged: false,
              isReviewed: true,
              status: 'ARCHIVED'
            }
          })
        }
        break

      case 'comment':
        if (action === 'approve') {
          result = await prisma.comment.update({
            where: { id },
            data: { 
              isFlagged: false,
              isReviewed: true,
              status: 'APPROVED'
            }
          })
        } else if (action === 'reject') {
          result = await prisma.comment.update({
            where: { id },
            data: { 
              isFlagged: false,
              isReviewed: true,
              status: 'REJECTED'
            }
          })
        }
        break

      case 'review':
        if (action === 'approve') {
          result = await prisma.review.update({
            where: { id },
            data: { 
              isFlagged: false,
              isReviewed: true
            }
          })
        } else if (action === 'reject') {
          result = await prisma.review.update({
            where: { id },
            data: { 
              isFlagged: false,
              isReviewed: true
            }
          })
        }
        break

      case 'content':
        if (action === 'approve') {
          result = await prisma.content.update({
            where: { id },
            data: { 
              isFlagged: false,
              isReviewed: true
            }
          })
        } else if (action === 'reject') {
          result = await prisma.content.update({
            where: { id },
            data: { 
              isFlagged: false,
              isReviewed: true
            }
          })
        }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid content type' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `Content ${action}d successfully`
    })
  } catch (error) {
    console.error('Error moderating content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
