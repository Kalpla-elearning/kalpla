import { redirect } from 'next/navigation'


import Link from 'next/link'
import { 
  CheckCircleIcon, 
  XCircleIcon,
  ArrowLeftIcon,
  PlayCircleIcon,
  UsersIcon,
  ClockIcon,
  DocumentIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline'

async function getCourse(courseId: string) {
  const { PrismaClient } = require('@prisma/client')
  const prisma = new PrismaClient()

  try {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        modules: {
          include: {
            contents: {
              orderBy: {
                order: 'asc',
              },
            },
          },
          orderBy: {
            order: 'asc',
          },
        },
        _count: {
          select: {
            modules: true,
            enrollments: true,
            reviews: true,
          },
        },
      },
    })

    return course
  } catch (error) {
    console.error('Error fetching course:', error)
    return null
  } finally {
    await prisma.$disconnect()
  }
}

export default async function CourseReviewPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  if (session.user?.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const course = await getCourse(params.id)

  if (!course) {
    redirect('/admin/courses')
  }

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <PlayCircleIcon className="h-4 w-4 text-blue-500" />
      case 'DOCUMENT':
        return <DocumentIcon className="h-4 w-4 text-green-500" />
      case 'QUIZ':
        return <QuestionMarkCircleIcon className="h-4 w-4 text-purple-500" />
      case 'ASSIGNMENT':
        return <DocumentIcon className="h-4 w-4 text-orange-500" />
      default:
        return <DocumentIcon className="h-4 w-4 text-gray-500" />
    }
  }

  const getContentTypeLabel = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return 'Video'
      case 'DOCUMENT':
        return 'Document'
      case 'QUIZ':
        return 'Quiz'
      case 'ASSIGNMENT':
        return 'Assignment'
      default:
        return type
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/courses"
              className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5 mr-2" />
              Back to Courses
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Review Course</h1>
              <p className="text-gray-600 mt-1">Evaluate course quality and content</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Course Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-start space-x-6">
                <div className="w-32 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                  {course.thumbnail ? (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <PlayCircleIcon className="h-12 w-8 text-gray-400" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h2>
                  {course.subtitle && (
                    <p className="text-gray-600 mb-3">{course.subtitle}</p>
                  )}
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <UsersIcon className="h-4 w-4 mr-1" />
                      <span>{course.instructor.name}</span>
                    </div>
                    <div className="flex items-center">
                      <PlayCircleIcon className="h-4 w-4 mr-1" />
                      <span>{course._count.modules} modules</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-gray-400">•</span>
                      <span>{course.category}</span>
                    </div>
                    {course.price > 0 && (
                      <div className="font-medium text-primary-600">
                        ₹{course.price}
                      </div>
                    )}
                  </div>

                  <div className="prose prose-sm max-w-none">
                    <div dangerouslySetInnerHTML={{ __html: course.description }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Course Curriculum */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Course Curriculum</h3>
                <p className="text-gray-600 mt-1">{course._count.modules} modules, {course.modules.reduce((total: number, module: any) => total + module.contents.length, 0)} lectures</p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {course.modules.map((module: any, moduleIndex: number) => (
                    <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-3">
                        Module {moduleIndex + 1}: {module.title}
                      </h4>
                      
                      {module.description && (
                        <p className="text-gray-600 text-sm mb-3">{module.description}</p>
                      )}

                      <div className="space-y-2">
                        {module.contents.map((content: any, contentIndex: number) => (
                          <div key={content.id} className="flex items-center space-x-3 text-sm">
                            <span className="text-gray-500 w-8">{contentIndex + 1}.</span>
                            {getContentTypeIcon(content.type)}
                            <span className="flex-1">{content.title}</span>
                            {content.duration > 0 && (
                              <span className="text-gray-500">
                                <ClockIcon className="h-3 w-3 inline mr-1" />
                                {content.duration}min
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* SEO & Marketing */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">SEO & Marketing</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SEO Title</label>
                  <p className="text-gray-900">{course.seoTitle || 'Not set'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
                  <p className="text-gray-900">{course.seoDescription || 'Not set'}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Keywords/Tags</label>
                  <p className="text-gray-900">{course.tags || 'Not set'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Review Panel */}
          <div className="space-y-6">
            {/* Course Status */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Status</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Status:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    <ClockIcon className="h-3 w-3 mr-1" />
                    PENDING REVIEW
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Created:</span>
                  <span className="text-sm text-gray-900">
                    {new Date(course.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Instructor:</span>
                  <span className="text-sm text-gray-900">{course.instructor.name}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Category:</span>
                  <span className="text-sm text-gray-900">{course.category}</span>
                </div>
              </div>
            </div>

            {/* Review Actions */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Review Decision</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Review Notes
                  </label>
                  <textarea
                    id="reviewNotes"
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Add your review notes and feedback..."
                  />
                </div>

                <div className="flex space-x-3">
                  <button
                    id="approveBtn"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                    Approve
                  </button>
                  <button
                    id="rejectBtn"
                    className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors duration-200"
                  >
                    <XCircleIcon className="h-4 w-4 mr-2" />
                    Reject
                  </button>
                </div>

                <div className="text-xs text-gray-500">
                  <p>• Approved courses will be published immediately</p>
                  <p>• Rejected courses will be returned to the instructor with feedback</p>
                </div>
              </div>
            </div>

            {/* Quality Checklist */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quality Checklist</h3>
              
              <div className="space-y-3">
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700">Content is original and not plagiarized</span>
                </label>
                
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700">Video/audio quality is acceptable</span>
                </label>
                
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700">Course structure is logical and well-organized</span>
                </label>
                
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700">Description is clear and accurate</span>
                </label>
                
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700">No inappropriate or banned content</span>
                </label>
                
                <label className="flex items-center">
                  <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
                  <span className="ml-2 text-sm text-gray-700">SEO optimization is adequate</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* JavaScript for review actions */}
      <script dangerouslySetInnerHTML={{
        __html: `
          document.getElementById('approveBtn').addEventListener('click', async () => {
            const notes = document.getElementById('reviewNotes').value;
            if (confirm('Are you sure you want to approve this course?')) {
              try {
                const response = await fetch('/api/courses/${course.id}/review', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'approve', notes })
                });
                
                if (response.ok) {
                  alert('Course approved successfully!');
                  window.location.href = '/admin/courses';
                } else {
                  alert('Failed to approve course');
                }
              } catch (error) {
                alert('Error approving course');
              }
            }
          });

          document.getElementById('rejectBtn').addEventListener('click', async () => {
            const notes = document.getElementById('reviewNotes').value;
            if (!notes.trim()) {
              alert('Please provide feedback notes for rejection');
              return;
            }
            
            if (confirm('Are you sure you want to reject this course?')) {
              try {
                const response = await fetch('/api/courses/${course.id}/review', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ action: 'reject', notes })
                });
                
                if (response.ok) {
                  alert('Course rejected successfully!');
                  window.location.href = '/admin/courses';
                } else {
                  alert('Failed to reject course');
                }
              } catch (error) {
                alert('Error rejecting course');
              }
            }
          });
        `
      }} />
    </div>
  )
}
