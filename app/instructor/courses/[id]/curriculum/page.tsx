'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  EyeSlashIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  PlayIcon,
  DocumentIcon,
  LinkIcon
} from '@heroicons/react/24/outline'

interface Module {
  id: string
  title: string
  description: string
  order: number
  isPublished: boolean
  lessons: Lesson[]
}

interface Lesson {
  id: string
  title: string
  description: string
  type: 'VIDEO' | 'DOCUMENT' | 'LINK'
  duration?: number
  content?: string
  videoUrl?: string
  documentUrl?: string
  externalUrl?: string
  order: number
  isPublished: boolean
}

interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  modules: Module[]
}

export default function CurriculumPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const courseId = params.id as string

  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [showAddModule, setShowAddModule] = useState(false)
  const [showAddLesson, setShowAddLesson] = useState<string | null>(null)
  const [editingModule, setEditingModule] = useState<string | null>(null)
  const [editingLesson, setEditingLesson] = useState<string | null>(null)

  // Form states
  const [moduleForm, setModuleForm] = useState({
    title: '',
    description: ''
  })
  const [lessonForm, setLessonForm] = useState({
    title: '',
    description: '',
    type: 'VIDEO' as 'VIDEO' | 'DOCUMENT' | 'LINK',
    content: '',
    videoUrl: '',
    documentUrl: '',
    externalUrl: ''
  })

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

    fetchCourseData()
  }, [session, status, router, courseId])

  const fetchCourseData = async () => {
    try {
      const response = await fetch(`/api/instructor/courses/${courseId}`)
      if (response.ok) {
        const data = await response.json()
        setCourse(data)
        // Expand all modules by default
        setExpandedModules(new Set(data.modules.map((m: Module) => m.id)))
      }
    } catch (error) {
      console.error('Error fetching course data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleModuleExpansion = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch(`/api/instructor/courses/${courseId}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleForm)
      })
      if (response.ok) {
        await fetchCourseData()
        setShowAddModule(false)
        setModuleForm({ title: '', description: '' })
      }
    } catch (error) {
      console.error('Error adding module:', error)
    }
  }

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!showAddLesson) return

    try {
      const response = await fetch(`/api/instructor/courses/${courseId}/modules/${showAddLesson}/lessons`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonForm)
      })
      if (response.ok) {
        await fetchCourseData()
        setShowAddLesson(null)
        setLessonForm({
          title: '',
          description: '',
          type: 'VIDEO',
          content: '',
          videoUrl: '',
          documentUrl: '',
          externalUrl: ''
        })
      }
    } catch (error) {
      console.error('Error adding lesson:', error)
    }
  }

  const handleUpdateModule = async (moduleId: string) => {
    try {
      const response = await fetch(`/api/instructor/courses/${courseId}/modules/${moduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(moduleForm)
      })
      if (response.ok) {
        await fetchCourseData()
        setEditingModule(null)
        setModuleForm({ title: '', description: '' })
      }
    } catch (error) {
      console.error('Error updating module:', error)
    }
  }

  const handleUpdateLesson = async (moduleId: string, lessonId: string) => {
    try {
      const response = await fetch(`/api/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lessonForm)
      })
      if (response.ok) {
        await fetchCourseData()
        setEditingLesson(null)
        setLessonForm({
          title: '',
          description: '',
          type: 'VIDEO',
          content: '',
          videoUrl: '',
          documentUrl: '',
          externalUrl: ''
        })
      }
    } catch (error) {
      console.error('Error updating lesson:', error)
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module? This will also delete all lessons within it.')) return

    try {
      const response = await fetch(`/api/instructor/courses/${courseId}/modules/${moduleId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        await fetchCourseData()
      }
    } catch (error) {
      console.error('Error deleting module:', error)
    }
  }

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return

    try {
      const response = await fetch(`/api/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        await fetchCourseData()
      }
    } catch (error) {
      console.error('Error deleting lesson:', error)
    }
  }

  const handleToggleModulePublish = async (moduleId: string, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/instructor/courses/${courseId}/modules/${moduleId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished })
      })
      if (response.ok) {
        await fetchCourseData()
      }
    } catch (error) {
      console.error('Error toggling module publish:', error)
    }
  }

  const handleToggleLessonPublish = async (moduleId: string, lessonId: string, isPublished: boolean) => {
    try {
      const response = await fetch(`/api/instructor/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: !isPublished })
      })
      if (response.ok) {
        await fetchCourseData()
      }
    } catch (error) {
      console.error('Error toggling lesson publish:', error)
    }
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <PlayIcon className="h-4 w-4" />
      case 'DOCUMENT':
        return <DocumentIcon className="h-4 w-4" />
      case 'LINK':
        return <LinkIcon className="h-4 w-4" />
      default:
        return <DocumentTextIcon className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Course not found</h2>
          <p className="text-gray-600 mb-4">The course you're looking for doesn't exist.</p>
          <Link href="/instructor/courses" className="btn-primary">
            Back to Courses
          </Link>
        </div>
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
                href="/instructor/courses"
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Course Curriculum</h1>
                <p className="text-gray-600 mt-2">{course.title}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href={`/courses/${course.id}`} className="btn-secondary">
                <EyeIcon className="h-4 w-4 mr-2" />
                Preview Course
              </Link>
              <button 
                onClick={() => setShowAddModule(true)}
                className="btn-primary flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Module
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Course Overview */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center space-x-4">
            <img 
              src={course.thumbnail} 
              alt={course.title}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div>
              <h2 className="text-xl font-semibold text-gray-900">{course.title}</h2>
              <p className="text-gray-600">{course.description}</p>
            </div>
          </div>
        </div>

        {/* Modules */}
        <div className="space-y-6">
          {course.modules.map((module) => (
            <div key={module.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => toggleModuleExpansion(module.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      {expandedModules.has(module.id) ? (
                        <ChevronDownIcon className="h-5 w-5" />
                      ) : (
                        <ChevronUpIcon className="h-5 w-5" />
                      )}
                    </button>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleModulePublish(module.id, module.isPublished)}
                      className={`p-2 rounded-lg ${
                        module.isPublished 
                          ? 'bg-green-100 text-green-600 hover:bg-green-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {module.isPublished ? (
                        <EyeIcon className="h-4 w-4" />
                      ) : (
                        <EyeSlashIcon className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingModule(module.id)
                        setModuleForm({ title: module.title, description: module.description })
                      }}
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteModule(module.id)}
                      className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-100"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {expandedModules.has(module.id) && (
                <div className="p-6">
                  {/* Edit Module Form */}
                  {editingModule === module.id && (
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <form onSubmit={(e) => { e.preventDefault(); handleUpdateModule(module.id) }}>
                        <div className="grid grid-cols-1 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Module Title
                            </label>
                            <input
                              type="text"
                              value={moduleForm.title}
                              onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            <textarea
                              value={moduleForm.description}
                              onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                              rows={3}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                          </div>
                          <div className="flex space-x-2">
                            <button type="submit" className="btn-primary">
                              Update Module
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setEditingModule(null)}
                              className="btn-secondary"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Lessons */}
                  <div className="space-y-4">
                    {module.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="text-gray-400">
                            {getLessonIcon(lesson.type)}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{lesson.title}</h4>
                            <p className="text-sm text-gray-600">{lesson.description}</p>
                            {lesson.duration && (
                              <p className="text-xs text-gray-500">{formatDuration(lesson.duration)}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleToggleLessonPublish(module.id, lesson.id, lesson.isPublished)}
                            className={`p-2 rounded-lg ${
                              lesson.isPublished 
                                ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            {lesson.isPublished ? (
                              <EyeIcon className="h-4 w-4" />
                            ) : (
                              <EyeSlashIcon className="h-4 w-4" />
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setEditingLesson(lesson.id)
                              setLessonForm({
                                title: lesson.title,
                                description: lesson.description,
                                type: lesson.type,
                                content: lesson.content || '',
                                videoUrl: lesson.videoUrl || '',
                                documentUrl: lesson.documentUrl || '',
                                externalUrl: lesson.externalUrl || ''
                              })
                            }}
                            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteLesson(module.id, lesson.id)}
                            className="p-2 text-red-400 hover:text-red-600 rounded-lg hover:bg-red-100"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Add Lesson Form */}
                    {showAddLesson === module.id && (
                      <div className="bg-blue-50 rounded-lg p-4">
                        <form onSubmit={handleAddLesson}>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lesson Title
                              </label>
                              <input
                                type="text"
                                value={lessonForm.title}
                                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                value={lessonForm.description}
                                onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lesson Type
                              </label>
                              <select
                                value={lessonForm.type}
                                onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value as any })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              >
                                <option value="VIDEO">Video</option>
                                <option value="DOCUMENT">Document</option>
                                <option value="LINK">External Link</option>
                              </select>
                            </div>
                            {lessonForm.type === 'VIDEO' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Video URL
                                </label>
                                <input
                                  type="url"
                                  value={lessonForm.videoUrl}
                                  onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                            )}
                            {lessonForm.type === 'DOCUMENT' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Document Content
                                </label>
                                <textarea
                                  value={lessonForm.content}
                                  onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                            )}
                            {lessonForm.type === 'LINK' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  External URL
                                </label>
                                <input
                                  type="url"
                                  value={lessonForm.externalUrl}
                                  onChange={(e) => setLessonForm({ ...lessonForm, externalUrl: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                            )}
                            <div className="flex space-x-2">
                              <button type="submit" className="btn-primary">
                                Add Lesson
                              </button>
                              <button 
                                type="button" 
                                onClick={() => setShowAddLesson(null)}
                                className="btn-secondary"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}

                    {/* Edit Lesson Form */}
                    {editingLesson === lesson.id && (
                      <div className="bg-yellow-50 rounded-lg p-4">
                        <form onSubmit={(e) => { e.preventDefault(); handleUpdateLesson(module.id, lesson.id) }}>
                          <div className="grid grid-cols-1 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lesson Title
                              </label>
                              <input
                                type="text"
                                value={lessonForm.title}
                                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                value={lessonForm.description}
                                onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Lesson Type
                              </label>
                              <select
                                value={lessonForm.type}
                                onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value as any })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                              >
                                <option value="VIDEO">Video</option>
                                <option value="DOCUMENT">Document</option>
                                <option value="LINK">External Link</option>
                              </select>
                            </div>
                            {lessonForm.type === 'VIDEO' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Video URL
                                </label>
                                <input
                                  type="url"
                                  value={lessonForm.videoUrl}
                                  onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                            )}
                            {lessonForm.type === 'DOCUMENT' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Document Content
                                </label>
                                <textarea
                                  value={lessonForm.content}
                                  onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })}
                                  rows={4}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                            )}
                            {lessonForm.type === 'LINK' && (
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  External URL
                                </label>
                                <input
                                  type="url"
                                  value={lessonForm.externalUrl}
                                  onChange={(e) => setLessonForm({ ...lessonForm, externalUrl: e.target.value })}
                                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                />
                              </div>
                            )}
                            <div className="flex space-x-2">
                              <button type="submit" className="btn-primary">
                                Update Lesson
                              </button>
                              <button 
                                type="button" 
                                onClick={() => setEditingLesson(null)}
                                className="btn-secondary"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    )}

                    <button
                      onClick={() => setShowAddLesson(module.id)}
                      className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-900 hover:border-gray-400 transition-colors"
                    >
                      <PlusIcon className="h-5 w-5 mx-auto mb-2" />
                      Add Lesson
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Add Module Form */}
          {showAddModule && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Module</h3>
              <form onSubmit={handleAddModule}>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Module Title
                    </label>
                    <input
                      type="text"
                      value={moduleForm.title}
                      onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      value={moduleForm.description}
                      onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <button type="submit" className="btn-primary">
                      Add Module
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setShowAddModule(false)}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {course.modules.length === 0 && !showAddModule && (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
              <p className="text-gray-600 mb-4">Start building your course by adding modules and lessons.</p>
              <button 
                onClick={() => setShowAddModule(true)}
                className="btn-primary"
              >
                Add Your First Module
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
