'use client'

import { useState, useEffect } from 'react'
import { 
  UserGroupIcon, 
  DocumentTextIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  ChartBarIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

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
  const [students, setStudents] = useState<Student[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([])
  const [selectedTab, setSelectedTab] = useState<'overview' | 'students' | 'assignments' | 'classes'>('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    // Mock data - in production, this would come from your API
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
        lastActive: '2 hours ago'
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
        lastActive: '1 day ago'
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
        lastActive: '30 minutes ago'
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
        content: 'My vision is to create a sustainable food delivery platform that reduces waste and supports local farmers...',
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
        content: 'After conducting 20 customer interviews, I found that 80% of respondents are interested in...',
        attachments: ['market_research.pdf', 'interview_notes.pdf'],
        grade: 45,
        feedback: 'Great work on the customer interviews! Consider adding more quantitative data to strengthen your validation.'
      },
      {
        id: '3',
        title: 'Business Model Canvas',
        student: mockStudents[2],
        phase: 3,
        phaseTitle: 'Business Model & Strategy',
        submittedAt: '2024-01-25T09:45:00Z',
        dueDate: '2024-01-25',
        points: 60,
        status: 'late',
        content: 'Here is my business model canvas for the eco-friendly packaging startup...',
        attachments: ['business_model_canvas.pdf']
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

    setStudents(mockStudents)
    setAssignments(mockAssignments)
    setLiveClasses(mockLiveClasses)
  }, [])

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.student.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus
    return matchesSearch && matchesStatus
  })

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

  const stats = {
    totalStudents: students.length,
    activeStudents: students.filter(s => s.lastActive.includes('hour') || s.lastActive.includes('minute')).length,
    pendingAssignments: assignments.filter(a => a.status === 'submitted').length,
    gradedAssignments: assignments.filter(a => a.status === 'graded').length,
    upcomingClasses: liveClasses.filter(c => new Date(c.date) > new Date()).length
  }

  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: ChartBarIcon },
              { id: 'students', name: 'Students', icon: UserGroupIcon },
              { id: 'assignments', name: 'Assignments', icon: DocumentTextIcon },
              { id: 'classes', name: 'Live Classes', icon: VideoCameraIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  selectedTab === tab.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 inline mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Student Progress Chart */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Student Progress</h3>
                  <div className="space-y-4">
                    {students.map((student) => (
                      <div key={student.id} className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {student.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{student.name}</p>
                            <p className="text-xs text-gray-500">Phase {student.currentPhase}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{student.totalPoints} pts</p>
                          <p className="text-xs text-gray-500">{student.assignmentsGraded}/{student.assignmentsSubmitted} graded</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {assignments.slice(0, 3).map((assignment) => (
                      <div key={assignment.id} className="flex items-center">
                        <div className="flex-shrink-0">
                          <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <div className="ml-3 flex-1">
                          <p className="text-sm text-gray-900">{assignment.student.name} submitted {assignment.title}</p>
                          <p className="text-xs text-gray-500">{assignment.submittedAt}</p>
                        </div>
                        {getStatusBadge(assignment.status)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Students Tab */}
          {selectedTab === 'students' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Your Students</h3>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Add Student
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {students.map((student) => (
                  <div key={student.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-700">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-lg font-medium text-gray-900">{student.name}</h4>
                        <p className="text-sm text-gray-500">{student.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Cohort:</span>
                        <span className="font-medium">{student.cohort}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Phase:</span>
                        <span className="font-medium">Phase {student.currentPhase}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Points:</span>
                        <span className="font-medium">{student.totalPoints}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Last Active:</span>
                        <span className="font-medium">{student.lastActive}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-md">
                        View Profile
                      </button>
                      <button className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-md">
                        Message
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {selectedTab === 'assignments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Assignment Submissions</h3>
                <div className="flex space-x-4">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search assignments..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-purple-500 focus:border-purple-500"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 focus:ring-purple-500 focus:border-purple-500"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Status</option>
                    <option value="submitted">Pending Review</option>
                    <option value="graded">Graded</option>
                    <option value="late">Late</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                {filteredAssignments.map((assignment) => (
                  <div key={assignment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900">{assignment.title}</h4>
                          {getStatusBadge(assignment.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          <span className="font-medium">{assignment.student.name}</span> • 
                          Phase {assignment.phase}: {assignment.phaseTitle} • 
                          {assignment.points} points
                        </p>
                        <p className="text-sm text-gray-500 mb-4">{assignment.content}</p>
                        
                        {assignment.attachments.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium text-gray-700 mb-2">Attachments:</p>
                            <div className="flex space-x-2">
                              {assignment.attachments.map((attachment, index) => (
                                <a
                                  key={index}
                                  href="#"
                                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200"
                                >
                                  <DocumentTextIcon className="h-3 w-3 mr-1" />
                                  {attachment}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {assignment.grade && (
                          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
                            <p className="text-sm font-medium text-green-800">Grade: {assignment.grade}/{assignment.points}</p>
                            {assignment.feedback && (
                              <p className="text-sm text-green-700 mt-1">{assignment.feedback}</p>
                            )}
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-6 flex space-x-2">
                        {assignment.status === 'submitted' && (
                          <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md">
                            Grade Assignment
                          </button>
                        )}
                        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Classes Tab */}
          {selectedTab === 'classes' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Live Classes</h3>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Schedule Class
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {liveClasses.map((classItem) => (
                  <div key={classItem.id} className="bg-white border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-medium text-gray-900">{classItem.title}</h4>
                        <p className="text-sm text-gray-600">{classItem.date} at {classItem.time}</p>
                        <p className="text-sm text-gray-500">{classItem.duration}</p>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {classItem.attendees}/{classItem.maxAttendees} registered
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        <button className="px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 rounded-md">
                          Start Class
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md">
                          Edit
                        </button>
                      </div>
                      {classItem.recordingUrl && (
                        <a
                          href={classItem.recordingUrl}
                          className="text-sm text-purple-600 hover:text-purple-800"
                        >
                          View Recording
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
