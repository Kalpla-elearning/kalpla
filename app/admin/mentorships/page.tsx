

import { redirect } from 'next/navigation'

import Link from 'next/link'
import { 
  UserIcon,
  AcademicCapIcon,
  StarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  PlusIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'



async function getMentorshipStats() {
  const [
    totalMentors,
    activeMentors,
    totalPrograms,
    activePrograms,
    totalEnrollments,
    totalSessions,
    pendingApplications,
    recentPrograms
  ] = await Promise.all([
    // Total mentors
    prisma.mentor.count(),
    // Active mentors
    prisma.mentor.count({ where: { isActive: true } }),
    // Total programs
    prisma.mentorshipProgram.count(),
    // Active programs
    prisma.mentorshipProgram.count({ where: { isActive: true } }),
    // Total enrollments
    prisma.mentorshipEnrollment.count(),
    // Total sessions
    prisma.mentorshipSession.count(),
    // Pending mentor applications (mentors not verified)
    prisma.mentor.count({ where: { isVerified: false } }),
    // Recent programs
    prisma.mentorshipProgram.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        mentor: {
          include: {
            user: {
              select: { name: true, email: true }
            }
          }
        },
        _count: {
          select: { enrollments: true }
        }
      }
    })
  ])

  return {
    totalMentors,
    activeMentors,
    totalPrograms,
    activePrograms,
    totalEnrollments,
    totalSessions,
    pendingApplications,
    recentPrograms
  }
}

export default async function AdminMentorshipsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  const stats = await getMentorshipStats()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mentorship Management</h1>
          <p className="text-gray-600 mt-2">Manage mentors, programs, and mentorship activities</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/mentorships/mentors"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            <UserIcon className="h-5 w-5 mr-2" />
            Manage Mentors
          </Link>
          <Link
            href="/admin/mentorships/programs"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <AcademicCapIcon className="h-5 w-5 mr-2" />
            Manage Programs
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Mentors</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMentors}</p>
              <p className="text-xs text-gray-500">{stats.activeMentors} active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AcademicCapIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Programs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPrograms}</p>
              <p className="text-xs text-gray-500">{stats.activePrograms} active</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <StarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
              <p className="text-xs text-gray-500">{stats.totalSessions} sessions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Applications</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingApplications}</p>
              <p className="text-xs text-gray-500">Requires review</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Link
          href="/admin/mentorships/mentors"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-500 bg-opacity-10">
              <UserIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Manage Mentors</h3>
              <p className="text-sm text-gray-600">Review applications, verify mentors, and manage profiles</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/mentorships/programs"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-500 bg-opacity-10">
              <AcademicCapIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Manage Programs</h3>
              <p className="text-sm text-gray-600">Create, edit, and manage mentorship programs</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/mentorships/enrollments"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-purple-500 bg-opacity-10">
              <StarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">View Enrollments</h3>
              <p className="text-sm text-gray-600">Monitor student enrollments and progress</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/mentorships/sessions"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-indigo-500 bg-opacity-10">
              <ClockIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Session Management</h3>
              <p className="text-sm text-gray-600">Track mentorship sessions and schedules</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/mentorships/applications"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-orange-500 bg-opacity-10">
              <PlusIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Review Applications</h3>
              <p className="text-sm text-gray-600">Review and approve mentor applications</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/mentorships/analytics"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-rose-500 bg-opacity-10">
              <StarIcon className="h-8 w-8 text-rose-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">View mentorship performance metrics</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Recent Programs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Mentorship Programs</h3>
            <Link
              href="/admin/mentorships/programs"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="p-6">
          {stats.recentPrograms.length > 0 ? (
            <div className="space-y-4">
              {stats.recentPrograms.map((program) => (
                <div key={program.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <AcademicCapIcon className="h-8 w-8 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{program.title}</h4>
                      <p className="text-sm text-gray-600">by {program.mentor.user.name}</p>
                      <p className="text-xs text-gray-500">{program.category} • {program.duration} weeks</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {program._count.enrollments} enrollments
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      program.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {program.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div className="flex items-center space-x-1">
                      <Link
                        href={`/admin/mentorships/programs/${program.id}`}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="View details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/mentorships/programs/${program.id}/edit`}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Edit program"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No mentorship programs yet</h3>
              <p className="text-gray-600 mb-4">Get started by creating your first mentorship program.</p>
              <Link
                href="/admin/mentorships/programs/create"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Program
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Alerts */}
      {stats.pendingApplications > 0 && (
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <ClockIcon className="h-5 w-5 text-yellow-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-yellow-800">
                {stats.pendingApplications} mentor application{stats.pendingApplications !== 1 ? 's' : ''} pending review
              </h3>
              <p className="text-sm text-yellow-700 mt-1">
                Review and approve mentor applications to expand your mentorship program.
              </p>
            </div>
            <div className="ml-auto">
              <Link
                href="/admin/mentorships/applications"
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm"
              >
                Review Applications
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
