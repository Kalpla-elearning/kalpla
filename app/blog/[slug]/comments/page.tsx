'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { format } from 'date-fns'
import { 
  ArrowLeftIcon,
  ChatBubbleLeftIcon,
  UserIcon,
  CalendarIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  FlagIcon,
  ArrowUturnLeftIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface Comment {
  id: string
  content: string
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    image: string | null
  }
  replies: Comment[]
  _count: {
    likes: number
    dislikes: number
  }
  isLiked?: boolean
  isDisliked?: boolean
}

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  featuredImage: string | null
}

export default function CommentsPage({ params }: { params: { slug: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [post, setPost] = useState<BlogPost | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [newComment, setNewComment] = useState('')
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState<'all' | 'approved' | 'pending'>('all')

  useEffect(() => {
    fetchPostAndComments()
  }, [params.slug])

  const fetchPostAndComments = async () => {
    try {
      const [postResponse, commentsResponse] = await Promise.all([
        fetch(`/api/blog/${params.slug}`),
        fetch(`/api/blog/${params.slug}/comments`)
      ])

      if (postResponse.ok) {
        const postData = await postResponse.json()
        setPost(postData.post)
      }

      if (commentsResponse.ok) {
        const commentsData = await commentsResponse.json()
        setComments(commentsData.comments)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!session || !newComment.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/blog/${params.slug}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: newComment }),
      })

      if (response.ok) {
        setNewComment('')
        fetchPostAndComments() // Refresh comments
      }
    } catch (error) {
      console.error('Error submitting comment:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!session || !replyContent.trim()) return

    setSubmitting(true)
    try {
      const response = await fetch(`/api/blog/${params.slug}/comments/${parentId}/replies`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content: replyContent }),
      })

      if (response.ok) {
        setReplyContent('')
        setReplyingTo(null)
        fetchPostAndComments() // Refresh comments
      }
    } catch (error) {
      console.error('Error submitting reply:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLikeComment = async (commentId: string) => {
    if (!session) return

    try {
      const response = await fetch(`/api/blog/comments/${commentId}/like`, {
        method: 'POST',
      })

      if (response.ok) {
        fetchPostAndComments() // Refresh comments
      }
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  const handleDislikeComment = async (commentId: string) => {
    if (!session) return

    try {
      const response = await fetch(`/api/blog/comments/${commentId}/dislike`, {
        method: 'POST',
      })

      if (response.ok) {
        fetchPostAndComments() // Refresh comments
      }
    } catch (error) {
      console.error('Error disliking comment:', error)
    }
  }

  const handleReportComment = async (commentId: string) => {
    if (!session) return

    try {
      const response = await fetch(`/api/blog/comments/${commentId}/report`, {
        method: 'POST',
      })

      if (response.ok) {
        alert('Comment reported successfully')
      }
    } catch (error) {
      console.error('Error reporting comment:', error)
    }
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM dd, yyyy')
  }

  const getFilteredComments = () => {
    if (filter === 'all') return comments
    return comments.filter(comment => comment.status === filter.toUpperCase())
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Post Not Found</h2>
          <p className="text-gray-600 mb-4">The blog post you're looking for doesn't exist.</p>
          <Link href="/blog" className="btn-primary">
            Back to Blog
          </Link>
        </div>
      </div>
    )
  }

  const filteredComments = getFilteredComments()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/blog" className="hover:text-primary-600 flex items-center">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Blog
            </Link>
            <span>/</span>
            <Link href={`/blog/${params.slug}`} className="hover:text-primary-600">
              {post.title}
            </Link>
            <span>/</span>
            <span className="text-gray-900">Comments</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Post Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-start space-x-4">
            {post.featuredImage && (
              <div className="flex-shrink-0">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-20 h-20 rounded-lg object-cover"
                />
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h1>
              {post.excerpt && (
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
              )}
              <Link
                href={`/blog/${params.slug}`}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Read full post →
              </Link>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 flex items-center">
              <ChatBubbleLeftIcon className="h-6 w-6 mr-2" />
              Comments ({comments.length})
            </h2>
            <div className="flex items-center space-x-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">All Comments</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>
          </div>

          {/* New Comment Form */}
          {session ? (
            <div className="mb-8 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                    {session.user?.image ? (
                      <img 
                        src={session.user.image} 
                        alt={session.user.name || 'User'}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-sm text-gray-500">
                      Commenting as {session.user?.name}
                    </p>
                    <button
                      onClick={handleSubmitComment}
                      disabled={!newComment.trim() || submitting}
                      className="btn-primary flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Posting...
                        </>
                      ) : (
                        <>
                          <PaperAirplaneIcon className="h-4 w-4 mr-2" />
                          Post Comment
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="mb-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-800 mb-3">
                Please <Link href="/auth/signin" className="font-medium underline">sign in</Link> to leave a comment.
              </p>
            </div>
          )}

          {/* Comments List */}
          {filteredComments.length === 0 ? (
            <div className="text-center py-12">
              <ChatBubbleLeftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No comments yet</h3>
              <p className="text-gray-600">
                {filter === 'all' 
                  ? 'Be the first to share your thoughts!'
                  : `No ${filter} comments found.`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredComments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  {/* Comment Status Badge */}
                  {comment.status !== 'APPROVED' && (
                    <div className="mb-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        comment.status === 'PENDING' 
                          ? 'bg-yellow-100 text-yellow-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {comment.status === 'PENDING' ? (
                          <>
                            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                            Pending Review
                          </>
                        ) : (
                          <>
                            <ExclamationTriangleIcon className="h-3 w-3 mr-1" />
                            Rejected
                          </>
                        )}
                      </span>
                    </div>
                  )}

                  {/* Main Comment */}
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {comment.author.image ? (
                          <img 
                            src={comment.author.image} 
                            alt={comment.author.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <UserIcon className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">{comment.author.name}</span>
                        <span className="text-sm text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                        {comment.status === 'APPROVED' && (
                          <CheckCircleIcon className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                      <p className="text-gray-700 mb-3 leading-relaxed">{comment.content}</p>
                      
                      {/* Comment Actions */}
                      <div className="flex items-center space-x-4 text-sm">
                        <button
                          onClick={() => handleLikeComment(comment.id)}
                          className={`flex items-center space-x-1 ${
                            comment.isLiked ? 'text-green-600' : 'text-gray-500 hover:text-green-600'
                          }`}
                        >
                          <ThumbsUpIcon className="h-4 w-4" />
                          <span>{comment._count.likes}</span>
                        </button>
                        <button
                          onClick={() => handleDislikeComment(comment.id)}
                          className={`flex items-center space-x-1 ${
                            comment.isDisliked ? 'text-red-600' : 'text-gray-500 hover:text-red-600'
                          }`}
                        >
                          <ThumbsDownIcon className="h-4 w-4" />
                          <span>{comment._count.dislikes}</span>
                        </button>
                        {session && (
                          <button
                            onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            className="flex items-center space-x-1 text-gray-500 hover:text-primary-600"
                          >
                            <ReplyIcon className="h-4 w-4" />
                            <span>Reply</span>
                          </button>
                        )}
                        {session && (
                          <button
                            onClick={() => handleReportComment(comment.id)}
                            className="flex items-center space-x-1 text-gray-500 hover:text-red-600"
                          >
                            <FlagIcon className="h-4 w-4" />
                            <span>Report</span>
                          </button>
                        )}
                      </div>

                      {/* Reply Form */}
                      {replyingTo === comment.id && session && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                {session.user?.image ? (
                                  <img 
                                    src={session.user.image} 
                                    alt={session.user.name || 'User'}
                                    className="h-8 w-8 rounded-full object-cover"
                                  />
                                ) : (
                                  <UserIcon className="h-5 w-5 text-gray-400" />
                                )}
                              </div>
                            </div>
                            <div className="flex-1">
                              <textarea
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                placeholder="Write a reply..."
                                rows={2}
                                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                              />
                              <div className="flex items-center justify-end mt-2 space-x-2">
                                <button
                                  onClick={() => {
                                    setReplyingTo(null)
                                    setReplyContent('')
                                  }}
                                  className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() => handleSubmitReply(comment.id)}
                                  disabled={!replyContent.trim() || submitting}
                                  className="btn-primary text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {submitting ? 'Posting...' : 'Post Reply'}
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 ml-8 space-y-4">
                          {comment.replies.map((reply) => (
                            <div key={reply.id} className="border-l-2 border-gray-200 pl-4">
                              <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0">
                                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    {reply.author.image ? (
                                      <img 
                                        src={reply.author.image} 
                                        alt={reply.author.name}
                                        className="h-8 w-8 rounded-full object-cover"
                                      />
                                    ) : (
                                      <UserIcon className="h-5 w-5 text-gray-400" />
                                    )}
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <span className="font-medium text-gray-900">{reply.author.name}</span>
                                    <span className="text-sm text-gray-500">
                                      {formatDate(reply.createdAt)}
                                    </span>
                                  </div>
                                  <p className="text-gray-700 text-sm">{reply.content}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
