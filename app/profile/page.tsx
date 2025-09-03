import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  GlobeAltIcon,
  CalendarIcon,
  AcademicCapIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import { getRoleDisplayName, getRoleColor } from '@/lib/utils'

async function getUserProfile(userId: string) {
  const { PrismaClient } = await import('@prisma/client')
  const prisma = new PrismaClient()
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        bio: true,
        location: true,
        website: true,
        image: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            courses: true,
            enrollments: true,
            posts: true
          }
        }
      }
    })
    
    return user
  } finally {
    await prisma.$disconnect()
  }
}

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const user = await getUserProfile(session.user.id)
  
  if (!user) {
    redirect('/auth/signin')
  }



  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="mt-2 text-gray-600">
              View and manage your account information
            </p>
          </div>
          <Link
            href="/profile/edit"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <PencilIcon className="h-4 w-4 mr-2" />
            Edit Profile
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {/* Avatar */}
              <div className="text-center mb-6">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gray-100 border-4 border-gray-200">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || 'Profile'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <UserIcon className="w-full h-full text-gray-400 p-8" />
                  )}
                </div>
                <h2 className="mt-4 text-xl font-semibold text-gray-900">{user.name}</h2>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                  {getRoleDisplayName(user.role)}
                </span>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <EnvelopeIcon className="h-5 w-5 mr-3" />
                  <span className="text-sm">{user.email}</span>
                </div>
                
                {user.phone && (
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon className="h-5 w-5 mr-3" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
                
                {user.location && (
                  <div className="flex items-center text-gray-600">
                    <MapPinIcon className="h-5 w-5 mr-3" />
                    <span className="text-sm">{user.location}</span>
                  </div>
                )}
                
                {user.website && (
                  <div className="flex items-center text-gray-600">
                    <GlobeAltIcon className="h-5 w-5 mr-3" />
                    <a 
                      href={user.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      {user.website}
                    </a>
                  </div>
                )}
                
                <div className="flex items-center text-gray-600">
                  <CalendarIcon className="h-5 w-5 mr-3" />
                  <span className="text-sm">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {user.bio && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About</h3>
                <p className="text-gray-700 leading-relaxed">{user.bio}</p>
              </div>
            )}

            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Activity Statistics</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{user._count.courses}</div>
                  <div className="text-sm text-gray-600">Courses Created</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{user._count.enrollments}</div>
                  <div className="text-sm text-gray-600">Courses Enrolled</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">{user._count.posts}</div>
                  <div className="text-sm text-gray-600">Blog Posts</div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.role === 'INSTRUCTOR' && (
                  <Link
                    href="/instructor/dashboard"
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <AcademicCapIcon className="h-6 w-6 text-primary-600 mr-3" />
                    <div>
                      <div className="font-medium text-gray-900">Instructor Dashboard</div>
                      <div className="text-sm text-gray-600">Manage your courses</div>
                    </div>
                  </Link>
                )}
                
                <Link
                  href="/courses"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <AcademicCapIcon className="h-6 w-6 text-primary-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Browse Courses</div>
                    <div className="text-sm text-gray-600">Discover new courses</div>
                  </div>
                </Link>
                
                <Link
                  href="/blog"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <AcademicCapIcon className="h-6 w-6 text-primary-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Blog</div>
                    <div className="text-sm text-gray-600">Read and write articles</div>
                  </div>
                </Link>
                
                <Link
                  href="/profile/edit"
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <PencilIcon className="h-6 w-6 text-primary-600 mr-3" />
                  <div>
                    <div className="font-medium text-gray-900">Edit Profile</div>
                    <div className="text-sm text-gray-600">Update your information</div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
