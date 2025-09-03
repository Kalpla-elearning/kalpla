'use client'

import { useState, useEffect } from 'react'
import { 
  UsersIcon, 
  BookOpenIcon, 
  CurrencyDollarIcon, 
  ChartBarIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline'

export default function AdminAnalyticsPage() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  const stats = [
    {
      name: 'Total Users',
      value: '2,543',
      change: '+12%',
      changeType: 'positive',
      icon: UsersIcon
    },
    {
      name: 'Active Courses',
      value: '156',
      change: '+8%',
      changeType: 'positive',
      icon: BookOpenIcon
    },
    {
      name: 'Total Revenue',
      value: '$45,231',
      change: '+23%',
      changeType: 'positive',
      icon: CurrencyDollarIcon
    },
    {
      name: 'Course Completion Rate',
      value: '87%',
      change: '+5%',
      changeType: 'positive',
      icon: ChartBarIcon
    },
    {
      name: 'Degree Programs',
      value: '24',
      change: '+3%',
      changeType: 'positive',
      icon: AcademicCapIcon
    },
    {
      name: 'Blog Posts',
      value: '89',
      change: '+15%',
      changeType: 'positive',
      icon: DocumentTextIcon
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: 'user_registration',
      message: 'New user registered: John Doe',
      time: '2 minutes ago',
      icon: UsersIcon
    },
    {
      id: 2,
      type: 'course_created',
      message: 'New course created: Advanced React Patterns',
      time: '15 minutes ago',
      icon: BookOpenIcon
    },
    {
      id: 3,
      type: 'payment_received',
      message: 'Payment received: $299.00',
      time: '1 hour ago',
      icon: CurrencyDollarIcon
    },
    {
      id: 4,
      type: 'course_completed',
      message: 'Course completed: JavaScript Fundamentals',
      time: '2 hours ago',
      icon: AcademicCapIcon
    }
  ]

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className="p-2 bg-primary-100 rounded-lg">
                  <stat.icon className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
              <div className="mt-4 flex items-center">
                {stat.changeType === 'positive' ? (
                  <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last month</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activities */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Activities</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <activity.icon className="h-5 w-5 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Quick Stats</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">New Users This Week</span>
                  <span className="text-sm font-medium text-gray-900">+45</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Courses Published</span>
                  <span className="text-sm font-medium text-gray-900">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Revenue This Month</span>
                  <span className="text-sm font-medium text-gray-900">$12,450</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Active Sessions</span>
                  <span className="text-sm font-medium text-gray-900">234</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Placeholder for charts */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Performance Charts</h2>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">Charts and detailed analytics coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
