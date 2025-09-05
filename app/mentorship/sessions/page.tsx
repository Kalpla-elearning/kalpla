'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  CalendarIcon,
  ClockIcon,
  UserIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlayIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

interface Session {
  id: string
  title: string
  description: string
  scheduledAt: string
  duration: number
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  meetingUrl: string | null
  notes: string | null
  mentor: {
    id: string
    user: {
      name: string
      avatar: string | null
    }
  }
}

export default function MentorshipSessionsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed' | 'cancelled'>('all')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchSessions()
  }, [session, status, router])

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/mentorship/sessions')
      if (response.ok) {
        const data = await response.json()
        setSessions(data)
      }
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Upcoming</span>
      case 'COMPLETED':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Completed</span>
      case 'CANCELLED':
        return <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Cancelled</span>
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return <CalendarIcon className="h-5 w-5 text-blue-500" />
      case 'COMPLETED':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />
      case 'CANCELLED':
        return <XCircleIcon className="h-5 w-5 text-red-500" />
      default:
        return <CalendarIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const filteredSessions = sessions.filter(session => {
    if (filter === 'all') return true
    if (filter === 'upcoming') return session.status === 'SCHEDULED'
    if (filter === 'completed') return session.status === 'COMPLETED'
    if (filter === 'cancelled') return session.status === 'CANCELLED'
    return true
  })

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
                href="/dashboard"
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Sessions</h1>
                <p className="text-gray-600 mt-2">Manage your mentorship sessions</p>
              </div>
            </div>
            <Link href="/mentorship" className="btn-primary">
              Find Mentors
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{sessions.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Upcoming</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s => s.status === 'SCHEDULED').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {sessions.filter(s => s.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UserIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Mentors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(sessions.map(s => s.mentor.id)).size}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Sessions</h2>
            <div className="flex space-x-2">
              {[
                { value: 'all', label: 'All Sessions' },
                { value: 'upcoming', label: 'Upcoming' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' }
              ].map((filterOption) => (
                <button
                  key={filterOption.value}
                  onClick={() => setFilter(filterOption.value as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === filterOption.value
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filterOption.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sessions List */}
        <div className="space-y-6">
          {filteredSessions.length === 0 ? (
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No sessions found</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? "You haven't booked any sessions yet."
                  : `No ${filter} sessions found.`
                }
              </p>
              <Link href="/mentorship" className="btn-primary">
                Find Mentors
              </Link>
            </div>
          ) : (
            filteredSessions.map((session) => (
              <div key={session.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        {getStatusIcon(session.status)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                          {getStatusBadge(session.status)}
                        </div>
                        
                        <p className="text-gray-600 mb-3">{session.description}</p>
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-1" />
                            <span>{session.mentor.user.name}</span>
                          </div>
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            <span>{formatDate(session.scheduledAt)}</span>
                          </div>
                          <div className="flex items-center">
                            <ClockIcon className="h-4 w-4 mr-1" />
                            <span>{session.duration} minutes</span>
                          </div>
                        </div>

                        {session.notes && (
                          <div className="bg-gray-50 rounded-lg p-4 mb-4">
                            <h4 className="font-medium text-gray-900 mb-2">Session Notes</h4>
                            <p className="text-gray-700 text-sm">{session.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-4">
                      {session.status === 'SCHEDULED' && (
                        <>
                          {session.meetingUrl ? (
                            <Link
                              href={session.meetingUrl}
                              target="_blank"
                              className="btn-primary flex items-center"
                            >
                              <VideoCameraIcon className="h-4 w-4 mr-2" />
                              Join Session
                            </Link>
                          ) : (
                            <span className="text-sm text-gray-500">Meeting link will be shared soon</span>
                          )}
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to cancel this session?')) {
                                // Handle cancellation
                              }
                            }}
                            className="btn-secondary"
                          >
                            Cancel Session
                          </button>
                        </>
                      )}
                      
                      {session.status === 'COMPLETED' && (
                        <Link
                          href={`/mentorship/sessions/${session.id}/review`}
                          className="btn-secondary"
                        >
                          Write Review
                        </Link>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/mentorship/sessions/${session.id}`}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
