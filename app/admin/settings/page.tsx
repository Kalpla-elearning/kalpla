

import { redirect } from 'next/navigation'
import Link from 'next/link'
import { 
  CogIcon,
  PaintBrushIcon,
  ShieldCheckIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  CreditCardIcon,
  BellIcon,
  UserIcon,
  AcademicCapIcon,
  BookOpenIcon,
  StarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Settings</h1>
          <p className="text-gray-600 mt-2">Configure platform settings, branding, and policies</p>
        </div>
      </div>

      {/* Settings Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* General Settings */}
        <Link
          href="/admin/settings/general"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-blue-500 bg-opacity-10">
              <CogIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">General Settings</h3>
              <p className="text-sm text-gray-600">Site name, description, and basic configuration</p>
            </div>
          </div>
        </Link>

        {/* Branding */}
        <Link
          href="/admin/settings/branding"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-purple-500 bg-opacity-10">
              <PaintBrushIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Branding</h3>
              <p className="text-sm text-gray-600">Logo, colors, and visual identity</p>
            </div>
          </div>
        </Link>

        {/* Security */}
        <Link
          href="/admin/settings/security"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-red-500 bg-opacity-10">
              <ShieldCheckIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Security</h3>
              <p className="text-sm text-gray-600">Security settings and access control</p>
            </div>
          </div>
        </Link>

        {/* Legal & Policies */}
        <Link
          href="/admin/settings/legal"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-green-500 bg-opacity-10">
              <DocumentTextIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Legal & Policies</h3>
              <p className="text-sm text-gray-600">Terms of service, privacy policy, and legal documents</p>
            </div>
          </div>
        </Link>

        {/* Payment Settings */}
        <Link
          href="/admin/settings/payments"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-emerald-500 bg-opacity-10">
              <CreditCardIcon className="h-8 w-8 text-emerald-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Payment Settings</h3>
              <p className="text-sm text-gray-600">Payment gateways and transaction settings</p>
            </div>
          </div>
        </Link>

        {/* Email Settings */}
        <Link
          href="/admin/settings/email"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-orange-500 bg-opacity-10">
              <BellIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Email Settings</h3>
              <p className="text-sm text-gray-600">Email templates and notification settings</p>
            </div>
          </div>
        </Link>

        {/* User Management */}
        <Link
          href="/admin/settings/users"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-indigo-500 bg-opacity-10">
              <UserIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
              <p className="text-sm text-gray-600">User roles, permissions, and registration settings</p>
            </div>
          </div>
        </Link>

        {/* Course Settings */}
        <Link
          href="/admin/settings/courses"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-cyan-500 bg-opacity-10">
              <BookOpenIcon className="h-8 w-8 text-cyan-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Course Settings</h3>
              <p className="text-sm text-gray-600">Course creation, approval, and content settings</p>
            </div>
          </div>
        </Link>

        {/* Instructor Settings */}
        <Link
          href="/admin/settings/instructors"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-amber-500 bg-opacity-10">
              <AcademicCapIcon className="h-8 w-8 text-amber-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Instructor Settings</h3>
              <p className="text-sm text-gray-600">Instructor approval and commission settings</p>
            </div>
          </div>
        </Link>

        {/* Review Settings */}
        <Link
          href="/admin/settings/reviews"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-yellow-500 bg-opacity-10">
              <StarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Review Settings</h3>
              <p className="text-sm text-gray-600">Review moderation and rating settings</p>
            </div>
          </div>
        </Link>

        {/* Financial Settings */}
        <Link
          href="/admin/settings/financial"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-lime-500 bg-opacity-10">
              <CurrencyDollarIcon className="h-8 w-8 text-lime-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">Financial Settings</h3>
              <p className="text-sm text-gray-600">Commission rates and financial policies</p>
            </div>
          </div>
        </Link>

        {/* SEO Settings */}
        <Link
          href="/admin/settings/seo"
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0 p-3 rounded-lg bg-teal-500 bg-opacity-10">
              <GlobeAltIcon className="h-8 w-8 text-teal-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-900">SEO Settings</h3>
              <p className="text-sm text-gray-600">Meta tags, sitemap, and search optimization</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <CogIcon className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Backup Settings</span>
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <DocumentTextIcon className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Export Config</span>
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <ShieldCheckIcon className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Security Scan</span>
            </button>
            <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <GlobeAltIcon className="h-5 w-5 text-gray-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Clear Cache</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">System Status</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-green-800">Database</span>
              </div>
              <span className="text-sm text-green-600">Online</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-green-800">Payment Gateway</span>
              </div>
              <span className="text-sm text-green-600">Connected</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-green-800">Email Service</span>
              </div>
              <span className="text-sm text-green-600">Active</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-sm font-medium text-green-800">File Storage</span>
              </div>
              <span className="text-sm text-green-600">Connected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Changes */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Settings Changes</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <CogIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Payment gateway updated</p>
                  <p className="text-xs text-gray-600">Razorpay configuration modified</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">2 hours ago</span>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <PaintBrushIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Brand colors updated</p>
                  <p className="text-xs text-gray-600">Primary color changed to blue</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">1 day ago</span>
            </div>
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Terms of service updated</p>
                  <p className="text-xs text-gray-600">New privacy policy added</p>
                </div>
              </div>
              <span className="text-xs text-gray-500">3 days ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
