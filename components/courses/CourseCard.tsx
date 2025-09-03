import Link from 'next/link'
import { 
  StarIcon,
  ClockIcon,
  UserIcon,
  AcademicCapIcon,
  PlayCircleIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

interface CourseCardProps {
  course: {
    id: string
    title: string
    slug?: string | null
    description?: string
    thumbnail?: string | null
    price: number
    category?: string | null
    instructor?: {
      name: string
      avatar?: string | null
    }
    modules?: Array<{
      contents?: Array<{
        id?: string
        title?: string
        description?: string | null
        type?: string
        url?: string | null
        duration?: number
      }>
    }>
    reviews?: Array<{
      rating: number
    }>
    _count?: {
      enrollments: number
      reviews: number
    }
  }
  variant?: 'default' | 'compact' | 'featured'
  showStats?: boolean
  showCategory?: boolean
  showInstructor?: boolean
  showPrice?: boolean
  showRating?: boolean
  showEnrollments?: boolean
  showDuration?: boolean
  showLessons?: boolean
}

export default function CourseCard({
  course,
  variant = 'default',
  showStats = true,
  showCategory = true,
  showInstructor = true,
  showPrice = true,
  showRating = true,
  showEnrollments = true,
  showDuration = true,
  showLessons = true
}: CourseCardProps) {
  // Calculate course statistics
  const totalLessons = course.modules?.reduce((sum, module) => sum + (module.contents?.length || 0), 0) || 0
  const totalDuration = course.modules?.reduce((sum, module) => 
    sum + (module.contents?.reduce((moduleSum, content) => moduleSum + (content.duration || 0), 0) || 0), 0
  ) || 0
  const avgRating = course.reviews && course.reviews.length > 0 
    ? course.reviews.reduce((acc, review) => acc + review.rating, 0) / course.reviews.length
    : 0

  // Determine card classes based on variant
  const getCardClasses = () => {
    const baseClasses = "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group"
    
    switch (variant) {
      case 'compact':
        return `${baseClasses} hover:scale-105`
      case 'featured':
        return `${baseClasses} hover:shadow-lg border-primary-200`
      default:
        return `${baseClasses} hover:shadow-lg`
    }
  }

  // Determine image classes based on variant
  const getImageClasses = () => {
    const baseClasses = "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
    
    switch (variant) {
      case 'compact':
        return `${baseClasses} aspect-square`
      case 'featured':
        return `${baseClasses} aspect-[16/9]`
      default:
        return `${baseClasses} aspect-[16/9]`
    }
  }

  // Determine content classes based on variant
  const getContentClasses = () => {
    switch (variant) {
      case 'compact':
        return "p-4"
      case 'featured':
        return "p-6"
      default:
        return "p-6"
    }
  }

  return (
    <Link href={`/courses/${course.slug || course.id}`} className="block">
      <div className={getCardClasses()}>
        {/* Course Image */}
        <div className="relative overflow-hidden">
          <div className={`${variant === 'compact' ? 'aspect-square' : 'aspect-[16/9]'} bg-gray-100 relative`}>
            {course.thumbnail ? (
              <img 
                src={course.thumbnail} 
                alt={course.title}
                className={getImageClasses()}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                <AcademicCapIcon className={`${variant === 'compact' ? 'h-8 w-8' : 'h-12 w-12'} text-primary-600`} />
              </div>
            )}
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
              <PlayCircleIcon className={`${variant === 'compact' ? 'h-8 w-8' : 'h-12 w-12'} text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
            </div>

            {/* Category Badge */}
            {showCategory && course.category && (
              <div className="absolute top-3 left-3">
                <span className="text-xs px-2 py-1 rounded-full font-medium bg-white/90 text-primary-700 backdrop-blur-sm">
                  {course.category}
                </span>
              </div>
            )}

            {/* Price Badge */}
            {showPrice && (
              <div className="absolute top-3 right-3">
                <span className="text-sm px-2 py-1 rounded-full font-semibold bg-primary-600 text-white">
                  {course.price === 0 ? 'Free' : `$${course.price}`}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className={getContentClasses()}>
          {/* Title */}
          <h3 className={`font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2 ${
            variant === 'compact' ? 'text-sm' : 'text-lg'
          }`}>
            {course.title}
          </h3>

          {/* Description */}
          {variant !== 'compact' && course.description && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {course.description}
            </p>
          )}

          {/* Instructor */}
          {showInstructor && course.instructor && (
            <div className="flex items-center gap-2 mb-4">
              <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-3 w-3 text-primary-600" />
              </div>
              <span className="text-sm text-gray-600">
                {course.instructor.name}
              </span>
            </div>
          )}

          {/* Course Stats */}
          {showStats && (
            <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
              {showDuration && (
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-4 w-4" />
                  <span>{Math.round(totalDuration / 60)}h {totalDuration % 60}m</span>
                </div>
              )}
              {showLessons && (
                <div className="flex items-center gap-1">
                  <PlayCircleIcon className="h-4 w-4" />
                  <span>{totalLessons} lessons</span>
                </div>
              )}
            </div>
          )}

          {/* Rating and Enrollments */}
          <div className="flex items-center justify-between">
            {showRating && (
              <div className="flex items-center gap-1">
                <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm font-medium">{avgRating.toFixed(1)}</span>
                <span className="text-sm text-gray-500">({course.reviews?.length || 0})</span>
              </div>
            )}
            {showEnrollments && (
              <div className="text-sm text-gray-500">
                                    {course._count?.enrollments || 0} students
              </div>
            )}
          </div>

          {/* Featured Badge */}
          {variant === 'featured' && (
            <div className="absolute top-0 left-0 bg-accent-500 text-white px-3 py-1 text-xs font-semibold rounded-br-lg">
              Featured
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}
