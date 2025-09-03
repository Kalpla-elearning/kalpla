'use client'

import { useState, useEffect } from 'react'
import { 
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  FlagIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  StarIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline'

interface FlaggedContent {
  posts: any[]
  comments: any[]
  reviews: any[]
  content: any[]
}

interface ModerationStats {
  totalFlaggedPosts: number
  totalFlaggedComments: number
  totalFlaggedReviews: number
  totalFlaggedContent: number
  pendingReviews: number
  totalReports: number
}

export default function ContentModerationPage() {
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent>({
    posts: [],
    comments: [],
    reviews: [],
    content: []
  })
  const [stats, setStats] = useState<ModerationStats>({
    totalFlaggedPosts: 0,
    totalFlaggedComments: 0,
    totalFlaggedReviews: 0,
    totalFlaggedContent: 0,
    pendingReviews: 0,
    totalReports: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('all')

  useEffect(() => {
    fetchModerationData()
  }, [])

  const fetchModerationData = async () => {
    try {
      const response = await fetch('/api/admin/content-moderation')
      const data = await response.json()

      if (data.success) {
        setFlaggedContent(data.data.flaggedContent)
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error('Error fetching moderation data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleModerationAction = async (type: string, id: string, action: string) => {
    try {
      const response = await fetch('/api/admin/content-moderation', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type,
          id,
          action
        })
      })

      if (response.ok) {
        fetchModerationData() // Refresh data
      } else {
        const data = await response.json()
        alert(data.error || 'Error processing moderation action')
      }
    } catch (error) {
      console.error('Error processing moderation action:', error)
      alert('Error processing moderation action')
    }
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'post':
        return <DocumentTextIcon className="h-5 w-5 text-blue-600" />
      case 'comment':
        return <ChatBubbleLeftIcon className="h-5 w-5 text-green-600" />
      case 'review':
        return <StarIcon className="h-5 w-5 text-yellow-600" />
      case 'content':
        return <VideoCameraIcon className="h-5 w-5 text-purple-600" />
      default:
        return <FlagIcon className="h-5 w-5 text-gray-600" />
    }
  }

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'post':
        return 'Blog Post'
      case 'comment':
        return 'Comment'
      case 'review':
        return 'Review'
      case 'content':
        return 'Course Content'
      default:
        return 'Content'
    }
  }

  const renderContentItem = (item: any, type: string) => (
    <div key={item.id} className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center mb-2">
            {getContentIcon(type)}
            <span className="ml-2 text-sm font-medium text-gray-600">
              {getContentTypeLabel(type)}
            </span>
            <span className="ml-2 px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
              Flagged
            </span>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {item.title || item.content?.substring(0, 100) + '...' || 'Untitled'}
          </h3>
          
          <div className="text-sm text-gray-600 mb-3">
            <p><strong>Author:</strong> {item.author?.name || item.user?.name || 'Unknown'}</p>
            <p><strong>Created:</strong> {new Date(item.createdAt).toLocaleDateString()}</p>
            {item.post && <p><strong>Post:</strong> {item.post.title}</p>}
            {item.course && <p><strong>Course:</strong> {item.course.title}</p>}
          </div>
          
          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">
            {item.content?.substring(0, 200)}...
          </div>
        </div>
        
        <div className="ml-4 flex flex-col space-y-2">
          <button
            onClick={() => handleModerationAction(type, item.id, 'approve')}
            className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 flex items-center"
          >
            <CheckCircleIcon className="h-4 w-4 mr-1" />
            Approve
          </button>
          <button
            onClick={() => handleModerationAction(type, item.id, 'reject')}
            className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 flex items-center"
          >
            <XCircleIcon className="h-4 w-4 mr-1" />
            Reject
          </button>
          <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700 flex items-center">
            <EyeIcon className="h-4 w-4 mr-1" />
            View
          </button>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Moderation</h2>
          <p className="text-gray-600">Review and moderate flagged content across the platform</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <FlagIcon className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReports}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <DocumentTextIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Flagged Posts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFlaggedPosts}</p>
            </div>
        </div>
      </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <ChatBubbleLeftIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Flagged Comments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFlaggedComments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <StarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Flagged Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFlaggedReviews}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <VideoCameraIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Flagged Content</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalFlaggedContent}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <ShieldCheckIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingReviews}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'all', name: 'All Content', count: stats.totalReports },
              { id: 'posts', name: 'Posts', count: stats.totalFlaggedPosts },
              { id: 'comments', name: 'Comments', count: stats.totalFlaggedComments },
              { id: 'reviews', name: 'Reviews', count: stats.totalFlaggedReviews },
              { id: 'content', name: 'Course Content', count: stats.totalFlaggedContent }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'all' && (
            <div className="space-y-6">
              {flaggedContent.posts.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Flagged Blog Posts</h3>
              <div className="space-y-4">
                    {flaggedContent.posts.map(post => renderContentItem(post, 'post'))}
                      </div>
                    </div>
              )}
              
              {flaggedContent.comments.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Flagged Comments</h3>
                  <div className="space-y-4">
                    {flaggedContent.comments.map(comment => renderContentItem(comment, 'comment'))}
                  </div>
              </div>
              )}
              
              {flaggedContent.reviews.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Flagged Reviews</h3>
              <div className="space-y-4">
                    {flaggedContent.reviews.map(review => renderContentItem(review, 'review'))}
                      </div>
                    </div>
              )}
              
              {flaggedContent.content.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Flagged Course Content</h3>
                  <div className="space-y-4">
                    {flaggedContent.content.map(content => renderContentItem(content, 'content'))}
                  </div>
              </div>
              )}
              
              {stats.totalReports === 0 && (
                <div className="text-center py-12">
                  <ShieldCheckIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No flagged content</h3>
                  <p className="text-gray-600">All content is clean and properly moderated.</p>
          </div>
              )}
            </div>
          )}

          {activeTab === 'posts' && (
              <div className="space-y-4">
              {flaggedContent.posts.map(post => renderContentItem(post, 'post'))}
              {flaggedContent.posts.length === 0 && (
                <div className="text-center py-12">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No flagged posts</h3>
                  <p className="text-gray-600">All blog posts are clean.</p>
                      </div>
              )}
                      </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              {flaggedContent.comments.map(comment => renderContentItem(comment, 'comment'))}
              {flaggedContent.comments.length === 0 && (
                <div className="text-center py-12">
                  <ChatBubbleLeftIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No flagged comments</h3>
                  <p className="text-gray-600">All comments are clean.</p>
                    </div>
              )}
                  </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {flaggedContent.reviews.map(review => renderContentItem(review, 'review'))}
              {flaggedContent.reviews.length === 0 && (
                <div className="text-center py-12">
                  <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No flagged reviews</h3>
                  <p className="text-gray-600">All reviews are clean.</p>
              </div>
            )}
          </div>
          )}

          {activeTab === 'content' && (
            <div className="space-y-4">
              {flaggedContent.content.map(content => renderContentItem(content, 'content'))}
              {flaggedContent.content.length === 0 && (
                <div className="text-center py-12">
                  <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No flagged content</h3>
                  <p className="text-gray-600">All course content is clean.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}