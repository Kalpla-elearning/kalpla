import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  UserIcon, 
  AcademicCapIcon, 
  CreditCardIcon, 
  DocumentTextIcon, 
  CogIcon, 
  BellIcon,
  BookOpenIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  ChartBarIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

async function getAdminStats() {
  const [
    totalUsers,
    totalInstructors,
    totalStudents,
    totalCourses,
    totalDegreePrograms,
    totalBlogPosts,
    totalMentors,
    totalPayments,
    totalRevenue,
    pendingEnrollments,
    recentEnrollments,
    recentPayments,
    activeSubscriptions,
    platformStats,
    monthlyStats
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
    // Total mentors
    Promise.resolve(0), // Placeholder for mentor count
    // Total payments
    prisma.payment.count({
      where: { status: 'SUCCESS' }
    }),
    // Total revenue
    prisma.payment.aggregate({
      where: { status: 'SUCCESS' },
      _sum: { amount: true }
    }),
    // Pending enrollments
    prisma.enrollment.count({
      where: { status: 'PENDING' }
    }),
    // Recent enrollments (last 7 days)
    prisma.enrollment.findMany({
      where: {
        enrolledAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } }
      },
      orderBy: { enrolledAt: 'desc' },
      take: 5
    }),
    // Recent payments (last 7 days)
    Promise.resolve([]), // Placeholder for recent payments
    // Active subscriptions
    Promise.resolve(0), // Placeholder for subscription count
    // Platform stats
    prisma.$transaction([
      prisma.user.count({ where: { isVerified: true } }),
      prisma.user.count({ where: { isVerified: false } }),
      prisma.course.count({ where: { status: 'PUBLISHED' } }),
      prisma.course.count({ where: { status: 'DRAFT' } }),
      prisma.payment.count({ where: { status: 'PENDING' } }),
      prisma.payment.count({ where: { status: 'FAILED' } }),
      prisma.enrollment.count({ where: { status: 'COMPLETED' } }),
      prisma.review.count()
    ]),
    // Monthly stats for trends
    prisma.$transaction([
      // This month's stats
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      prisma.payment.aggregate({
        where: {
          status: 'SUCCESS',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        _sum: { amount: true }
      }),
      // Last month's stats
      prisma.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      }),
      prisma.payment.aggregate({
        where: {
          status: 'SUCCESS',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
            lt: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        },
        _sum: { amount: true }
      })
    ])
  ])

  const [verifiedUsers, unverifiedUsers, publishedCourses, draftCourses, pendingPayments, failedPayments, completedEnrollments, totalReviews] = platformStats
  const [thisMonthUsers, thisMonthRevenue, lastMonthUsers, lastMonthRevenue] = monthlyStats

  // Calculate trends
  const userGrowth = lastMonthUsers > 0 ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0
  const revenueGrowth = (lastMonthRevenue._sum.amount || 0) > 0 ? 
    (((thisMonthRevenue._sum.amount || 0) - (lastMonthRevenue._sum.amount || 0)) / (lastMonthRevenue._sum.amount || 0)) * 100 : 0

  return {
    totalUsers,
    totalInstructors,
    totalStudents,
    totalCourses,
    totalDegreePrograms,
    totalBlogPosts,
    totalMentors,
    totalPayments,
    totalRevenue: totalRevenue._sum.amount || 0,
    pendingEnrollments,
    recentEnrollments,
    recentPayments,
    activeSubscriptions,
    verifiedUsers,
    unverifiedUsers,
    publishedCourses,
    draftCourses,
    pendingPayments,
    failedPayments,
    completedEnrollments,
    totalReviews,
    thisMonthUsers,
    thisMonthRevenue: thisMonthRevenue._sum.amount || 0,
    userGrowth,
    revenueGrowth
  }
}

export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  const stats = await getAdminStats()

  const dashboardItems = [
    {
      title: 'User Management',
      description: 'Manage students, instructors, and administrators',
      icon: UserIcon,
      href: '/admin/users',
      color: 'bg-blue-500',
      count: stats.totalUsers,
      subtext: `${stats.totalStudents} students, ${stats.totalInstructors} instructors`,
      trend: stats.userGrowth,
      trendType: stats.userGrowth >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Course Management',
      description: 'Create, edit, and manage courses',
      icon: BookOpenIcon,
      href: '/admin/courses',
      color: 'bg-green-500',
      count: stats.totalCourses,
      subtext: `${stats.publishedCourses} published, ${stats.draftCourses} drafts`
    },
    {
      title: 'Degree Programs',
      description: 'Manage degree programs and enrollments',
      icon: AcademicCapIcon,
      href: '/admin/degree-programs',
      color: 'bg-purple-500',
      count: stats.totalDegreePrograms
    },
    {
      title: 'Mentorships',
      description: 'Manage mentorship programs and mentors',
      icon: UserGroupIcon,
      href: '/admin/mentorships',
      color: 'bg-indigo-500',
      count: stats.totalMentors
    },
    {
      title: 'Blog Management',
      description: 'Create and manage blog content',
      icon: DocumentTextIcon,
      href: '/admin/blog',
      color: 'bg-orange-500',
      count: stats.totalBlogPosts
    },
    {
      title: 'Payment Management',
      description: 'Monitor payments and process refunds',
      icon: CreditCardIcon,
      href: '/admin/payments',
      color: 'bg-emerald-500',
      count: stats.totalPayments,
      subtext: `${stats.pendingPayments} pending, ${stats.failedPayments} failed`,
      trend: stats.revenueGrowth,
      trendType: stats.revenueGrowth >= 0 ? 'positive' : 'negative'
    },
    {
      title: 'Reports & Analytics',
      description: 'View detailed reports and insights',
      icon: ChartBarIcon,
      href: '/admin/reports',
      color: 'bg-rose-500'
    },
    {
      title: 'Platform Settings',
      description: 'Configure platform settings and policies',
      icon: CogIcon,
      href: '/admin/settings',
      color: 'bg-gray-500'
    }
  ]

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, {session.user.name}! 👋</h1>
            <p className="text-primary-100">Here's what's happening with your platform today.</p>
          </div>
          <div className="hidden md:block">
            <div className="text-right">
              <p className="text-sm text-primary-100">Total Revenue</p>
              <p className="text-3xl font-bold">₹{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-primary-100">
                {stats.revenueGrowth >= 0 ? '+' : ''}{stats.revenueGrowth.toFixed(1)}% from last month
              </p>
            </div>
          </div>
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
              <BookOpenIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              <p className="text-xs text-gray-500">{stats.publishedCourses} published</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCardIcon className="h-8 w-8 text-emerald-600" />
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
              <UserGroupIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Subscriptions</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
              <p className="text-xs text-gray-500">{stats.totalMentors} mentors</p>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Navigation */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {dashboardItems.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.title}
              href={item.href}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <div className={`flex-shrink-0 p-3 rounded-lg ${item.color} bg-opacity-10`}>
                  <Icon className={`h-8 w-8 ${item.color.replace('bg-', 'text-')}`} />
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                    {item.count && (
                      <span className="bg-primary-100 text-primary-800 text-xs font-medium px-2 py-1 rounded-full">
                        {item.count}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                  {item.subtext && (
                    <p className="text-xs text-gray-500 mt-1">{item.subtext}</p>
                  )}
                  {item.trend !== undefined && (
                    <div className="flex items-center mt-2">
                      {item.trendType === 'positive' ? (
                        <ArrowTrendingUpIcon className="h-3 w-3 text-green-600 mr-1" />
                      ) : (
                        <ArrowTrendingDownIcon className="h-3 w-3 text-red-600 mr-1" />
                      )}
                      <span className={`text-xs font-medium ${
                        item.trendType === 'positive' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {item.trend >= 0 ? '+' : ''}{item.trend.toFixed(1)}%
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Enrollments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Enrollments</h3>
          </div>
          <div className="p-6">
            {stats.recentEnrollments.length > 0 ? (
              <div className="space-y-4">
                {stats.recentEnrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{enrollment.user.name}</p>
                      <p className="text-sm text-gray-600">{enrollment.course.title}</p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {new Date(enrollment.enrolledAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent enrollments</p>
            )}
          </div>
        </div>

        {/* Recent Payments */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Payments</h3>
          </div>
          <div className="p-6">
                         <p className="text-gray-500 text-center py-4">No recent payments</p>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {stats.pendingEnrollments > 0 && (
                <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
                  <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">{stats.pendingEnrollments} pending enrollments</p>
                    <p className="text-xs text-yellow-600">Requires attention</p>
                  </div>
                </div>
              )}
              
              {stats.pendingPayments > 0 && (
                <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                  <ClockIcon className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-blue-800">{stats.pendingPayments} pending payments</p>
                    <p className="text-xs text-blue-600">Awaiting confirmation</p>
                  </div>
                </div>
              )}

              {stats.failedPayments > 0 && (
                <div className="flex items-center p-3 bg-red-50 rounded-lg">
                  <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-red-800">{stats.failedPayments} failed payments</p>
                    <p className="text-xs text-red-600">Requires investigation</p>
                  </div>
                </div>
              )}

              {stats.unverifiedUsers > 0 && (
                <div className="flex items-center p-3 bg-orange-50 rounded-lg">
                  <ShieldCheckIcon className="h-5 w-5 text-orange-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-orange-800">{stats.unverifiedUsers} unverified users</p>
                    <p className="text-xs text-orange-600">Email verification pending</p>
                  </div>
                </div>
              )}

              {!stats.pendingEnrollments && !stats.pendingPayments && !stats.failedPayments && !stats.unverifiedUsers && (
                <div className="flex items-center p-3 bg-green-50 rounded-lg">
                  <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm font-medium text-green-800">All systems operational</p>
                    <p className="text-xs text-green-600">No issues detected</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <StarIcon className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
              <p className="text-sm text-gray-600">Total Reviews</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <EyeIcon className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.completedEnrollments}</p>
              <p className="text-sm text-gray-600">Completed Courses</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <UserIcon className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stats.thisMonthUsers}</p>
              <p className="text-sm text-gray-600">New Users This Month</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl">
              <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCardIcon className="h-6 w-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{stats.thisMonthRevenue.toLocaleString()}</p>
              <p className="text-sm text-gray-600">Revenue This Month</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
