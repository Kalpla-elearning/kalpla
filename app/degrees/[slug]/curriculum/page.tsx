import { notFound } from 'next/navigation'

import Link from 'next/link'
import { 
  ArrowLeftIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon,
  UserIcon,
  CheckCircleIcon,
  StarIcon,
  CalendarIcon,
  MapPinIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  TrophyIcon,
  LightBulbIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'



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
      }
    }
  })
  return program
}

export default async function CurriculumPage({ params }: { params: { slug: string } }) {
  const program = await getDegreeProgram(params.slug)

  if (!program) {
    notFound()
  }

  const syllabus = program.syllabus ? JSON.parse(program.syllabus) : []
  const features = program.features ? JSON.parse(program.features) : []
  const requirements = program.requirements ? JSON.parse(program.requirements) : []

  // Calculate total credits and duration
  const totalCredits = syllabus.reduce((total: number, semester: any) => {
    return total + (semester.credits || semester.courses.length * 3)
  }, 0)

  const totalDuration = syllabus.length * 6 // Assuming 6 months per semester

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
            <Link href={`/degrees/${params.slug}`} className="hover:text-primary-600">
              {program.title}
            </Link>
            <span>/</span>
            <span className="text-gray-900">Curriculum</span>
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

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <StarIcon className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                      <span className="font-medium">{program.rating}</span>
                    </div>
                    <div className="flex items-center">
                      <UserIcon className="h-5 w-5 text-gray-400 mr-1" />
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

            {/* Program Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Program Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-primary-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <AcademicCapIcon className="h-8 w-8 text-primary-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Total Credits</h3>
                  <p className="text-2xl font-bold text-primary-600">{totalCredits}</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <CalendarIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Duration</h3>
                  <p className="text-2xl font-bold text-green-600">{totalDuration} months</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <BookOpenIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Semesters</h3>
                  <p className="text-2xl font-bold text-blue-600">{syllabus.length}</p>
                </div>
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <LightBulbIcon className="h-6 w-6 mr-2 text-yellow-500" />
                Learning Outcomes
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Technical Skills</h3>
                    <p className="text-gray-600 text-sm">Develop advanced technical skills and expertise in your chosen field</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Critical Thinking</h3>
                    <p className="text-gray-600 text-sm">Enhance analytical and problem-solving abilities</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Leadership</h3>
                    <p className="text-gray-600 text-sm">Build leadership and management capabilities</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Research Skills</h3>
                    <p className="text-gray-600 text-sm">Develop research methodology and academic writing skills</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum Structure */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Curriculum Structure</h2>
              <div className="space-y-6">
                {syllabus.map((semester: any, index: number) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Semester {semester.semester}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span className="flex items-center">
                          <ClockIcon className="h-4 w-4 mr-1" />
                          {semester.duration || '6 months'}
                        </span>
                        <span className="flex items-center">
                          <BookOpenIcon className="h-4 w-4 mr-1" />
                          {semester.credits || semester.courses.length * 3} credits
                        </span>
                      </div>
                    </div>

                    {semester.description && (
                      <p className="text-gray-600 mb-4">{semester.description}</p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {semester.courses.map((course: any, courseIndex: number) => (
                        <div key={courseIndex} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{course.name || course}</h4>
                            <span className="text-sm text-gray-500">
                              {course.credits || 3} credits
                            </span>
                          </div>
                          {course.description && (
                            <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                          )}
                          {course.instructor && (
                            <p className="text-xs text-gray-500">Instructor: {course.instructor}</p>
                          )}
                        </div>
                      ))}
                    </div>

                    {semester.learningObjectives && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h4 className="font-medium text-gray-900 mb-2">Learning Objectives</h4>
                        <ul className="space-y-1">
                          {semester.learningObjectives.map((objective: string, objIndex: number) => (
                            <li key={objIndex} className="flex items-start text-sm text-gray-600">
                              <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                              {objective}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Assessment Methods */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Assessment Methods</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold">30%</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Assignments & Projects</h3>
                    <p className="text-gray-600 text-sm">Regular assignments, case studies, and practical projects</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <span className="text-green-600 font-semibold">40%</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Examinations</h3>
                    <p className="text-gray-600 text-sm">Mid-term and final examinations</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-semibold">20%</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Participation</h3>
                    <p className="text-gray-600 text-sm">Class participation and discussions</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-orange-100 rounded-full w-10 h-10 flex items-center justify-center mr-3">
                    <span className="text-orange-600 font-semibold">10%</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Research</h3>
                    <p className="text-gray-600 text-sm">Research papers and presentations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/degrees/${params.slug}/apply`}
                  className="w-full btn-primary text-center"
                >
                  Apply Now
                </Link>
                <Link
                  href={`/degrees/${params.slug}`}
                  className="w-full btn-secondary text-center"
                >
                  View Program Details
                </Link>
                <Link
                  href="/degrees"
                  className="w-full btn-outline text-center"
                >
                  Browse All Programs
                </Link>
              </div>
            </div>

            {/* Program Features */}
            {features.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Features</h3>
                <div className="space-y-3">
                  {features.map((feature: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Admission Requirements */}
            {requirements.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admission Requirements</h3>
                <div className="space-y-3">
                  {requirements.map((requirement: string, index: number) => (
                    <div key={index} className="flex items-start">
                      <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                      <span className="text-gray-700 text-sm">{requirement}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Program Director */}
            {program.instructor && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Program Director</h3>
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                    {program.instructor.avatar ? (
                      <img 
                        src={program.instructor.avatar} 
                        alt={program.instructor.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{program.instructor.name}</h4>
                    {program.instructor.bio && (
                      <p className="text-sm text-gray-600 mt-1">{program.instructor.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Career Prospects */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              <TrophyIcon className="h-6 w-6 mr-2 text-yellow-500" />
              Career Prospects
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <ChartBarIcon className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">High Demand</h3>
                <p className="text-gray-600 text-sm">Graduates are in high demand across industries</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <TrophyIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Career Growth</h3>
                <p className="text-gray-600 text-sm">Excellent opportunities for career advancement</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                  <GlobeAltIcon className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">Global Opportunities</h3>
                <p className="text-gray-600 text-sm">Work opportunities worldwide</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
