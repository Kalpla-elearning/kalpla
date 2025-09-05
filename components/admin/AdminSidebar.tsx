'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  HomeIcon,
  UsersIcon,
  BookOpenIcon,
  AcademicCapIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  CogIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

const navigation = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Users',
    href: '/admin/users',
    icon: UsersIcon,
  },
  {
    name: 'Courses',
    href: '/admin/courses',
    icon: BookOpenIcon,
  },
  {
    name: 'Degree Programs',
    href: '/admin/degree-programs',
    icon: AcademicCapIcon,
  },
  {
    name: 'Mentors',
    href: '/admin/mentors',
    icon: UserGroupIcon,
  },
  {
    name: 'Payments',
    href: '/admin/payments',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'Analytics',
    href: '/admin/analytics',
    icon: ChartBarIcon,
  },
  {
    name: 'Settings',
    href: '/admin/settings',
    icon: CogIcon,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    )
  }

  return (
    <div className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900">Admin Panel</h2>
        <p className="text-sm text-gray-500 mt-1">Manage your platform</p>
      </div>

      <nav className="mt-6 px-3">
        <ul className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const isExpanded = expandedItems.includes(item.name)
            
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-red-50 text-red-700 border-r-2 border-red-700'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 flex-shrink-0 ${
                      isActive ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Quick Stats */}
      <div className="mt-8 px-3">
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Total Users</span>
              <span className="font-medium">1,234</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Active Courses</span>
              <span className="font-medium">45</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Revenue</span>
              <span className="font-medium">₹2.5M</span>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="mt-6 px-3">
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Admin Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
              System Backup
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
              Clear Cache
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md">
              View Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
