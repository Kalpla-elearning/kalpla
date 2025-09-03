'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { 
  AcademicCapIcon,
  PlayIcon,
  PauseIcon,
  CheckCircleIcon,
  LockClosedIcon,
  ClockIcon,
  UserIcon,
  ChartBarIcon,
  BookOpenIcon,
  CalendarIcon,
  ArrowRightIcon,
  ExclamationTriangleIcon,
  VideoCameraIcon
} from '@heroicons/react/24/outline'

interface Phase {
  id: string
  title: string
  description: string
  order: number
  isUnlocked: boolean
  unlockDate: string | null
  lessons: Lesson[]
  progress: number
}

interface Lesson {
  id: string
  title: string
  description: string
  type: string
  url: string | null
  content: string | null
  duration: number | null
  order: number
  isRequired: boolean
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
  watchTime: number
}

interface MentorshipData {
  enrollment: {
    id: string
    status: string
    progress: number
    currentPhase: number
    enrolledAt: string
  }
  program: {
    title: string
    description: string
    duration: string
  }
  phases: Phase[]
}

export default function MentorshipDashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mentorshipData, setMentorshipData] = useState<MentorshipData | null>(null)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isLoadingVideo, setIsLoadingVideo] = useState(false)

  useEffect(() => {
    if (session?.user) {
      fetchMentorshipData()
    }
  }, [session])

  const fetchMentorshipData = async () => {
    try {
      const response = await fetch('/api/mentorship/dashboard')
      if (response.ok) {
        const data = await response.json()
        setMentorshipData(data)
      } else {
        setError('Failed to load mentorship data')
      }
    } catch (err) {
      setError('Network error')
    } finally {
      setIsLoading(false)
    }
  }

  const getSignedVideoUrl = async (videoKey: string, lessonId: string) => {
    try {
      setIsLoadingVideo(true)
      const response = await fetch('/api/mentorship/video-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          videoKey,
          lessonId
        })
      })

      if (response.ok) {
        const data = await response.json()
        return data.url
      } else {
        throw new Error('Failed to get video URL')
      }
    } catch (error) {
      console.error('Error getting signed URL:', error)
      throw error
    } finally {
      setIsLoadingVideo(false)
    }
  }

  const handleLessonSelect = async (lesson: Lesson) => {
    setSelectedLesson(lesson)
    
    if (lesson.type === 'VIDEO' && lesson.url) {
      try {
        // Extract video key from URL
        const videoKey = lesson.url.split('/').pop() || lesson.url
        const signedUrl = await getSignedVideoUrl(videoKey, lesson.id)
        setVideoUrl(signedUrl)
      } catch (error) {
        console.error('Error loading video:', error)
        setError('Failed to load video')
      }
    }
  }

  const markLessonComplete = async (lessonId: string) => {
    try {
      const response = await fetch('/api/mentorship/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          status: 'COMPLETED',
          watchTime: 0 // You can track actual watch time here
        })
      })

      if (response.ok) {
        // Update local state
        setMentorshipData(prev => {
          if (!prev) return prev
          
          return {
            ...prev,
            phases: prev.phases.map(phase => ({
              ...phase,
              lessons: phase.lessons.map(lesson => 
                lesson.id === lessonId 
                  ? { ...lesson, status: 'COMPLETED' as const }
                  : lesson
              )
            }))
          }
        })

        // Update selected lesson if it's the current one
        if (selectedLesson?.id === lessonId) {
          setSelectedLesson(prev => prev ? { ...prev, status: 'COMPLETED' } : null)
        }
      }
    } catch (error) {
      console.error('Error marking lesson complete:', error)
    }
  }

  const updateProgress = async (lessonId: string, watchTime: number) => {
    try {
      await fetch('/api/mentorship/progress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonId,
          status: 'IN_PROGRESS',
          watchTime
        })
      })
    } catch (error) {
      console.error('Error updating progress:', error)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session?.user) {
    router.push('/auth/signin')
    return null
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchMentorshipData}
            className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  if (!mentorshipData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">No mentorship data found</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AcademicCapIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Kalpla Mentorship</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Program Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {mentorshipData.program.title}
          </h1>
          <p className="text-gray-600 mb-4">{mentorshipData.program.description}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-600">
                {Math.round(mentorshipData.enrollment.progress)}%
              </div>
              <div className="text-sm text-gray-600">Overall Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                Phase {mentorshipData.enrollment.currentPhase}
              </div>
              <div className="text-sm text-gray-600">Current Phase</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {mentorshipData.program.duration}
              </div>
              <div className="text-sm text-gray-600">Program Duration</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Phases List */}
          <div className="lg:col-span-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Learning Path</h2>
            <div className="space-y-4">
              {mentorshipData.phases.map((phase) => (
                <div key={phase.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium text-gray-900">Phase {phase.order}</h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        phase.isUnlocked 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {phase.isUnlocked ? 'Unlocked' : 'Locked'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{phase.title}</p>
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{Math.round(phase.progress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${phase.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  
                  {phase.isUnlocked && (
                    <div className="p-4">
                      <div className="space-y-2">
                        {phase.lessons.map((lesson) => (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonSelect(lesson)}
                            className={`w-full text-left p-3 rounded-lg border transition-colors ${
                              selectedLesson?.id === lesson.id
                                ? 'border-primary-500 bg-primary-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                {lesson.type === 'VIDEO' ? (
                                  <VideoCameraIcon className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <BookOpenIcon className="h-4 w-4 text-green-500" />
                                )}
                                <span className="text-sm font-medium text-gray-900">
                                  {lesson.title}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2">
                                {lesson.status === 'COMPLETED' && (
                                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                                )}
                                {lesson.duration && (
                                  <span className="text-xs text-gray-500">
                                    {Math.round(lesson.duration / 60)}m
                                  </span>
                                )}
                              </div>
                            </div>
                            {lesson.description && (
                              <p className="text-xs text-gray-600 mt-1 truncate">
                                {lesson.description}
                              </p>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Video Player */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              {selectedLesson ? (
                <div>
                  <div className="p-6 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">
                      {selectedLesson.title}
                    </h2>
                    <p className="text-gray-600">{selectedLesson.description}</p>
                  </div>
                  
                  <div className="p-6">
                    {selectedLesson.type === 'VIDEO' ? (
                      <div>
                        {isLoadingVideo ? (
                          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                          </div>
                        ) : videoUrl ? (
                          <div className="aspect-video bg-black rounded-lg overflow-hidden">
                            <video
                              controls
                              className="w-full h-full"
                              onPlay={() => setIsVideoPlaying(true)}
                              onPause={() => setIsVideoPlaying(false)}
                              onTimeUpdate={(e) => {
                                const video = e.target as HTMLVideoElement
                                updateProgress(selectedLesson.id, video.currentTime)
                              }}
                              onEnded={() => {
                                markLessonComplete(selectedLesson.id)
                              }}
                            >
                              <source src={videoUrl} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                        ) : (
                          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-600">Video not available</p>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="prose max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: selectedLesson.content || '' }} />
                      </div>
                    )}
                    
                    <div className="mt-6 flex justify-between items-center">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedLesson.status === 'COMPLETED' 
                            ? 'bg-green-100 text-green-800'
                            : selectedLesson.status === 'IN_PROGRESS'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedLesson.status.replace('_', ' ')}
                        </span>
                        {selectedLesson.duration && (
                          <span className="text-sm text-gray-500">
                            Duration: {Math.round(selectedLesson.duration / 60)} minutes
                          </span>
                        )}
                      </div>
                      
                      {selectedLesson.status !== 'COMPLETED' && (
                        <button
                          onClick={() => markLessonComplete(selectedLesson.id)}
                          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors"
                        >
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Select a lesson to start learning
                  </h3>
                  <p className="text-gray-600">
                    Choose a lesson from the left panel to begin your mentorship journey
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
