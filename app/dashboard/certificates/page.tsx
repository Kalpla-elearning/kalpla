'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  AcademicCapIcon, 
  ArrowDownTrayIcon, 
  ShareIcon, 
  EyeIcon,
  CalendarIcon,
  UserIcon,
  StarIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

interface Certificate {
  id: string
  courseTitle: string
  courseSlug: string
  instructorName: string
  completedAt: string
  certificateUrl?: string
  grade?: number
  course: {
    id: string
    title: string
    slug: string
    thumbnail?: string
    instructor: {
      name: string
    }
  }
}

export default function CertificatesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchCertificates()
  }, [session, status, router])

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/user/certificates')
      if (response.ok) {
        const data = await response.json()
        setCertificates(data)
      }
    } catch (error) {
      console.error('Error fetching certificates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (certificateId: string, courseTitle: string) => {
    try {
      // In a real application, this would generate and download a PDF certificate
      // For now, we'll just show a success message
      alert(`Downloading certificate for ${courseTitle}...`)
    } catch (error) {
      console.error('Error downloading certificate:', error)
    }
  }

  const handleShare = async (certificateId: string, courseTitle: string) => {
    try {
      // In a real application, this would share the certificate URL
      if (navigator.share) {
        await navigator.share({
          title: `Certificate: ${courseTitle}`,
          text: `I completed the ${courseTitle} course on Kalpla!`,
          url: window.location.href
        })
      } else {
        // Fallback to copying to clipboard
        await navigator.clipboard.writeText(window.location.href)
        alert('Certificate link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing certificate:', error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/dashboard"
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">My Certificates</h1>
                <p className="text-gray-600 mt-2">Download and share your course completion certificates</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <AcademicCapIcon className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Certificates</p>
                <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <StarIcon className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Average Grade</p>
                <p className="text-2xl font-bold text-gray-900">
                  {certificates.length > 0 
                    ? Math.round(certificates.reduce((sum, cert) => sum + (cert.grade || 0), 0) / certificates.length)
                    : 0
                  }%
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CalendarIcon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Latest Achievement</p>
                <p className="text-2xl font-bold text-gray-900">
                  {certificates.length > 0 
                    ? new Date(certificates[0].completedAt).toLocaleDateString()
                    : 'None'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        {certificates.length === 0 ? (
          <div className="text-center py-12">
            <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
            <p className="text-gray-600 mb-6">
              Complete your first course to earn your certificate!
            </p>
            <Link href="/courses" className="btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <div key={certificate.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Certificate Header */}
                <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <AcademicCapIcon className="h-8 w-8 mr-3" />
                      <div>
                        <h3 className="text-lg font-semibold">Certificate</h3>
                        <p className="text-primary-100 text-sm">Course Completion</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">{certificate.grade || 100}%</div>
                      <div className="text-primary-100 text-sm">Grade</div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  {/* Course Info */}
                  <div className="mb-4">
                    <h4 className="text-lg font-semibold text-gray-900 mb-2">
                      <Link href={`/courses/${certificate.courseSlug}`} className="hover:text-primary-600">
                        {certificate.courseTitle}
                      </Link>
                    </h4>
                    <div className="flex items-center text-sm text-gray-600 mb-2">
                      <UserIcon className="h-4 w-4 mr-1" />
                      {certificate.instructorName}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Completed {new Date(certificate.completedAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Certificate Preview */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center justify-center">
                      <DocumentTextIcon className="h-12 w-12 text-gray-400" />
                    </div>
                    <p className="text-center text-sm text-gray-600 mt-2">
                      Certificate of Completion
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleDownload(certificate.id, certificate.courseTitle)}
                      className="flex-1 btn-primary flex items-center justify-center"
                    >
                      <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                      Download
                    </button>
                    <button
                      onClick={() => handleShare(certificate.id, certificate.courseTitle)}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      title="Share Certificate"
                    >
                      <ShareIcon className="h-5 w-5" />
                    </button>
                    <Link
                      href={`/courses/${certificate.courseSlug}/certificate`}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      title="View Certificate"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Certificate Information */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About Certificates</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What you get</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Official certificate with your name</li>
                <li>• Course completion date</li>
                <li>• Instructor signature</li>
                <li>• Unique certificate ID</li>
                <li>• Shareable on LinkedIn and other platforms</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">How to use</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Download as PDF for your records</li>
                <li>• Add to your professional portfolio</li>
                <li>• Share on social media platforms</li>
                <li>• Include in job applications</li>
                <li>• Verify authenticity with certificate ID</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
