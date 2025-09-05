'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  CheckCircleIcon,
  ArrowDownTrayIcon,
  ShareIcon,
  AcademicCapIcon,
  CalendarIcon,
  UserIcon,
  ArrowLeftIcon,
  PrinterIcon
} from '@heroicons/react/24/outline'

interface Certificate {
  id: string
  courseId: string
  userId: string
  issuedAt: string
  course: {
    title: string
    instructor: {
      name: string
    }
  }
  user: {
    name: string
    email: string
  }
  completionDate: string
  certificateNumber: string
}

export default function CertificatePage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [downloading, setDownloading] = useState(false)

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchCertificate()
  }, [session, status, params.slug])

  const fetchCertificate = async () => {
    try {
      const response = await fetch(`/api/courses/${params.slug}/certificate`)
      if (!response.ok) {
        if (response.status === 404) {
          setError('Certificate not found. You may not have completed this course yet.')
        } else {
          throw new Error('Failed to load certificate')
        }
      } else {
        const data = await response.json()
        setCertificate(data)
      }
    } catch (error) {
      setError('Failed to load certificate')
    } finally {
      setLoading(false)
    }
  }

  const downloadCertificate = async () => {
    if (!certificate) return

    setDownloading(true)
    try {
      const response = await fetch(`/api/courses/${params.slug}/certificate/download`)
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `certificate-${certificate.course.title.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      }
    } catch (error) {
      console.error('Error downloading certificate:', error)
    } finally {
      setDownloading(false)
    }
  }

  const shareCertificate = async () => {
    if (!certificate) return

    try {
      if (navigator.share) {
        await navigator.share({
          title: `Certificate of Completion - ${certificate.course.title}`,
          text: `I just completed ${certificate.course.title} on Kalpla!`,
          url: window.location.href
        })
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href)
        alert('Certificate link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing certificate:', error)
    }
  }

  const printCertificate = () => {
    window.print()
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to signin
  }

  if (error || !certificate) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AcademicCapIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Certificate Not Available</h2>
          <p className="text-gray-600 mb-6">{error || 'You need to complete this course to receive a certificate.'}</p>
          <div className="space-y-3">
            <Link href={`/courses/${params.slug}`} className="btn-primary block">
              View Course
            </Link>
            <Link href="/courses/enrolled" className="text-primary-600 hover:text-primary-700">
              My Enrolled Courses
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link 
                href={`/courses/${params.slug}`}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                Back to Course
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Certificate of Completion</h1>
                <p className="text-gray-600">{certificate.course.title}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <button
                onClick={shareCertificate}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <ShareIcon className="h-4 w-4 mr-2" />
                Share
              </button>
              <button
                onClick={printCertificate}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <PrinterIcon className="h-4 w-4 mr-2" />
                Print
              </button>
              <button
                onClick={downloadCertificate}
                disabled={downloading}
                className="btn-primary flex items-center"
              >
                <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                {downloading ? 'Downloading...' : 'Download'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Certificate */}
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {/* Certificate Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 p-8 text-center text-white">
            <div className="flex items-center justify-center mb-4">
              <AcademicCapIcon className="h-12 w-12 mr-3" />
              <h2 className="text-3xl font-bold">Kalpla</h2>
            </div>
            <h1 className="text-2xl font-semibold mb-2">Certificate of Completion</h1>
            <p className="text-primary-100">This is to certify that</p>
          </div>

          {/* Certificate Body */}
          <div className="p-8 text-center">
            <div className="mb-8">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                {certificate.user.name}
              </h3>
              <p className="text-lg text-gray-600 mb-6">
                has successfully completed the course
              </p>
              <h4 className="text-2xl font-semibold text-primary-600 mb-6">
                {certificate.course.title}
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <UserIcon className="h-6 w-6 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Instructor</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {certificate.course.instructor.name}
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <CalendarIcon className="h-6 w-6 text-gray-400 mr-2" />
                  <span className="text-sm font-medium text-gray-600">Completion Date</span>
                </div>
                <p className="text-lg font-semibold text-gray-900">
                  {new Date(certificate.completionDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <p className="text-sm text-gray-500 mb-4">
                Certificate Number: {certificate.certificateNumber}
              </p>
              <p className="text-sm text-gray-500">
                Issued on {new Date(certificate.issuedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Certificate Footer */}
          <div className="bg-gray-50 p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CheckCircleIcon className="h-8 w-8 text-green-500 mr-3" />
                <div>
                  <p className="font-semibold text-gray-900">Course Completed</p>
                  <p className="text-sm text-gray-600">100% progress achieved</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-sm text-gray-500">Verified by Kalpla</p>
                <p className="text-xs text-gray-400">This certificate can be verified online</p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificate Info */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Certificate</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">What this certificate represents:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Successful completion of all course modules</li>
                <li>• Demonstrated understanding of course material</li>
                <li>• Commitment to continuous learning</li>
                <li>• Professional development achievement</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">How to use this certificate:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Add to your professional portfolio</li>
                <li>• Share on LinkedIn and other platforms</li>
                <li>• Include in job applications</li>
                <li>• Display in your workspace</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
