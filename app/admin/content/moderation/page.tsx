import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  ExclamationTriangleIcon,
  FlagIcon,
  EyeIcon,
  CheckCircleIcon,
  XCircleIcon,
  ChatBubbleLeftIcon,
  StarIcon,
  PlayIcon,
  UserIcon,
  CalendarIcon,
  ShieldCheckIcon,
  TrashIcon,
  ClockIcon
} from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

async function getModerationData() {
  const [
    flaggedComments,
    flaggedReviews,
    flaggedVideos,
    totalFlagged,
    resolvedFlags,
    pendingFlags,
    recentActivity
  ] = await Promise.all([
    // Flagged comments
    prisma.comment.findMany({
      where: { isFlagged: true },
      include: {
        author: {
          select: { name: true, email: true }
        },
        post: {
          select: { title: true }
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
          select: { name: true, email: true }
        },
        course: {
          select: { title: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    // Flagged videos (content)
    prisma.content.findMany({
      where: { isFlagged: true },
      include: {
        module: {
          select: { 
            course: {
              select: { title: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    // Total flagged content
    prisma.$transaction([
      prisma.comment.count({ where: { isFlagged: true } }),
      prisma.review.count({ where: { isFlagged: true } }),
      prisma.content.count({ where: { isFlagged: true } })
    ]),
    // Resolved flags (last 7 days)
    prisma.$transaction([
      prisma.comment.count({ 
        where: { 
          isFlagged: false,
          updatedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.review.count({ 
        where: { 
          isFlagged: false,
          updatedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      }),
      prisma.content.count({ 
        where: { 
          isFlagged: false,
          updatedAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          }
        }
      })
    ]),
    // Pending flags
    prisma.$transaction([
      prisma.comment.count({ where: { isFlagged: true, isReviewed: false } }),
      prisma.review.count({ where: { isFlagged: true, isReviewed: false } }),
      prisma.content.count({ where: { isFlagged: true, isReviewed: false } })
    ]),
    // Recent moderation activity
    prisma.comment.findMany({
      where: {
        OR: [
          { isFlagged: true },
          { isReviewed: true }
        ]
      },
      include: {
        author: {
          select: { name: true }
        },
        post: {
          select: { title: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 5
    })
  ])

  const [totalFlaggedComments, totalFlaggedReviews, totalFlaggedVideos] = totalFlagged
  const [resolvedComments, resolvedReviews, resolvedVideos] = resolvedFlags
  const [pendingComments, pendingReviews, pendingVideos] = pendingFlags

  return {
    flaggedComments,
    flaggedReviews,
    flaggedVideos,
    totalFlaggedComments,
    totalFlaggedReviews,
    totalFlaggedVideos,
    resolvedComments,
    resolvedReviews,
    resolvedVideos,
    pendingComments,
    pendingReviews,
    pendingVideos,
    recentActivity
  }
}

export default async function AdminContentModerationPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  const data = await getModerationData()

  const totalFlagged = data.totalFlaggedComments + data.totalFlaggedReviews + data.totalFlaggedVideos
  const totalResolved = data.resolvedComments + data.resolvedReviews + data.resolvedVideos
  const totalPending = data.pendingComments + data.pendingReviews + data.pendingVideos

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
          <p className="text-gray-600 mt-2">Review and manage flagged content across the platform</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/content/guidelines"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            <ShieldCheckIcon className="h-5 w-5 mr-2" />
            Moderation Guidelines
          </Link>
          <Link
            href="/admin/content/reports"
            className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center"
          >
            <FlagIcon className="h-5 w-5 mr-2" />
            View Reports
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Flagged</p>
              <p className="text-2xl font-bold text-gray-900">{totalFlagged}</p>
              <p className="text-xs text-gray-500">Content requiring review</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{totalPending}</p>
              <p className="text-xs text-gray-500">Awaiting action</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved This Week</p>
              <p className="text-2xl font-bold text-gray-900">{totalResolved}</p>
              <p className="text-xs text-gray-500">Successfully moderated</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ShieldCheckIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Moderation Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalFlagged > 0 ? Math.round((totalResolved / (totalFlagged + totalResolved)) * 100) : 100}%
              </p>
              <p className="text-xs text-gray-500">Efficiency score</p>
            </div>
          </div>
        </div>
      </div>

      {/* Flagged Content Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Flagged Content</h3>
        </div>
        <div className="p-6">
          {/* Comments */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-900 flex items-center">
                <ChatBubbleLeftIcon className="h-5 w-5 mr-2" />
                Flagged Comments ({data.totalFlaggedComments})
              </h4>
              <Link
                href="/admin/content/comments"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
            {data.flaggedComments.length > 0 ? (
              <div className="space-y-4">
                {data.flaggedComments.map((comment) => (
                  <div key={comment.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{comment.author.name}</span>
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(comment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{comment.content}</p>
                        <p className="text-xs text-gray-500">Post: {comment.post.title}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Approve
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors">
                          <XCircleIcon className="h-3 w-3 mr-1" />
                          Remove
                        </button>
                        <Link
                          href={`/admin/content/comments/${comment.id}`}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No flagged comments</p>
            )}
          </div>

          {/* Reviews */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-900 flex items-center">
                <StarIcon className="h-5 w-5 mr-2" />
                Flagged Reviews ({data.totalFlaggedReviews})
              </h4>
              <Link
                href="/admin/content/reviews"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
            {data.flaggedReviews.length > 0 ? (
              <div className="space-y-4">
                {data.flaggedReviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{review.user.name}</span>
                          <div className="flex items-center ml-2">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                        <p className="text-xs text-gray-500">Course: {review.course.title}</p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Approve
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors">
                          <XCircleIcon className="h-3 w-3 mr-1" />
                          Remove
                        </button>
                        <Link
                          href={`/admin/content/reviews/${review.id}`}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No flagged reviews</p>
            )}
          </div>

          {/* Videos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-md font-semibold text-gray-900 flex items-center">
                <PlayIcon className="h-5 w-5 mr-2" />
                Flagged Videos ({data.totalFlaggedVideos})
              </h4>
              <Link
                href="/admin/content/videos"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                View all
              </Link>
            </div>
            {data.flaggedVideos.length > 0 ? (
              <div className="space-y-4">
                {data.flaggedVideos.map((video) => (
                  <div key={video.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h5 className="text-sm font-medium text-gray-900 mb-2">{video.title}</h5>
                        <p className="text-sm text-gray-700 mb-2">{video.description}</p>
                                                 <p className="text-xs text-gray-500">Course: {video.module.course.title}</p>
                        <p className="text-xs text-gray-500">
                          Duration: {video.duration} minutes
                        </p>
                      </div>
                      <div className="flex items-center space-x-2 ml-4">
                        <button className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700 transition-colors">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Approve
                        </button>
                        <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors">
                          <XCircleIcon className="h-3 w-3 mr-1" />
                          Remove
                        </button>
                        <Link
                          href={`/admin/content/videos/${video.id}`}
                          className="p-1 text-gray-400 hover:text-gray-600"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No flagged videos</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Moderation Activity</h3>
        </div>
        <div className="p-6">
          {data.recentActivity.length > 0 ? (
            <div className="space-y-4">
              {data.recentActivity.map((comment) => (
                <div key={comment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <ChatBubbleLeftIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                                             <p className="text-sm font-medium text-gray-900">
                         Comment by {comment.author.name}
                       </p>
                       <p className="text-sm text-gray-600">Post: {comment.post.title}</p>
                      <p className="text-xs text-gray-500">
                        {comment.isFlagged ? 'Flagged' : 'Reviewed'} {new Date(comment.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    comment.isFlagged ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {comment.isFlagged ? 'Flagged' : 'Reviewed'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">No recent moderation activity</p>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Bulk Approve Selected</span>
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Bulk Remove Selected</span>
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ShieldCheckIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Update Guidelines</span>
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <TrashIcon className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Clear Resolved</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
