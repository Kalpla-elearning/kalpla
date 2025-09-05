'use client'

import { useState, useEffect } from 'react'
import { 
  UserGroupIcon, 
  BookOpenIcon, 
  CreditCardIcon,
  ChartBarIcon,
  CogIcon,
  DocumentTextIcon,
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  EyeIcon,
  StarIcon,
  PlusIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

interface AdminStats {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  monthlyRevenue: number
  totalCourses: number
  totalAssignments: number
  pendingPayments: number
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical'
}

interface RecentUser {
  id: string
  name: string
  email: string
  role: 'STUDENT' | 'MENTOR' | 'ADMIN'
  joinedAt: string
  lastActive: string
  status: 'active' | 'inactive' | 'suspended'
}

interface SystemAlert {
  id: string
  type: 'info' | 'warning' | 'error' | 'success'
  title: string
  message: string
  timestamp: string
  resolved: boolean
}

interface RevenueData {
  month: string
  revenue: number
  users: number
  courses: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [recentUsers, setRecentUsers] = useState<RecentUser[]>([])
  const [systemAlerts, setSystemAlerts] = useState<SystemAlert[]>([])
  const [revenueData, setRevenueData] = useState<RevenueData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock data - in production, this would come from your API
    const mockStats: AdminStats = {
      totalUsers: 1250,
      activeUsers: 980,
      totalRevenue: 2500000,
      monthlyRevenue: 450000,
      totalCourses: 45,
      totalAssignments: 320,
      pendingPayments: 12,
      systemHealth: 'excellent'
    }

    const mockRecentUsers: RecentUser[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        role: 'STUDENT',
        joinedAt: '2024-01-20',
        lastActive: '2 hours ago',
        status: 'active'
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike@example.com',
        role: 'MENTOR',
        joinedAt: '2024-01-18',
        lastActive: '1 day ago',
        status: 'active'
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily@example.com',
        role: 'STUDENT',
        joinedAt: '2024-01-15',
        lastActive: '3 days ago',
        status: 'inactive'
      }
    ]

    const mockSystemAlerts: SystemAlert[] = [
      {
        id: '1',
        type: 'info',
        title: 'Database Backup Completed',
        message: 'Daily backup completed successfully',
        timestamp: '2 hours ago',
        resolved: true
      },
      {
        id: '2',
        type: 'warning',
        title: 'High Server Load',
        message: 'Server load is above 80%',
        timestamp: '1 hour ago',
        resolved: false
      },
      {
        id: '3',
        type: 'success',
        title: 'Payment Processed',
        message: 'Payment of ₹25,000 processed successfully',
        timestamp: '30 minutes ago',
        resolved: true
      }
    ]

    const mockRevenueData: RevenueData[] = [
      { month: 'Jan', revenue: 400000, users: 120, courses: 8 },
      { month: 'Feb', revenue: 450000, users: 150, courses: 12 },
      { month: 'Mar', revenue: 500000, users: 180, courses: 15 },
      { month: 'Apr', revenue: 480000, users: 170, courses: 14 },
      { month: 'May', revenue: 520000, users: 200, courses: 18 },
      { month: 'Jun', revenue: 450000, users: 160, courses: 16 }
    ]

    setStats(mockStats)
    setRecentUsers(mockRecentUsers)
    setSystemAlerts(mockSystemAlerts)
    setRevenueData(mockRevenueData)
    setLoading(false)
  }, [])

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'STUDENT':
        return 'bg-blue-100 text-blue-800'
      case 'MENTOR':
        return 'bg-purple-100 text-purple-800'
      case 'ADMIN':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-yellow-100 text-yellow-800'
      case 'suspended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'info':
        return 'bg-blue-100 text-blue-800'
      case 'warning':
        return 'bg-yellow-100 text-yellow-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      case 'success':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSystemHealthColor = (health: string) => {
    switch (health) {
      case 'excellent':
        return 'text-green-600'
      case 'good':
        return 'text-blue-600'
      case 'warning':
        return 'text-yellow-600'
      case 'critical':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-red-600 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="mt-2 text-red-100">Complete platform management and analytics</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <div className="text-sm text-red-100">Total Users</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
              <p className="text-xs text-green-600">+{stats.activeUsers} active</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CreditCardIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-green-600">+₹{stats.monthlyRevenue.toLocaleString()} this month</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpenIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Courses</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
              <p className="text-xs text-blue-600">{stats.totalAssignments} assignments</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-orange-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">System Health</p>
              <p className={`text-2xl font-bold ${getSystemHealthColor(stats.systemHealth)}`}>
                {stats.systemHealth.charAt(0).toUpperCase() + stats.systemHealth.slice(1)}
              </p>
              <p className="text-xs text-gray-600">{stats.pendingPayments} pending payments</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
            </div>
            <div className="p-6">
              <div className="h-64 flex items-end space-x-2">
                {revenueData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center">
                    <div 
                      className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t"
                      style={{ height: `${(data.revenue / 600000) * 200}px` }}
                    ></div>
                    <div className="text-xs text-gray-600 mt-2">{data.month}</div>
                    <div className="text-xs text-gray-500">₹{(data.revenue / 1000).toFixed(0)}k</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            </div>
            <div className="p-6 space-y-3">
              <Link
                href="/dashboard/admin/users"
                className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <UserGroupIcon className="h-5 w-5 mr-3 text-blue-500" />
                Manage Users
              </Link>
              <Link
                href="/dashboard/admin/courses"
                className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <BookOpenIcon className="h-5 w-5 mr-3 text-green-500" />
                Manage Courses
              </Link>
              <Link
                href="/dashboard/admin/payments"
                className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <CreditCardIcon className="h-5 w-5 mr-3 text-purple-500" />
                View Payments
              </Link>
              <Link
                href="/dashboard/admin/analytics"
                className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ChartBarIcon className="h-5 w-5 mr-3 text-orange-500" />
                View Analytics
              </Link>
              <Link
                href="/dashboard/admin/settings"
                className="flex items-center p-3 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <CogIcon className="h-5 w-5 mr-3 text-gray-500" />
                System Settings
              </Link>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
            </div>
            <div className="p-6">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getSystemHealthColor(stats.systemHealth)}`}>
                  {stats.systemHealth.charAt(0).toUpperCase() + stats.systemHealth.slice(1)}
                </div>
                <div className="text-sm text-gray-600 mt-2">Overall Status</div>
                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <div className="flex justify-between">
                    <span>Active Users:</span>
                    <span className="font-medium">{stats.activeUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pending Payments:</span>
                    <span className="font-medium">{stats.pendingPayments}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Courses:</span>
                    <span className="font-medium">{stats.totalCourses}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>
            <Link
              href="/dashboard/admin/users"
              className="text-sm text-red-600 hover:text-red-800"
            >
              View All
            </Link>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{user.name}</h4>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
                    {user.status}
                  </span>
                  <button className="text-gray-400 hover:text-gray-600">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Alerts */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">System Alerts</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {systemAlerts.map((alert) => (
              <div key={alert.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {alert.type === 'info' && <ClockIcon className="h-5 w-5 text-blue-500" />}
                    {alert.type === 'warning' && <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />}
                    {alert.type === 'error' && <ExclamationTriangleIcon className="h-5 w-5 text-red-500" />}
                    {alert.type === 'success' && <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                  </div>
                  <div className="ml-4">
                    <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                    <p className="text-sm text-gray-600">{alert.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{alert.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getAlertColor(alert.type)}`}>
                    {alert.type}
                  </span>
                  {alert.resolved && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Resolved
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
