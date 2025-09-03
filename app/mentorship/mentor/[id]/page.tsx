import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  AcademicCapIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyRupeeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

interface MentorProfile {
  id: string
  bio: string
  expertise: string
  experience: number
  hourlyRate: number
  rating: number
  totalSessions: number
  isVerified: boolean
  isActive: boolean
  user: {
    id: string
    name: string
    avatar: string | null
    location: string | null
  }
  programs: {
    id: string
    title: string
    description: string
    category: string
    duration: number
    price: number
    maxStudents: number
    currentStudents: number
    _count: {
      enrollments: number
    }
  }[]
  reviews: {
    id: string
    rating: number
    comment: string
    createdAt: string
    user: {
      name: string
    }
  }[]
}

async function getMentorProfile(mentorId: string): Promise<MentorProfile | null> {
  const mentor = await prisma.mentor.findUnique({
    where: { id: mentorId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
          location: true
        }
      },
      programs: {
        where: { isActive: true },
        include: {
          _count: {
            select: {
              enrollments: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      reviews: {
        include: {
          user: {
            select: {
              name: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      }
    }
  })

  return mentor
}

export default async function MentorProfilePage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const session = await getServerSession(authOptions)
  const mentor = await getMentorProfile(params.id)

  if (!mentor || !mentor.isActive) {
    notFound()
  }

  const expertiseList = JSON.parse(mentor.expertise || '[]')
  const averageRating = mentor.reviews.length > 0 
    ? mentor.reviews.reduce((sum, review) => sum + review.rating, 0) / mentor.reviews.length
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/mentorship"
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{mentor.user.name}</h1>
                <p className="text-gray-600 mt-2">Mentor Profile</p>
              </div>
            </div>
            {session?.user && (
              <Link href={`/mentorship/mentor/${mentor.id}/book`} className="btn-primary">
                Book a Session
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Mentor Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <div className="flex items-start space-x-6">
                <img 
                  src={mentor.user.avatar || '/api/placeholder/120/120'} 
                  alt={mentor.user.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{mentor.user.name}</h2>
                    {mentor.isVerified && (
                      <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                        Verified Mentor
                      </span>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                      <span>{averageRating.toFixed(1)} ({mentor.reviews.length} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{mentor.experience} years experience</span>
                    </div>
                    <div className="flex items-center">
                      <UserGroupIcon className="h-4 w-4 text-gray-400 mr-1" />
                      <span>{mentor.totalSessions} sessions completed</span>
                    </div>
                  </div>

                  {mentor.user.location && (
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      <span>{mentor.user.location}</span>
                    </div>
                  )}

                  <p className="text-gray-700 mb-4">{mentor.bio}</p>

                  <div className="flex flex-wrap gap-2">
                    {expertiseList.map((skill: string, index: number) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Programs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Mentorship Programs</h3>
              
              {mentor.programs.length === 0 ? (
                <div className="text-center py-8">
                  <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No programs available</h4>
                  <p className="text-gray-600">This mentor hasn't created any programs yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {mentor.programs.map((program) => (
                    <div key={program.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-900">{program.title}</h4>
                          <p className="text-gray-600 mt-1">{program.description}</p>
                        </div>
                        <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          {program.category}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Duration</div>
                          <div className="font-semibold text-gray-900">{program.duration} weeks</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Price</div>
                          <div className="font-semibold text-gray-900">₹{program.price.toLocaleString()}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Students</div>
                          <div className="font-semibold text-gray-900">{program.currentStudents}/{program.maxStudents}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm text-gray-600">Enrollments</div>
                          <div className="font-semibold text-gray-900">{program._count.enrollments}</div>
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Link 
                          href={`/mentorship/${program.id}`}
                          className="btn-primary flex-1 text-center"
                        >
                          View Details
                        </Link>
                        <Link 
                          href={`/mentorship/${program.id}/apply`}
                          className="btn-secondary flex-1 text-center"
                        >
                          Apply Now
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6">Student Reviews</h3>
              
              {mentor.reviews.length === 0 ? (
                <div className="text-center py-8">
                  <ChatBubbleLeftRightIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h4>
                  <p className="text-gray-600">Be the first to review this mentor.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {mentor.reviews.map((review) => (
                    <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon 
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-medium text-gray-900">{review.user.name}</span>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Session Booking */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Book a Session</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hourly Rate</span>
                  <span className="font-semibold text-gray-900">₹{mentor.hourlyRate.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Sessions</span>
                  <span className="font-semibold text-gray-900">{mentor.totalSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-semibold text-gray-900">{averageRating.toFixed(1)}/5</span>
                </div>
              </div>
              
              {session?.user ? (
                <Link 
                  href={`/mentorship/mentor/${mentor.id}/book`}
                  className="w-full btn-primary mt-4"
                >
                  Book Now
                </Link>
              ) : (
                <Link 
                  href="/auth/signin"
                  className="w-full btn-primary mt-4"
                >
                  Sign In to Book
                </Link>
              )}
            </div>

            {/* Availability */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Weekdays</span>
                  <span className="text-sm text-gray-900">6 PM - 9 PM IST</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Weekends</span>
                  <span className="text-sm text-gray-900">10 AM - 6 PM IST</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Session Duration</span>
                  <span className="text-sm text-gray-900">60 minutes</span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
              <p className="text-gray-600 text-sm mb-4">
                Have questions? Send a message to this mentor.
              </p>
              <Link 
                href={`/mentorship/mentor/${mentor.id}/contact`}
                className="w-full btn-secondary"
              >
                Send Message
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
