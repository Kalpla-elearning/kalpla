

import { redirect } from 'next/navigation'

import Link from 'next/link'
import { 
  AcademicCapIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  XCircleIcon,
  EyeIcon,
  PencilIcon,
  PlusIcon,
  TrashIcon,
  UserIcon,
  BookOpenIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'



async function getCertificateData() {
  const [
    totalCertificates,
    issuedCertificates,
    revokedCertificates,
    pendingCertificates,
    certificateTemplates,
    recentIssuances,
    recentRevocations
  ] = await Promise.all([
    // Total certificates
    prisma.certificate.count(),
    // Issued certificates (last 30 days)
    prisma.certificate.count({
      where: {
        status: 'ISSUED',
        issuedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    // Revoked certificates (last 30 days)
    prisma.certificate.count({
      where: {
        status: 'REVOKED',
        revokedAt: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    }),
    // Pending certificates
    prisma.certificate.count({
      where: { status: 'PENDING' }
    }),
    // Certificate templates
    prisma.certificateTemplate.findMany({
      include: {
        _count: {
          select: { certificates: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    }),
    // Recent issuances
    prisma.certificate.findMany({
      where: { status: 'ISSUED' },
      include: {
        user: {
          select: { name: true, email: true }
        },
        course: {
          select: { title: true }
        },
        template: {
          select: { name: true }
        }
      },
      orderBy: { issuedAt: 'desc' },
      take: 10
    }),
    // Recent revocations
    prisma.certificate.findMany({
      where: { status: 'REVOKED' },
      include: {
        user: {
          select: { name: true, email: true }
        },
        course: {
          select: { title: true }
        }
      },
      orderBy: { revokedAt: 'desc' },
      take: 5
    })
  ])

  return {
    totalCertificates,
    issuedCertificates,
    revokedCertificates,
    pendingCertificates,
    certificateTemplates,
    recentIssuances,
    recentRevocations
  }
}

export default async function AdminCertificatesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  const data = await getCertificateData()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Certificate Management</h1>
          <p className="text-gray-600 mt-2">Design, issue, and manage course completion certificates</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/certificates/templates"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            <PencilIcon className="h-5 w-5 mr-2" />
            Manage Templates
          </Link>
          <Link
            href="/admin/certificates/issue"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Issue Certificate
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AcademicCapIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Certificates</p>
              <p className="text-2xl font-bold text-gray-900">{data.totalCertificates}</p>
              <p className="text-xs text-gray-500">All time</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recently Issued</p>
              <p className="text-2xl font-bold text-gray-900">{data.issuedCertificates}</p>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Recently Revoked</p>
              <p className="text-2xl font-bold text-gray-900">{data.revokedCertificates}</p>
              <p className="text-xs text-gray-500">Last 30 days</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-gray-900">{data.pendingCertificates}</p>
              <p className="text-xs text-gray-500">Awaiting approval</p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Templates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Certificate Templates</h3>
            <Link
              href="/admin/certificates/templates/create"
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-1" />
              Create Template
            </Link>
          </div>
        </div>
        <div className="p-6">
          {data.certificateTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.certificateTemplates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {template.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{template._count.certificates} certificates issued</span>
                    <span>Created {new Date(template.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/certificates/templates/${template.id}`}
                      className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Preview
                    </Link>
                    <Link
                      href={`/admin/certificates/templates/${template.id}/edit`}
                      className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors flex items-center"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No certificate templates</h3>
              <p className="text-gray-600 mb-4">Create your first certificate template to get started.</p>
              <Link
                href="/admin/certificates/templates/create"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Template
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Issuances */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Issuances</h3>
              <Link
                href="/admin/certificates/issued"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {data.recentIssuances.length > 0 ? (
              <div className="space-y-4">
                {data.recentIssuances.map((certificate) => (
                  <div key={certificate.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{certificate.user.name}</h4>
                        <p className="text-sm text-gray-600">{certificate.course.title}</p>
                        <p className="text-xs text-gray-500">
                          Issued {new Date(certificate.issuedAt!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">{certificate.template?.name || 'Default Template'}</span>
                      <Link
                        href={`/admin/certificates/${certificate.id}`}
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="View certificate"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </Link>
                                              <button
                          className="p-1 text-gray-400 hover:text-gray-600"
                          title="Download certificate"
                        >
                          <ArrowDownTrayIcon className="h-4 w-4" />
                        </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent certificate issuances</p>
            )}
          </div>
        </div>

        {/* Recent Revocations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Recent Revocations</h3>
              <Link
                href="/admin/certificates/revoked"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View all
              </Link>
            </div>
          </div>
          <div className="p-6">
            {data.recentRevocations.length > 0 ? (
              <div className="space-y-4">
                {data.recentRevocations.map((certificate) => (
                  <div key={certificate.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      <XCircleIcon className="h-5 w-5 text-red-600 mr-3" />
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{certificate.user.name}</h4>
                        <p className="text-sm text-gray-600">{certificate.course.title}</p>
                        <p className="text-xs text-gray-500">
                          Revoked {new Date(certificate.revokedAt!).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/admin/certificates/${certificate.id}`}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        View Details
                      </Link>
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Restore certificate"
                      >
                        <CheckCircleIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No recent certificate revocations</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link
              href="/admin/certificates/issue"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <PlusIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Issue Certificate</span>
            </Link>
            <Link
              href="/admin/certificates/templates/create"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <PencilIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Create Template</span>
            </Link>
            <Link
              href="/admin/certificates/bulk-issue"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <AcademicCapIcon className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Bulk Issue</span>
            </Link>
            <Link
              href="/admin/certificates/reports"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <DocumentTextIcon className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Generate Reports</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
