import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  StarIcon,
  ClockIcon,
  UserIcon,
  AcademicCapIcon,
  PlayCircleIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  VideoCameraIcon,
  QuestionMarkCircleIcon,
  BookOpenIcon,
  ArrowLeftIcon,
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

export const dynamic = 'force-dynamic'

async function getCourse(slug: string) {
  const course = await prisma.course.findFirst({
    where: { 
      slug: slug,
      status: 'PUBLISHED'
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          bio: true
        }
      },
      modules: {
        include: {
          contents: {
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { order: 'asc' }
      },
      enrollments: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        }
      },
      reviews: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      },
      _count: {
        select: {
          enrollments: true,
          reviews: true
        }
      }
    }
  })
  return course
}

async function getRelatedCourses(courseId: string, category: string) {
  const courses = await prisma.course.findMany({
    where: {
      id: { not: courseId },
      category: category,
      status: 'PUBLISHED'
    },
    include: {
      instructor: {
        select: {
          name: true
        }
      },
      _count: {
        select: {
          enrollments: true,
          reviews: true
        }
      }
    },
    take: 3,
    orderBy: { createdAt: 'desc' }
  })
  return courses
}

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug)
  
  if (!course) {
    notFound()
  }

  const relatedCourses = await getRelatedCourses(course.id, course.category || '')

  // Calculate course statistics
  const totalLessons = course.modules.reduce((sum, module) => sum + module.contents.length, 0)
  const avgRating = course.reviews.length > 0 
    ? course.reviews.reduce((acc, review) => acc + review.rating, 0) / course.reviews.length
    : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link 
            href="/courses" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Courses
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
              {/* Course Image */}
              <div className="aspect-[16/9] bg-gray-100 relative">
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                    <AcademicCapIcon className="h-16 w-16 text-primary-600" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
                  <PlayCircleIcon className="h-16 w-16 text-white" />
                </div>
              </div>

              <div className="p-6">
                {/* Category */}
                {course.category && (
                  <div className="mb-4">
                    <span className="text-sm px-3 py-1 rounded-full font-medium bg-primary-100 text-primary-700">
                      {course.category}
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  {course.title}
                </h1>

                {/* Description */}
                <p className="text-gray-600 text-lg mb-6">
                  {course.description}
                </p>

                {/* Course Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <ClockIcon className="h-5 w-5 text-gray-400 mr-2" />
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      Self-paced
                    </div>
                    <div className="text-sm text-gray-500">Duration</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <PlayCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
                    </div>
                    <div className="text-lg font-semibold text-gray-900">{totalLessons}</div>
                    <div className="text-sm text-gray-500">Lessons</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <StarIcon className="h-5 w-5 text-yellow-400 fill-current mr-2" />
                    </div>
                    <div className="text-lg font-semibold text-gray-900">{avgRating.toFixed(1)}</div>
                    <div className="text-sm text-gray-500">Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-2" />
                    </div>
                    <div className="text-lg font-semibold text-gray-900">{course._count.enrollments}</div>
                    <div className="text-sm text-gray-500">Students</div>
                  </div>
                </div>

                {/* Instructor */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <UserIcon className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{course.instructor.name}</div>
                    <div className="text-sm text-gray-600">Course Instructor</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">Course Curriculum</h2>
                <p className="text-gray-600 mt-2">
                  {course.modules.length} modules • {totalLessons} lessons • Self-paced
                </p>
              </div>
              <div className="divide-y divide-gray-200">
                {course.modules.map((module, moduleIndex) => (
                  <div key={module.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">
                        Module {moduleIndex + 1}: {module.title}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {module.contents.length} lessons
                      </span>
                    </div>
                    {module.description && (
                      <p className="text-gray-600 mb-4">{module.description}</p>
                    )}
                    <div className="space-y-3">
                      {module.contents.map((content, contentIndex) => (
                        <div key={content.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            {content.type === 'VIDEO' && <VideoCameraIcon className="h-5 w-5 text-red-500" />}
                            {content.type === 'PDF' && <DocumentTextIcon className="h-5 w-5 text-blue-500" />}
                            {content.type === 'QUIZ' && <QuestionMarkCircleIcon className="h-5 w-5 text-purple-500" />}
                            {content.type === 'TEXT' && <BookOpenIcon className="h-5 w-5 text-green-500" />}
                          </div>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {contentIndex + 1}. {content.title}
                            </div>
                            {content.description && (
                              <div className="text-sm text-gray-600">{content.description}</div>
                            )}
                          </div>
                          <div className="flex-shrink-0 text-sm text-gray-500">
                            N/A
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">Student Reviews</h2>
                  <div className="flex items-center gap-2">
                    <StarIcon className="h-5 w-5 text-yellow-400 fill-current" />
                    <span className="font-semibold">{avgRating.toFixed(1)}</span>
                    <span className="text-gray-500">({course.reviews.length} reviews)</span>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {course.reviews.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No reviews yet. Be the first to review this course!
                  </div>
                ) : (
                  course.reviews.map((review) => (
                    <div key={review.id} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <UserIcon className="h-5 w-5 text-primary-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="font-medium text-gray-900">{review.user.name}</div>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <StarIcon
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= review.rating
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {review.comment && (
                            <p className="text-gray-600">{review.comment}</p>
                          )}
                          <div className="text-sm text-gray-500 mt-2">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Enrollment Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 sticky top-8">
              <div className="text-3xl font-bold text-primary-600 mb-4">
                {course.price === 0 ? 'Free' : `$${course.price}`}
              </div>
              
              <button className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors mb-4">
                Enroll Now
              </button>
              
              <div className="text-sm text-gray-600 mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>Full lifetime access</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>Access on mobile and TV</span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500" />
                  <span>30-Day money-back guarantee</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-sm text-gray-500">This course includes:</div>
                <div className="text-lg font-semibold text-gray-900">{totalLessons} lessons</div>
                <div className="text-sm text-gray-500">
                  Self-paced content
                </div>
              </div>
            </div>

            {/* Instructor Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Instructor</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <UserIcon className="h-8 w-8 text-primary-600" />
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{course.instructor.name}</div>
                  <div className="text-sm text-gray-600">Course Instructor</div>
                </div>
              </div>
              {course.instructor.bio && (
                <p className="text-gray-600 text-sm">{course.instructor.bio}</p>
              )}
            </div>

            {/* Related Courses */}
            {relatedCourses.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Related Courses</h3>
                <div className="space-y-4">
                  {relatedCourses.map((relatedCourse) => (
                    <Link
                      key={relatedCourse.id}
                      href={`/courses/${relatedCourse.slug}`}
                      className="block group"
                    >
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <AcademicCapIcon className="h-6 w-6 text-gray-400" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                            {relatedCourse.title}
                          </div>
                          <div className="text-sm text-gray-600">
                            {relatedCourse.instructor.name}
                          </div>
                          <div className="text-sm font-semibold text-primary-600">
                            {relatedCourse.price === 0 ? 'Free' : `$${relatedCourse.price}`}
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
