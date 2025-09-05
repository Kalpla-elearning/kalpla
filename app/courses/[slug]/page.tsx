'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  StarIcon,
  ClockIcon,
  UserIcon,
  AcademicCapIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  ArrowLeftIcon,
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  SparklesIcon,
  UserGroupIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  ClockIcon as ClockIconSolid,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import CourseEnrollmentButton from '@/components/courses/CourseEnrollmentButton'

interface Course {
  id: string
  title: string
  description: string
  price: number
  currency: string
  category: string
  difficulty: string
  thumbnail: string
      instructor: {
    id: string
    name: string
    email: string
    avatar: string
  }
  modules: any[]
  reviews: any[]
  _count: {
    enrollments: number
    reviews: number
  }
  avgRating: number
  createdAt: string
  updatedAt: string
}

export default function CourseDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCourse()
  }, [slug])

  const fetchCourse = async () => {
    try {
      setLoading(true)
      // For now, we'll use mock data since we don't have the API route yet
      const mockCourse: Course = {
        id: '1',
        title: 'Complete Web Development Bootcamp',
        description: 'Learn full-stack web development from scratch with modern technologies including React, Node.js, and databases.',
        price: 2999,
        currency: 'INR',
        category: 'Technology',
        difficulty: 'beginner',
        thumbnail: '/api/placeholder/800/400',
        instructor: {
          id: '1',
          name: 'John Doe',
          email: 'john@example.com',
          avatar: '/api/placeholder/100/100'
        },
        modules: [],
        reviews: [],
        _count: {
          enrollments: 1250,
          reviews: 89
        },
        avgRating: 4.8,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setCourse(mockCourse)
    } catch (err) {
      setError('Failed to fetch course')
      console.error('Error fetching course:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading course...</p>
        </div>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Course not found'}</p>
          <Link href="/courses" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/courses" className="text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon className="h-5 w-5" />
          </Link>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
              {/* Course Image */}
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  </div>

            {/* Course Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this course</h2>
              <p className="text-gray-700 leading-relaxed">{course.description}</p>
              </div>

            {/* What you'll learn */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What you'll learn</h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Master modern web development technologies</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Build responsive and interactive websites</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Learn backend development and databases</span>
                </li>
                <li className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Deploy applications to the cloud</span>
                </li>
              </ul>
                  </div>

            {/* Course Content */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Course content</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <VideoCameraIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">Introduction to Web Development</span>
                    </div>
                    <span className="text-sm text-gray-500">15 min</span>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <VideoCameraIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">HTML Fundamentals</span>
                  </div>
                    <span className="text-sm text-gray-500">45 min</span>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <VideoCameraIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">CSS Styling</span>
                    </div>
                    <span className="text-sm text-gray-500">60 min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-600">
                  ₹{course.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">One-time payment</div>
              </div>
              
              <CourseEnrollmentButton courseId={course.id} />
              
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Duration</span>
                  <span>8 hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Level</span>
                  <span className="capitalize">{course.difficulty}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Students</span>
                  <span>{course._count.enrollments.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Rating</span>
                  <div className="flex items-center space-x-1">
                    <StarIconSolid className="h-4 w-4 text-yellow-400" />
                    <span>{course.avgRating}</span>
              </div>
                </div>
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Instructor</h3>
              <div className="flex items-center space-x-3">
                <img 
                  src={course.instructor.avatar} 
                  alt={course.instructor.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900">{course.instructor.name}</div>
                  <div className="text-sm text-gray-500">Senior Developer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}