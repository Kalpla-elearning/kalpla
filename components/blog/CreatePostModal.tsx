'use client'

import { useState, useEffect } from 'react'
import { 
  XMarkIcon,
  EyeIcon,
  CalendarIcon,
  LockClosedIcon,
  GlobeAltIcon,
  PhotoIcon,
  TagIcon,
  FolderIcon,
  DocumentTextIcon,
  CheckIcon
} from '@heroicons/react/24/outline'
import SimpleTiptapEditor from './SimpleTiptapEditor'

interface Category {
  id: string
  name: string
  slug: string
  color: string
  _count: {
    posts: number
  }
}

interface Tag {
  id: string
  name: string
  slug: string
  color: string
  _count: {
    posts: number
  }
}

interface CreatePostModalProps {
  categories: Category[]
  tags: Tag[]
  onClose: () => void
  onSuccess: () => void
}

export default function CreatePostModal({ categories, tags, onClose, onSuccess }: CreatePostModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    featuredImage: '',
    status: 'DRAFT',
    visibility: 'PUBLIC',
    password: '',
    publishedAt: '',
    scheduledAt: '',
    categoryIds: [] as string[],
    tagIds: [] as string[],
    metaTitle: '',
    metaDescription: ''
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)
  const [showSeoFields, setShowSeoFields] = useState(false)

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/(^-|-$)/g, '')
      
      if (!formData.metaTitle) {
        setFormData(prev => ({ ...prev, metaTitle: formData.title }))
      }
      if (!formData.metaDescription && formData.excerpt) {
        setFormData(prev => ({ ...prev, metaDescription: formData.excerpt }))
      }
    }
  }, [formData.title, formData.excerpt])

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleCategoryToggle = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }))
  }

  const handleTagToggle = (tagId: string) => {
    setFormData(prev => ({
      ...prev,
      tagIds: prev.tagIds.includes(tagId)
        ? prev.tagIds.filter(id => id !== tagId)
        : [...prev.tagIds, tagId]
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required'
    }

    if (formData.visibility === 'PASSWORD_PROTECTED' && !formData.password.trim()) {
      newErrors.password = 'Password is required for password-protected posts'
    }

    if (formData.status === 'SCHEDULED' && !formData.scheduledAt) {
      newErrors.scheduledAt = 'Scheduled date is required for scheduled posts'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        onSuccess()
      } else {
        const data = await response.json()
        setErrors({ submit: data.error || 'Error creating post' })
      }
    } catch (error) {
      console.error('Error creating post:', error)
      setErrors({ submit: 'Error creating post' })
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return <GlobeAltIcon className="h-4 w-4" />
      case 'DRAFT':
        return <DocumentTextIcon className="h-4 w-4" />
      case 'PRIVATE':
        return <LockClosedIcon className="h-4 w-4" />
      case 'SCHEDULED':
        return <CalendarIcon className="h-4 w-4" />
      default:
        return <DocumentTextIcon className="h-4 w-4" />
    }
  }

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'PUBLIC':
        return <GlobeAltIcon className="h-4 w-4" />
      case 'PRIVATE':
        return <LockClosedIcon className="h-4 w-4" />
      case 'PASSWORD_PROTECTED':
        return <LockClosedIcon className="h-4 w-4" />
      default:
        return <GlobeAltIcon className="h-4 w-4" />
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-4 mx-auto p-0 border w-full max-w-6xl shadow-lg rounded-md bg-white">
        <div className="flex h-screen">
          {/* Main Content Area */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200 bg-white">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Add New Post</h2>
                <p className="text-sm text-gray-600">Create a new blog post</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="btn-secondary inline-flex items-center"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  {showPreview ? 'Edit' : 'Preview'}
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6">
              {showPreview ? (
                <div className="max-w-4xl mx-auto">
                  <div className="bg-white border border-gray-200 rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">{formData.title || 'Untitled'}</h1>
                    {formData.excerpt && (
                      <p className="text-lg text-gray-600 mb-6 italic">{formData.excerpt}</p>
                    )}
                    <div 
                      className="prose prose-lg max-w-none"
                      dangerouslySetInnerHTML={{ __html: formData.content || '<p>No content yet...</p>' }}
                    />
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Post Title *
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`input-field text-2xl font-bold ${errors.title ? 'border-red-500' : ''}`}
                      placeholder="Enter post title..."
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                  </div>

                  {/* Excerpt */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Excerpt
                    </label>
                    <textarea
                      rows={3}
                      value={formData.excerpt}
                      onChange={(e) => handleInputChange('excerpt', e.target.value)}
                      className="input-field"
                      placeholder="Write a brief excerpt for this post..."
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.excerpt.length}/160 characters
                    </p>
                  </div>

                  {/* Content */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <SimpleTiptapEditor
                      content={formData.content}
                      onChange={(content) => handleInputChange('content', content)}
                      placeholder="Start writing your post..."
                    />
                    {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                  </div>

                  {/* Featured Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Featured Image
                    </label>
                    <div className="flex items-center space-x-4">
                      <input
                        type="url"
                        value={formData.featuredImage}
                        onChange={(e) => handleInputChange('featuredImage', e.target.value)}
                        className="input-field flex-1"
                        placeholder="Enter image URL..."
                      />
                      <button
                        type="button"
                        className="btn-secondary inline-flex items-center"
                      >
                        <PhotoIcon className="h-4 w-4 mr-2" />
                        Upload
                      </button>
                    </div>
                    {formData.featuredImage && (
                      <div className="mt-2">
                        <img
                          src={formData.featuredImage}
                          alt="Featured"
                          className="h-32 w-32 object-cover rounded border"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategoryToggle(category.id)}
                          className={`flex items-center justify-between p-3 border rounded-lg transition-colors ${
                            formData.categoryIds.includes(category.id)
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <div
                              className="w-3 h-3 rounded-full mr-2"
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="text-sm font-medium">{category.name}</span>
                          </div>
                          {formData.categoryIds.includes(category.id) && (
                            <CheckIcon className="h-4 w-4 text-primary-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {tags.map((tag) => (
                        <button
                          key={tag.id}
                          type="button"
                          onClick={() => handleTagToggle(tag.id)}
                          className={`flex items-center justify-between p-2 border rounded-lg transition-colors ${
                            formData.tagIds.includes(tag.id)
                              ? 'border-primary-500 bg-primary-50'
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center">
                            <div
                              className="w-2 h-2 rounded-full mr-2"
                              style={{ backgroundColor: tag.color }}
                            />
                            <span className="text-sm">{tag.name}</span>
                          </div>
                          {formData.tagIds.includes(tag.id) && (
                            <CheckIcon className="h-3 w-3 text-primary-600" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SEO Fields */}
                  <div>
                    <button
                      type="button"
                      onClick={() => setShowSeoFields(!showSeoFields)}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                      <span>SEO Settings</span>
                      <svg
                        className={`ml-2 h-4 w-4 transition-transform ${
                          showSeoFields ? 'rotate-180' : ''
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {showSeoFields && (
                      <div className="mt-4 space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meta Title
                          </label>
                          <input
                            type="text"
                            value={formData.metaTitle}
                            onChange={(e) => handleInputChange('metaTitle', e.target.value)}
                            className="input-field"
                            placeholder="SEO title for search engines..."
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            {formData.metaTitle.length}/60 characters
                          </p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Meta Description
                          </label>
                          <textarea
                            rows={3}
                            value={formData.metaDescription}
                            onChange={(e) => handleInputChange('metaDescription', e.target.value)}
                            className="input-field"
                            placeholder="SEO description for search engines..."
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            {formData.metaDescription.length}/160 characters
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-md p-4">
                      <p className="text-red-800">{errors.submit}</p>
                    </div>
                  )}
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-6 space-y-6">
              {/* Publish */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Publish</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="input-field"
                    >
                      <option value="DRAFT">Draft</option>
                      <option value="PUBLISHED">Published</option>
                      <option value="PRIVATE">Private</option>
                      <option value="SCHEDULED">Scheduled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                    <select
                      value={formData.visibility}
                      onChange={(e) => handleInputChange('visibility', e.target.value)}
                      className="input-field"
                    >
                      <option value="PUBLIC">Public</option>
                      <option value="PRIVATE">Private</option>
                      <option value="PASSWORD_PROTECTED">Password Protected</option>
                    </select>
                  </div>

                  {formData.visibility === 'PASSWORD_PROTECTED' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className={`input-field ${errors.password ? 'border-red-500' : ''}`}
                        placeholder="Enter password..."
                      />
                      {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                    </div>
                  )}

                  {formData.status === 'SCHEDULED' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Schedule</label>
                      <input
                        type="datetime-local"
                        value={formData.scheduledAt}
                        onChange={(e) => handleInputChange('scheduledAt', e.target.value)}
                        className={`input-field ${errors.scheduledAt ? 'border-red-500' : ''}`}
                      />
                      {errors.scheduledAt && <p className="text-red-500 text-sm mt-1">{errors.scheduledAt}</p>}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <button
                      type="submit"
                      onClick={handleSubmit}
                      disabled={loading}
                      className="btn-primary flex-1"
                    >
                      {loading ? 'Creating...' : 'Create Post'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>

              {/* Post Status */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Post Status</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      {getStatusIcon(formData.status)}
                      <span className="ml-2 text-sm font-medium capitalize">{formData.status.toLowerCase()}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-center">
                      {getVisibilityIcon(formData.visibility)}
                      <span className="ml-2 text-sm font-medium capitalize">
                        {formData.visibility.replace('_', ' ').toLowerCase()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Categories & Tags Summary */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Categories & Tags</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Categories ({formData.categoryIds.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.categoryIds.map((categoryId) => {
                        const category = categories.find(c => c.id === categoryId)
                        return category ? (
                          <span
                            key={categoryId}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: `${category.color}20`,
                              color: category.color
                            }}
                          >
                            {category.name}
                          </span>
                        ) : null
                      })}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-500 mb-2">Tags ({formData.tagIds.length})</p>
                    <div className="flex flex-wrap gap-1">
                      {formData.tagIds.map((tagId) => {
                        const tag = tags.find(t => t.id === tagId)
                        return tag ? (
                          <span
                            key={tagId}
                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                            style={{ 
                              backgroundColor: `${tag.color}20`,
                              color: tag.color
                            }}
                          >
                            {tag.name}
                          </span>
                        ) : null
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
