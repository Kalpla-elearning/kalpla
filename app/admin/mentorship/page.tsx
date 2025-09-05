'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { 
  AcademicCapIcon,
  UserGroupIcon,
  ChartBarIcon,
  BookOpenIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  VideoCameraIcon,
  CloudArrowUpIcon
} from '@heroicons/react/24/outline'

interface Student {
  id: string
  name: string
  email: string
  college: string
  yearOfStudy: string
  enrollmentDate: string
  progress: number
  status: string
  currentPhase: number
}

interface Phase {
  id: string
  title: string
  order: number
  isUnlocked: boolean
  lessonCount: number
  studentCount: number
}

interface Analytics {
  totalStudents: number
  activeStudents: number
  completedStudents: number
  averageProgress: number
  recentEnrollments: number
  totalRevenue: number
}

interface VideoUpload {
  id: string
  fileName: string
  originalName: string
  url: string
  size: number
  uploadedBy: string
  uploadedAt: string
}

export default function AdminMentorshipPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [students, setStudents] = useState<Student[]>([])
  const [phases, setPhases] = useState<Phase[]>([])
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [videos, setVideos] = useState<VideoUpload[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    if (session?.user) {
      fetchData()
    }
  }, [session])

  const fetchData = async () => {
    try {
      const [analyticsRes, studentsRes, phasesRes, videosRes] = await Promise.all([
        fetch('/api/admin/mentorship/analytics'),
        fetch('/api/admin/mentorship/students'),
        fetch('/api/admin/mentorship/phases'),
        fetch('/api/admin/mentorship/videos')
      ])

      if (analyticsRes.ok) {
        const analyticsData = await analyticsRes.json()
        setAnalytics(analyticsData)
      }

      if (studentsRes.ok) {
        const studentsData = await studentsRes.json()
        setStudents(studentsData)
      }

      if (phasesRes.ok) {
        const phasesData = await phasesRes.json()
        setPhases(phasesData)
      }

      if (videosRes.ok) {
        const videosData = await videosRes.json()
        setVideos(videosData)
      }
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleVideoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/avi', 'video/mov', 'video/wmv']
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid video file (MP4, WebM, AVI, MOV, WMV)')
      return
    }

    // Validate file size (500MB max)
    if (file.size > 500 * 1024 * 1024) {
      alert('Video file too large. Maximum size is 500MB.')
      return
    }

    setSelectedFile(file)
    setUploadingVideo(true)

    try {
      const formData = new FormData()
      formData.append('video', file)

      const response = await fetch('/api/mentorship/upload-video', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        setVideos(prev => [result, ...prev])
        setSelectedFile(null)
        alert('Video uploaded successfully!')
      } else {
        const error = await response.json()
        alert(`Upload failed: ${error.message}`)
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploadingVideo(false)
    }
  }

  const handleDeleteVideo = async (videoId: string, videoUrl: string) => {
    if (!confirm('Are you sure you want to delete this video?')) return

    try {
      const response = await fetch('/api/mentorship/upload-video', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ url: videoUrl })
      })

      if (response.ok) {
        setVideos(prev => prev.filter(video => video.id !== videoId))
        alert('Video deleted successfully!')
      } else {
        const error = await response.json()
        alert(`Delete failed: ${error.message}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Delete failed. Please try again.')
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session?.user || session.user.role !== 'ADMIN') {
    router.push('/auth/signin')
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AcademicCapIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Kalpla Admin</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Welcome, {session.user.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mentorship Program Management
          </h1>
          <p className="text-gray-600">
            Manage students, content, and track program performance
          </p>
        </div>

        {/* Analytics Overview */}
        {analytics && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <UserGroupIcon className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Students</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.totalStudents}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ChartBarIcon className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Students</p>
                  <p className="text-2xl font-bold text-gray-900">{analytics.activeStudents}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                  <p className="text-2xl font-bold text-gray-900">{Math.round(analytics.averageProgress)}%</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <ArrowUpIcon className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">₹{analytics.totalRevenue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('students')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'students'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Students
              </button>
              <button
                onClick={() => setActiveTab('content')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'content'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Content Management
              </button>
              <button
                onClick={() => setActiveTab('phases')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'phases'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Phases
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Program Overview</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Recent Activity</h3>
                    <p className="text-sm text-gray-600">No recent activity to display</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-medium text-gray-900 mb-2">Quick Actions</h3>
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 text-sm bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100">
                        Add New Phase
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100">
                        Upload Video
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm bg-primary-50 text-primary-700 rounded-md hover:bg-primary-100">
                        View Reports
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'students' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Management</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">College</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Progress</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {students.map((student) => (
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{student.name}</div>
                              <div className="text-sm text-gray-500">{student.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.college}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div className="bg-primary-600 h-2 rounded-full" style={{ width: `${student.progress}%` }}></div>
                              </div>
                              <span className="text-sm text-gray-900">{student.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              student.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                              student.status === 'ENROLLED' ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {student.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button className="text-primary-600 hover:text-primary-900">View Details</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'content' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Content Management</h2>
                  <div className="flex items-center space-x-4">
                    <label className="cursor-pointer bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                      <CloudArrowUpIcon className="h-5 w-5 inline mr-2" />
                      Upload Video
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                        disabled={uploadingVideo}
                      />
                    </label>
                  </div>
                </div>

                {uploadingVideo && (
                  <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                      <span className="text-blue-800">Uploading video...</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {videos.map((video) => (
                    <div key={video.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <VideoCameraIcon className="h-6 w-6 text-gray-400" />
                          <button
                            onClick={() => handleDeleteVideo(video.id, video.url)}
                            className="text-red-600 hover:text-red-800"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                        <h3 className="font-medium text-gray-900 mb-1 truncate">{video.originalName}</h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {(video.size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <p className="text-xs text-gray-400">
                          Uploaded: {new Date(video.uploadedAt).toLocaleDateString()}
                        </p>
                        <div className="mt-3 flex space-x-2">
                          <button className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded hover:bg-gray-200">
                            Copy URL
                          </button>
                          <button className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded hover:bg-primary-100">
                            Preview
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {videos.length === 0 && (
                  <div className="text-center py-12">
                    <VideoCameraIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No videos uploaded yet</h3>
                    <p className="text-gray-500 mb-4">Upload your first video to get started</p>
                    <label className="cursor-pointer bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 transition-colors">
                      <CloudArrowUpIcon className="h-5 w-5 inline mr-2" />
                      Upload Video
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'phases' && (
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Phase Management</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {phases.map((phase) => (
                    <div key={phase.id} className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">{phase.title}</h3>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          phase.isUnlocked ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {phase.isUnlocked ? 'Unlocked' : 'Locked'}
                        </span>
                      </div>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>Order: {phase.order}</p>
                        <p>Lessons: {phase.lessonCount}</p>
                        <p>Students: {phase.studentCount}</p>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button className="text-sm bg-primary-50 text-primary-700 px-3 py-1 rounded hover:bg-primary-100">
                          Edit
                        </button>
                        <button className="text-sm bg-gray-50 text-gray-700 px-3 py-1 rounded hover:bg-gray-100">
                          View Lessons
                        </button>
                      </div>
                    </div>
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
