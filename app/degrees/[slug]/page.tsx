import { notFound } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  ClockIcon, 
  UserGroupIcon, 
  StarIcon, 
  MapPinIcon, 
  AcademicCapIcon,
  CheckCircleIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  BookOpenIcon,
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  TrophyIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'
import { getRoleDisplayName, getRoleColor } from '@/lib/utils'
import DegreeEnrollmentButton from '@/components/degrees/DegreeEnrollmentButton'

export const dynamic = 'force-dynamic'

async function getDegreeProgram(slug: string) {
  const program = await prisma.degreeProgram.findFirst({
    where: { 
      slug,
      status: 'PUBLISHED'
    },
    include: {
      instructor: {
        select: {
          id: true,
          name: true,
          avatar: true,
          bio: true
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
  return program
}

async function getRelatedPrograms(category: string, currentId: string) {
  const programs = await prisma.degreeProgram.findMany({
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
  return programs
}

export default async function DegreeProgramPage({ params }: { params: { slug: string } }) {
  const [session, program] = await Promise.all([
    getServerSession(authOptions),
    getDegreeProgram(params.slug)
  ])

  if (!program) {
    notFound()
  }

  const relatedPrograms = await getRelatedPrograms(program.category, program.id)

  const features = program.features ? JSON.parse(program.features) : []
  const requirements = program.requirements ? JSON.parse(program.requirements) : []
  const syllabus = program.syllabus ? JSON.parse(program.syllabus) : []
  
  // Safety checks for arrays
  const safeFeatures = Array.isArray(features) ? features : []
  const safeRequirements = Array.isArray(requirements) ? requirements : []
  const safeSyllabus = Array.isArray(syllabus) ? syllabus : []

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/degrees" className="hover:text-primary-600 flex items-center">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Degree Programs
            </Link>
            <span>/</span>
            <span className="text-gray-900">{program.title}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Program Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{program.title}</h1>
                  <p className="text-lg text-gray-600 mb-4">{program.institution}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {program.location}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {program.duration}
                    </div>
                    <div className="flex items-center">
                      <GlobeAltIcon className="h-4 w-4 mr-1" />
                      {program.format}
                    </div>
                    <div className="flex items-center">
                      <AcademicCapIcon className="h-4 w-4 mr-1" />
                      {program.level}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center">
                      <StarIcon className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{program.rating}</span>
                      <span className="text-gray-500 ml-1">({program._count.reviews} reviews)</span>
                    </div>
                    <div className="flex items-center">
                      <UserGroupIcon className="h-5 w-5 text-gray-400 mr-1" />
                      <span className="text-gray-600">{program.currentStudents} students enrolled</span>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    ₹{program.price.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-500">{program.currency}</div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed">{program.description}</p>
            </div>

            {/* Features */}
            {safeFeatures.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Program Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {safeFeatures.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum */}
            {safeSyllabus.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Curriculum</h2>
                <div className="space-y-3">
                  {safeSyllabus.map((semester: any, index: number) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Semester {semester.semester}</h3>
                      <ul className="space-y-1">
                        {(semester.subjects || []).map((course: string, courseIndex: number) => (
                          <li key={courseIndex} className="flex items-center text-gray-700">
                            <BookOpenIcon className="h-4 w-4 text-gray-400 mr-2" />
                            {course}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {safeRequirements.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Admission Requirements</h2>
                <ul className="space-y-2">
                  {safeRequirements.map((requirement: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700">{requirement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Instructor */}
            {program.instructor && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Program Director</h2>
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    {program.instructor.avatar ? (
                      <img 
                        src={program.instructor.avatar} 
                        alt={program.instructor.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{program.instructor.name}</h3>
                    {program.instructor.bio && (
                      <p className="text-gray-600 text-sm mt-1">{program.instructor.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Enrollment Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Enroll Now</h3>
              
              <div className="mb-4">
                <div className="text-3xl font-bold text-primary-600 mb-1">
                  ₹{program.price.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500 mb-4">{program.currency}</div>
              </div>

              <DegreeEnrollmentButton 
                programId={program.id}
                programTitle={program.title}
                price={program.price}
                isLoggedIn={!!session}
              />

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-gray-600">Available Seats:</span>
                  <span className="font-medium">
                    {program.maxStudents ? program.maxStudents - program.currentStudents : 'Unlimited'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Format:</span>
                  <span className="font-medium">{program.format}</span>
                </div>
              </div>
            </div>

            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{program.duration}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Level</span>
                  <span className="font-medium">{program.level}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Format</span>
                  <span className="font-medium">{program.format}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Location</span>
                  <span className="font-medium">{program.location}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center">
                    <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                    <span className="font-medium">{program.rating}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Accreditation */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <ShieldCheckIcon className="h-5 w-5 mr-2 text-green-600" />
                Accreditation
              </h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700">UGC Recognized</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700">AICTE Approved</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                  <span className="text-sm text-gray-700">International Recognition</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Programs */}
        {relatedPrograms && relatedPrograms.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Programs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPrograms.map((relatedProgram) => (
                <Link 
                  key={relatedProgram.id} 
                  href={`/degrees/${relatedProgram.slug}`}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{relatedProgram.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{relatedProgram.institution}</p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-primary-600 font-medium">₹{relatedProgram.price.toLocaleString()}</span>
                    <div className="flex items-center">
                      <StarIcon className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                      <span>{relatedProgram.rating}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
