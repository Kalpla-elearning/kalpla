'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ChatBubbleLeftRightIcon,
  QuestionMarkCircleIcon,
  CheckCircleIcon,
  ClockIcon,
  UserIcon,
  BookOpenIcon,
  EyeIcon,
  ArrowUturnLeftIcon,
  FlagIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface Discussion {
  id: string
  title: string
  content: string
  status: 'OPEN' | 'RESOLVED' | 'CLOSED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  createdAt: string
  updatedAt: string
  user: {
    id: string
    name: string
    email: string
  }
  course: {
    id: string
    title: string
    slug: string
  }
  replies: Reply[]
  _count: {
    replies: number
  }
}

interface Reply {
  id: string
  content: string
  createdAt: string
  user: {
    id: string
    name: string
    role: string
  }
  isInstructorReply: boolean
}

export default function DiscussionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved' | 'closed'>('all')
  const [priority, setPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all')
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null)
  const [replyContent, setReplyContent] = useState('')
  const [showReplyForm, setShowReplyForm] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }

    fetchDiscussions()
  }, [session, status, router, filter, priority])

  const fetchDiscussions = async () => {
    try {
      const params = new URLSearchParams()
      if (filter !== 'all') params.append('status', filter.toUpperCase())
      if (priority !== 'all') params.append('priority', priority.toUpperCase())
      
      const response = await fetch(`/api/instructor/discussions?${params}`)
      if (response.ok) {
        const data = await response.json()
        setDiscussions(data)
      }
    } catch (error) {
      console.error('Error fetching discussions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleReply = async (discussionId: string) => {
    if (!replyContent.trim()) return

    try {
      const response = await fetch(`/api/instructor/discussions/${discussionId}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: replyContent })
      })
      if (response.ok) {
        await fetchDiscussions()
        setReplyContent('')
        setShowReplyForm(null)
      }
    } catch (error) {
      console.error('Error posting reply:', error)
    }
  }

  const handleStatusChange = async (discussionId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/instructor/discussions/${discussionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })
      if (response.ok) {
        await fetchDiscussions()
      }
    } catch (error) {
      console.error('Error updating discussion status:', error)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Open</span>
      case 'RESOLVED':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Resolved</span>
      case 'CLOSED':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Closed</span>
      default:
        return null
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">High</span>
      case 'MEDIUM':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Medium</span>
      case 'LOW':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Low</span>
      default:
        return null
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/instructor/dashboard"
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Student Discussions</h1>
                <p className="text-gray-600 mt-2">Manage questions and discussions from your students</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Status</option>
                <option value="open">Open</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Priorities</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
          </div>
        </div>

        {/* Discussions List */}
        <div className="space-y-6">
          {discussions.length === 0 ? (
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No discussions found</h3>
              <p className="text-gray-600">Students haven't asked any questions yet.</p>
            </div>
          ) : (
            discussions.map((discussion) => (
              <div key={discussion.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <QuestionMarkCircleIcon className="h-5 w-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-gray-900">{discussion.title}</h3>
                        {getStatusBadge(discussion.status)}
                        {getPriorityBadge(discussion.priority)}
                      </div>
                      <p className="text-gray-600 mb-3">{discussion.content}</p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-1" />
                          {discussion.user.name}
                        </div>
                        <div className="flex items-center">
                          <BookOpenIcon className="h-4 w-4 mr-1" />
                          {discussion.course.title}
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {formatDate(discussion.createdAt)}
                        </div>
                        <div className="flex items-center">
                          <ChatBubbleLeftRightIcon className="h-4 w-4 mr-1" />
                          {discussion._count.replies} replies
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowReplyForm(showReplyForm === discussion.id ? null : discussion.id)}
                        className="btn-secondary flex items-center"
                      >
                        <ArrowUturnLeftIcon className="h-4 w-4 mr-2" />
                        Reply
                      </button>
                      <select
                        value={discussion.status}
                        onChange={(e) => handleStatusChange(discussion.id, e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      >
                        <option value="OPEN">Open</option>
                        <option value="RESOLVED">Resolved</option>
                        <option value="CLOSED">Closed</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Reply Form */}
                {showReplyForm === discussion.id && (
                  <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Your Reply
                      </label>
                      <textarea
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Write your reply..."
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleReply(discussion.id)}
                        className="btn-primary"
                      >
                        Post Reply
                      </button>
                      <button
                        onClick={() => {
                          setShowReplyForm(null)
                          setReplyContent('')
                        }}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Replies */}
                {discussion.replies.length > 0 && (
                  <div className="px-6 py-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Replies</h4>
                    <div className="space-y-4">
                      {discussion.replies.map((reply) => (
                        <div key={reply.id} className={`p-4 rounded-lg ${
                          reply.isInstructorReply ? 'bg-blue-50 border-l-4 border-blue-400' : 'bg-gray-50'
                        }`}>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <div className="flex items-center">
                                {reply.isInstructorReply ? (
                                  <StarIcon className="h-4 w-4 text-blue-500 mr-1" />
                                ) : (
                                  <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
                                )}
                                <span className="text-sm font-medium text-gray-900">
                                  {reply.user.name}
                                </span>
                                {reply.isInstructorReply && (
                                  <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                    Instructor
                                  </span>
                                )}
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
