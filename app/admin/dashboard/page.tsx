'use client'

import { 
  UsersIcon, 
  BookOpenIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

export default function AdminDashboardPage() {
  const stats = [
    {
      name: 'Total Users',
      value: '1,234',
      change: '+12%',
      changeType: 'positive',
      icon: UsersIcon,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Active Courses',
      value: '45',
      change: '+8%',
      changeType: 'positive',
      icon: BookOpenIcon,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Revenue',
      value: '₹2,500,000',
      change: '+15%',
      changeType: 'positive',
      icon: CurrencyDollarIcon,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      name: 'Completion Rate',
      value: '87%',
      change: '+3%',
      changeType: 'positive',
      icon: ChartBarIcon,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ]

  const recentActivities = [
    {
      id: 1,
      user: 'John Doe',
      action: 'enrolled in',
      course: 'Full Stack Development',
      time: '2 hours ago',
      type: 'enrollment',
    },
    {
      id: 2,
      user: 'Jane Smith',
      action: 'completed',
      course: 'React Fundamentals',
      time: '4 hours ago',
      type: 'completion',
    },
    {
      id: 3,
      user: 'Mike Johnson',
      action: 'started',
      course: 'Python for Data Science',
      time: '6 hours ago',
      type: 'start',
    },
    {
      id: 4,
      user: 'Sarah Wilson',
      action: 'applied for',
      course: '12-Month Startup Program',
      time: '8 hours ago',
      type: 'application',
    },
  ]

  const quickActions = [
    {
      name: 'Add New Course',
      description: 'Create a new course',
      icon: BookOpenIcon,
      href: '/admin/courses/new',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      name: 'Manage Users',
      description: 'View and manage users',
      icon: UsersIcon,
      href: '/admin/users',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'View Analytics',
      description: 'Check platform analytics',
      icon: ChartBarIcon,
      href: '/admin/analytics',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      name: 'Payment Reports',
      description: 'View payment reports',
      icon: CurrencyDollarIcon,
      href: '/admin/payments',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome to the Kalpla admin panel. Manage your platform efficiently.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {stat.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {stat.value}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.changeType === 'positive' ? (
                        <ArrowUpIcon className="h-4 w-4 flex-shrink-0 self-center" />
                      ) : (
                        <ArrowDownIcon className="h-4 w-4 flex-shrink-0 self-center" />
                      )}
                      <span className="sr-only">
                        {stat.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                      </span>
                      {stat.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Recent Activities</h3>
          </div>
          <div className="px-6 py-4">
            <div className="flow-root">
              <ul className="-mb-8">
                {recentActivities.map((activity, activityIdx) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {activityIdx !== recentActivities.length - 1 ? (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      ) : null}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center ring-8 ring-white">
                            {activity.type === 'enrollment' && <BookOpenIcon className="h-5 w-5 text-blue-500" />}
                            {activity.type === 'completion' && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                            {activity.type === 'start' && <ClockIcon className="h-5 w-5 text-yellow-500" />}
                            {activity.type === 'application' && <AcademicCapIcon className="h-5 w-5 text-purple-500" />}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              <span className="font-medium text-gray-900">{activity.user}</span>{' '}
                              {activity.action}{' '}
                              <span className="font-medium text-gray-900">{activity.course}</span>
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {activity.time}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow-sm rounded-lg border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {quickActions.map((action) => (
                <a
                  key={action.name}
                  href={action.href}
                  className="flex items-center p-4 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200"
                >
                  <div className={`flex-shrink-0 p-2 rounded-lg ${action.bgColor}`}>
                    <action.icon className={`h-5 w-5 ${action.color}`} />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{action.name}</h4>
                    <p className="text-sm text-gray-500">{action.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white shadow-sm rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">System Status</h3>
        </div>
        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Database</p>
                <p className="text-sm text-gray-500">Operational</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-green-400 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">API</p>
                <p className="text-sm text-gray-500">Operational</p>
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Payments</p>
                <p className="text-sm text-gray-500">Limited</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}