'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  HomeIcon,
  BookOpenIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  BuildingOffice2Icon,
  ShoppingBagIcon,
  ChatBubbleLeftRightIcon,
  CogIcon,
  TrophyIcon,
  ChartBarIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ShareIcon
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'Overview', href: '/dashboard', icon: HomeIcon },
  { name: 'Learning Hub', href: '/dashboard/learning', icon: BookOpenIcon },
  { name: 'Assignments', href: '/dashboard/assignments', icon: ClipboardDocumentListIcon },
  { name: 'Live Classes', href: '/dashboard/live-classes', icon: VideoCameraIcon },
  { name: 'Mentors', href: '/dashboard/mentors', icon: UserGroupIcon },
  { name: 'Investors', href: '/dashboard/investors', icon: BuildingOffice2Icon },
  { name: 'Services', href: '/dashboard/services', icon: ShoppingBagIcon },
  { name: 'Referrals', href: '/dashboard/referrals', icon: ShareIcon },
  { name: 'Community', href: '/dashboard/community', icon: ChatBubbleLeftRightIcon },
  { name: 'Progress', href: '/dashboard/progress', icon: ChartBarIcon },
  { name: 'Achievements', href: '/dashboard/achievements', icon: TrophyIcon },
  { name: 'Resources', href: '/dashboard/resources', icon: DocumentTextIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: CogIcon },
]

const serviceCategories = [
  { name: 'Web Development', href: '/dashboard/services/web-dev', icon: CurrencyDollarIcon },
  { name: 'App Development', href: '/dashboard/services/app-dev', icon: CurrencyDollarIcon },
  { name: 'Branding', href: '/dashboard/services/branding', icon: CurrencyDollarIcon },
  { name: 'Marketing', href: '/dashboard/services/marketing', icon: CurrencyDollarIcon },
  { name: 'Legal Services', href: '/dashboard/services/legal', icon: CurrencyDollarIcon },
  { name: 'Fundraising', href: '/dashboard/services/fundraising', icon: CurrencyDollarIcon },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-white shadow-lg h-screen overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900">Kalpla Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Student Portal</p>
      </div>

      <nav className="mt-6">
        <div className="px-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Main Navigation
          </h3>
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-primary-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="mt-8 px-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Startup Services
          </h3>
          <div className="space-y-1">
            {serviceCategories.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-green-100 text-green-700 border-r-2 border-green-500'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <item.icon
                    className={`mr-3 h-5 w-5 ${
                      isActive ? 'text-green-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                  />
                  {item.name}
                </Link>
              )
            })}
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mt-8 px-3">
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg p-4 text-white">
            <h4 className="text-sm font-semibold mb-2">Your Progress</h4>
            <div className="flex items-center justify-between text-xs mb-2">
              <span>Phase 3 of 12</span>
              <span>25%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div className="bg-white h-2 rounded-full" style={{ width: '25%' }}></div>
            </div>
            <p className="text-xs mt-2 opacity-90">
              Complete assignments to unlock Phase 4
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 px-3">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Quick Actions
          </h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              📚 Submit Assignment
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              🎯 Book Mentor Session
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              💼 Request Service
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors">
              💬 Join Community Chat
            </button>
          </div>
        </div>
      </nav>
    </div>
  )
}
