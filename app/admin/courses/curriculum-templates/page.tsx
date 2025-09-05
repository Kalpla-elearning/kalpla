

import { redirect } from 'next/navigation'

import Link from 'next/link'
import { 
  BookOpenIcon,
  PlusIcon,
  PencilIcon,
  EyeIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  AcademicCapIcon,
  ClockIcon,
  StarIcon,
  UserIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'



async function getCurriculumTemplatesData() {
  const [
    totalTemplates,
    activeTemplates,
    usedTemplates,
    popularTemplates,
    recentTemplates,
    templateCategories
  ] = await Promise.all([
    // Total templates
    prisma.curriculumTemplate.count(),
    // Active templates
    prisma.curriculumTemplate.count({ where: { isActive: true } }),
    // Templates in use
    prisma.curriculumTemplate.count({ where: { courses: { some: {} } } }),
    // Popular templates (most used)
    prisma.curriculumTemplate.findMany({
      include: {
        _count: {
          select: { courses: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),
    // Recent templates
    prisma.curriculumTemplate.findMany({
      include: {
        _count: {
          select: { courses: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    }),
    // Template categories
    prisma.curriculumTemplate.groupBy({
      by: ['category'],
      _count: {
        id: true
      }
    })
  ])

  return {
    totalTemplates,
    activeTemplates,
    usedTemplates,
    popularTemplates,
    recentTemplates,
    templateCategories
  }
}

export default async function AdminCurriculumTemplatesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user || session.user.role !== 'ADMIN') {
    redirect('/auth/signin')
  }

  const data = await getCurriculumTemplatesData()

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Curriculum Templates</h1>
          <p className="text-gray-600 mt-2">Pre-built curriculum structures for fast course setup</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            href="/admin/courses/curriculum-templates/create"
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create Template
          </Link>
          <Link
            href="/admin/courses/curriculum-templates/import"
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
          >
            <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
            Import Template
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <BookOpenIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Templates</p>
              <p className="text-2xl font-bold text-gray-900">{data.totalTemplates}</p>
              <p className="text-xs text-gray-500">All templates</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Templates</p>
              <p className="text-2xl font-bold text-gray-900">{data.activeTemplates}</p>
              <p className="text-xs text-gray-500">Available for use</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <StarIcon className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Use</p>
              <p className="text-2xl font-bold text-gray-900">{data.usedTemplates}</p>
              <p className="text-xs text-gray-500">Being used by courses</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <AcademicCapIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Categories</p>
              <p className="text-2xl font-bold text-gray-900">{data.templateCategories.length}</p>
              <p className="text-xs text-gray-500">Different categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Templates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Popular Templates</h3>
            <Link
              href="/admin/courses/curriculum-templates"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>
        </div>
        <div className="p-6">
          {data.popularTemplates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.popularTemplates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {template._count.courses} courses
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">{template.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <ClockIcon className="h-4 w-4 mr-1" />
                      {template.estimatedDuration} hours
                    </span>
                    <span className="flex items-center">
                      <BookOpenIcon className="h-4 w-4 mr-1" />
                      {template.lessonCount} lessons
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/courses/curriculum-templates/${template.id}`}
                      className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
                    >
                      <EyeIcon className="h-4 w-4 mr-1" />
                      Preview
                    </Link>
                    <button className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center">
                      <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                      Use Template
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No popular templates yet</h3>
              <p className="text-gray-600">Create templates to help instructors build courses faster.</p>
            </div>
          )}
        </div>
      </div>

      {/* All Templates */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">All Templates</h3>
            <div className="flex items-center space-x-2">
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">All Categories</option>
                {data.templateCategories.map((category) => (
                  <option key={category.category} value={category.category}>
                    {category.category} ({category._count.id})
                  </option>
                ))}
              </select>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-6">
          {data.recentTemplates.length > 0 ? (
            <div className="space-y-6">
              {data.recentTemplates.map((template) => (
                <div key={template.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">{template.name}</h4>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-3 ${
                          template.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {template.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 ml-2">
                          {template.category}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-4">{template.description}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center">
                          <BookOpenIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{template.lessonCount} lessons</span>
                        </div>
                        <div className="flex items-center">
                          <ClockIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{template.estimatedDuration} hours</span>
                        </div>
                        <div className="flex items-center">
                          <StarIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{template.difficultyLevel}</span>
                        </div>
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-600">{template._count.courses} courses using</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            Created {new Date(template.createdAt).toLocaleDateString()}
                          </span>
                          {template.lastUpdated && (
                            <span className="text-xs text-gray-500">
                              Updated {new Date(template.lastUpdated).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/admin/courses/curriculum-templates/${template.id}`}
                            className="bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors flex items-center"
                          >
                            <EyeIcon className="h-4 w-4 mr-1" />
                            Preview
                          </Link>
                          <Link
                            href={`/admin/courses/curriculum-templates/${template.id}/edit`}
                            className="bg-gray-600 text-white px-3 py-2 rounded text-sm hover:bg-gray-700 transition-colors flex items-center"
                          >
                            <PencilIcon className="h-4 w-4 mr-1" />
                            Edit
                          </Link>
                          <button className="bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 transition-colors flex items-center">
                            <DocumentDuplicateIcon className="h-4 w-4 mr-1" />
                            Use Template
                          </button>
                          <button className="bg-red-600 text-white px-3 py-2 rounded text-sm hover:bg-red-700 transition-colors flex items-center">
                            <TrashIcon className="h-4 w-4 mr-1" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No curriculum templates</h3>
              <p className="text-gray-600 mb-4">Create your first curriculum template to help instructors build courses faster.</p>
              <Link
                href="/admin/courses/curriculum-templates/create"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Create Template
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Template Categories */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Template Categories</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {data.templateCategories.map((category) => (
              <div key={category.category} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{category.category}</h4>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                    {category._count.id}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">templates available</p>
              </div>
            ))}
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
              href="/admin/courses/curriculum-templates/create"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <PlusIcon className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Create Template</span>
            </Link>
            <Link
              href="/admin/courses/curriculum-templates/import"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <DocumentDuplicateIcon className="h-5 w-5 text-blue-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Import Template</span>
            </Link>
            <Link
              href="/admin/courses/curriculum-templates/export"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <BookOpenIcon className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Export Templates</span>
            </Link>
            <Link
              href="/admin/courses/curriculum-templates/analytics"
              className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <StarIcon className="h-5 w-5 text-orange-600 mr-2" />
              <span className="text-sm font-medium text-gray-700">Usage Analytics</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
