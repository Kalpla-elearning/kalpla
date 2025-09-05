'use client'

import { 
  BookOpenIcon, 
  ClipboardDocumentListIcon, 
  UserGroupIcon, 
  TrophyIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function DashboardPage() {
  // Mock user data for now
  const user = {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    role: 'STUDENT'
  }

  const stats = [
    {
      name: 'Courses Enrolled',
      value: 2,
      icon: BookOpenIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      name: 'Assignments Completed',
      value: 5,
      icon: CheckCircleIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      name: 'Mentor Sessions',
      value: 3,
      icon: UserGroupIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      name: 'Current Phase',
      value: 'Phase 3 of 12',
      icon: TrophyIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100'
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'assignment',
      title: 'Submitted Business Model Canvas',
      course: 'Startup Fundamentals',
      time: '2 hours ago',
      status: 'submitted'
    },
    {
      id: 2,
      type: 'mentor',
      title: 'Booked session with John Smith',
      course: 'Mentor Session',
      time: '1 day ago',
      status: 'scheduled'
    },
    {
      id: 3,
      type: 'course',
      title: 'Completed Module 2: Market Research',
      course: 'Startup Fundamentals',
      time: '2 days ago',
      status: 'completed'
    },
    {
      id: 4,
      type: 'service',
      title: 'Requested Web Development Service',
      course: 'Services',
      time: '3 days ago',
      status: 'pending'
    }
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: 'Live Class: Pitch Deck Workshop',
      time: 'Today, 2:00 PM',
      type: 'live-class',
      instructor: 'Sarah Johnson'
    },
    {
      id: 2,
      title: 'Mentor Session with Mike Chen',
      time: 'Tomorrow, 10:00 AM',
      type: 'mentor-session',
      instructor: 'Mike Chen'
    },
    {
      id: 3,
      title: 'Assignment Due: Financial Projections',
      time: 'Dec 15, 11:59 PM',
      type: 'assignment',
      instructor: 'System'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.name || 'Student'}! 👋
        </h1>
        <p className="text-primary-100">
          Ready to continue your startup journey? You're making great progress!
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
              </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                    {activity.type === 'assignment' && (
                      <ClipboardDocumentListIcon className="h-5 w-5 text-blue-500" />
                    )}
                    {activity.type === 'mentor' && (
                      <UserGroupIcon className="h-5 w-5 text-purple-500" />
                    )}
                    {activity.type === 'course' && (
                      <BookOpenIcon className="h-5 w-5 text-green-500" />
                    )}
                    {activity.type === 'service' && (
                      <ChartBarIcon className="h-5 w-5 text-orange-500" />
                    )}
              </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.course}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
              </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      activity.status === 'completed' ? 'bg-green-100 text-green-800' :
                      activity.status === 'submitted' ? 'bg-blue-100 text-blue-800' :
                      activity.status === 'scheduled' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {activity.status}
                    </span>
            </div>
          </div>
              ))}
              </div>
            <div className="mt-4">
              <Link
                href="/dashboard/activity"
                className="text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                View all activity →
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Upcoming Events</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-sm text-gray-500">with {event.instructor}</p>
                    <p className="text-xs text-gray-400">{event.time}</p>
                  </div>
                  <div className="flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      event.type === 'live-class' ? 'bg-red-100 text-red-800' :
                      event.type === 'mentor-session' ? 'bg-purple-100 text-purple-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {event.type.replace('-', ' ')}
                        </span>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link
                href="/dashboard/calendar"
                className="text-sm text-primary-600 hover:text-primary-500 font-medium"
              >
                View calendar →
              </Link>
            </div>
          </div>
        </div>
        </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Learning Progress</h3>
        </div>
        <div className="p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Phase 3: Business Model Development</span>
              <span className="text-sm text-gray-500">25% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-primary-600 h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-500">Modules Completed</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">3</div>
              <div className="text-sm text-gray-500">Assignments Pending</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-gray-500">Days Remaining</div>
            </div>
          </div>

          <div className="mt-6">
            <Link
              href="/dashboard/learning"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              Continue Learning
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/dashboard/assignments"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ClipboardDocumentListIcon className="h-8 w-8 text-blue-500 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Submit Assignment</div>
                <div className="text-sm text-gray-500">Upload your work</div>
              </div>
                </Link>

            <Link
              href="/dashboard/mentors"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <UserGroupIcon className="h-8 w-8 text-purple-500 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Book Mentor</div>
                <div className="text-sm text-gray-500">Schedule session</div>
              </div>
            </Link>

            <Link
              href="/dashboard/services"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <ChartBarIcon className="h-8 w-8 text-green-500 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Request Service</div>
                <div className="text-sm text-gray-500">Get help with startup</div>
                      </div>
                        </Link>

            <Link
              href="/dashboard/community"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <TrophyIcon className="h-8 w-8 text-yellow-500 mr-3" />
              <div>
                <div className="font-medium text-gray-900">Join Community</div>
                <div className="text-sm text-gray-500">Connect with peers</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}