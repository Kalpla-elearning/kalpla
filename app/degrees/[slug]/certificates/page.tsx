import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  AcademicCapIcon,
  ShieldCheckIcon,
  TrophyIcon,
  StarIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  BookOpenIcon,
  LightBulbIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

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
      }
    }
  })
  return program
}

export default async function CertificatesPage({ params }: { params: { slug: string } }) {
  const program = await getDegreeProgram(params.slug)

  if (!program) {
    notFound()
  }

  const features = program.features ? JSON.parse(program.features) : []

  // Mock accreditation data - in a real app, this would come from the database
  const accreditations = [
    {
      name: "University Grants Commission (UGC)",
      type: "Government Recognition",
      status: "Recognized",
      validUntil: "2025",
      description: "Official recognition by the Government of India's higher education regulatory body",
      logo: "/api/placeholder/80/80"
    },
    {
      name: "All India Council for Technical Education (AICTE)",
      type: "Technical Education",
      status: "Approved",
      validUntil: "2025",
      description: "Approval for technical education programs by the national technical education body",
      logo: "/api/placeholder/80/80"
    },
    {
      name: "National Assessment and Accreditation Council (NAAC)",
      type: "Quality Assurance",
      status: "A+ Grade",
      validUntil: "2024",
      description: "Highest grade accreditation for quality assurance in higher education",
      logo: "/api/placeholder/80/80"
    },
    {
      name: "International Association of Universities (IAU)",
      type: "International Recognition",
      status: "Member",
      validUntil: "Ongoing",
      description: "International recognition and membership in the global university network",
      logo: "/api/placeholder/80/80"
    }
  ]

  const certifications = [
    {
      name: "ISO 9001:2015",
      type: "Quality Management",
      status: "Certified",
      validUntil: "2024",
      description: "International standard for quality management systems",
      logo: "/api/placeholder/80/80"
    },
    {
      name: "ISO 21001:2018",
      type: "Educational Organizations",
      status: "Certified",
      validUntil: "2024",
      description: "Management system standard for educational organizations",
      logo: "/api/placeholder/80/80"
    }
  ]

  const recognitions = [
    {
      title: "Top 50 Universities in India",
      organization: "National Institutional Ranking Framework (NIRF)",
      year: "2023",
      category: "Overall Ranking",
      rank: "47"
    },
    {
      title: "Excellence in Technical Education",
      organization: "Confederation of Indian Industry (CII)",
      year: "2023",
      category: "Industry Recognition",
      rank: "Award Winner"
    },
    {
      title: "Best Online Learning Platform",
      organization: "Digital Learning Awards",
      year: "2023",
      category: "E-Learning",
      rank: "1st Place"
    }
  ]

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
            <span className="text-gray-900">Certificates & Accreditation</span>
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

            {/* Accreditation Overview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <ShieldCheckIcon className="h-6 w-6 mr-2 text-green-600" />
                Accreditation Overview
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <ShieldCheckIcon className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">Government Recognized</h3>
                  <p className="text-gray-600 text-sm">UGC & AICTE approved</p>
                </div>
                <div className="text-center">
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <TrophyIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">NAAC A+ Grade</h3>
                  <p className="text-gray-600 text-sm">Highest quality rating</p>
                </div>
                <div className="text-center">
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                    <GlobeAltIcon className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">International Recognition</h3>
                  <p className="text-gray-600 text-sm">IAU member institution</p>
                </div>
              </div>
            </div>

            {/* Government Accreditations */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Government Accreditations</h2>
              <div className="space-y-6">
                {accreditations.map((accreditation, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <img 
                        src={accreditation.logo} 
                        alt={accreditation.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{accreditation.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          accreditation.status === 'Recognized' || accreditation.status === 'Approved' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {accreditation.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{accreditation.type}</p>
                      <p className="text-gray-700 mb-2">{accreditation.description}</p>
                      <p className="text-xs text-gray-500">Valid until: {accreditation.validUntil}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality Certifications */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Quality Certifications</h2>
              <div className="space-y-6">
                {certifications.map((certification, index) => (
                  <div key={index} className="flex items-start space-x-4 p-4 border border-gray-200 rounded-lg">
                    <div className="flex-shrink-0">
                      <img 
                        src={certification.logo} 
                        alt={certification.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{certification.name}</h3>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                          {certification.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{certification.type}</p>
                      <p className="text-gray-700 mb-2">{certification.description}</p>
                      <p className="text-xs text-gray-500">Valid until: {certification.validUntil}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Awards & Recognitions */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                <TrophyIcon className="h-6 w-6 mr-2 text-yellow-500" />
                Awards & Recognitions
              </h2>
              <div className="space-y-4">
                {recognitions.map((recognition, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">{recognition.title}</h3>
                      <p className="text-sm text-gray-600">{recognition.organization} • {recognition.year}</p>
                      <p className="text-xs text-gray-500">{recognition.category}</p>
                    </div>
                    <div className="text-right">
                      <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                        {recognition.rank}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Degree Recognition */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Degree Recognition</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Government Employment</h3>
                    <p className="text-gray-600 text-sm">Recognized for government job applications</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Higher Education</h3>
                    <p className="text-gray-600 text-sm">Valid for pursuing further studies</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Private Sector</h3>
                    <p className="text-gray-600 text-sm">Accepted by all major private companies</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircleIcon className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">International Recognition</h3>
                    <p className="text-gray-600 text-sm">Recognized globally for employment</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quality Assurance */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quality Assurance</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold text-sm">1</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Regular Quality Audits</h3>
                    <p className="text-gray-600 text-sm">Annual quality assessments by regulatory bodies</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold text-sm">2</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Faculty Excellence</h3>
                    <p className="text-gray-600 text-sm">Highly qualified and experienced faculty members</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold text-sm">3</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Modern Curriculum</h3>
                    <p className="text-gray-600 text-sm">Updated curriculum aligned with industry standards</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full w-8 h-8 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-semibold text-sm">4</span>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-1">Student Support</h3>
                    <p className="text-gray-600 text-sm">Comprehensive academic and career support services</p>
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
                  href={`/degrees/${params.slug}/curriculum`}
                  className="w-full btn-outline text-center"
                >
                  View Curriculum
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

            {/* Accreditation Summary */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Accreditation Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">UGC Recognition</span>
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">AICTE Approval</span>
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">NAAC Grade</span>
                  <span className="text-green-600 font-medium">A+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">ISO Certification</span>
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">International Recognition</span>
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
              </div>
            </div>

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

        {/* Contact Information */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">For Accreditation Inquiries</h3>
                <p className="text-gray-600 text-sm mb-1">Email: accreditation@{program.institution.toLowerCase().replace(/\s+/g, '')}.edu</p>
                <p className="text-gray-600 text-sm mb-1">Phone: +91-XXX-XXXX-XXXX</p>
                <p className="text-gray-600 text-sm">Hours: Monday - Friday, 9:00 AM - 5:00 PM</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">For Student Verification</h3>
                <p className="text-gray-600 text-sm mb-1">Email: verification@{program.institution.toLowerCase().replace(/\s+/g, '')}.edu</p>
                <p className="text-gray-600 text-sm mb-1">Phone: +91-XXX-XXXX-XXXX</p>
                <p className="text-gray-600 text-sm">Hours: Monday - Friday, 9:00 AM - 5:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
