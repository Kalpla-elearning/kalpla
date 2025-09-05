'use client'

import { useState, useEffect } from 'react'
import { 
  PlayIcon, 
  CheckCircleIcon, 
  LockClosedIcon,
  ClockIcon,
  StarIcon,
  TrophyIcon,
  BookOpenIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface Phase {
  id: number
  title: string
  description: string
  duration: string
  points: number
  status: 'locked' | 'available' | 'in-progress' | 'completed'
  progress: number
  videos: Video[]
  assignments: Assignment[]
  liveClass?: LiveClass
}

interface Video {
  id: string
  title: string
  duration: string
  thumbnail: string
  url: string
  watched: boolean
}

interface Assignment {
  id: string
  title: string
  description: string
  dueDate: string
  points: number
  status: 'not-started' | 'in-progress' | 'submitted' | 'graded'
  grade?: number
  feedback?: string
}

interface LiveClass {
  id: string
  title: string
  date: string
  time: string
  duration: string
  meetingLink: string
  recordingUrl?: string
}

export default function MentorshipDashboard() {
  const [currentPhase, setCurrentPhase] = useState(1)
  const [phases, setPhases] = useState<Phase[]>([])
  const [leaderboard, setLeaderboard] = useState([])
  const [userStats, setUserStats] = useState({
    totalPoints: 0,
    completedPhases: 0,
    currentRank: 0,
    totalStudents: 0
  })

  useEffect(() => {
    // Mock data - in production, this would come from your API
    const mockPhases: Phase[] = [
      {
        id: 1,
        title: "Foundation & Mindset",
        description: "Build the entrepreneurial mindset and understand the fundamentals of startup success.",
        duration: "2 weeks",
        points: 100,
        status: 'completed',
        progress: 100,
        videos: [
          { id: '1', title: 'Introduction to Entrepreneurship', duration: '45 min', thumbnail: '/api/placeholder/300/200', url: '#', watched: true },
          { id: '2', title: 'Building the Right Mindset', duration: '38 min', thumbnail: '/api/placeholder/300/200', url: '#', watched: true },
        ],
        assignments: [
          { id: '1', title: 'Personal Vision Statement', description: 'Write your personal vision for your startup journey', dueDate: '2024-01-15', points: 25, status: 'graded', grade: 23 },
          { id: '2', title: 'Market Research Basics', description: 'Research 3 potential markets for your idea', dueDate: '2024-01-20', points: 30, status: 'graded', grade: 28 },
        ],
        liveClass: {
          id: '1',
          title: 'Q&A Session: Foundation Phase',
          date: '2024-01-25',
          time: '7:00 PM',
          duration: '1 hour',
          meetingLink: '#',
          recordingUrl: '#'
        }
      },
      {
        id: 2,
        title: "Idea Validation & Market Research",
        description: "Learn how to validate your business idea and conduct thorough market research.",
        duration: "3 weeks",
        points: 150,
        status: 'in-progress',
        progress: 60,
        videos: [
          { id: '3', title: 'Market Validation Techniques', duration: '52 min', thumbnail: '/api/placeholder/300/200', url: '#', watched: true },
          { id: '4', title: 'Customer Discovery Process', duration: '41 min', thumbnail: '/api/placeholder/300/200', url: '#', watched: false },
        ],
        assignments: [
          { id: '3', title: 'Market Validation Report', description: 'Complete market validation for your idea', dueDate: '2024-02-10', points: 50, status: 'in-progress' },
          { id: '4', title: 'Customer Interview Scripts', description: 'Create interview scripts for customer discovery', dueDate: '2024-02-15', points: 40, status: 'not-started' },
        ]
      },
      {
        id: 3,
        title: "Business Model & Strategy",
        description: "Develop your business model and strategic approach to market entry.",
        duration: "2 weeks",
        points: 120,
        status: 'available',
        progress: 0,
        videos: [
          { id: '5', title: 'Business Model Canvas', duration: '48 min', thumbnail: '/api/placeholder/300/200', url: '#', watched: false },
          { id: '6', title: 'Value Proposition Design', duration: '35 min', thumbnail: '/api/placeholder/300/200', url: '#', watched: false },
        ],
        assignments: [
          { id: '5', title: 'Business Model Canvas', description: 'Complete your business model canvas', dueDate: '2024-02-28', points: 60, status: 'not-started' },
        ]
      },
      // Add more phases...
      {
        id: 4,
        title: "Product Development",
        description: "Learn how to build and iterate on your product effectively.",
        duration: "4 weeks",
        points: 200,
        status: 'locked',
        progress: 0,
        videos: [],
        assignments: []
      },
      {
        id: 5,
        title: "Marketing & Sales",
        description: "Master the art of marketing and sales for your startup.",
        duration: "3 weeks",
        points: 180,
        status: 'locked',
        progress: 0,
        videos: [],
        assignments: []
      },
      {
        id: 6,
        title: "Funding & Investment",
        description: "Understand funding options and how to pitch to investors.",
        duration: "2 weeks",
        points: 150,
        status: 'locked',
        progress: 0,
        videos: [],
        assignments: []
      },
      {
        id: 7,
        title: "Operations & Scaling",
        description: "Learn how to scale your operations and manage growth.",
        duration: "3 weeks",
        points: 170,
        status: 'locked',
        progress: 0,
        videos: [],
        assignments: []
      },
      {
        id: 8,
        title: "Legal & Compliance",
        description: "Navigate legal requirements and compliance for your startup.",
        duration: "2 weeks",
        points: 100,
        status: 'locked',
        progress: 0,
        videos: [],
        assignments: []
      },
      {
        id: 9,
        title: "Team Building & Leadership",
        description: "Build and lead your startup team effectively.",
        duration: "2 weeks",
        points: 130,
        status: 'locked',
        progress: 0,
        videos: [],
        assignments: []
      },
      {
        id: 10,
        title: "Technology & Innovation",
        description: "Leverage technology and innovation for competitive advantage.",
        duration: "3 weeks",
        points: 160,
        status: 'locked',
        progress: 0,
        videos: [],
        assignments: []
      },
      {
        id: 11,
        title: "International Expansion",
        description: "Plan and execute international expansion strategies.",
        duration: "2 weeks",
        points: 140,
        status: 'locked',
        progress: 0,
        videos: [],
        assignments: []
      },
      {
        id: 12,
        title: "Exit Strategies & Future Planning",
        description: "Plan for exit strategies and long-term business sustainability.",
        duration: "2 weeks",
        points: 120,
        status: 'locked',
        progress: 0,
        videos: [],
        assignments: []
      }
    ]

    setPhases(mockPhases)
    setUserStats({
      totalPoints: 51,
      completedPhases: 1,
      currentRank: 15,
      totalStudents: 150
    })
  }, [])

  const getPhaseIcon = (phase: Phase) => {
    switch (phase.status) {
      case 'completed':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />
      case 'in-progress':
        return <PlayIcon className="h-6 w-6 text-blue-500" />
      case 'available':
        return <PlayIcon className="h-6 w-6 text-gray-400" />
      case 'locked':
        return <LockClosedIcon className="h-6 w-6 text-gray-300" />
      default:
        return <BookOpenIcon className="h-6 w-6 text-gray-400" />
    }
  }

  const getPhaseStatusColor = (phase: Phase) => {
    switch (phase.status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'available':
        return 'bg-yellow-100 text-yellow-800'
      case 'locked':
        return 'bg-gray-100 text-gray-500'
      default:
        return 'bg-gray-100 text-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">12-Month Startup Mentorship Program</h1>
            <p className="mt-2 text-blue-100">Transform your idea into a successful startup</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{userStats.totalPoints} Points</div>
            <div className="text-sm text-blue-100">Rank #{userStats.currentRank} of {userStats.totalStudents}</div>
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
              <p className="text-2xl font-bold text-gray-900">{userStats.totalPoints}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Phases</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.completedPhases}/12</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Current Rank</p>
              <p className="text-2xl font-bold text-gray-900">#{userStats.currentRank}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Cohort Size</p>
              <p className="text-2xl font-bold text-gray-900">{userStats.totalStudents}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Phases Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {phases.map((phase) => (
          <div key={phase.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  {getPhaseIcon(phase)}
                  <span className="ml-2 text-sm font-medium text-gray-900">Phase {phase.id}</span>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPhaseStatusColor(phase)}`}>
                  {phase.status.replace('-', ' ')}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{phase.title}</h3>
              <p className="text-sm text-gray-600 mb-4">{phase.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center">
                  <ClockIcon className="h-4 w-4 mr-1" />
                  {phase.duration}
                </span>
                <span className="flex items-center">
                  <StarIcon className="h-4 w-4 mr-1" />
                  {phase.points} points
                </span>
              </div>
              
              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{phase.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${phase.progress}%` }}
                  ></div>
                </div>
              </div>
              
              {/* Phase Content Summary */}
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <VideoCameraIcon className="h-4 w-4 mr-2" />
                  {phase.videos.length} videos
                </div>
                <div className="flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-2" />
                  {phase.assignments.length} assignments
                </div>
                {phase.liveClass && (
                  <div className="flex items-center">
                    <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                    Live class available
                  </div>
                )}
              </div>
              
              {/* Action Button */}
              <div className="mt-4">
                {phase.status === 'locked' ? (
                  <button 
                    disabled
                    className="w-full px-4 py-2 text-sm font-medium text-gray-400 bg-gray-100 rounded-md cursor-not-allowed"
                  >
                    Locked
                  </button>
                ) : (
                  <button 
                    onClick={() => setCurrentPhase(phase.id)}
                    className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors"
                  >
                    {phase.status === 'completed' ? 'Review' : 'Start Phase'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current Phase Details */}
      {phases.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Phase {currentPhase}: {phases[currentPhase - 1]?.title}
            </h2>
          </div>
          <div className="p-6">
            <p className="text-gray-600 mb-6">{phases[currentPhase - 1]?.description}</p>
            
            {/* Videos Section */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Videos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {phases[currentPhase - 1]?.videos.map((video) => (
                  <div key={video.id} className="flex items-center p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="h-16 w-24 object-cover rounded"
                      />
                    </div>
                    <div className="ml-4 flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{video.title}</h4>
                      <p className="text-sm text-gray-500">{video.duration}</p>
                      {video.watched && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Watched
                        </span>
                      )}
                    </div>
                    <button className="ml-4 p-2 text-blue-600 hover:text-blue-800">
                      <PlayIcon className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Assignments Section */}
            <div className="mb-8">
              <h3 className="text-md font-semibold text-gray-900 mb-4">Assignments</h3>
              <div className="space-y-4">
                {phases[currentPhase - 1]?.assignments.map((assignment) => (
                  <div key={assignment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">{assignment.title}</h4>
                      <p className="text-sm text-gray-500">{assignment.description}</p>
                      <div className="flex items-center mt-2 space-x-4 text-xs text-gray-500">
                        <span>Due: {assignment.dueDate}</span>
                        <span>{assignment.points} points</span>
                        {assignment.grade && (
                          <span className="text-green-600">Grade: {assignment.grade}/{assignment.points}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        assignment.status === 'graded' ? 'bg-green-100 text-green-800' :
                        assignment.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                        assignment.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {assignment.status.replace('-', ' ')}
                      </span>
                      <button className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800">
                        {assignment.status === 'not-started' ? 'Start' : 'View'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Live Class Section */}
            {phases[currentPhase - 1]?.liveClass && (
              <div>
                <h3 className="text-md font-semibold text-gray-900 mb-4">Live Class</h3>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900">{phases[currentPhase - 1]?.liveClass?.title}</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    {phases[currentPhase - 1]?.liveClass?.date} at {phases[currentPhase - 1]?.liveClass?.time} ({phases[currentPhase - 1]?.liveClass?.duration})
                  </p>
                  <button className="mt-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md">
                    Join Class
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}