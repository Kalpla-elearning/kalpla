import Link from 'next/link'
import { ArrowRightIcon, ClockIcon, PlayCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const miniCourses = [
  {
    id: '1',
    title: 'Introduction to AI & Machine Learning',
    duration: '2 hours',
    lessons: 8,
    level: 'Beginner',
    price: 29,
    originalPrice: 49,
    rating: 4.8,
    students: 15000,
    description: 'Get started with AI and machine learning concepts in just 2 hours.',
    topics: ['AI Fundamentals', 'Machine Learning Basics', 'Neural Networks', 'Practical Applications']
  },
  {
    id: '2',
    title: 'Digital Marketing Essentials',
    duration: '3 hours',
    lessons: 12,
    level: 'Beginner',
    price: 39,
    originalPrice: 59,
    rating: 4.7,
    students: 12000,
    description: 'Master the fundamentals of digital marketing in a comprehensive 3-hour course.',
    topics: ['SEO Basics', 'Social Media Marketing', 'Email Marketing', 'Analytics']
  },
  {
    id: '3',
    title: 'Python for Beginners',
    duration: '4 hours',
    lessons: 15,
    level: 'Beginner',
    price: 49,
    originalPrice: 79,
    rating: 4.9,
    students: 25000,
    description: 'Learn Python programming from scratch with hands-on projects.',
    topics: ['Python Syntax', 'Data Types', 'Functions', 'Object-Oriented Programming']
  },
  {
    id: '4',
    title: 'UI/UX Design Fundamentals',
    duration: '2.5 hours',
    lessons: 10,
    level: 'Beginner',
    price: 35,
    originalPrice: 55,
    rating: 4.6,
    students: 8000,
    description: 'Learn the principles of user interface and user experience design.',
    topics: ['Design Principles', 'User Research', 'Wireframing', 'Prototyping']
  }
]

export function FeaturedMiniCourses() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Featured Mini-Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Quick, focused learning experiences designed to boost your skills in just a few hours. 
            Perfect for busy professionals who want to learn efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {miniCourses.map((course) => (
            <div key={course.id} className="card-hover group">
              <div className="p-6">
                {/* Course Image Placeholder */}
                <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg mb-4 flex items-center justify-center">
                  <PlayCircleIcon className="h-12 w-12 text-primary-600" />
                </div>

                {/* Course Info */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded font-medium">
                      {course.level}
                    </span>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {course.description}
                  </p>

                  {/* Topics */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-gray-700">What you'll learn:</h4>
                    <div className="flex flex-wrap gap-1">
                      {course.topics.slice(0, 2).map((topic, index) => (
                        <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {topic}
                        </span>
                      ))}
                      {course.topics.length > 2 && (
                        <span className="text-xs text-gray-500">
                          +{course.topics.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{course.lessons} lessons</span>
                    <span>{course.students.toLocaleString()} students</span>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center">
                    <div className="flex items-center mr-2">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i <= Math.floor(course.rating)
                              ? 'text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">{course.rating}</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-gray-900">${course.price}</span>
                      {course.originalPrice > course.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ${course.originalPrice}
                        </span>
                      )}
                    </div>
                    {course.originalPrice > course.price && (
                      <span className="bg-error-100 text-error-800 text-xs font-bold px-2 py-1 rounded">
                        {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  {/* CTA */}
                  <Link
                    href={`/mini-courses/${course.id}`}
                    className="btn-primary w-full text-center block text-sm"
                  >
                    Start Learning
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/mini-courses"
            className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
          >
            <span>View All Mini-Courses</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
