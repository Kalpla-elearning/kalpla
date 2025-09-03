import Link from 'next/link'
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import CourseCard from '@/components/courses/CourseCard'

const featuredCourses = [
  {
    id: '1',
    title: 'Complete Web Development Bootcamp',
    instructor: {
      name: 'Dr. Angela Yu'
    },
    price: 29.99,
    thumbnail: '/api/placeholder/300/200',
    category: 'Development',
    description: 'Learn web development from scratch with this comprehensive course covering HTML, CSS, JavaScript, and more.',
    modules: [
      {
        contents: [
          { duration: 1800 }, // 30 minutes
          { duration: 2700 }, // 45 minutes
          { duration: 3600 }  // 1 hour
        ]
      },
      {
        contents: [
          { duration: 2400 }, // 40 minutes
          { duration: 3000 }  // 50 minutes
        ]
      }
    ],
    reviews: [
      { rating: 5 },
      { rating: 4 },
      { rating: 5 },
      { rating: 4 },
      { rating: 5 }
    ],
    _count: {
      enrollments: 125000,
      reviews: 5
    }
  },
  {
    id: '2',
    title: 'Python for Data Science and Machine Learning',
    instructor: {
      name: 'Jose Portilla'
    },
    price: 24.99,
    thumbnail: '/api/placeholder/300/200',
    category: 'Data Science',
    description: 'Master Python programming for data science, machine learning, and artificial intelligence applications.',
    modules: [
      {
        contents: [
          { duration: 1800 }, // 30 minutes
          { duration: 2700 }  // 45 minutes
        ]
      }
    ],
    reviews: [
      { rating: 5 },
      { rating: 4 },
      { rating: 5 },
      { rating: 4 }
    ],
    _count: {
      enrollments: 89000,
      reviews: 4
    }
  },
  {
    id: '3',
    title: 'The Complete JavaScript Course 2024',
    instructor: {
      name: 'Jonas Schmedtmann'
    },
    price: 19.99,
    thumbnail: '/api/placeholder/300/200',
    category: 'Development',
    description: 'Learn JavaScript from scratch and build real-world projects with modern ES6+ features.',
    modules: [
      {
        contents: [
          { duration: 3600 }, // 1 hour
          { duration: 2700 }, // 45 minutes
          { duration: 1800 }  // 30 minutes
        ]
      }
    ],
    reviews: [
      { rating: 5 },
      { rating: 5 },
      { rating: 4 },
      { rating: 5 },
      { rating: 5 }
    ],
    _count: {
      enrollments: 156000,
      reviews: 5
    }
  },
  {
    id: '4',
    title: 'Digital Marketing Masterclass',
    instructor: {
      name: 'Phil Ebiner'
    },
    price: 34.99,
    thumbnail: '/api/placeholder/300/200',
    category: 'Marketing',
    description: 'Learn digital marketing strategies including SEO, social media, email marketing, and Google Ads.',
    modules: [
      {
        contents: [
          { duration: 1800 }, // 30 minutes
          { duration: 2400 }  // 40 minutes
        ]
      }
    ],
    reviews: [
      { rating: 4 },
      { rating: 5 },
      { rating: 4 },
      { rating: 4 }
    ],
    _count: {
      enrollments: 67000,
      reviews: 4
    }
  }
]

export function FeaturedCourses() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Featured Courses
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our most popular courses taught by industry experts. 
            Start your learning journey today with these handpicked selections.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/courses"
            className="btn-primary inline-flex items-center space-x-2 text-lg px-8 py-4"
          >
            <span>View All Courses</span>
            <ArrowRightIcon className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
