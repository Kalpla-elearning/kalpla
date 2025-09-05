'use client'

import { useState, useEffect } from 'react'
import { 
  UserGroupIcon, 
  DocumentTextIcon, 
  ChartBarIcon,
  VideoCameraIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  BellIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface MentorStats {
  totalStudents: number
  activeStudents: number
  pendingAssignments: number
  gradedAssignments: number
  upcomingClasses: number
  totalEarnings: number
  averageRating: number
  totalSessions: number
}

interface Student {
  id: string
  name: string
  email: string
  cohort: string
  currentPhase: number
  totalPoints: number
  assignmentsSubmitted: number
  assignmentsGraded: number
  lastActive: string
  progress: number
  avatar?: string
}

interface Assignment {
  id: string
  title: string
  student: Student
  phase: number
  phaseTitle: string
  submittedAt: string
  dueDate: string
  points: number
  status: 'submitted' | 'graded' | 'late'
  content: string
  attachments: string[]
  grade?: number
  feedback?: string
}

interface LiveClass {
  id: string
  title: string
  date: string
  time: string
  duration: string
  attendees: number
  maxAttendees: number
  meetingLink: string
  recordingUrl?: string
}

export default function MentorDashboard() {
  const [stats, setStats] = useState<MentorStats | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in production, this would come from your API
    const mockStats: MentorStats = {
      totalStudents: 25,
      activeStudents: 18,
      pendingAssignments: 8,
      gradedAssignments: 45,
      upcomingClasses: 3,
      totalEarnings: 12500,
      averageRating: 4.8,
      totalSessions: 120
    }

    const mockStudents: Student[] = [
      {
        id: '1',
        name: 'John Doe',
        email: 'john@example.com',
        cohort: 'Cohort 2024-01',
        currentPhase: 2,
        totalPoints: 85,
        assignmentsSubmitted: 3,
        assignmentsGraded: 2,
        lastActive: '2 hours ago',
        progress: 65
      },
      {
        id: '2',
        name: 'Jane Smith',
        email: 'jane@example.com',
        cohort: 'Cohort 2024-01',
        currentPhase: 1,
        totalPoints: 45,
        assignmentsSubmitted: 2,
        assignmentsGraded: 1,
        lastActive: '1 day ago',
        progress: 40
      },
      {
        id: '3',
        name: 'Mike Johnson',
        email: 'mike@example.com',
        cohort: 'Cohort 2024-01',
        currentPhase: 3,
        totalPoints: 120,
        assignmentsSubmitted: 5,
        assignmentsGraded: 4,
        lastActive: '30 minutes ago',
        progress: 80
      }
    ]

    const mockAssignments: Assignment[] = [
      {
        id: '1',
        title: 'Personal Vision Statement',
        student: mockStudents[0],
        phase: 1,
        phaseTitle: 'Foundation & Mindset',
        submittedAt: '2024-01-15T10:30:00Z',
        dueDate: '2024-01-15',
        points: 25,
        status: 'submitted',
        content: 'My vision is to create a sustainable food delivery platform...',
        attachments: ['vision_statement.pdf']
      },
      {
        id: '2',
        title: 'Market Validation Report',
        student: mockStudents[1],
        phase: 2,
        phaseTitle: 'Idea Validation & Market Research',
        submittedAt: '2024-01-20T14:15:00Z',
        dueDate: '2024-01-20',
        points: 50,
        status: 'graded',
        content: 'After conducting 20 customer interviews...',
        attachments: ['market_research.pdf'],
        grade: 45,
        feedback: 'Great work on the customer interviews!'
      }
    ]

    const mockLiveClasses: LiveClass[] = [
      {
        id: '1',
        title: 'Q&A Session: Foundation Phase',
        date: '2024-01-30',
        time: '7:00 PM',
        duration: '1 hour',
        attendees: 12,
        maxAttendees: 20,
        meetingLink: '#',
        recordingUrl: '#'
      },
      {
        id: '2',
        title: 'Market Research Workshop',
        date: '2024-02-05',
        time: '6:00 PM',
        duration: '1.5 hours',
        attendees: 8,
        maxAttendees: 20,
        meetingLink: '#'
      }
    ]

    setStats(mockStats)
    setStudents(mockStudents)
    setAssignments(mockAssignments)
    setLiveClasses(mockLiveClasses)
    setLoading(false)
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'graded':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Graded
        </span>
      case 'submitted':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <ClockIcon className="w-3 h-3 mr-1" />
          Pending Review
        </span>
      case 'late':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
          Late
        </span>
      default:
        return null
    }
  }

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-purple-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mentor Dashboard</h1>
            <p className="mt-2 text-purple-100">Guide your students through their startup journey</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{stats.totalStudents} Students</div>
            <div className="text-sm text-purple-100">{stats.activeStudents} active today</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingAssignments}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Graded Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.gradedAssignments}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <VideoCameraIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Classes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingClasses}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Progress Overview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Student Progress</h3>
                <Link
                  href="/dashboard/mentor/students"
                  className="text-sm text-purple-600 hover:text-purple-800"
                >
                  View All
                </Link>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-700">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">{student.name}</h4>
                        <p className="text-xs text-gray-500">Phase {student.currentPhase} • {student.totalPoints} points</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{student.progress}%</div>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${student.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <Link
                href="/dashboard/mentor/assignments"
                className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <DocumentTextIcon className="h-5 w-5 mr-3 text-blue-500" />
                Grade Assignments
              </Link>
              <Link
                href="/dashboard/mentor/students"
                className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <UserGroupIcon className="h-5 w-5 mr-3 text-green-500" />
                View Students
              </Link>
              <Link
                href="/dashboard/mentor/classes"
                className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <VideoCameraIcon className="h-5 w-5 mr-3 text-purple-500" />
                Schedule Class
              </Link>
              <Link
                href="/dashboard/mentor/reports"
                className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChartBarIcon className="h-5 w-5 mr-3 text-orange-500" />
                View Reports
              </Link>
            </div>
          </div>

          {/* Earnings Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Earnings Summary</h3>
            </div>
            <div className="p-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600">₹{stats.totalEarnings.toLocaleString()}</div>
                <div className="text-sm text-gray-600">Total Earnings</div>
                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Average Rating:</span>
                    <span className="font-medium">{stats.averageRating}/5</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Sessions:</span>
                    <span className="font-medium">{stats.totalSessions}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Assignment Submissions */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Assignment Submissions</h3>
            <Link
              href="/dashboard/mentor/assignments"
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {assignment.student.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{assignment.title}</h4>
                    <p className="text-xs text-gray-500">
                      {assignment.student.name} • Phase {assignment.phase}: {assignment.phaseTitle}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  {getStatusBadge(assignment.status)}
                  <button className="px-3 py-1 text-sm text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-md">
                    {assignment.status === 'submitted' ? 'Grade' : 'View'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Upcoming Live Classes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Live Classes</h3>
            <Link
              href="/dashboard/mentor/classes"
              className="text-sm text-purple-600 hover:text-purple-800"
            >
              Manage Classes
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {liveClasses.map((classItem) => (
              <div key={classItem.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{classItem.title}</h4>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {classItem.attendees}/{classItem.maxAttendees} registered
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-3">{classItem.date} at {classItem.time} ({classItem.duration})</p>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md">
                    Start Class
                  </button>
                  <button className="px-3 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
