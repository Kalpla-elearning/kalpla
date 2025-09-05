import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { 
  UserGroupIcon,
  CalendarIcon,
  ClockIcon,
  StarIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const mentors = [
  {
    id: 1,
    name: 'Sarah Johnson',
    title: 'Serial Entrepreneur & VC',
    company: 'TechVentures Capital',
    experience: '15+ years',
    rating: 4.9,
    reviews: 127,
    specialties: ['Product Strategy', 'Fundraising', 'Scaling'],
    hourlyRate: 2000,
    availability: 'Available',
    nextAvailable: '2024-01-16T10:00:00Z',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    bio: 'Sarah has founded 3 successful startups and now invests in early-stage companies. She specializes in product-market fit and scaling strategies.',
    unlocked: true,
    sessionsCompleted: 3,
    totalSessions: 5
  },
  {
    id: 2,
    name: 'Mike Chen',
    title: 'CTO & Technical Co-founder',
    company: 'DataFlow Inc.',
    experience: '12+ years',
    rating: 4.8,
    reviews: 89,
    specialties: ['Technical Architecture', 'Team Building', 'Product Development'],
    hourlyRate: 1800,
    availability: 'Available',
    nextAvailable: '2024-01-17T14:00:00Z',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    bio: 'Mike is a technical co-founder with expertise in building scalable products. He has helped 50+ startups with their technical challenges.',
    unlocked: true,
    sessionsCompleted: 1,
    totalSessions: 3
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    title: 'Marketing Director',
    company: 'GrowthCo',
    experience: '10+ years',
    rating: 4.7,
    reviews: 156,
    specialties: ['Digital Marketing', 'Brand Strategy', 'Customer Acquisition'],
    hourlyRate: 1500,
    availability: 'Busy',
    nextAvailable: '2024-01-20T09:00:00Z',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    bio: 'Emily has led marketing for multiple unicorn startups and specializes in growth hacking and customer acquisition strategies.',
    unlocked: true,
    sessionsCompleted: 0,
    totalSessions: 2
  },
  {
    id: 4,
    name: 'David Kim',
    title: 'Legal Counsel',
    company: 'StartupLaw Partners',
    experience: '8+ years',
    rating: 4.9,
    reviews: 73,
    specialties: ['Legal Structure', 'IP Protection', 'Fundraising Legal'],
    hourlyRate: 2200,
    availability: 'Available',
    nextAvailable: '2024-01-18T11:00:00Z',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    bio: 'David specializes in startup legal matters including incorporation, IP protection, and fundraising documentation.',
    unlocked: false,
    sessionsCompleted: 0,
    totalSessions: 0
  }
]

const upcomingSessions = [
  {
    id: 1,
    mentor: 'Sarah Johnson',
    title: 'Product Strategy Review',
    date: '2024-01-16',
    time: '10:00 AM - 11:00 AM',
    type: 'video',
    status: 'confirmed',
    meetingLink: 'https://zoom.us/j/123456789'
  },
  {
    id: 2,
    mentor: 'Mike Chen',
    title: 'Technical Architecture Discussion',
    date: '2024-01-17',
    time: '2:00 PM - 3:00 PM',
    type: 'video',
    status: 'confirmed',
    meetingLink: 'https://zoom.us/j/987654321'
  }
]

const completedSessions = [
  {
    id: 1,
    mentor: 'Sarah Johnson',
    title: 'Business Model Review',
    date: '2024-01-10',
    duration: '60 minutes',
    rating: 5,
    feedback: 'Excellent session! Sarah provided great insights on our business model and helped us refine our value proposition.',
    actionItems: ['Update business model canvas', 'Research competitor pricing', 'Schedule follow-up session']
  },
  {
    id: 2,
    mentor: 'Mike Chen',
    title: 'Technical Feasibility Assessment',
    date: '2024-01-08',
    duration: '45 minutes',
    rating: 4,
    feedback: 'Mike helped us understand the technical requirements for our MVP and provided a clear roadmap.',
    actionItems: ['Create technical specification document', 'Research development tools', 'Estimate development timeline']
  }
]

export default async function MentorsPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return <div>Loading...</div>
  }

  const unlockedMentors = mentors.filter(m => m.unlocked)
  const lockedMentors = mentors.filter(m => !m.unlocked)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Mentors</h1>
        <p className="text-green-100">
          Connect with industry experts and get personalized guidance for your startup journey
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Available Mentors</p>
              <p className="text-2xl font-semibold text-gray-900">{unlockedMentors.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">{upcomingSessions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed Sessions</p>
              <p className="text-2xl font-semibold text-gray-900">{completedSessions.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <StarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-semibold text-gray-900">4.8</p>
            </div>
          </div>
        </div>
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Sessions</h2>
          <div className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <VideoCameraIcon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{session.title}</h3>
                      <p className="text-sm text-gray-600">with {session.mentor}</p>
                      <p className="text-sm text-gray-500">{session.date} at {session.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {session.status}
                    </span>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                      Join Meeting
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Mentors */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Available Mentors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {unlockedMentors.map((mentor) => (
            <div key={mentor.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={mentor.image}
                  alt={mentor.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                  <p className="text-sm text-gray-600">{mentor.title}</p>
                  <p className="text-sm text-gray-500">{mentor.company}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(mentor.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">{mentor.rating} ({mentor.reviews} reviews)</span>
                </div>
                <p className="text-sm text-gray-700 mb-3">{mentor.bio}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {mentor.specialties.map((specialty) => (
                    <span
                      key={specialty}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">₹{mentor.hourlyRate}</span>/hour
                </div>
                <div className="flex items-center space-x-1">
                  <div className={`w-2 h-2 rounded-full ${
                    mentor.availability === 'Available' ? 'bg-green-400' : 'bg-yellow-400'
                  }`}></div>
                  <span className="text-sm text-gray-600">{mentor.availability}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary-700">
                  Book Session
                </button>
                <button className="w-full border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
                  View Profile
                </button>
              </div>
              
              {mentor.sessionsCompleted > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Sessions: {mentor.sessionsCompleted}/{mentor.totalSessions}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{ width: `${(mentor.sessionsCompleted / mentor.totalSessions) * 100}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Locked Mentors */}
      {lockedMentors.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Locked Mentors</h2>
          <p className="text-sm text-gray-600 mb-4">
            Complete Phase 6 to unlock access to these mentors
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lockedMentors.map((mentor) => (
              <div key={mentor.id} className="border border-gray-200 rounded-lg p-6 opacity-60">
                <div className="flex items-center space-x-4 mb-4">
                  <img
                    src={mentor.image}
                    alt={mentor.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{mentor.name}</h3>
                    <p className="text-sm text-gray-600">{mentor.title}</p>
                    <p className="text-sm text-gray-500">{mentor.company}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(mentor.rating) ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{mentor.rating} ({mentor.reviews} reviews)</span>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{mentor.bio}</p>
                </div>
                
                <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-600 mb-1">Locked</div>
                    <div className="text-xs text-gray-500">Complete Phase 6 to unlock</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed Sessions */}
      {completedSessions.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Sessions</h2>
          <div className="space-y-4">
            {completedSessions.map((session) => (
              <div key={session.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{session.title}</h3>
                    <p className="text-sm text-gray-600">with {session.mentor}</p>
                    <p className="text-sm text-gray-500">{session.date} • {session.duration}</p>
                    <p className="text-sm text-gray-700 mt-2">{session.feedback}</p>
                    
                    {session.actionItems.length > 0 && (
                      <div className="mt-3">
                        <h4 className="text-sm font-medium text-gray-900 mb-1">Action Items:</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          {session.actionItems.map((item, index) => (
                            <li key={index} className="flex items-center">
                              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="ml-4 text-right">
                    <div className="flex items-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i < session.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <button className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
