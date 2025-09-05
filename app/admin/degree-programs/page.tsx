'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/hooks/useAuth'
import { 
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  AcademicCapIcon,
  UserGroupIcon,
  StarIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'
import CreateDegreeProgramModal from '@/components/admin/CreateDegreeProgramModal'
import EditDegreeProgramModal from '@/components/admin/EditDegreeProgramModal'

interface DegreeProgram {
  id: string
  title: string
  slug: string
  description: string
  institution: string
  location: string
  duration: string
  format: string
  level: string
  price: number
  currency: string
  imageUrl?: string
  category: string
  tags: string[]
  features: string[]
  requirements: string[]
  syllabus: any[]
  isFeatured: boolean
  maxStudents?: number
  currentStudents: number
  rating: number
  totalReviews: number
  instructor?: {
    id: string
    name: string
    avatar?: string
  }
  enrollmentCount: number
  activeEnrollments: number
  pendingPayments: number
  averageRating: number
  isEnrollmentOpen: boolean
  enrollmentPercentage: number
  status: string
  createdAt: string
  updatedAt: string
}

type SortField = 'title' | 'institution' | 'price' | 'currentStudents' | 'createdAt' | 'rating'
type SortOrder = 'asc' | 'desc'

export default function AdminDegreeProgramsPage() {
  const { data: session } = useSession()
  const [programs, setPrograms] = useState<DegreeProgram[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProgram, setSelectedProgram] = useState<DegreeProgram | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [levelFilter, setLevelFilter] = useState('')
  const [formatFilter, setFormatFilter] = useState('')
  const [enrollmentFilter, setEnrollmentFilter] = useState('')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [stats, setStats] = useState({
    totalPrograms: 0,
    totalStudents: 0,
    totalRevenue: 0,
    publishedPrograms: 0,
    draftPrograms: 0,
    featuredPrograms: 0
  })

  useEffect(() => {
    if (session?.user) {
      fetchPrograms()
    }
  }, [session, search, statusFilter, categoryFilter, levelFilter, formatFilter, enrollmentFilter, sortField, sortOrder])

  const fetchPrograms = async () => {
    try {
      const params = new URLSearchParams({
        status: statusFilter || 'all',
        ...(search && { search }),
        ...(categoryFilter && { category: categoryFilter }),
        ...(levelFilter && { level: levelFilter }),
        ...(formatFilter && { format: formatFilter }),
        ...(enrollmentFilter && { enrollmentStatus: enrollmentFilter }),
        sortBy: sortField,
        order: sortOrder
      })

      const response = await fetch(`/api/degree-programs?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setPrograms(data.data.programs)
        if (data.data.stats) {
          setStats(data.data.stats)
        }
      }
    } catch (error) {
      console.error('Error fetching programs:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (programId: string) => {
    try {
      const response = await fetch(`/api/degree-programs/${programId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setPrograms(programs.filter(program => program.id !== programId))
        setIsDeleteModalOpen(false)
        setSelectedProgram(null)
        fetchPrograms() // Refresh stats
      }
    } catch (error) {
      console.error('Error deleting program:', error)
    }
  }

  const handleStatusChange = async (programId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/degree-programs/${programId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        setPrograms(programs.map(program => 
          program.id === programId ? { ...program, status: newStatus } : program
        ))
      }
    } catch (error) {
      console.error('Error updating program status:', error)
    }
  }

  const handleSort = (field: SortField) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc'
    setSortField(field)
    setSortOrder(newOrder)
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronUpIcon className="h-4 w-4 text-gray-400" />
    }
    return sortOrder === 'asc' 
      ? <ChevronUpIcon className="h-4 w-4 text-primary-600" />
      : <ChevronDownIcon className="h-4 w-4 text-primary-600" />
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Published</span>
      case 'DRAFT':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">Draft</span>
      case 'ARCHIVED':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Archived</span>
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  const getEnrollmentStatusBadge = (program: DegreeProgram) => {
    if (!program.maxStudents) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Open</span>
    }
    if (program.currentStudents >= program.maxStudents) {
      return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Full</span>
    }
    return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Limited</span>
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Degree Programs Management</h2>
          <p className="text-gray-600">Manage degree programs, enrollments, and content</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
        >
          <PlusIcon className="h-4 w-4 mr-2" />
          New Program
        </button>
      </div>

      {/* Enhanced Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <AcademicCapIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Programs</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalPrograms}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserGroupIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{stats.totalRevenue.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <CalendarIcon className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Published</p>
              <p className="text-2xl font-bold text-gray-900">{stats.publishedPrograms}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Drafts</p>
              <p className="text-2xl font-bold text-gray-900">{stats.draftPrograms}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <StarIcon className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Featured</p>
              <p className="text-2xl font-bold text-gray-900">{stats.featuredPrograms}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search programs..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Categories</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Business">Business</option>
              <option value="Engineering">Engineering</option>
              <option value="Arts">Arts</option>
              <option value="Science">Science</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Level
            </label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Levels</option>
              <option value="UNDERGRADUATE">Undergraduate</option>
              <option value="GRADUATE">Graduate</option>
              <option value="DOCTORATE">Doctorate</option>
              <option value="CERTIFICATE">Certificate</option>
              <option value="DIPLOMA">Diploma</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format
            </label>
            <select
              value={formatFilter}
              onChange={(e) => setFormatFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Formats</option>
              <option value="ONLINE">Online</option>
              <option value="HYBRID">Hybrid</option>
              <option value="ON_CAMPUS">On Campus</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enrollment
            </label>
            <select
              value={enrollmentFilter}
              onChange={(e) => setEnrollmentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All</option>
              <option value="OPEN">Open</option>
              <option value="FULL">Full</option>
              <option value="CLOSED">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Enhanced Programs Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Programs</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Program
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('institution')}
                >
                  <div className="flex items-center">
                    Institution
                    {getSortIcon('institution')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center">
                    Price
                    {getSortIcon('price')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enrollment
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('currentStudents')}
                >
                  <div className="flex items-center">
                    Students
                    {getSortIcon('currentStudents')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {programs.map((program) => (
                <tr key={program.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {program.imageUrl && (
                        <img
                          src={program.imageUrl}
                          alt={program.title}
                          className="h-10 w-10 rounded-lg object-cover mr-3"
                        />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{program.title}</div>
                        <div className="text-sm text-gray-500">{program.level} • {program.duration}</div>
                        <div className="text-xs text-gray-400">{program.format}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {program.institution}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(program.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatPrice(program.price, program.currency)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getEnrollmentStatusBadge(program)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <UsersIcon className="h-3 w-3 mr-1" />
                        {program.currentStudents}
                        {program.maxStudents && ` / ${program.maxStudents}`}
                      </div>
                      {program.maxStudents && (
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full" 
                            style={{ width: `${program.enrollmentPercentage}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedProgram(program)
                          setIsEditModalOpen(true)
                        }}
                        className="text-primary-600 hover:text-primary-900"
                        title="Edit Program"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProgram(program)
                          setIsDeleteModalOpen(true)
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete Program"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                      <a
                        href={`/degrees/${program.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-600 hover:text-gray-900"
                        title="View Program"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </a>
                      <a
                        href={`/admin/degree-programs/${program.id}/enrollments`}
                        className="text-blue-600 hover:text-blue-900"
                        title="Manage Enrollments"
                      >
                        <UserGroupIcon className="h-4 w-4" />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Program Modal */}
      {isCreateModalOpen && (
        <CreateDegreeProgramModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={() => {
            setIsCreateModalOpen(false)
            fetchPrograms()
          }}
        />
      )}

      {/* Edit Program Modal */}
      {isEditModalOpen && selectedProgram && (
        <EditDegreeProgramModal
          program={selectedProgram}
          onClose={() => {
            setIsEditModalOpen(false)
            setSelectedProgram(null)
          }}
          onSuccess={() => {
            setIsEditModalOpen(false)
            setSelectedProgram(null)
            fetchPrograms()
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && selectedProgram && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Program</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete "{selectedProgram.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(selectedProgram.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
