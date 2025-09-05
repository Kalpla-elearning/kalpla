
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CourseCard from '@/components/courses/CourseCard'
import { MagnifyingGlassIcon, FunnelIcon, AdjustmentsHorizontalIcon, StarIcon, ClockIcon, UserIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

async function getCoursesByCategory(categorySlug: string, searchParams: any) {
  const { price, sort } = searchParams
  
  // Build where clause
  const where: any = {
    status: 'PUBLISHED',
    category: categorySlug
  }

  if (price) {
    const [minPrice, maxPrice] = price.split('-').map(Number)
    if (maxPrice) {
      where.price = { gte: minPrice, lte: maxPrice }
    } else {
      where.price = { gte: minPrice }
    }
  }

  // Build orderBy clause
  let orderBy: any = { createdAt: 'desc' }
  if (sort) {
    switch (sort) {
      case 'newest':
        orderBy = { createdAt: 'desc' }
        break
      case 'oldest':
        orderBy = { createdAt: 'asc' }
        break
      case 'price-low':
        orderBy = { price: 'asc' }
        break
      case 'price-high':
        orderBy = { price: 'desc' }
        break
      case 'popular':
        orderBy = { enrollments: { _count: 'desc' } }
        break
    }
  }

  const courses = await prisma.course.findMany({
    where,
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          avatar: true
        }
      },
      _count: {
        select: {
          enrollments: true,
          reviews: true
        }
      }
    },
    orderBy
  })

  return courses
}

async function getCategories() {
  // Get unique categories from courses
  const courses = await prisma.course.findMany({
    where: { status: 'PUBLISHED' },
    select: { category: true }
  })
  
  const categories = courses
    .map(course => course.category)
    .filter(Boolean)
    .filter((category, index, arr) => arr.indexOf(category) === index)
    .map(category => ({
      name: category,
      slug: category?.toLowerCase().replace(/\s+/g, '-'),
      count: courses.filter(c => c.category === category).length
    }))

  return categories
}

async function getPriceRanges() {
  const courses = await prisma.course.findMany({
    where: { status: 'PUBLISHED' },
    select: { price: true }
  })
  
  const prices = courses.map(c => c.price).filter(Boolean)
  if (prices.length === 0) return []
  
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  
  return [
    { range: '0-1000', count: prices.filter(p => p <= 1000).length },
    { range: '1000-5000', count: prices.filter(p => p > 1000 && p <= 5000).length },
    { range: '5000-10000', count: prices.filter(p => p > 5000 && p <= 10000).length },
    { range: '10000+', count: prices.filter(p => p > 10000).length }
  ]
}

export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }; 
  searchParams: { 
    price?: string; 
    sort?: string; 
  } 
}) {
  const [courses, categories, priceRanges] = await Promise.all([
    getCoursesByCategory(params.slug, searchParams),
    getCategories(),
    getPriceRanges()
  ])

  const category = categories.find(c => c.slug === params.slug)
  if (!category) {
    notFound()
  }

  const totalCourses = courses.length

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">
              {category.name} Courses
            </h1>
            <p className="text-xl text-primary-100 mb-6">
              Discover the best {category.name.toLowerCase()} courses from expert instructors
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm">
              <span className="flex items-center">
                <AcademicCapIcon className="h-5 w-5 mr-2" />
                {totalCourses} courses available
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <FunnelIcon className="h-5 w-5 mr-2" />
                  Filters
                </h3>
                <Link
                  href={`/courses/category/${params.slug}`}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Clear all
                </Link>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Categories</h4>
                <div className="space-y-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/courses/category/${cat.slug}`}
                      className={`flex items-center justify-between text-sm ${
                        cat.slug === params.slug
                          ? 'text-primary-600 font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-gray-400">({cat.count})</span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Price</h4>
                <div className="space-y-2">
                  {priceRanges.map((range) => (
                    <Link
                      key={range.range}
                      href={`/courses/category/${params.slug}?price=${range.range}`}
                      className={`flex items-center justify-between text-sm ${
                        searchParams.price === range.range
                          ? 'text-primary-600 font-medium'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <span>₹{range.range}</span>
                      <span className="text-gray-400">({range.count})</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and Results */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {totalCourses} course{totalCourses !== 1 ? 's' : ''} found
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <AdjustmentsHorizontalIcon className="h-5 w-5 text-gray-400" />
                <select
                  value={searchParams.sort || 'newest'}
                  onChange={(e) => {
                    const url = new URL(window.location.href)
                    url.searchParams.set('sort', e.target.value)
                    window.location.href = url.toString()
                  }}
                  className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>

            {/* Course Grid */}
            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No courses found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or browse all courses
                </p>
                <Link
                  href="/courses"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                >
                  Browse All Courses
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
