


import Link from 'next/link'
import { 
  UserGroupIcon,
  ClockIcon,
  CurrencyRupeeIcon,
  StarIcon,
  MapPinIcon,
  CalendarIcon,
  AcademicCapIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

interface MentorshipProgram {
  id: string
  title: string
  description: string
  category: string
  duration: number
  price: number
  maxStudents: number
  currentStudents: number
  mentor: {
    id: string
    bio: string
    expertise: string
    experience: number
    hourlyRate: number
    rating: number
    totalSessions: number
    user: {
      id: string
      name: string
      avatar: string | null
    }
  }
  _count: {
    enrollments: number
    reviews: number
  }
}

async function getMentorshipPrograms() {
  // Mock data for now until we add real programs
  return [
    {
      id: '1',
      title: 'Web Development Mastery',
      description: 'Learn full-stack web development from scratch to advanced concepts',
      category: 'Technology',
      duration: 12,
      price: 15000,
      maxStudents: 20,
      currentStudents: 8,
      mentor: {
        id: '1',
        bio: 'Senior Full-Stack Developer with 8+ years of experience',
        expertise: '["JavaScript", "React", "Node.js", "Python"]',
        experience: 8,
        hourlyRate: 2000,
        rating: 4.8,
        totalSessions: 150,
        user: {
          id: '1',
          name: 'Sarah Johnson',
          avatar: '/api/placeholder/40/40'
        }
      },
      _count: {
        enrollments: 8
      }
    },
    {
      id: '2',
      title: 'Digital Marketing Strategy',
      description: 'Master digital marketing techniques and grow your business online',
      category: 'Marketing',
      duration: 8,
      price: 12000,
      maxStudents: 15,
      currentStudents: 12,
      mentor: {
        id: '2',
        bio: 'Digital Marketing Expert with proven track record',
        expertise: '["SEO", "Social Media", "Content Marketing", "Analytics"]',
        experience: 6,
        hourlyRate: 1800,
        rating: 4.9,
        totalSessions: 200,
        user: {
          id: '2',
          name: 'Mike Chen',
          avatar: '/api/placeholder/40/40'
        }
      },
      _count: {
        enrollments: 12
      }
    },
    {
      id: '3',
      title: 'UI/UX Design Fundamentals',
      description: 'Create beautiful and functional user interfaces',
      category: 'Design',
      duration: 10,
      price: 18000,
      maxStudents: 12,
      currentStudents: 6,
      mentor: {
        id: '3',
        bio: 'Creative Director with expertise in user-centered design',
        expertise: '["Figma", "Adobe XD", "Prototyping", "User Research"]',
        experience: 10,
        hourlyRate: 2500,
        rating: 4.7,
        totalSessions: 120,
        user: {
          id: '3',
          name: 'Emily Rodriguez',
          avatar: '/api/placeholder/40/40'
        }
      },
      _count: {
        enrollments: 6
      }
    }
  ]
}

export default async function MentorshipPage() {
  const session = await getServerSession(authOptions)
  const programs = await getMentorshipPrograms()

  const categories = [
    { name: 'Technology', icon: AcademicCapIcon, color: 'bg-blue-500' },
    { name: 'Business', icon: RocketLaunchIcon, color: 'bg-green-500' },
    { name: 'Design', icon: UserGroupIcon, color: 'bg-purple-500' },
    { name: 'Marketing', icon: StarIcon, color: 'bg-yellow-500' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Find Your Perfect Mentor
            </h1>
            <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
              Connect with industry experts and accelerate your career growth through personalized mentorship programs
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/mentorship/apply" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Become a Mentor
              </Link>
              <Link href="/mentorship/programs" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600">
                Browse Programs
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Categories</h2>
          <p className="text-gray-600">Find mentorship in your area of interest</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {categories.map((category) => (
            <div key={category.name} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 ${category.color} rounded-lg flex items-center justify-center mx-auto mb-4`}>
                <category.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">{category.name}</h3>
            </div>
          ))}
        </div>
      </div>

      {/* Featured Programs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Featured Mentorship Programs</h2>
            <p className="text-gray-600 mt-2">Handpicked programs from top mentors</p>
          </div>
          <Link href="/mentorship/programs" className="btn-primary">
            View All Programs
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs.slice(0, 6).map((program) => (
            <div key={program.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              {/* Program Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                                         <img 
                       src={program.mentor.user.avatar || '/api/placeholder/40/40'} 
                       alt={program.mentor.user.name}
                       className="w-10 h-10 rounded-full object-cover"
                     />
                     <div>
                       <h3 className="font-semibold text-gray-900">{program.mentor.user.name}</h3>
                       <p className="text-sm text-gray-600">{JSON.parse(program.mentor.expertise).join(', ')}</p>
                     </div>
                  </div>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-900 ml-1">
                      {program.mentor.rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {program.title}
                </h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {program.description}
                </p>

                {/* Program Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>{program.duration} weeks</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <UserGroupIcon className="h-4 w-4 mr-2" />
                    <span>{program.currentStudents}/{program.maxStudents} students</span>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary-600">
                    ₹{program.price.toLocaleString()}
                  </span>
                                     <span className="text-sm text-gray-500">
                     {program._count.enrollments} students
                   </span>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <Link 
                    href={`/mentorship/${program.id}`}
                    className="flex-1 btn-primary text-center"
                  >
                    View Details
                  </Link>
                  <Link 
                    href={`/mentorship/${program.id}/apply`}
                    className="flex-1 btn-secondary text-center"
                  >
                    Apply Now
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {programs.length === 0 && (
          <div className="text-center py-12">
            <UserGroupIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No mentorship programs available</h3>
            <p className="text-gray-600 mb-4">Check back soon for new programs or become a mentor yourself.</p>
            <Link href="/mentorship/apply" className="btn-primary">
              Become a Mentor
            </Link>
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">How Mentorship Works</h2>
            <p className="text-gray-600">Simple steps to start your mentorship journey</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Find Your Mentor</h3>
              <p className="text-gray-600">Browse through our curated list of industry experts and find the perfect mentor for your goals.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Apply & Connect</h3>
              <p className="text-gray-600">Submit your application and schedule your first session with your chosen mentor.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Grow Together</h3>
              <p className="text-gray-600">Attend regular sessions, get personalized guidance, and accelerate your career growth.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Accelerate Your Career?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of professionals who have transformed their careers through mentorship
            </p>
            <div className="flex justify-center space-x-4">
              <Link href="/mentorship/programs" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Browse Programs
              </Link>
              <Link href="/mentorship/apply" className="btn-secondary border-white text-white hover:bg-white hover:text-primary-600">
                Become a Mentor
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
