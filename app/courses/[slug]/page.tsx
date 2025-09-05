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
  ChatBubbleLeftRightIcon,
  CurrencyDollarIcon,
  TrophyIcon,
  ShieldCheckIcon,
  ArrowRightIcon,
  SparklesIcon,
  UserGroupIcon,
  LightBulbIcon,
  RocketLaunchIcon,
  ClockIcon as ClockIconSolid,
  GlobeAltIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'
import CourseEnrollmentButton from '@/components/courses/CourseEnrollmentButton'

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
        },
        take: 5
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
        take: 10
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

async function getRelatedCourses(category: string, currentId: string) {
  const courses = await prisma.course.findMany({
    where: {
      category,
      status: 'PUBLISHED',
      id: { not: currentId }
    },
    take: 3,
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
    }
  })
  return courses
}

export default async function CoursePage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug)

  if (!course) {
    notFound()
  }

  const relatedCourses = await getRelatedCourses(course.category, course.id)

  // Calculate total duration
  const totalDuration = course.modules.reduce((sum, module) =>
    sum + module.contents.reduce((contentSum, content) => contentSum + (content.duration || 0), 0), 0
  )

  // Calculate average rating
  const avgRating = course._count.reviews > 0
    ? course.reviews.reduce((sum, review) => sum + review.rating, 0) / course._count.reviews
    : 0

  // Format duration
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  // Course outcomes (you can customize these based on course data)
  const courseOutcomes = [
    "Master the fundamentals and advanced concepts",
    "Build real-world projects and applications",
    "Get hands-on experience with industry tools",
    "Receive a completion certificate",
    "Join a community of like-minded learners",
    "Access to lifetime course updates"
  ]

  // Who is this course for
  const targetAudience = [
    "Beginners looking to start their journey",
    "Professionals wanting to upskill",
    "Students seeking practical knowledge",
    "Anyone interested in this field"
  ]

  // FAQ data
  const faqs = [
    {
      question: "Is this course beginner-friendly?",
      answer: "Yes! This course is designed for complete beginners with no prior experience required."
    },
    {
      question: "Do I need any prerequisites?",
      answer: "No specific prerequisites are required. We start from the basics and build up gradually."
    },
    {
      question: "Will I get lifetime access?",
      answer: "Yes, once you enroll, you'll have lifetime access to all course materials and updates."
    },
    {
      question: "What if I don't like the course?",
      answer: "We offer a 30-day money-back guarantee if you're not satisfied with the course."
    },
    {
      question: "Can I learn at my own pace?",
      answer: "Absolutely! You can learn at your own pace and access the materials anytime."
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/courses" className="hover:text-primary-600 flex items-center">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              All Courses
            </Link>
            <span>/</span>
            <span className="text-gray-900">{course.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* 1. Hero Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{course.title}</h1>
                  <p className="text-xl text-gray-600 mb-6">{course.description}</p>
                  
                  {/* Course Stats */}
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {formatDuration(totalDuration)}
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {course.level}
                    </div>
                    <div className="flex items-center">
                      <BookOpenIcon className="h-4 w-4 mr-1" />
                      {course.modules.length} Modules
                    </div>
                    <div className="flex items-center">
                      <StarIconSolid className="h-4 w-4 text-yellow-400 mr-1" />
                      {avgRating.toFixed(1)} ({course._count.reviews} reviews)
                    </div>
                  </div>

                  {/* CTA Button */}
                  <div className="flex items-center space-x-4">
                    <CourseEnrollmentButton 
                      courseId={course.id}
                      courseTitle={course.title}
                      amount={course.price}
                      session={null}
                    />
                    <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                      <HeartIcon className="h-4 w-4 mr-2" />
                      Add to Wishlist
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. What You'll Learn (Outcomes) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <SparklesIcon className="h-6 w-6 text-primary-600 mr-2" />
                What You'll Learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-start">
                    <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Who is This Course For? */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <UserGroupIcon className="h-6 w-6 text-primary-600 mr-2" />
                Who is This Course For?
              </h2>
              <div className="space-y-3">
                {targetAudience.map((audience, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mr-3 mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700">{audience}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Course Structure (Modules/Timeline) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <BookOpenIcon className="h-6 w-6 text-primary-600 mr-2" />
                Course Structure
              </h2>
              <div className="space-y-4">
                {course.modules.map((module, index) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Module {index + 1}: {module.title}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {module.contents.length} lessons
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4">{module.description}</p>
                    <div className="space-y-2">
                      {module.contents.map((content, contentIndex) => (
                        <div key={content.id} className="flex items-center text-sm text-gray-600">
                          <PlayCircleIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span>{content.title}</span>
                          {content.duration && (
                            <span className="ml-auto text-gray-500">
                              {formatDuration(content.duration)}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Course Format */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <GlobeAltIcon className="h-6 w-6 text-primary-600 mr-2" />
                Course Format
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <ClockIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Duration</p>
                      <p className="text-gray-600">{formatDuration(totalDuration)}</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <VideoCameraIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Format</p>
                      <p className="text-gray-600">Self-paced online</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <TrophyIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Certification</p>
                      <p className="text-gray-600">Completion certificate</p>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Access</p>
                      <p className="text-gray-600">Lifetime access</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Instructor Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <AcademicCapIcon className="h-6 w-6 text-primary-600 mr-2" />
                Meet Your Instructor
              </h2>
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  {course.instructor.avatar ? (
                    <img
                      src={course.instructor.avatar}
                      alt={course.instructor.name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <UserIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {course.instructor.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{course.instructor.bio}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      {course.instructor.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 7. Student Success & Testimonials */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <TrophyIcon className="h-6 w-6 text-primary-600 mr-2" />
                Student Success Stories
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {course.reviews.slice(0, 4).map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center mb-4">
                      <div className="flex-shrink-0">
                        {review.user.avatar ? (
                          <img
                            src={review.user.avatar}
                            alt={review.user.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <UserIcon className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{review.user.name}</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIconSolid
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">{review.comment}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. Pricing & Enrollment Options */}
            <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-lg border border-primary-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <CurrencyDollarIcon className="h-6 w-6 text-primary-600 mr-2" />
                Pricing & Enrollment
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-baseline">
                    <span className="text-4xl font-bold text-gray-900">
                      ₹{course.price.toLocaleString()}
                    </span>
                    <span className="text-lg text-gray-500 ml-2">one-time</span>
                  </div>
                  <p className="text-gray-600 mt-2">Lifetime access • No recurring fees</p>
                </div>
                <div className="text-right">
                  <CourseEnrollmentButton 
                    courseId={course.id}
                    courseTitle={course.title}
                    amount={course.price}
                    session={null}
                  />
                  <p className="text-sm text-gray-500 mt-2">30-day money-back guarantee</p>
                </div>
              </div>
            </div>

            {/* 9. FAQ Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <QuestionMarkCircleIcon className="h-6 w-6 text-primary-600 mr-2" />
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 10. Closing Section (Motivational CTA) */}
            <div className="bg-gradient-to-r from-primary-600 to-blue-600 rounded-lg text-white p-8 text-center">
              <h2 className="text-3xl font-bold mb-4">
                Ready to Transform Your Skills?
              </h2>
              <p className="text-xl mb-6 opacity-90">
                Join thousands of students who have already started their journey with this course.
              </p>
              <div className="flex items-center justify-center space-x-4">
                <CourseEnrollmentButton 
                  courseId={course.id}
                  courseTitle={course.title}
                  amount={course.price}
                  session={null}
                />
                <div className="text-sm opacity-75">
                  <p>✓ 30-day money-back guarantee</p>
                  <p>✓ Lifetime access</p>
                  <p>✓ Certificate of completion</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Course Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 sticky top-8">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  ₹{course.price.toLocaleString()}
                </div>
                <p className="text-gray-600">One-time payment</p>
              </div>
              
              <CourseEnrollmentButton 
                courseId={course.id}
                courseTitle={course.title}
                amount={course.price}
                session={null}
              />
              
              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Duration</span>
                  <span>{formatDuration(totalDuration)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Level</span>
                  <span>{course.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Modules</span>
                  <span>{course.modules.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Students</span>
                  <span>{course._count.enrollments}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Rating</span>
                  <div className="flex items-center">
                    <StarIconSolid className="h-4 w-4 text-yellow-400 mr-1" />
                    <span>{avgRating.toFixed(1)}</span>
                  </div>
                </div>
              </div>
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
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-16 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <PlayCircleIcon className="h-6 w-6 text-gray-400" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                            {relatedCourse.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {relatedCourse.instructor.name}
                          </p>
                          <div className="flex items-center mt-1">
                            <StarIconSolid className="h-3 w-3 text-yellow-400 mr-1" />
                            <span className="text-xs text-gray-500">
                              {relatedCourse._count.reviews > 0 
                                ? (relatedCourse.reviews?.reduce((sum, r) => sum + r.rating, 0) / relatedCourse._count.reviews).toFixed(1)
                                : '0.0'
                              }
                            </span>
                            <span className="text-xs text-gray-500 ml-2">
                              ₹{relatedCourse.price.toLocaleString()}
                            </span>
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