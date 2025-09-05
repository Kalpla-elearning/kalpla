'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/hooks/useAuth'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { 
  CalendarIcon,
  ClockIcon,
  UserIcon,
  CurrencyRupeeIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

interface Mentor {
  id: string
  bio: string
  expertise: string
  experience: number
  hourlyRate: number
  rating: number
  totalSessions: number
  user: {
    id: string
    name: string
    avatar: string | null
  }
}

interface TimeSlot {
  id: string
  time: string
  available: boolean
}

export default function BookMentorPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const params = useParams()
  const mentorId = params.id as string

  const [mentor, setMentor] = useState<Mentor | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [sessionTitle, setSessionTitle] = useState('')
  const [sessionDescription, setSessionDescription] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [availableDates] = useState(() => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      dates.push(date.toISOString().split('T')[0])
    }
    return dates
  })

  const timeSlots = [
    { id: '1', time: '10:00 AM', available: true },
    { id: '2', time: '11:00 AM', available: true },
    { id: '3', time: '12:00 PM', available: true },
    { id: '4', time: '2:00 PM', available: false },
    { id: '5', time: '3:00 PM', available: true },
    { id: '6', time: '4:00 PM', available: true },
    { id: '7', time: '5:00 PM', available: true },
    { id: '8', time: '6:00 PM', available: true },
    { id: '9', time: '7:00 PM', available: true },
    { id: '10', time: '8:00 PM', available: false },
  ]

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchMentorData()
  }, [session, status, router, mentorId])

  const fetchMentorData = async () => {
    try {
      const response = await fetch(`/api/mentorship/mentor/${mentorId}`)
      if (response.ok) {
        const data = await response.json()
        setMentor(data)
      }
    } catch (error) {
      console.error('Error fetching mentor data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedDate || !selectedTime || !sessionTitle) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/mentorship/book-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mentorId,
          scheduledAt: `${selectedDate}T${selectedTime}:00`,
          title: sessionTitle,
          description: sessionDescription,
          duration: 60
        }),
      })

      if (response.ok) {
        const data = await response.json()
        router.push(`/mentorship/sessions/${data.sessionId}/confirmation`)
      } else {
        const error = await response.json()
        alert(error.message || 'Something went wrong')
      }
    } catch (error) {
      console.error('Error booking session:', error)
      alert('Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!mentor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mentor not found</h2>
          <p className="text-gray-600 mb-4">The mentor you're looking for doesn't exist.</p>
          <Link href="/mentorship" className="btn-primary">
            Browse Mentors
          </Link>
        </div>
      </div>
    )
  }

  const expertiseList = JSON.parse(mentor.expertise || '[]')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href={`/mentorship/mentor/${mentorId}`}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Book Session</h1>
                <p className="text-gray-600 mt-2">Schedule a session with {mentor.user.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Schedule Your Session</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Session Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Title *
                  </label>
                  <input
                    type="text"
                    value={sessionTitle}
                    onChange={(e) => setSessionTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="e.g., Career Guidance, Technical Review, Project Discussion"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Description
                  </label>
                  <textarea
                    value={sessionDescription}
                    onChange={(e) => setSessionDescription(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Briefly describe what you'd like to discuss or get help with..."
                  />
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Date *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {availableDates.map((date) => (
                      <button
                        key={date}
                        type="button"
                        onClick={() => setSelectedDate(date)}
                        className={`p-3 text-left border rounded-lg transition-colors ${
                          selectedDate === date
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <div className="font-medium">{formatDate(date)}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time Selection */}
                {selectedDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Time *
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {timeSlots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => slot.available && setSelectedTime(slot.time)}
                          disabled={!slot.available}
                          className={`p-3 text-center border rounded-lg transition-colors ${
                            selectedTime === slot.time
                              ? 'border-primary-500 bg-primary-50 text-primary-700'
                              : slot.available
                              ? 'border-gray-300 hover:border-gray-400'
                              : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                          {slot.time}
                          {!slot.available && (
                            <div className="text-xs mt-1">Booked</div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit Button */}
                <div className="pt-6">
                  <button
                    type="submit"
                    disabled={isSubmitting || !selectedDate || !selectedTime || !sessionTitle}
                    className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Booking...' : 'Book Session'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Mentor Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center space-x-4 mb-4">
                <img 
                  src={mentor.user.avatar || '/api/placeholder/60/60'} 
                  alt={mentor.user.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{mentor.user.name}</h3>
                  <p className="text-sm text-gray-600">{mentor.experience} years experience</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Hourly Rate</span>
                  <span className="font-semibold text-gray-900">₹{mentor.hourlyRate.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Session Duration</span>
                  <span className="font-semibold text-gray-900">60 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Sessions</span>
                  <span className="font-semibold text-gray-900">{mentor.totalSessions}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-semibold text-gray-900">{mentor.rating.toFixed(1)}/5</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="font-medium text-gray-900 mb-2">Expertise</h4>
                <div className="flex flex-wrap gap-2">
                  {expertiseList.slice(0, 3).map((skill: string, index: number) => (
                    <span 
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Session Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Session Details</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-semibold text-gray-900">60 minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Format</span>
                  <span className="font-semibold text-gray-900">Video Call</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Platform</span>
                  <span className="font-semibold text-gray-900">Zoom/Google Meet</span>
                </div>
              </div>
            </div>

            {/* What to Expect */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What to Expect</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Personalized guidance based on your needs</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Interactive Q&A session</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Actionable feedback and next steps</span>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircleIcon className="h-4 w-4 text-green-500 mt-0.5" />
                  <span>Session recording (if permitted)</span>
                </div>
              </div>
            </div>

            {/* Cancellation Policy */}
            <div className="bg-yellow-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4">Cancellation Policy</h3>
              <div className="space-y-2 text-sm text-yellow-800">
                <p>• Free cancellation up to 24 hours before the session</p>
                <p>• 50% refund for cancellations within 24 hours</p>
                <p>• No refund for no-shows or late cancellations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
