import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  UserIcon,
  BookOpenIcon,
  StarIcon,
  CalendarIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

async function getApprovalRequests() {
  const [
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    totalRequests,
    recentActivity
  ] = await Promise.all([
    // Pending approval requests
    prisma.course.findMany({
      where: { status: 'PENDING' },
      include: {
        instructor: {
          select: { name: true, email: true, avatar: true }
        },
        _count: {
          select: { modules: true, enrollments: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    // Recently approved requests
    prisma.course.findMany({
      where: { 
        status: 'PUBLISHED',
        updatedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      include: {
        instructor: {
          select: { name: true, email: true }
        },
        _count: {
          select: { modules: true, enrollments: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 5
    }),
    // Recently rejected requests
    prisma.course.findMany({
      where: { 
        status: 'REJECTED',
        updatedAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      },
      include: {
        instructor: {
          select: { name: true, email: true }
        }
      },
      orderBy: { updatedAt: 'desc' },
      take: 5
    }),
    // Total requests count
    prisma.course.count(),
    // Recent activity
    prisma.course.findMany({
      take: 10,
      orderBy: { updatedAt: 'desc' },
      include: {
        instructor: {
          select: { name: true }
        }
      }
    })
  ])

  return {
    pendingRequests,
    approvedRequests,
    rejectedRequests,
    totalRequests,
    recentActivity
  }
}

export default async function AdminCourseApprovalRequestsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  const data = await getApprovalRequests()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Course Approval Requests</h1>
          <p className="text-gray-600 mt-2">Review and manage instructor course submissions</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/courses"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            <BookOpenIcon className="h-5 w-5 mr-2" />
            All Courses
          </Link>
          <Link
            href="/admin/courses/guidelines"
            className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Guidelines
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{data.pendingRequests.length}</p>
              <p className="text-xs text-gray-500">Awaiting approval</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recently Approved</p>
              <p className="text-2xl font-bold text-gray-900">{data.approvedRequests.length}</p>
              <p className="text-xs text-gray-500">This week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recently Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{data.rejectedRequests.length}</p>
              <p className="text-xs text-gray-500">This week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpenIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{data.totalRequests}</p>
              <p className="text-xs text-gray-500">All time</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Requests */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Pending Approval Requests</h3>
            <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              {data.pendingRequests.length} requests
            </span>
          </div>
        </div>
        <div className="p-6">
          {data.pendingRequests.length > 0 ? (
            <div className="space-y-6">
              {data.pendingRequests.map((course) => (
                <div key={course.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <div className="flex-shrink-0">
                          {course.instructor.avatar ? (
                            <img
                              src={course.instructor.avatar}
                              alt={course.instructor.name}
                              className="h-10 w-10 rounded-full"
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <h4 className="text-lg font-semibold text-gray-900">{course.title}</h4>
                          <p className="text-sm text-gray-600">by {course.instructor.name}</p>
                          <p className="text-xs text-gray-500">{course.instructor.email}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                       <div className="flex items-center">
                                 <BookOpenIcon className="h-4 w-4 text-gray-400 mr-2" />
                                 <span className="text-sm text-gray-600">{course._count.modules} modules</span>
                               </div>
                                                       <div className="flex items-center">
                                 <StarIcon className="h-4 w-4 text-gray-400 mr-2" />
                                 <span className="text-sm text-gray-600">Uncategorized</span>
                               </div>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">
                            Submitted {new Date(course.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-700 line-clamp-3">{course.description}</p>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {course.level}
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {course.duration} hours
                          </span>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ₹{course.price}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/courses/${course.id}/review`}
                            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            Review Course
                          </Link>
                          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm flex items-center">
                            <CheckCircleIcon className="h-4 w-4 mr-1" />
                            Approve
                          </button>
                          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm flex items-center">
                            <XCircleIcon className="h-4 w-4 mr-1" />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
              <p className="text-gray-600">All course submissions have been reviewed.</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recently Approved */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recently Approved</h3>
              <Link
                href="/admin/courses?status=published"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {data.approvedRequests.length > 0 ? (
              <div className="space-y-4">
                {data.approvedRequests.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-600">by {course.instructor.name}</p>
                        <p className="text-xs text-gray-500">
                          Approved {new Date(course.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {course._count.enrollments} enrollments
                      </span>
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="View course"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recently approved courses</p>
            )}
          </div>
        </div>

        {/* Recently Rejected */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recently Rejected</h3>
              <Link
                href="/admin/courses?status=rejected"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {data.rejectedRequests.length > 0 ? (
              <div className="space-y-4">
                {data.rejectedRequests.map((course) => (
                  <div key={course.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <XCircleIcon className="h-5 w-5 text-red-600 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{course.title}</h4>
                        <p className="text-sm text-gray-600">by {course.instructor.name}</p>
                        <p className="text-xs text-gray-500">
                          Rejected {new Date(course.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/courses/${course.id}/review`}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Review
                      </Link>
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="View course"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recently rejected courses</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Bulk Approve Selected</span>
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <XCircleIcon className="h-5 w-5 text-red-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Bulk Reject Selected</span>
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <PencilIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Update Guidelines</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
