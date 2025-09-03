'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  AcademicCapIcon,
  StarIcon,
  UserIcon,
  ArrowRightIcon,
  BookOpenIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface EnrolledCourse {
  id: string
  enrolledAt: string
  progress: number
  lastAccessedAt?: string
  course: {
    id: string
    title: string
    description: string
    slug: string
    thumbnail?: string
    instructor: {
      name: string
      avatar?: string
    }
    modules: Array<{
      id: string
      title: string
      contents: Array<{
        id: string
        title: string
        type: string
        isCompleted: boolean
      }>
    }>
    _count: {
      enrollments: number
      reviews: number
    }
    reviews: Array<{
      rating: number
    }>
  }
}

export default function EnrolledCoursesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [enrolledCourses, setEnrolledCourses] = useState<EnrolledCourse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<'all' | 'in-progress' | 'completed'>('all')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchEnrolledCourses()
  }, [session, status])

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch('/api/courses/enrolled')
      if (!response.ok) {
        throw new Error('Failed to load enrolled courses')
      }
      const data = await response.json()
      setEnrolledCourses(data)
    } catch (error) {
      setError('Failed to load enrolled courses')
    } finally {
      setLoading(false)
    }
  }

  const getAverageRating = (reviews: Array<{ rating: number }>) => {
    if (reviews.length === 0) return 0
    return reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  }

  const getTotalContents = (course: EnrolledCourse['course']) => {
    return course.modules.reduce((acc, module) => acc + module.contents.length, 0)
  }

  const getCompletedContents = (course: EnrolledCourse['course']) => {
    return course.modules.reduce((acc, module) => 
      acc + module.contents.filter(content => content.isCompleted).length, 0
    )
  }

  const getFilteredCourses = () => {
    switch (filter) {
      case 'in-progress':
        return enrolledCourses.filter(course => course.progress < 100)
      case 'completed':
        return enrolledCourses.filter(course => course.progress === 100)
      default:
        return enrolledCourses
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'text-green-600'
    if (progress >= 50) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to signin
  }

  const filteredCourses = getFilteredCourses()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>
              <p className="text-gray-600 mt-2">
                {enrolledCourses.length} enrolled course{enrolledCourses.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <Link href="/courses" className="btn-primary">
              Browse More Courses
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'all' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All Courses ({enrolledCourses.length})
            </button>
            <button
              onClick={() => setFilter('in-progress')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'in-progress' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              In Progress ({enrolledCourses.filter(c => c.progress < 100).length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium ${
                filter === 'completed' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed ({enrolledCourses.filter(c => c.progress === 100).length})
            </button>
          </div>
        </div>

        {error ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Courses</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={fetchEnrolledCourses} className="btn-primary">
              Try Again
            </button>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center">
            <BookOpenIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {filter === 'all' ? 'No Enrolled Courses' : 
               filter === 'in-progress' ? 'No Courses in Progress' : 
               'No Completed Courses'}
            </h2>
            <p className="text-gray-600 mb-6">
              {filter === 'all' ? 'Start your learning journey by enrolling in courses.' :
               filter === 'in-progress' ? 'All your courses are completed! Great job!' :
               'Complete some courses to see them here.'}
            </p>
            <Link href="/courses" className="btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((enrollment) => (
              <div key={enrollment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Course Image */}
                <div className="aspect-video bg-gray-200 relative">
                  {enrollment.course.thumbnail ? (
                    <img
                      src={enrollment.course.thumbnail}
                      alt={enrollment.course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <AcademicCapIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Progress Badge */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-white rounded-full px-3 py-1 text-sm font-medium text-gray-900 shadow-md">
                      {enrollment.progress}% Complete
                    </div>
                  </div>

                  {/* Continue Button */}
                  <Link
                    href={`/courses/${enrollment.course.slug}/learn`}
                    className="absolute bottom-3 right-3 bg-primary-600 text-white p-2 rounded-full shadow-md hover:bg-primary-700"
                  >
                    <PlayIcon className="h-5 w-5" />
                  </Link>
                </div>

                {/* Course Info */}
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {enrollment.course.instructor.avatar ? (
                        <img
                          src={enrollment.course.instructor.avatar}
                          alt={enrollment.course.instructor.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <span className="text-sm text-gray-600">{enrollment.course.instructor.name}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {enrollment.course.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {enrollment.course.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                      <span>Progress</span>
                      <span className={getProgressColor(enrollment.progress)}>
                        {getCompletedContents(enrollment.course)} of {getTotalContents(enrollment.course)} lessons
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${enrollment.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span>{getAverageRating(enrollment.course.reviews).toFixed(1)}</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      <span>Enrolled {new Date(enrollment.enrolledAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/courses/${enrollment.course.slug}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View Course
                    </Link>
                    
                    <Link
                      href={`/courses/${enrollment.course.slug}/learn`}
                      className="flex items-center px-4 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                    >
                      {enrollment.progress === 100 ? 'Review' : 'Continue'}
                      <ArrowRightIcon className="h-4 w-4 ml-1" />
                    </Link>
                  </div>

                  {/* Last Accessed */}
                  {enrollment.lastAccessedAt && (
                    <div className="mt-3 text-xs text-gray-500">
                      Last accessed {new Date(enrollment.lastAccessedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
