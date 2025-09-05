import Link from 'next/link'
import { ArrowRightIcon, AcademicCapIcon, ClockIcon, TrophyIcon } from '@heroicons/react/24/outline'
import { StarIcon } from '@heroicons/react/24/solid'

const degreePrograms = [
  {
    id: '1',
    title: 'Master of Science in Computer Science',
    university: 'Stanford University',
    duration: '24 months',
    format: 'Online',
    price: 45000,
    originalPrice: 65000,
    rating: 4.9,
    students: 1200,
    description: 'Advanced computer science program covering AI, machine learning, and software engineering.',
    features: ['Industry Mentorship', 'Capstone Project', 'Career Support', 'Flexible Schedule']
  },
  {
    id: '2',
    title: 'Master of Business Administration (MBA)',
    university: 'Harvard Business School',
    duration: '18 months',
    format: 'Hybrid',
    price: 55000,
    originalPrice: 75000,
    rating: 4.8,
    students: 800,
    description: 'Comprehensive MBA program designed for working professionals and entrepreneurs.',
    features: ['Executive Coaching', 'Global Immersion', 'Networking Events', 'Startup Incubator']
  },
  {
    id: '3',
    title: 'Master of Data Science',
    university: 'MIT',
    duration: '20 months',
    format: 'Online',
    price: 40000,
    originalPrice: 60000,
    rating: 4.9,
    students: 1500,
    description: 'Cutting-edge data science program with focus on AI, machine learning, and big data.',
    features: ['Real-world Projects', 'Industry Partnerships', 'Research Opportunities', 'Job Placement']
  }
]

export function FeaturedDegreePrograms() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Featured Degree Programs
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Earn industry-recognized degrees from top universities. 
            Advance your career with our comprehensive accredited programs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {degreePrograms.map((program) => (
            <div key={program.id} className="card-hover group">
              <div className="p-8">
                {/* Header */}
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-primary-100 rounded-full mr-4">
                    <AcademicCapIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                      {program.title}
                    </h3>
                    <p className="text-primary-600 font-medium">{program.university}</p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 mb-6">{program.description}</p>

                {/* Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Program Features:</h4>
                  <ul className="space-y-2">
                    {program.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <div className="w-2 h-2 bg-primary-500 rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <ClockIcon className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{program.duration}</span>
                    </div>
                    <p className="text-xs text-gray-500">Duration</p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center mb-1">
                      <TrophyIcon className="h-4 w-4 text-gray-500 mr-1" />
                      <span className="text-sm font-medium text-gray-900">{program.format}</span>
                    </div>
                    <p className="text-xs text-gray-500">Format</p>
                  </div>
                </div>

                {/* Rating and Students */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center">
                    <div className="flex items-center mr-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${
                            i <= Math.floor(program.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{program.rating}</span>
                  </div>
                  <span className="text-sm text-gray-600">{program.students.toLocaleString()} students</span>
                </div>

                {/* Price */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-2xl font-bold text-gray-900">₹{program.price.toLocaleString()}</span>
                    {program.originalPrice > program.price && (
                      <span className="text-lg text-gray-500 line-through ml-2">
                        ₹{program.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                  {program.originalPrice > program.price && (
                    <span className="bg-error-100 text-error-800 text-xs font-bold px-2 py-1 rounded">
                      {Math.round(((program.originalPrice - program.price) / program.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>

                {/* CTA */}
                <Link
                  href={`/degrees/${program.id}`}
                  className="btn-primary w-full text-center block"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/degrees"
            className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
          >
            <span>View All Degree Programs</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
