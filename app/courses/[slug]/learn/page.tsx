'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  PlayIcon,
  PauseIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  CheckCircleIcon,
  ClockIcon,
  BookOpenIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlayCircleIcon,
  DocumentIcon,
  QuestionMarkCircleIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface Content {
  id: string
  title: string
  description?: string
  type: string
  url?: string
  content?: string
  duration?: number
  order: number
  isCompleted?: boolean
}

interface Module {
  id: string
  title: string
  description?: string
  order: number
  contents: Content[]
}

interface Course {
  id: string
  title: string
  description: string
  thumbnail?: string
  instructor: {
    name: string
    avatar?: string
  }
  modules: Module[]
}

export default function CoursePlayerPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const { data: session } = useSession()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [currentContentIndex, setCurrentContentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchCourse()
  }, [session, params.slug])

  const fetchCourse = async () => {
    try {
      const response = await fetch(`/api/courses/${params.slug}`)
      if (!response.ok) {
        throw new Error('Course not found')
      }
      const data = await response.json()
      setCourse(data)
    } catch (error) {
      setError('Failed to load course')
    } finally {
      setLoading(false)
    }
  }

  const currentModule = course?.modules[currentModuleIndex]
  const currentContent = currentModule?.contents[currentContentIndex]

  const totalContents = course?.modules.reduce((acc, module) => acc + module.contents.length, 0) || 0
  const completedContents = course?.modules.reduce((acc, module) => 
    acc + module.contents.filter(content => content.isCompleted).length, 0) || 0

  const handleContentComplete = async () => {
    if (!currentContent) return

    try {
      await fetch('/api/courses/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course?.id,
          contentId: currentContent.id,
          completed: true
        })
      })

      // Update local state
      if (course) {
        const updatedCourse = { ...course }
        updatedCourse.modules[currentModuleIndex].contents[currentContentIndex].isCompleted = true
        setCourse(updatedCourse)
      }

      // Move to next content
      if (currentContentIndex < (currentModule?.contents.length || 0) - 1) {
        setCurrentContentIndex(currentContentIndex + 1)
      } else if (currentModuleIndex < (course?.modules.length || 0) - 1) {
        setCurrentModuleIndex(currentModuleIndex + 1)
        setCurrentContentIndex(0)
      }
    } catch (error) {
      console.error('Failed to mark content as complete:', error)
    }
  }

  const handlePrevious = () => {
    if (currentContentIndex > 0) {
      setCurrentContentIndex(currentContentIndex - 1)
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex(currentModuleIndex - 1)
      const prevModule = course?.modules[currentModuleIndex - 1]
      setCurrentContentIndex((prevModule?.contents.length || 1) - 1)
    }
  }

  const handleNext = () => {
    if (currentContentIndex < (currentModule?.contents.length || 0) - 1) {
      setCurrentContentIndex(currentContentIndex + 1)
    } else if (currentModuleIndex < (course?.modules.length || 0) - 1) {
      setCurrentModuleIndex(currentModuleIndex + 1)
      setCurrentContentIndex(0)
    }
  }

  const canGoPrevious = currentContentIndex > 0 || currentModuleIndex > 0
  const canGoNext = currentContentIndex < (currentModule?.contents.length || 0) - 1 || currentModuleIndex < (course?.modules.length || 0) - 1

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'The course you are looking for does not exist.'}</p>
          <Link href="/courses" className="btn-primary">
            Browse Courses
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Link 
              href={`/courses/${params.slug}`}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Course
            </Link>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">{course.title}</h1>
              <p className="text-sm text-gray-600">Module {currentModuleIndex + 1} of {course.modules.length}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              {completedContents} of {totalContents} completed
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              {sidebarOpen ? <ChevronUpIcon className="h-5 w-5" /> : <ChevronDownIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:mr-80' : ''}`}>
          <div className="max-w-4xl mx-auto p-6">
            {/* Content Player */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
              <div className="aspect-video bg-gray-900 rounded-t-lg flex items-center justify-center">
                {currentContent?.type === 'VIDEO' ? (
                  <div className="w-full h-full">
                    {currentContent.url ? (
                      <video
                        className="w-full h-full object-contain"
                        controls
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={handleContentComplete}
                      >
                        <source src={currentContent.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    ) : (
                      <div className="flex items-center justify-center text-white">
                        <PlayCircleIcon className="h-16 w-16" />
                      </div>
                    )}
                  </div>
                ) : currentContent?.type === 'PDF' ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <iframe
                      src={currentContent.url}
                      className="w-full h-full"
                      title={currentContent.title}
                    />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">
                    <DocumentIcon className="h-16 w-16" />
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentContent?.title}
                  </h2>
                  <div className="flex items-center space-x-2">
                    {currentContent?.type === 'VIDEO' && (
                      <VideoCameraIcon className="h-5 w-5 text-gray-400" />
                    )}
                    {currentContent?.type === 'PDF' && (
                      <DocumentTextIcon className="h-5 w-5 text-gray-400" />
                    )}
                    {currentContent?.type === 'QUIZ' && (
                      <QuestionMarkCircleIcon className="h-5 w-5 text-gray-400" />
                    )}
                    {currentContent?.duration && (
                      <div className="flex items-center text-sm text-gray-500">
                        <ClockIcon className="h-4 w-4 mr-1" />
                        {Math.floor(currentContent.duration / 60)}:{(currentContent.duration % 60).toString().padStart(2, '0')}
                      </div>
                    )}
                  </div>
                </div>

                {currentContent?.description && (
                  <p className="text-gray-600 mb-4">{currentContent.description}</p>
                )}

                {currentContent?.type === 'TEXT' && currentContent.content && (
                  <div className="prose max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: currentContent.content }} />
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={handlePrevious}
                    disabled={!canGoPrevious}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Previous
                  </button>

                  <button
                    onClick={handleContentComplete}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Mark Complete
                  </button>

                  <button
                    onClick={handleNext}
                    disabled={!canGoNext}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                    <ArrowRightIcon className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        {sidebarOpen && (
          <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-gray-200 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h3>
              
              <div className="space-y-4">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg">
                    <div className="p-3 bg-gray-50 border-b border-gray-200">
                      <h4 className="font-medium text-gray-900">
                        Module {moduleIndex + 1}: {module.title}
                      </h4>
                    </div>
                    
                    <div className="p-2">
                      {module.contents.map((content, contentIndex) => (
                        <button
                          key={content.id}
                          onClick={() => {
                            setCurrentModuleIndex(moduleIndex)
                            setCurrentContentIndex(contentIndex)
                          }}
                          className={`w-full text-left p-2 rounded text-sm flex items-center space-x-2 hover:bg-gray-50 ${
                            currentModuleIndex === moduleIndex && currentContentIndex === contentIndex
                              ? 'bg-primary-50 text-primary-700'
                              : 'text-gray-700'
                          }`}
                        >
                          {content.isCompleted ? (
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                          ) : (
                            <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                          )}
                          
                          {content.type === 'VIDEO' && <VideoCameraIcon className="h-4 w-4 text-gray-400" />}
                          {content.type === 'PDF' && <DocumentTextIcon className="h-4 w-4 text-gray-400" />}
                          {content.type === 'QUIZ' && <QuestionMarkCircleIcon className="h-4 w-4 text-gray-400" />}
                          
                          <span className="flex-1 truncate">{content.title}</span>
                          
                          {content.duration && (
                            <span className="text-xs text-gray-500">
                              {Math.floor(content.duration / 60)}:{(content.duration % 60).toString().padStart(2, '0')}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
