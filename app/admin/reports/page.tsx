

import { redirect } from 'next/navigation'

import Link from 'next/link'
import { 
  ChartBarIcon,
  UserIcon,
  BookOpenIcon,
  AcademicCapIcon,
  CurrencyDollarIcon,
  StarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CalendarIcon,
  ClockIcon,
  EyeIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

async function getReportStats() {
  const [
    totalUsers,
    totalInstructors,
    totalStudents,
    totalCourses,
    totalDegreePrograms,
    totalBlogPosts,
    totalRevenue,
    totalEnrollments,
    totalReviews,
    thisMonthUsers,
    thisMonthRevenue,
    thisMonthEnrollments,
    lastMonthUsers,
    lastMonthRevenue,
    lastMonthEnrollments,
    topCourses,
    topInstructors,
    recentActivity
  ] = await Promise.all([
    // Total users
    prisma.user.count(),
    // Total instructors
    prisma.user.count({ where: { role: 'INSTRUCTOR' } }),
    // Total students
    prisma.user.count({ where: { role: 'STUDENT' } }),
    // Total courses
    prisma.course.count(),
    // Total degree programs
    prisma.degreeProgram.count(),
    // Total blog posts
    prisma.post.count(),
    // Total revenue
    prisma.payment.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true }
    }),
    // Total enrollments
    prisma.enrollment.count(),
    // Total reviews
    prisma.review.count(),
    // This month users
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    // This month revenue
    prisma.payment.aggregate({
      where: {
        status: 'SUCCESS',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { amount: true }
    }),
    // This month enrollments
    prisma.enrollment.count({
      where: {
        enrolledAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    // Last month users
    prisma.user.count({
      where: {
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    // Last month revenue
    prisma.payment.aggregate({
      where: {
        status: 'SUCCESS',
        createdAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      },
      _sum: { amount: true }
    }),
    // Last month enrollments
    prisma.enrollment.count({
      where: {
        enrolledAt: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
          lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
        }
      }
    }),
    // Top courses by enrollments
    prisma.course.findMany({
      take: 5,
      orderBy: {
        enrollments: {
          _count: 'desc'
        }
      },
      include: {
        instructor: {
          select: { name: true }
        },
        _count: {
          select: { enrollments: true, reviews: true }
        }
      }
    }),
    // Top instructors by enrollments
    prisma.user.findMany({
      where: { role: 'INSTRUCTOR' },
      take: 5,
      include: {
        courses: {
          include: {
            _count: {
              select: { enrollments: true }
            }
          }
        }
      }
    }),
    // Recent activity
    prisma.$transaction([
      // Recent enrollments
      prisma.enrollment.findMany({
        take: 3,
        orderBy: { enrolledAt: 'desc' },
        include: {
          user: { select: { name: true } },
          course: { select: { title: true } }
        }
      }),
      // Recent payments
      prisma.payment.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true } },
          order: { select: { itemTitle: true } }
        }
      }),
      // Recent reviews
      prisma.review.findMany({
        take: 3,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { name: true } },
          course: { select: { title: true } }
        }
      })
    ])
  ])

  // Calculate growth rates
  const userGrowth = lastMonthUsers > 0 ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0
  const revenueGrowth = (lastMonthRevenue._sum.amount || 0) > 0 ? 
    (((thisMonthRevenue._sum.amount || 0) - (lastMonthRevenue._sum.amount || 0)) / (lastMonthRevenue._sum.amount || 0)) * 100 : 0
  const enrollmentGrowth = lastMonthEnrollments > 0 ? ((thisMonthEnrollments - lastMonthEnrollments) / lastMonthEnrollments) * 100 : 0

  const [recentEnrollments, recentPayments, recentReviews] = recentActivity

  return {
    totalUsers,
    totalInstructors,
    totalStudents,
    totalCourses,
    totalDegreePrograms,
    totalBlogPosts,
    totalRevenue: totalRevenue._sum.amount || 0,
    totalEnrollments,
    totalReviews,
    thisMonthUsers,
    thisMonthRevenue: thisMonthRevenue._sum.amount || 0,
    thisMonthEnrollments,
    lastMonthUsers,
    lastMonthRevenue: lastMonthRevenue._sum.amount || 0,
    lastMonthEnrollments,
    userGrowth,
    revenueGrowth,
    enrollmentGrowth,
    topCourses,
    topInstructors,
    recentEnrollments,
    recentPayments,
    recentReviews
  }
}

export default async function AdminReportsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  const stats = await getReportStats()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center">
            <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
            Export Report
          </button>
          <Link
            href="/admin/reports/detailed"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <ChartBarIcon className="h-5 w-5 mr-2" />
            Detailed Analytics
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
              <div className="flex items-center mt-1">
                {stats.userGrowth >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-xs font-medium ${
                  stats.userGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.userGrowth >= 0 ? '+' : ''}{stats.userGrowth.toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500 ml-1">this month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-1">
                {stats.revenueGrowth >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-xs font-medium ${
                  stats.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth.toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500 ml-1">this month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpenIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
              <div className="flex items-center mt-1">
                {stats.enrollmentGrowth >= 0 ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-xs font-medium ${
                  stats.enrollmentGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stats.enrollmentGrowth >= 0 ? '+' : ''}{stats.enrollmentGrowth.toFixed(1)}%
                </span>
                <span className="text-xs text-gray-500 ml-1">this month</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <StarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Reviews</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              <p className="text-xs text-gray-500">Average rating: 4.5/5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/reports/users"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-500 bg-opacity-10">
              <UserIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">User Analytics</h3>
              <p className="text-sm text-gray-600">Detailed user growth and engagement metrics</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/reports/revenue"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-500 bg-opacity-10">
              <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Reports</h3>
              <p className="text-sm text-gray-600">Financial performance and revenue trends</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/reports/courses"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-purple-500 bg-opacity-10">
              <BookOpenIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Course Performance</h3>
              <p className="text-sm text-gray-600">Course popularity and completion rates</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/reports/instructors"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-indigo-500 bg-opacity-10">
              <AcademicCapIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Instructor Analytics</h3>
              <p className="text-sm text-gray-600">Instructor performance and earnings</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/reports/engagement"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-orange-500 bg-opacity-10">
              <StarIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Engagement Metrics</h3>
              <p className="text-sm text-gray-600">User engagement and retention data</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/reports/export"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-gray-500 bg-opacity-10">
              <DocumentArrowDownIcon className="h-8 w-8 text-gray-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
              <p className="text-sm text-gray-600">Export reports in various formats</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Top Courses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Top Performing Courses</h3>
              <Link
                href="/admin/reports/courses"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {stats.topCourses.length > 0 ? (
              <div className="space-y-4">
                {stats.topCourses.map((course, index) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">{index + 1}</span>
                      </div>
                      <div className="ml-4">
                        <h4 className="text-sm font-medium text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-600">by {course.instructor.name}</p>
                        <p className="text-xs text-gray-500">{course._count.enrollments} enrollments</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {course._count.reviews} reviews
                      </span>
                      <div className="flex items-center space-x-1">
                        <Link
                          href={`/admin/courses/${course.id}`}
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="View details"
                        >
                          <EyeIcon className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses yet</h3>
                <p className="text-gray-600">Course performance data will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Top Instructors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Top Instructors</h3>
              <Link
                href="/admin/reports/instructors"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {stats.topInstructors.length > 0 ? (
              <div className="space-y-4">
                {stats.topInstructors.map((instructor, index) => {
                  const totalEnrollments = instructor.courses.reduce((sum, course) => sum + course._count.enrollments, 0)
                  return (
                    <div key={instructor.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-indigo-600">{index + 1}</span>
                        </div>
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900">{instructor.name}</h4>
                          <p className="text-sm text-gray-600">{instructor.courses.length} courses</p>
                          <p className="text-xs text-gray-500">{totalEnrollments} total enrollments</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {instructor.courses.length} courses
                        </span>
                        <div className="flex items-center space-x-1">
                          <Link
                            href={`/admin/instructors/${instructor.id}`}
                            className="p-1 text-gray-400 hover:text-gray-600"
                            title="View details"
                          >
                            <EyeIcon className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No instructors yet</h3>
                <p className="text-gray-600">Instructor performance data will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recent Enrollments */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <BookOpenIcon className="h-4 w-4 mr-2" />
                Recent Enrollments
              </h4>
              <div className="space-y-3">
                {stats.recentEnrollments.length > 0 ? (
                  stats.recentEnrollments.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{enrollment.user.name}</p>
                        <p className="text-xs text-gray-600">{enrollment.course.title}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No recent enrollments</p>
                )}
              </div>
            </div>

            {/* Recent Payments */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <CurrencyDollarIcon className="h-4 w-4 mr-2" />
                Recent Payments
              </h4>
              <div className="space-y-3">
                {stats.recentPayments.length > 0 ? (
                  stats.recentPayments.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{payment.user.name}</p>
                        <p className="text-xs text-gray-600">{payment.order?.itemTitle || 'Unknown'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">₹{payment.amount?.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No recent payments</p>
                )}
              </div>
            </div>

            {/* Recent Reviews */}
            <div>
              <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <StarIcon className="h-4 w-4 mr-2" />
                Recent Reviews
              </h4>
              <div className="space-y-3">
                {stats.recentReviews.length > 0 ? (
                  stats.recentReviews.map((review) => (
                    <div key={review.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{review.user.name}</p>
                        <p className="text-xs text-gray-600">{review.course.title}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center">
                          <StarIcon className="h-3 w-3 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-900 ml-1">{review.rating}</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No recent reviews</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
