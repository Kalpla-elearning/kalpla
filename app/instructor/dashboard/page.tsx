import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  AcademicCapIcon, 
  UsersIcon, 
  CurrencyRupeeIcon, 
  StarIcon,
  BookOpenIcon,
  ChartBarIcon,
  PlusIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

async function getInstructorStats(instructorId: string) {
  const [
    totalCourses,
    totalStudents,
    totalEarnings,
    averageRating,
    recentEnrollments,
    recentReviews,
    pendingQuestions
  ] = await Promise.all([
    // Total courses count
    prisma.course.count({
      where: { instructorId }
    }),
    // Total students (unique enrollments)
    prisma.enrollment.count({
      where: {
        course: {
          instructorId
        }
      }
    }),
    // Total earnings (sum of course prices)
    prisma.enrollment.findMany({
      where: {
        course: {
          instructorId
        }
      },
      include: {
        course: {
          select: {
            price: true
          }
        }
      }
    }),
    // Average rating
    prisma.review.aggregate({
      where: {
        course: {
          instructorId
        }
      },
      _avg: {
        rating: true
      }
    }),
    // Recent enrollments (last 5)
    prisma.enrollment.findMany({
      where: {
        course: {
          instructorId
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        },
        course: {
          select: {
            title: true,
            slug: true
          }
        }
      },
      orderBy: { enrolledAt: 'desc' },
      take: 5
    }),
    // Recent reviews (last 5)
    prisma.review.findMany({
      where: {
        course: {
          instructorId
        }
      },
      include: {
        user: {
          select: {
            name: true
          }
        },
        course: {
          select: {
            title: true,
            slug: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    // Pending questions count (mock data for now)
    Promise.resolve(3)
  ])

  const totalEarningsAmount = totalEarnings.reduce((sum, enrollment) => sum + enrollment.course.price, 0)

  return {
    totalCourses,
    totalStudents,
    totalEarnings: totalEarningsAmount,
    averageRating: averageRating._avg.rating || 0,
    recentEnrollments,
    recentReviews,
    pendingQuestions
  }
}

export default async function InstructorDashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  if (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const stats = await getInstructorStats(session.user.id)

  const dashboardItems = [
    {
      title: 'My Courses',
      description: 'Manage your published courses and content',
      icon: BookOpenIcon,
      href: '/instructor/courses',
      color: 'bg-blue-500',
      badge: stats.totalCourses
    },
    {
      title: 'Create Course',
      description: 'Upload new course content and materials',
      icon: PlusIcon,
      href: '/instructor/courses/create',
      color: 'bg-green-500'
    },
    {
      title: 'Earnings Report',
      description: 'View your revenue and payment history',
      icon: ChartBarIcon,
      href: '/instructor/earnings',
      color: 'bg-purple-500'
    },
    {
      title: 'Student Q&A',
      description: 'Answer student questions and discussions',
      icon: UsersIcon,
      href: '/instructor/discussions',
      color: 'bg-yellow-500',
      badge: stats.pendingQuestions
    },
    {
      title: 'Analytics',
      description: 'Track course performance and insights',
      icon: ChartBarIcon,
      href: '/instructor/analytics',
      color: 'bg-red-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Instructor Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {session.user.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/instructor/courses/create"
                className="btn-primary flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Create Course
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BookOpenIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <UsersIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Students</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CurrencyRupeeIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Rating</p>
                <p className="text-2xl font-bold text-gray-900">{stats.averageRating.toFixed(1)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {dashboardItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                href={item.href}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-lg ${item.color} bg-opacity-10`}>
                    <Icon className={`h-8 w-8 ${item.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      {item.badge && (
                        <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Enrollments */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Enrollments</h3>
            </div>
            <div className="p-6">
              {stats.recentEnrollments.length === 0 ? (
                <div className="text-center py-8">
                  <UsersIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent enrollments</h3>
                  <p className="text-gray-600 mb-4">Students will appear here when they enroll in your courses.</p>
                  <Link href="/instructor/courses" className="btn-primary">
                    View My Courses
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                      <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <UsersIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-medium text-gray-900">
                          {enrollment.user.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Enrolled in{' '}
                          <Link href={`/courses/${enrollment.course.slug}`} className="text-primary-600 hover:text-primary-500">
                            {enrollment.course.title}
                          </Link>
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Reviews */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Reviews</h3>
            </div>
            <div className="p-6">
              {stats.recentReviews.length === 0 ? (
                <div className="text-center py-8">
                  <StarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No recent reviews</h3>
                  <p className="text-gray-600 mb-4">Student reviews will appear here when they rate your courses.</p>
                  <Link href="/instructor/courses" className="btn-primary">
                    View My Courses
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {stats.recentReviews.map((review) => (
                    <div key={review.id} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {review.user.name}
                        </h4>
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-gray-600 ml-1">{review.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {review.comment}
                      </p>
                      <p className="text-xs text-gray-500">
                        For{' '}
                        <Link href={`/courses/${review.course.slug}`} className="text-primary-600 hover:text-primary-500">
                          {review.course.title}
                        </Link>
                        {' '}• {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/instructor/courses/create"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <PlusIcon className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Create New Course</h4>
                <p className="text-sm text-gray-600">Upload course content and materials</p>
              </div>
            </Link>
            
            <Link
              href="/instructor/qa"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <UsersIcon className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">Answer Questions</h4>
                <p className="text-sm text-gray-600">Respond to student inquiries</p>
              </div>
            </Link>
            
            <Link
              href="/instructor/earnings"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
            >
              <ChartBarIcon className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <h4 className="font-medium text-gray-900">View Earnings</h4>
                <p className="text-sm text-gray-600">Check your revenue and payments</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
