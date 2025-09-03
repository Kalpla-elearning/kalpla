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
  UserGroupIcon
} from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

async function getUserStats(userId: string) {
  const [
    enrolledCourses,
    completedCourses,
    totalSpent,
    certificates,
    recentActivity
  ] = await Promise.all([
    // Enrolled courses count
    prisma.enrollment.count({
      where: { userId }
    }),
    // Completed courses count
    prisma.enrollment.count({
      where: { 
        userId,
        status: 'COMPLETED'
      }
    }),
    // Total spent (sum of course prices)
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            price: true
          }
        }
      }
    }),
    // Certificates count
    prisma.enrollment.count({
      where: { 
        userId,
        status: 'COMPLETED'
      }
    }),
    // Recent activity (last 5 enrollments)
    prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            title: true,
            slug: true,
            thumbnail: true
          }
        }
      },
      orderBy: { enrolledAt: 'desc' },
      take: 5
    })
  ])

  const totalSpentAmount = totalSpent.reduce((sum, enrollment) => sum + enrollment.course.price, 0)

  return {
    enrolledCourses,
    completedCourses,
    totalSpent: totalSpentAmount,
    certificates,
    recentActivity
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/signin')
  }

  const stats = await getUserStats(session.user.id)

  const dashboardItems = [
    {
      title: 'My Profile',
      description: 'View and edit your personal information',
      icon: UserIcon,
      href: '/dashboard/profile',
      color: 'bg-blue-500'
    },
    {
      title: 'My Courses',
      description: 'Access your enrolled courses and track progress',
      icon: AcademicCapIcon,
      href: '/dashboard/courses',
      color: 'bg-green-500',
      badge: stats.enrolledCourses
    },
    {
      title: 'My Payments',
      description: 'View payment history and manage billing',
      icon: CreditCardIcon,
      href: '/dashboard/payments',
      color: 'bg-purple-500'
    },
    {
      title: 'Certificates',
      description: 'Download your course completion certificates',
      icon: DocumentTextIcon,
      href: '/dashboard/certificates',
      color: 'bg-yellow-500',
      badge: stats.certificates
    },
    {
      title: 'Settings',
      description: 'Manage password and preferences',
      icon: CogIcon,
      href: '/dashboard/settings',
      color: 'bg-gray-500'
    },
    {
      title: 'Notifications',
      description: 'View and manage your notifications',
      icon: BellIcon,
      href: '/dashboard/notifications',
      color: 'bg-red-500'
    },
    {
      title: 'Mentorship Sessions',
      description: 'Manage your mentorship sessions and meetings',
      icon: UserGroupIcon,
      href: '/dashboard/mentorship/sessions',
      color: 'bg-indigo-500'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-2">Welcome back, {session.user.name}!</p>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/courses"
                className="btn-primary"
              >
                Browse Courses
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
                <p className="text-sm font-medium text-gray-600">Enrolled Courses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.enrolledCourses}</p>
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
                <p className="text-2xl font-bold text-gray-900">{stats.completedCourses}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Certificates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.certificates}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CreditCardIcon className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">₹{stats.totalSpent.toLocaleString()}</p>
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

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            {stats.recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recent activity</h3>
                <p className="text-gray-600 mb-4">Start your learning journey by enrolling in a course!</p>
                <Link href="/courses" className="btn-primary">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentActivity.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    {enrollment.course.thumbnail ? (
                      <img
                        src={enrollment.course.thumbnail}
                        alt={enrollment.course.title}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <BookOpenIcon className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        <Link href={`/courses/${enrollment.course.slug}`} className="hover:text-primary-600">
                          {enrollment.course.title}
                        </Link>
                      </h4>
                      <p className="text-sm text-gray-600">
                        Enrolled on {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        enrollment.status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-800'
                          : enrollment.status === 'IN_PROGRESS'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {enrollment.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
