'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  BookOpenIcon, 
  PlayIcon, 
  CheckCircleIcon, 
  ClockIcon,
  StarIcon,
  UserIcon,
  ArrowRightIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

interface EnrolledCourse {
  id: string
  status: string
  progress: number
  enrolledAt: string
  completedAt?: string
  course: {
    id: string
    title: string
    slug: string
    description: string
    thumbnail?: string
    price: number
    instructor: {
      id: string
      name: string
      avatar?: string
    }
  }
}

export default function MyCoursesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [courses, setCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchEnrolledCourses()
  }, [session, status, router])

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch('/api/user/enrolled-courses')
      if (response.ok) {
        const data = await response.json()
        setCourses(data)
      }
    } catch (error) {
      console.error('Error fetching enrolled courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const getFilteredCourses = () => {
    switch (filter) {
      case 'in-progress':
        return courses.filter(course => course.status === 'ACTIVE')
      case 'completed':
        return courses.filter(course => course.status === 'COMPLETED')
      default:
        return courses
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800'
      case 'ACTIVE':
        return 'bg-blue-100 text-blue-800'
      case 'CANCELLED':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-blue-500'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const filteredCourses = getFilteredCourses()

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
                <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
                <p className="text-gray-600 mt-2">Track your learning progress</p>
              </div>
            </div>
            <Link href="/courses" className="btn-primary">
              Browse More Courses
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpenIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Enrolled</p>
                <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <ClockIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {courses.filter(c => c.status === 'ACTIVE').length}
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
                  {courses.filter(c => c.status === 'COMPLETED').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">My Courses</h2>
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All ({courses.length})
              </button>
              <button
                onClick={() => setFilter('in-progress')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'in-progress'
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                In Progress ({courses.filter(c => c.status === 'ACTIVE').length})
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === 'completed'
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Completed ({courses.filter(c => c.status === 'COMPLETED').length})
              </button>
            </div>
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === 'all' ? 'No courses enrolled yet' : `No ${filter} courses`}
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === 'all' 
                ? 'Start your learning journey by enrolling in a course!'
                : `You don't have any ${filter} courses yet.`
              }
            </p>
            <Link href="/courses" className="btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((enrollment) => (
              <div key={enrollment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Course Image */}
                {enrollment.course.thumbnail ? (
                  <img
                    src={enrollment.course.thumbnail}
                    alt={enrollment.course.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <BookOpenIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}

                <div className="p-6">
                  {/* Course Title and Status */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                      <Link href={`/courses/${enrollment.course.slug}`} className="hover:text-primary-600">
                        {enrollment.course.title}
                      </Link>
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadge(enrollment.status)}`}>
                      {enrollment.status.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Instructor */}
                  <div className="flex items-center mb-4">
                    {enrollment.course.instructor.avatar ? (
                      <img
                        src={enrollment.course.instructor.avatar}
                        alt={enrollment.course.instructor.name}
                        className="h-6 w-6 rounded-full mr-2"
                      />
                    ) : (
                      <UserIcon className="h-6 w-6 text-gray-400 mr-2" />
                    )}
                    <span className="text-sm text-gray-600">{enrollment.course.instructor.name}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{Math.round(enrollment.progress)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressColor(enrollment.progress)}`}
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Enrollment Date */}
                  <div className="flex items-center text-sm text-gray-500 mb-4">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {enrollment.status === 'ACTIVE' ? (
                      <Link
                        href={`/courses/${enrollment.course.slug}/learn`}
                        className="flex-1 btn-primary flex items-center justify-center"
                      >
                        <PlayIcon className="h-4 w-4 mr-2" />
                        Continue Learning
                      </Link>
                    ) : enrollment.status === 'COMPLETED' ? (
                      <Link
                        href={`/courses/${enrollment.course.slug}/certificate`}
                        className="flex-1 btn-primary flex items-center justify-center"
                      >
                        <AcademicCapIcon className="h-4 w-4 mr-2" />
                        View Certificate
                      </Link>
                    ) : (
                      <Link
                        href={`/courses/${enrollment.course.slug}`}
                        className="flex-1 btn-primary flex items-center justify-center"
                      >
                        <ArrowRightIcon className="h-4 w-4 mr-2" />
                        View Course
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
