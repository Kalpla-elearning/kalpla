'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ClockIcon, 
  UserGroupIcon, 
  StarIcon, 
  MapPinIcon, 
  AcademicCapIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BookOpenIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  TrophyIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { getRoleDisplayName, getRoleColor } from '@/lib/utils'
import DegreeEnrollmentButton from '@/components/degrees/DegreeEnrollmentButton'

interface DegreeProgram {
  id: string
  title: string
  description: string
  price: number
  currency: string
  duration: string
  level: string
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

export default function DegreeDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [degree, setDegree] = useState<DegreeProgram | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchDegree()
  }, [slug])

  const fetchDegree = async () => {
    try {
      setLoading(true)
      // For now, we'll use mock data since we don't have the API route yet
      const mockDegree: DegreeProgram = {
        id: '1',
        title: 'Bachelor of Computer Science',
        description: 'A comprehensive degree program covering all aspects of computer science including programming, algorithms, data structures, and software engineering.',
        price: 150000,
        currency: 'INR',
        duration: '4 years',
        level: 'undergraduate',
        thumbnail: '/api/placeholder/800/400',
        instructor: {
          id: '1',
          name: 'Dr. Jane Smith',
          email: 'jane@example.com',
          avatar: '/api/placeholder/100/100'
        },
        modules: [],
        reviews: [],
        _count: {
          enrollments: 250,
          reviews: 45
        },
        avgRating: 4.7,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setDegree(mockDegree)
    } catch (err) {
      setError('Failed to fetch degree program')
      console.error('Error fetching degree program:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading degree program...</p>
        </div>
      </div>
    )
  }

  if (error || !degree) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Degree program not found'}</p>
          <Link href="/degrees" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
            Back to Degree Programs
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
            <Link href="/degrees" className="text-gray-600 hover:text-gray-900">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">{degree.title}</h1>
          </div>
        </div>
      </div>

      {/* Degree Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Degree Image */}
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src={degree.thumbnail} 
                alt={degree.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Degree Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About this degree program</h2>
              <p className="text-gray-700 leading-relaxed">{degree.description}</p>
            </div>

            {/* Program Structure */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Program structure</h3>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BookOpenIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">Year 1: Foundation</span>
                    </div>
                    <span className="text-sm text-gray-500">8 courses</span>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BookOpenIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">Year 2: Core Subjects</span>
                    </div>
                    <span className="text-sm text-gray-500">10 courses</span>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BookOpenIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">Year 3: Specialization</span>
                    </div>
                    <span className="text-sm text-gray-500">12 courses</span>
                  </div>
                </div>
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <BookOpenIcon className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-900">Year 4: Capstone Project</span>
                    </div>
                    <span className="text-sm text-gray-500">6 courses</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Degree Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-primary-600">
                  ₹{degree.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Per year</div>
              </div>
              
              <DegreeEnrollmentButton degreeId={degree.id} />
              
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Duration</span>
                  <span>{degree.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Level</span>
                  <span className="capitalize">{degree.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Students</span>
                  <span>{degree._count.enrollments.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Rating</span>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span>{degree.avgRating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Program Director */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Director</h3>
              <div className="flex items-center space-x-3">
                <img 
                  src={degree.instructor.avatar} 
                  alt={degree.instructor.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-900">{degree.instructor.name}</div>
                  <div className="text-sm text-gray-500">Professor of Computer Science</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}