'use client'

import { useState } from 'react'
import { 
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  CheckIcon
} from '@heroicons/react/24/outline'

interface Tag {
  id: string
  name: string
  slug: string
  color: string
  _count: {
    posts: number
  }
}

interface TagManagementModalProps {
  tags: Tag[]
  onClose: () => void
  onSuccess: () => void
}

export default function TagManagementModal({ tags, onClose, onSuccess }: TagManagementModalProps) {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    color: '#10B981'
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setLoading(true)
    try {
      const response = await fetch('/api/blog/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({ name: '', description: '', color: '#10B981' })
        setShowCreateForm(false)
        onSuccess()
      } else {
        const data = await response.json()
        setErrors({ submit: data.error || 'Error creating tag' })
      }
    } catch (error) {
      console.error('Error creating tag:', error)
      setErrors({ submit: 'Error creating tag' })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm() || !editingTag) return

    setLoading(true)
    try {
      const response = await fetch(`/api/blog/tags/${editingTag.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setFormData({ name: '', description: '', color: '#10B981' })
        setEditingTag(null)
        onSuccess()
      } else {
        const data = await response.json()
        setErrors({ submit: data.error || 'Error updating tag' })
      }
    } catch (error) {
      console.error('Error updating tag:', error)
      setErrors({ submit: 'Error updating tag' })
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (tagId: string) => {
    if (!confirm('Are you sure you want to delete this tag? This will remove it from all posts.')) return

    try {
      const response = await fetch(`/api/blog/tags/${tagId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        onSuccess()
      } else {
        const data = await response.json()
        alert(data.error || 'Error deleting tag')
      }
    } catch (error) {
      console.error('Error deleting tag:', error)
      alert('Error deleting tag')
    }
  }

  const startEdit = (tag: Tag) => {
    setEditingTag(tag)
    setFormData({
      name: tag.name,
      description: '',
      color: tag.color
    })
    setShowCreateForm(false)
  }

  const cancelEdit = () => {
    setEditingTag(null)
    setFormData({ name: '', description: '', color: '#10B981' })
    setErrors({})
  }

  const cancelCreate = () => {
    setShowCreateForm(false)
    setFormData({ name: '', description: '', color: '#10B981' })
    setErrors({})
  }

  const predefinedColors = [
    '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6',
    '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'
  ]

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-4xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Manage Tags</h3>
              <p className="text-sm text-gray-600">Add flexible tags to organize your blog posts</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-primary inline-flex items-center"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Tag
              </button>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Create/Edit Form */}
          {(showCreateForm || editingTag) && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <h4 className="text-md font-medium text-gray-900 mb-4">
                {editingTag ? 'Edit Tag' : 'Create New Tag'}
              </h4>
              <form onSubmit={editingTag ? handleEdit : handleCreate} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`input-field ${errors.name ? 'border-red-500' : ''}`}
                      placeholder="Tag name"
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => handleInputChange('color', e.target.value)}
                        className="w-10 h-10 border border-gray-300 rounded cursor-pointer"
                      />
                      <div className="flex flex-wrap gap-1">
                        {predefinedColors.map((color) => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => handleInputChange('color', color)}
                            className={`w-6 h-6 rounded border-2 ${
                              formData.color === color ? 'border-gray-400' : 'border-gray-200'
                            }`}
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="input-field"
                    placeholder="Tag description (optional)"
                  />
                </div>
                {errors.submit && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-3">
                    <p className="text-red-800 text-sm">{errors.submit}</p>
                  </div>
                )}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={editingTag ? cancelEdit : cancelCreate}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary"
                  >
                    {loading ? 'Saving...' : (editingTag ? 'Update Tag' : 'Create Tag')}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tags List */}
          <div className="space-y-4">
            {tags.length === 0 ? (
              <div className="text-center py-8">
                <TagIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tags yet</h3>
                <p className="text-gray-600 mb-4">Create your first tag to categorize your blog posts.</p>
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary inline-flex items-center"
                >
                  <PlusIcon className="h-4 w-4 mr-2" />
                  Create Tag
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {tags.map((tag) => (
                  <div key={tag.id} className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: tag.color }}
                        />
                        <div>
                          <h4 className="font-medium text-gray-900 text-sm">{tag.name}</h4>
                          <p className="text-xs text-gray-500">{tag._count.posts} posts</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => startEdit(tag)}
                          className="text-primary-600 hover:text-primary-900 p-1"
                          title="Edit tag"
                        >
                          <PencilIcon className="h-3 w-3" />
                        </button>
                        <button
                          onClick={() => handleDelete(tag.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete tag"
                        >
                          <TrashIcon className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
