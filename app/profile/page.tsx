'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/components/providers/AuthProvider'
import Link from 'next/link'
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  GlobeAltIcon,
  CalendarIcon,
  AcademicCapIcon,
  PencilIcon
} from '@heroicons/react/24/outline'
import { getRoleDisplayName, getRoleColor } from '@/lib/utils'

interface UserProfile {
  id: string
  name: string
  email: string
  phone: string
  bio: string
  location: string
  website: string
  avatar: string
  role: string
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchProfile()
    }
  }, [user])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      // For now, we'll use mock data since we don't have the API route yet
      const mockProfile: UserProfile = {
        id: user?.id || '1',
        name: user?.name || 'John Doe',
        email: user?.email || 'john@example.com',
        phone: '+91 98765 43210',
        bio: 'Passionate learner and educator with expertise in web development and technology.',
        location: 'Mumbai, India',
        website: 'https://johndoe.com',
        avatar: '/api/placeholder/100/100',
        role: user?.role || 'STUDENT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setProfile(mockProfile)
    } catch (err) {
      setError('Failed to fetch profile')
      console.error('Error fetching profile:', err)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Profile not found'}</p>
          <Link href="/dashboard" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
            Back to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <Link 
              href="/profile/edit"
              className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
            >
              <PencilIcon className="h-4 w-4" />
              <span>Edit Profile</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <UserIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">{profile.name}</div>
                    <div className="text-sm text-gray-500">Full Name</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">{profile.email}</div>
                    <div className="text-sm text-gray-500">Email Address</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <PhoneIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">{profile.phone}</div>
                    <div className="text-sm text-gray-500">Phone Number</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPinIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">{profile.location}</div>
                    <div className="text-sm text-gray-500">Location</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <GlobeAltIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="font-medium text-gray-900">{profile.website}</div>
                    <div className="text-sm text-gray-500">Website</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
              <p className="text-gray-700">{profile.bio}</p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
              <img 
                src={profile.avatar} 
                alt={profile.name}
                className="h-24 w-24 rounded-full mx-auto mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900">{profile.name}</h3>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-2 ${getRoleColor(profile.role)}`}>
                {getRoleDisplayName(profile.role)}
              </div>
            </div>

            {/* Account Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center justify-between">
                  <span>Member since</span>
                  <span>{new Date(profile.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Last updated</span>
                  <span>{new Date(profile.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}