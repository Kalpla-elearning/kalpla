'use client'

import { useState, useEffect } from 'react'
import { 
  BookOpenIcon, 
  TrophyIcon, 
  BellIcon,
  UserIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  FireIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface StudentStats {
  totalPoints: number
  currentRank: number
  totalStudents: number
  completedModules: number
  totalModules: number
  assignmentsSubmitted: number
  assignmentsGraded: number
  badges: string[]
  streak: number
}

interface RecentActivity {
  id: string
  type: 'assignment' | 'module' | 'badge' | 'announcement'
  title: string
  description: string
  timestamp: string
  points?: number
}

interface UpcomingDeadline {
  id: string
  title: string
  dueDate: string
  module: string
  points: number
  isUrgent: boolean
}

export default function StudentDashboard() {
  const [stats, setStats] = useState<StudentStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<UpcomingDeadline[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in production, this would come from your API
    const mockStats: StudentStats = {
      totalPoints: 285,
      currentRank: 3,
      totalStudents: 150,
      completedModules: 2,
      totalModules: 12,
      assignmentsSubmitted: 8,
      assignmentsGraded: 6,
      badges: ['quick-starter', 'consistent-learner', 'top-performer'],
      streak: 7
    }

    const mockRecentActivity: RecentActivity[] = [
      {
        id: '1',
        type: 'assignment',
        title: 'Market Validation Report',
        description: 'Assignment submitted and graded',
        timestamp: '2 hours ago',
        points: 45
      },
      {
        id: '2',
        type: 'badge',
        title: 'Top Performer Badge',
        description: 'Earned for reaching top 3 in leaderboard',
        timestamp: '1 day ago'
      },
      {
        id: '3',
        type: 'module',
        title: 'Phase 2: Idea Validation',
        description: 'Module completed successfully',
        timestamp: '2 days ago'
      },
      {
        id: '4',
        type: 'announcement',
        title: 'Live Class Tomorrow',
        description: 'Join the Q&A session at 7 PM',
        timestamp: '3 days ago'
      }
    ]

    const mockUpcomingDeadlines: UpcomingDeadline[] = [
      {
        id: '1',
        title: 'Business Model Canvas',
        dueDate: '2024-01-25',
        module: 'Phase 3: Business Model',
        points: 60,
        isUrgent: true
      },
      {
        id: '2',
        title: 'Customer Interview Report',
        dueDate: '2024-01-28',
        module: 'Phase 2: Idea Validation',
        points: 40,
        isUrgent: false
      },
      {
        id: '3',
        title: 'MVP Prototype',
        dueDate: '2024-02-05',
        module: 'Phase 4: Product Development',
        points: 80,
        isUrgent: false
      }
    ]

    setStats(mockStats)
    setRecentActivity(mockRecentActivity)
    setUpcomingDeadlines(mockUpcomingDeadlines)
    setLoading(false)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'assignment':
        return <DocumentTextIcon className="h-5 w-5 text-blue-500" />
      case 'module':
        return <BookOpenIcon className="h-5 w-5 text-green-500" />
      case 'badge':
        return <TrophyIcon className="h-5 w-5 text-yellow-500" />
      case 'announcement':
        return <BellIcon className="h-5 w-5 text-purple-500" />
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />
    }
  }

  const getBadgeColor = (badge: string) => {
    const colors: { [key: string]: string } = {
      'quick-starter': 'bg-green-100 text-green-800',
      'consistent-learner': 'bg-blue-100 text-blue-800',
      'top-performer': 'bg-yellow-100 text-yellow-800',
      'speed-demon': 'bg-red-100 text-red-800',
      'perfectionist': 'bg-purple-100 text-purple-800',
    }
    return colors[badge] || 'bg-gray-100 text-gray-800'
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, Student! 👋</h1>
            <p className="mt-2 text-blue-100">Ready to continue your startup journey?</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">#{stats.currentRank}</div>
            <div className="text-sm text-blue-100">of {stats.totalStudents} students</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrophyIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPoints}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpenIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Modules Completed</p>
              <p className="text-2xl font-bold text-gray-900">{stats.completedModules}/{stats.totalModules}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <FireIcon className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">{stats.streak} days</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.assignmentsGraded}/{stats.assignmentsSubmitted}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start">
                    <div className="flex-shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                        <span className="text-xs text-gray-500">{activity.timestamp}</span>
                      </div>
                      <p className="text-sm text-gray-600">{activity.description}</p>
                      {activity.points && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                          +{activity.points} points
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions & Badges */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <Link
                href="/dashboard/student/courses"
                className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <BookOpenIcon className="h-5 w-5 mr-3 text-blue-500" />
                Continue Learning
              </Link>
              <Link
                href="/dashboard/student/assignments"
                className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <DocumentTextIcon className="h-5 w-5 mr-3 text-green-500" />
                Submit Assignment
              </Link>
              <Link
                href="/dashboard/student/leaderboard"
                className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <TrophyIcon className="h-5 w-5 mr-3 text-yellow-500" />
                View Leaderboard
              </Link>
              <Link
                href="/dashboard/student/mentors"
                className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <UserIcon className="h-5 w-5 mr-3 text-purple-500" />
                Connect with Mentor
              </Link>
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Your Badges</h3>
            </div>
            <div className="p-6">
              <div className="flex flex-wrap gap-2">
                {stats.badges.map((badge) => (
                  <span
                    key={badge}
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getBadgeColor(badge)}`}
                  >
                    {badge.replace('-', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Upcoming Deadlines</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {upcomingDeadlines.map((deadline) => (
              <div key={deadline.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <ClockIcon className={`h-5 w-5 ${deadline.isUrgent ? 'text-red-500' : 'text-gray-400'}`} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{deadline.title}</h4>
                    <p className="text-sm text-gray-500">{deadline.module}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {getDaysUntilDue(deadline.dueDate)} days left
                  </div>
                  <div className="text-xs text-gray-500">{deadline.points} points</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Program Progress</h3>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Overall Progress</span>
              <span>{Math.round((stats.completedModules / stats.totalModules) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(stats.completedModules / stats.totalModules) * 100}%` }}
              ></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">{stats.completedModules}</div>
              <div className="text-sm text-gray-600">Modules Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600">{stats.assignmentsGraded}</div>
              <div className="text-sm text-gray-600">Assignments Graded</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-600">{stats.totalPoints}</div>
              <div className="text-sm text-gray-600">Total Points</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
