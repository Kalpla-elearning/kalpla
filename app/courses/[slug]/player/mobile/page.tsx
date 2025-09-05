'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ChevronLeftIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlayIcon,
  CheckCircleIcon,
  LockClosedIcon,
  DocumentTextIcon,
  ClipboardDocumentListIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  TrophyIcon,
  ClockIcon,
  BookOpenIcon,
  AcademicCapIcon,
  PlusIcon,
  ArrowUpTrayIcon,
  Bars3Icon
} from '@heroicons/react/24/outline'
import { VideoPlayer } from '@/components/course/VideoPlayer'

interface Lesson {
  id: string
  title: string
  description: string
  duration: string
  videoUrl: string
  thumbnail: string
  isCompleted: boolean
  isLocked: boolean
  isCurrent: boolean
  points: number
  resources: Resource[]
  assignment?: Assignment
}

interface Module {
  id: string
  title: string
  phase: number
  isUnlocked: boolean
  lessons: Lesson[]
  totalLessons: number
  completedLessons: number
}

interface Resource {
  id: string
  name: string
  type: 'pdf' | 'doc' | 'link' | 'video'
  url: string
  size?: string
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
  attachments: string[]
}

interface Note {
  id: string
  content: string
  timestamp: string
  lessonId: string
}

export default function MobileCoursePlayerPage() {
  const params = useParams()
  const router = useRouter()
  
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null)
  const [modules, setModules] = useState<Module[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'assignments' | 'notes' | 'discussion'>('overview')
  const [showSidebar, setShowSidebar] = useState(false)
  const [expandedModule, setExpandedModule] = useState<string | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [showBadgeNotification, setShowBadgeNotification] = useState(false)
  const [badgeEarned, setBadgeEarned] = useState<string | null>(null)
  const [pointsEarned, setPointsEarned] = useState(0)

  useEffect(() => {
    // Mock data - same as desktop version
    const mockModules: Module[] = [
      {
        id: '1',
        title: 'Phase 1: Foundation & Mindset',
        phase: 1,
        isUnlocked: true,
        totalLessons: 8,
        completedLessons: 6,
        lessons: [
          {
            id: '1-1',
            title: 'Introduction to Entrepreneurship',
            description: 'Learn the fundamentals of entrepreneurship and what it takes to start a business.',
            duration: '45:30',
            videoUrl: 'https://example.com/video1.mp4',
            thumbnail: '/api/placeholder/300/200',
            isCompleted: true,
            isLocked: false,
            isCurrent: false,
            points: 10,
            resources: [
              { id: '1', name: 'Entrepreneurship Guide.pdf', type: 'pdf', url: '#', size: '2.3 MB' },
              { id: '2', name: 'Key Takeaways.docx', type: 'doc', url: '#', size: '1.1 MB' }
            ]
          },
          {
            id: '1-2',
            title: 'Building the Right Mindset',
            description: 'Develop the entrepreneurial mindset needed for success.',
            duration: '38:15',
            videoUrl: 'https://example.com/video2.mp4',
            thumbnail: '/api/placeholder/300/200',
            isCompleted: true,
            isLocked: false,
            isCurrent: false,
            points: 10,
            resources: [
              { id: '3', name: 'Mindset Assessment.pdf', type: 'pdf', url: '#', size: '1.8 MB' }
            ]
          },
          {
            id: '1-3',
            title: 'Personal Vision Statement',
            description: 'Create your personal vision and mission statement.',
            duration: '52:20',
            videoUrl: 'https://example.com/video3.mp4',
            thumbnail: '/api/placeholder/300/200',
            isCompleted: false,
            isLocked: false,
            isCurrent: true,
            points: 15,
            resources: [
              { id: '4', name: 'Vision Template.docx', type: 'doc', url: '#', size: '0.8 MB' }
            ],
            assignment: {
              id: '1-3-assignment',
              title: 'Create Your Vision Statement',
              description: 'Write a comprehensive vision statement for your startup journey.',
              dueDate: '2024-01-25',
              points: 25,
              status: 'in-progress',
              attachments: []
            }
          }
        ]
      },
      {
        id: '2',
        title: 'Phase 2: Idea Validation & Market Research',
        phase: 2,
        isUnlocked: true,
        totalLessons: 10,
        completedLessons: 0,
        lessons: [
          {
            id: '2-1',
            title: 'Market Validation Techniques',
            description: 'Learn how to validate your business idea effectively.',
            duration: '1:05:30',
            videoUrl: 'https://example.com/video4.mp4',
            thumbnail: '/api/placeholder/300/200',
            isCompleted: false,
            isLocked: false,
            isCurrent: false,
            points: 15,
            resources: []
          }
        ]
      },
      {
        id: '3',
        title: 'Phase 3: Business Model & Strategy',
        phase: 3,
        isUnlocked: false,
        totalLessons: 8,
        completedLessons: 0,
        lessons: []
      }
    ]

    setModules(mockModules)
    
    // Set current lesson
    const current = mockModules[0].lessons.find(lesson => lesson.isCurrent)
    if (current) {
      setCurrentLesson(current)
    }
  }, [])

  const handleLessonSelect = (lesson: Lesson) => {
    if (lesson.isLocked) return
    setCurrentLesson(lesson)
    setShowSidebar(false)
  }

  const handleMarkComplete = () => {
    if (currentLesson) {
      // Mark lesson as completed
      setModules(prev => prev.map(module => ({
        ...module,
        lessons: module.lessons.map(lesson => 
          lesson.id === currentLesson.id 
            ? { ...lesson, isCompleted: true }
            : lesson
        ),
        completedLessons: module.lessons.filter(lesson => 
          lesson.id === currentLesson.id ? true : lesson.isCompleted
        ).length
      })))

      // Award points
      setPointsEarned(currentLesson.points)
      
      // Check for badge unlock
      if (Math.random() > 0.7) { // 30% chance for demo
        setBadgeEarned('Consistent Learner')
        setShowBadgeNotification(true)
        setTimeout(() => setShowBadgeNotification(false), 5000)
      }
    }
  }

  const handleAddNote = () => {
    if (newNote.trim() && currentLesson) {
      const note: Note = {
        id: Date.now().toString(),
        content: newNote,
        timestamp: new Date().toISOString(),
        lessonId: currentLesson.id
      }
      setNotes(prev => [...prev, note])
      setNewNote('')
    }
  }

  const getProgressPercentage = () => {
    const totalLessons = modules.reduce((sum, module) => sum + module.totalLessons, 0)
    const completedLessons = modules.reduce((sum, module) => sum + module.completedLessons, 0)
    return Math.round((completedLessons / totalLessons) * 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard" className="text-gray-600">
                <ChevronLeftIcon className="h-6 w-6" />
              </Link>
              <div>
                <div className="flex items-center space-x-2">
                  <AcademicCapIcon className="h-6 w-6 text-blue-600" />
                  <span className="font-bold text-gray-900">Kalpla</span>
                </div>
                <div className="text-xs text-gray-500">Startup Mentorship</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowSidebar(true)}
                className="p-2 text-gray-600 hover:text-gray-900"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
              <div className="h-8 w-8 bg-gray-300 rounded-full"></div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{getProgressPercentage()}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-1.5">
              <div 
                className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Video Player */}
      <div className="bg-black">
        <VideoPlayer
          src={currentLesson?.videoUrl || ''}
          poster={currentLesson?.thumbnail}
          className="w-full h-64 sm:h-80"
        />
      </div>

      {/* Lesson Info */}
      <div className="bg-white p-4 border-b border-gray-200">
        <h1 className="text-lg font-bold text-gray-900 mb-1">
          {currentLesson?.title}
        </h1>
        <p className="text-sm text-gray-600 mb-3">
          {currentLesson?.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center">
              <ClockIcon className="h-3 w-3 mr-1" />
              {currentLesson?.duration}
            </span>
            <span className="flex items-center">
              <StarIcon className="h-3 w-3 mr-1" />
              {currentLesson?.points} pts
            </span>
          </div>
          
          <button
            onClick={handleMarkComplete}
            disabled={currentLesson?.isCompleted}
            className={`px-4 py-2 rounded-lg text-sm font-medium ${
              currentLesson?.isCompleted
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-600 text-white'
            }`}
          >
            {currentLesson?.isCompleted ? 'Completed' : 'Mark Complete'}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex overflow-x-auto">
          {[
            { id: 'overview', name: 'Overview', icon: BookOpenIcon },
            { id: 'resources', name: 'Resources', icon: DocumentTextIcon },
            { id: 'assignments', name: 'Assignments', icon: ClipboardDocumentListIcon },
            { id: 'notes', name: 'Notes', icon: StarIcon },
            { id: 'discussion', name: 'Q&A', icon: ChatBubbleLeftRightIcon },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium border-b-2 flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 bg-white">
        <div className="p-4">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Lesson Overview</h3>
              <p className="text-gray-600 text-sm">
                {currentLesson?.description}
              </p>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2 text-sm">Key Takeaways</h4>
                <ul className="list-disc list-inside text-blue-800 text-sm space-y-1">
                  <li>Understand the fundamentals of entrepreneurship</li>
                  <li>Learn how to develop the right mindset</li>
                  <li>Create a compelling vision statement</li>
                </ul>
              </div>
            </div>
          )}

          {/* Resources Tab */}
          {activeTab === 'resources' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Resources</h3>
              <div className="space-y-3">
                {currentLesson?.resources.map((resource) => (
                  <div key={resource.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center space-x-3">
                      <DocumentTextIcon className="h-6 w-6 text-blue-500" />
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 text-sm">{resource.name}</h4>
                        <p className="text-xs text-gray-500">{resource.size}</p>
                      </div>
                      <button className="text-blue-600">
                        <ArrowUpTrayIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Assignments Tab */}
          {activeTab === 'assignments' && currentLesson?.assignment && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Assignment</h3>
              <div className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  {currentLesson.assignment.title}
                </h4>
                <p className="text-gray-600 text-sm mb-3">
                  {currentLesson.assignment.description}
                </p>
                
                <div className="flex items-center space-x-3 text-xs text-gray-500 mb-3">
                  <span>Due: {currentLesson.assignment.dueDate}</span>
                  <span>{currentLesson.assignment.points} points</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    currentLesson.assignment.status === 'graded' ? 'bg-green-100 text-green-800' :
                    currentLesson.assignment.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                    currentLesson.assignment.status === 'in-progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {currentLesson.assignment.status.replace('-', ' ')}
                  </span>
                </div>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <ArrowUpTrayIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 text-sm mb-3">Tap to upload files</p>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm">
                    Choose Files
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notes Tab */}
          {activeTab === 'notes' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Notes</h3>
              
              <div className="space-y-3">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Add a note..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                  />
                  <button
                    onClick={handleAddNote}
                    className="px-3 py-2 bg-blue-600 text-white rounded-lg"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="space-y-2">
                  {notes.map((note) => (
                    <div key={note.id} className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-900 text-sm">{note.content}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(note.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Discussion Tab */}
          {activeTab === 'discussion' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900">Q&A Discussion</h3>
              
              <div className="space-y-3">
                {[
                  {
                    id: '1',
                    question: 'How do I know if my business idea is viable?',
                    author: 'Sarah Johnson',
                    timestamp: '2 hours ago',
                    replies: 3,
                    upvotes: 5
                  },
                  {
                    id: '2',
                    question: 'What are the key elements of a strong vision statement?',
                    author: 'Mike Chen',
                    timestamp: '1 day ago',
                    replies: 7,
                    upvotes: 12
                  }
                ].map((discussion) => (
                  <div key={discussion.id} className="border border-gray-200 rounded-lg p-3">
                    <h4 className="font-medium text-gray-900 text-sm mb-1">{discussion.question}</h4>
                    <p className="text-xs text-gray-500 mb-2">
                      by {discussion.author} • {discussion.timestamp}
                    </p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <button className="flex items-center space-x-1">
                        <StarIcon className="h-3 w-3" />
                        <span>{discussion.upvotes}</span>
                      </button>
                      <span>{discussion.replies} replies</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar Overlay */}
      {showSidebar && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowSidebar(false)}></div>
          <div className="absolute right-0 top-0 bottom-0 w-80 bg-white shadow-lg">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Course Outline</h2>
                <button
                  onClick={() => setShowSidebar(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
              </div>
              
              <div className="space-y-2">
                {modules.map((module) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg">
                    <button
                      onClick={() => setExpandedModule(expandedModule === module.id ? null : module.id)}
                      className={`w-full p-3 text-left ${module.isUnlocked ? 'bg-white' : 'bg-gray-50'}`}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 text-sm">{module.title}</h3>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {module.completedLessons}/{module.totalLessons}
                          </span>
                          {expandedModule === module.id ? (
                            <ChevronUpIcon className="h-4 w-4 text-gray-400" />
                          ) : (
                            <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                        <div 
                          className="bg-blue-600 h-1 rounded-full"
                          style={{ width: `${(module.completedLessons / module.totalLessons) * 100}%` }}
                        ></div>
                      </div>
                    </button>
                    
                    {expandedModule === module.id && module.isUnlocked && (
                      <div className="p-2 space-y-1">
                        {module.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonSelect(lesson)}
                            className={`w-full text-left p-2 rounded-md flex items-center space-x-2 ${
                              lesson.isCurrent 
                                ? 'bg-blue-100 text-blue-900' 
                                : lesson.isCompleted 
                                  ? 'text-green-600 hover:bg-green-50'
                                  : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {lesson.isCompleted ? (
                              <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            ) : lesson.isLocked ? (
                              <LockClosedIcon className="h-4 w-4 text-gray-400" />
                            ) : (
                              <PlayIcon className="h-4 w-4" />
                            )}
                            <div className="flex-1">
                              <div className="text-sm font-medium">{lesson.title}</div>
                              <div className="text-xs text-gray-500">{lesson.duration}</div>
                            </div>
                            <div className="text-xs text-gray-500">{lesson.points} pts</div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Badge Notification */}
      {showBadgeNotification && (
        <div className="fixed top-4 left-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <TrophyIcon className="h-5 w-5" />
            <div>
              <p className="font-medium text-sm">Badge Unlocked!</p>
              <p className="text-xs">{badgeEarned}</p>
            </div>
          </div>
        </div>
      )}

      {/* Points Notification */}
      {pointsEarned > 0 && (
        <div className="fixed bottom-4 left-4 right-4 bg-green-100 border border-green-400 text-green-800 px-4 py-3 rounded-lg shadow-lg z-50">
          <div className="flex items-center space-x-2">
            <StarIcon className="h-5 w-5" />
            <div>
              <p className="font-medium text-sm">Points Earned!</p>
              <p className="text-xs">+{pointsEarned} points</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
