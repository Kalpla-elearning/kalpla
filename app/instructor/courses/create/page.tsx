'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  BookOpenIcon, 
  PlusIcon, 
  PhotoIcon,
  CurrencyRupeeIcon,
  TagIcon,
  DocumentTextIcon,
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface CourseForm {
  title: string
  description: string
  price: number
  category: string
  tags: string
  thumbnail?: File
}

export default function CreateCoursePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null)
  
  const [formData, setFormData] = useState<CourseForm>({
    title: '',
    description: '',
    price: 0,
    category: '',
    tags: '',
    thumbnail: undefined
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    if (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN') {
      router.push('/dashboard')
      return
    }
  }, [session, status, router])

  const handleInputChange = (field: keyof CourseForm, value: string | number | File) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleInputChange('thumbnail', file)
      
      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('price', formData.price.toString())
      formDataToSend.append('category', formData.category)
      formDataToSend.append('tags', formData.tags)
      
      if (formData.thumbnail) {
        formDataToSend.append('thumbnail', formData.thumbnail)
      }

      const response = await fetch('/api/instructor/courses', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        const data = await response.json()
        setSuccess('Course created successfully! Redirecting...')
        setTimeout(() => {
          router.push(`/instructor/courses/${data.id}/edit`)
        }, 2000)
      } else {
        const errorData = await response.json()
        setError(errorData.error || 'Failed to create course')
      }
    } catch (error) {
      console.error('Error creating course:', error)
      setError('An error occurred while creating the course')
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    'Programming',
    'Design',
    'Business',
    'Marketing',
    'Music',
    'Photography',
    'Health & Fitness',
    'Language',
    'Technology',
    'Personal Development'
  ]

  if (status === 'loading') {
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
          <div className="flex items-center space-x-4">
            <Link
              href="/instructor/courses"
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
              <p className="text-gray-600 mt-2">Upload course content and materials</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error/Success Messages */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <XMarkIcon className="h-5 w-5 text-red-400" />
              <div className="ml-3">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex">
              <CheckIcon className="h-5 w-5 text-green-400" />
              <div className="ml-3">
                <p className="text-sm text-green-800">{success}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Course Information</h2>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Course Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Course Title *
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="input-field"
                placeholder="Enter course title"
                required
              />
            </div>

            {/* Course Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Course Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="input-field"
                placeholder="Describe what students will learn in this course"
                required
              />
            </div>

            {/* Course Thumbnail */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course Thumbnail
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {thumbnailPreview ? (
                    <div className="mb-4">
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail preview"
                        className="mx-auto h-32 w-auto rounded-lg"
                      />
                    </div>
                  ) : (
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                  )}
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="thumbnail"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="thumbnail"
                        name="thumbnail"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={handleThumbnailChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>
            </div>

            {/* Course Category */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="input-field"
                required
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Course Tags */}
            <div>
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                className="input-field"
                placeholder="Enter tags separated by commas (e.g., JavaScript, React, Web Development)"
              />
              <p className="mt-1 text-sm text-gray-500">
                Tags help students find your course. Separate multiple tags with commas.
              </p>
            </div>

            {/* Course Price */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">
                Course Price (₹) *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <CurrencyRupeeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                  className="input-field pl-10"
                  placeholder="0"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <p className="mt-1 text-sm text-gray-500">
                Set the price for your course. You can offer it for free by setting the price to 0.
              </p>
            </div>

            {/* Course Requirements */}
            <div>
              <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 mb-2">
                Course Requirements
              </label>
              <textarea
                id="requirements"
                rows={3}
                className="input-field"
                placeholder="What should students know before taking this course?"
              />
              <p className="mt-1 text-sm text-gray-500">
                List any prerequisites or requirements for students taking this course.
              </p>
            </div>

            {/* Learning Outcomes */}
            <div>
              <label htmlFor="outcomes" className="block text-sm font-medium text-gray-700 mb-2">
                Learning Outcomes
              </label>
              <textarea
                id="outcomes"
                rows={3}
                className="input-field"
                placeholder="What will students be able to do after completing this course?"
              />
              <p className="mt-1 text-sm text-gray-500">
                Describe the skills and knowledge students will gain from this course.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
              <Link
                href="/instructor/courses"
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex items-center"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : (
                  <PlusIcon className="h-4 w-4 mr-2" />
                )}
                {loading ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </form>
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Creating a Great Course</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Course Title</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Make it clear and descriptive</li>
                <li>• Include the main topic or skill</li>
                <li>• Keep it under 60 characters</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Course Description</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Explain what students will learn</li>
                <li>• Highlight key benefits</li>
                <li>• Use clear, engaging language</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Pricing Strategy</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Research similar courses</li>
                <li>• Consider your expertise level</li>
                <li>• Start with competitive pricing</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Course Structure</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Plan your curriculum carefully</li>
                <li>• Include practical exercises</li>
                <li>• Provide clear learning objectives</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
