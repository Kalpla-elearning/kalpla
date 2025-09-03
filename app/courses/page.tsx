import { prisma } from '@/lib/prisma'
import CourseCard from '@/components/courses/CourseCard'
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

async function getCourses() {
  const courses = await prisma.course.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      },
      modules: {
        include: {
          contents: true
        }
      },
      enrollments: true,
      reviews: true,
      _count: {
        select: {
          enrollments: true,
          reviews: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  return courses
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      color: true
    }
  })
  return categories
}

export default async function CoursesPage() {
  const [courses, categories] = await Promise.all([
    getCourses(),
    getCategories()
  ])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Explore Our Courses
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Discover a world of knowledge with our comprehensive collection of courses designed to help you grow and succeed.
            </p>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search courses..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                <FunnelIcon className="h-4 w-4" />
                Filters
              </button>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent">
                <option value="">Sort by</option>
                <option value="newest">Newest</option>
                <option value="popular">Most Popular</option>
                <option value="rating">Highest Rated</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">{courses.length}</div>
                <div className="text-sm text-gray-600">Total Courses</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {courses.reduce((sum, course) => sum + course._count.enrollments, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Enrollments</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {courses.reduce((sum, course) => sum + course._count.reviews, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Reviews</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary-600">
                  {courses.reduce((sum, course) => {
                    const avgRating = course.reviews.length > 0 
                      ? course.reviews.reduce((acc, review) => acc + review.rating, 0) / course.reviews.length
                      : 0
                    return sum + avgRating
                  }, 0).toFixed(1)}
                </div>
                <div className="text-sm text-gray-600">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Courses */}
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <AcademicCapIcon className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No courses available</h3>
            <p className="text-gray-600">Check back soon for new courses!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                variant="default"
                showStats={true}
                showCategory={true}
                showInstructor={true}
                showPrice={true}
                showRating={true}
                showEnrollments={true}
                showDuration={true}
                showLessons={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
