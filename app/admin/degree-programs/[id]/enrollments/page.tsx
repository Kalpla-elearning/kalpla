'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/hooks/useAuth'
import { useParams } from 'next/navigation'
import { 
  UserGroupIcon,
  UserPlusIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon
} from '@heroicons/react/24/outline'

interface Enrollment {
  id: string
  userId: string
  programId: string
  status: string
  paymentStatus: string
  enrolledAt: string
  completedAt?: string
  progress: number
  currentSemester: number
  totalSemesters?: number
  user: {
    id: string
    name: string
    email: string
    phone?: string
    avatar?: string
  }
  program: {
    id: string
    title: string
    price: number
    currency: string
    maxStudents?: number
    currentStudents: number
  }
}

interface ProgramStats {
  totalEnrollments: number
  statusBreakdown: Array<{
    status: string
    _count: { id: number }
  }>
  paymentBreakdown: Array<{
    paymentStatus: string
    _count: { id: number }
  }>
}

type SortField = 'enrolledAt' | 'status' | 'paymentStatus' | 'progress' | 'user.name'
type SortOrder = 'asc' | 'desc'

export default function ProgramEnrollmentsPage() {
  const { data: session } = useSession()
  const params = useParams()
  const programId = params.id as string
  
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [program, setProgram] = useState<any>(null)
  const [stats, setStats] = useState<ProgramStats>({
    totalEnrollments: 0,
    statusBreakdown: [],
    paymentBreakdown: []
  })
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [sortField, setSortField] = useState<SortField>('enrolledAt')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [showAddEnrollment, setShowAddEnrollment] = useState(false)
  const [selectedEnrollment, setSelectedEnrollment] = useState<Enrollment | null>(null)

  useEffect(() => {
    if (session?.user && programId) {
      fetchEnrollments()
      fetchProgram()
    }
  }, [session, programId, search, statusFilter, paymentFilter, sortField, sortOrder])

  const fetchEnrollments = async () => {
    try {
      const params = new URLSearchParams({
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
        ...(paymentFilter && { paymentStatus: paymentFilter }),
        sortBy: sortField,
        order: sortOrder
      })

      const response = await fetch(`/api/degree-programs/${programId}/enrollments?${params}`)
      const data = await response.json()
      
      if (data.success) {
        setEnrollments(data.data.enrollments)
        setStats(data.data.stats)
      }
    } catch (error) {
      console.error('Error fetching enrollments:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchProgram = async () => {
    try {
      const response = await fetch(`/api/degree-programs/${programId}`)
      const data = await response.json()
      
      if (data.success) {
        setProgram(data.data.program)
      }
    } catch (error) {
      console.error('Error fetching program:', error)
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Active</span>
      case 'PENDING':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
      case 'COMPLETED':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Completed</span>
      case 'CANCELLED':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Cancelled</span>
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>
    }
  }

  const getPaymentStatusBadge = (paymentStatus: string) => {
    switch (paymentStatus) {
      case 'SUCCESS':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Paid</span>
      case 'PENDING':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
      case 'FAILED':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Failed</span>
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">{paymentStatus}</span>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Program not found</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Enrollment Management</h2>
          <p className="text-gray-600">{program.title}</p>
        </div>
        <button
          onClick={() => setShowAddEnrollment(true)}
          className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 flex items-center"
        >
          <UserPlusIcon className="h-4 w-4 mr-2" />
          Add Enrollment
        </button>
      </div>

      {/* Program Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-primary-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Enrollments</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-8 w-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Program Price</p>
              <p className="text-2xl font-bold text-gray-900">{formatPrice(program.price, program.currency)}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Seat Capacity</p>
              <p className="text-2xl font-bold text-gray-900">
                {program.currentStudents}
                {program.maxStudents && ` / ${program.maxStudents}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center">
            <ClockIcon className="h-8 w-8 text-purple-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-600">Enrollment Status</p>
              <p className="text-2xl font-bold text-gray-900">
                {program.maxStudents && program.currentStudents >= program.maxStudents ? 'Full' : 'Open'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Enrollment Status</h3>
          <div className="space-y-3">
            {stats.statusBreakdown.map((item) => (
              <div key={item.status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.status}</span>
                <span className="text-sm font-medium text-gray-900">{item._count.id}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Status</h3>
          <div className="space-y-3">
            {stats.paymentBreakdown.map((item) => (
              <div key={item.paymentStatus} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{item.paymentStatus}</span>
                <span className="text-sm font-medium text-gray-900">{item._count.id}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Students
            </label>
            <div className="relative">
              <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email..."
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enrollment Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="PENDING">Pending</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Status
            </label>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All Payments</option>
              <option value="SUCCESS">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={fetchEnrollments}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 flex items-center justify-center"
            >
              <FunnelIcon className="h-4 w-4 mr-2" />
              Filter
            </button>
          </div>
        </div>
      </div>

      {/* Enrollments Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Enrollments</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('enrolledAt')}
                >
                  <div className="flex items-center">
                    Enrolled Date
                    {getSortIcon('enrolledAt')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center">
                    Status
                    {getSortIcon('status')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('paymentStatus')}
                >
                  <div className="flex items-center">
                    Payment
                    {getSortIcon('paymentStatus')}
                  </div>
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('progress')}
                >
                  <div className="flex items-center">
                    Progress
                    {getSortIcon('progress')}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {enrollments.map((enrollment) => (
                <tr key={enrollment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">
                          {enrollment.user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{enrollment.user.name}</div>
                        <div className="text-sm text-gray-500">{enrollment.user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      {formatDate(enrollment.enrolledAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(enrollment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getPaymentStatusBadge(enrollment.paymentStatus)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="space-y-1">
                      <div className="flex items-center">
                        <ChartBarIcon className="h-3 w-3 mr-1" />
                        {enrollment.progress}%
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary-600 h-2 rounded-full" 
                          style={{ width: `${enrollment.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedEnrollment(enrollment)
                          // TODO: Open enrollment details modal
                        }}
                        className="text-blue-600 hover:text-blue-900"
                        title="View Details"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedEnrollment(enrollment)
                          // TODO: Open edit enrollment modal
                        }}
                        className="text-primary-600 hover:text-primary-900"
                        title="Edit Enrollment"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          // TODO: Handle enrollment cancellation
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Cancel Enrollment"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Enrollment Modal Placeholder */}
      {showAddEnrollment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-gray-900">Add Enrollment</h3>
              <p className="text-sm text-gray-500 mt-2">This feature will be implemented</p>
              <div className="mt-4">
                <button
                  onClick={() => setShowAddEnrollment(false)}
                  className="btn-primary"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
