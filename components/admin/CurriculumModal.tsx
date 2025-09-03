'use client'

import { useState, useEffect } from 'react'
import { 
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PlayIcon,
  DocumentTextIcon,
  PhotoIcon,
  AcademicCapIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

interface Course {
  id: string
  title: string
  description: string
  price: number
  category: string | null
  tags: string | null
  status: string
  createdAt: string
  instructor: {
    id: string
    name: string
    email: string
  }
  _count: {
    modules: number
    enrollments: number
    reviews: number
  }
}

interface Module {
  id: string
  title: string
  description: string | null
  order: number
  contents: Content[]
}

interface Content {
  id: string
  title: string
  description: string | null
  type: string
  url: string | null
  content: string | null
  order: number
}

interface CurriculumModalProps {
  course: Course
  onClose: () => void
}

export default function CurriculumModal({ course, onClose }: CurriculumModalProps) {
  const [modules, setModules] = useState<Module[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())
  const [showAddModule, setShowAddModule] = useState(false)
  const [showAddContent, setShowAddContent] = useState<string | null>(null)
  const [editingModule, setEditingModule] = useState<Module | null>(null)
  const [editingContent, setEditingContent] = useState<Content | null>(null)

  // Fetch modules and contents
  const fetchModules = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/admin/courses/${course.id}/modules`)
      const data = await response.json()

      if (response.ok) {
        setModules(data.modules)
        // Auto-expand first module
        if (data.modules.length > 0) {
          setExpandedModules(new Set([data.modules[0].id]))
        }
      } else {
        console.error('Error fetching modules:', data.error)
      }
    } catch (error) {
      console.error('Error fetching modules:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchModules()
  }, [course.id])

  const toggleModule = (moduleId: string) => {
    const newExpanded = new Set(expandedModules)
    if (newExpanded.has(moduleId)) {
      newExpanded.delete(moduleId)
    } else {
      newExpanded.add(moduleId)
    }
    setExpandedModules(newExpanded)
  }

  const handleAddModule = async (title: string, description: string) => {
    try {
      const response = await fetch(`/api/admin/courses/${course.id}/modules`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      })

      if (response.ok) {
        fetchModules()
        setShowAddModule(false)
      } else {
        const data = await response.json()
        alert(data.error || 'Error creating module')
      }
    } catch (error) {
      console.error('Error creating module:', error)
      alert('Error creating module')
    }
  }

  const handleEditModule = async (moduleId: string, title: string, description: string) => {
    try {
      const response = await fetch(`/api/admin/courses/${course.id}/modules/${moduleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description })
      })

      if (response.ok) {
        fetchModules()
        setEditingModule(null)
      } else {
        const data = await response.json()
        alert(data.error || 'Error updating module')
      }
    } catch (error) {
      console.error('Error updating module:', error)
      alert('Error updating module')
    }
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!confirm('Are you sure you want to delete this module? This will also delete all its contents.')) return

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/modules/${moduleId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchModules()
      } else {
        const data = await response.json()
        alert(data.error || 'Error deleting module')
      }
    } catch (error) {
      console.error('Error deleting module:', error)
      alert('Error deleting module')
    }
  }

  const handleAddContent = async (moduleId: string, contentData: any) => {
    try {
      const response = await fetch(`/api/admin/courses/${course.id}/modules/${moduleId}/contents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentData)
      })

      if (response.ok) {
        fetchModules()
        setShowAddContent(null)
      } else {
        const data = await response.json()
        alert(data.error || 'Error creating content')
      }
    } catch (error) {
      console.error('Error creating content:', error)
      alert('Error creating content')
    }
  }

  const handleEditContent = async (moduleId: string, contentId: string, contentData: any) => {
    try {
      const response = await fetch(`/api/admin/courses/${course.id}/modules/${moduleId}/contents/${contentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentData)
      })

      if (response.ok) {
        fetchModules()
        setEditingContent(null)
      } else {
        const data = await response.json()
        alert(data.error || 'Error updating content')
      }
    } catch (error) {
      console.error('Error updating content:', error)
      alert('Error updating content')
    }
  }

  const handleDeleteContent = async (moduleId: string, contentId: string) => {
    if (!confirm('Are you sure you want to delete this content?')) return

    try {
      const response = await fetch(`/api/admin/courses/${course.id}/modules/${moduleId}/contents/${contentId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchModules()
      } else {
        const data = await response.json()
        alert(data.error || 'Error deleting content')
      }
    } catch (error) {
      console.error('Error deleting content:', error)
      alert('Error deleting content')
    }
  }

  const getContentIcon = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return <PlayIcon className="h-4 w-4" />
      case 'PDF':
        return <DocumentTextIcon className="h-4 w-4" />
      case 'TEXT':
        return <DocumentTextIcon className="h-4 w-4" />
      default:
        return <DocumentTextIcon className="h-4 w-4" />
    }
  }

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'VIDEO':
        return 'text-red-600 bg-red-100'
      case 'PDF':
        return 'text-blue-600 bg-blue-100'
      case 'TEXT':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-6xl shadow-lg rounded-md bg-white">
        <div className="mt-3">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Curriculum Management</h3>
              <p className="text-sm text-gray-600">{course.title}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Add Module Button */}
          <div className="mb-4">
            <button
              onClick={() => setShowAddModule(true)}
              className="btn-primary inline-flex items-center"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Module
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading curriculum...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {modules.map((module) => (
                <div key={module.id} className="border border-gray-200 rounded-lg">
                  {/* Module Header */}
                  <div className="p-4 bg-gray-50 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => toggleModule(module.id)}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          {expandedModules.has(module.id) ? (
                            <ChevronDownIcon className="h-5 w-5" />
                          ) : (
                            <ChevronRightIcon className="h-5 w-5" />
                          )}
                        </button>
                        <AcademicCapIcon className="h-5 w-5 text-primary-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">{module.title}</h4>
                          {module.description && (
                            <p className="text-sm text-gray-600">{module.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">
                          {module.contents.length} items
                        </span>
                        <button
                          onClick={() => setEditingModule(module)}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteModule(module.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setShowAddContent(module.id)}
                          className="text-green-600 hover:text-green-900"
                        >
                          <PlusIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Module Contents */}
                  {expandedModules.has(module.id) && (
                    <div className="p-4">
                      {module.contents.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">No content added yet</p>
                      ) : (
                        <div className="space-y-2">
                          {module.contents.map((content) => (
                            <div key={content.id} className="flex items-center justify-between p-3 bg-white border border-gray-200 rounded">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded ${getContentTypeColor(content.type)}`}>
                                  {getContentIcon(content.type)}
                                </div>
                                <div>
                                  <h5 className="font-medium text-gray-900">{content.title}</h5>
                                  {content.description && (
                                    <p className="text-sm text-gray-600">{content.description}</p>
                                  )}
                                  <span className="text-xs text-gray-500">{content.type}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setEditingContent(content)}
                                  className="text-primary-600 hover:text-primary-900"
                                >
                                  <PencilIcon className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteContent(module.id, content.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {modules.length === 0 && (
                <div className="text-center py-8">
                  <AcademicCapIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No modules yet</h3>
                  <p className="text-gray-600">Start building your course curriculum by adding modules.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add Module Modal */}
      {showAddModule && (
        <AddModuleModal
          onClose={() => setShowAddModule(false)}
          onSave={handleAddModule}
        />
      )}

      {/* Edit Module Modal */}
      {editingModule && (
        <EditModuleModal
          module={editingModule}
          onClose={() => setEditingModule(null)}
          onSave={(title, description) => handleEditModule(editingModule.id, title, description)}
        />
      )}

      {/* Add Content Modal */}
      {showAddContent && (
        <AddContentModal
          moduleId={showAddContent}
          onClose={() => setShowAddContent(null)}
          onSave={(contentData) => handleAddContent(showAddContent, contentData)}
        />
      )}

      {/* Edit Content Modal */}
      {editingContent && (
        <EditContentModal
          content={editingContent}
          onClose={() => setEditingContent(null)}
          onSave={(contentData) => handleEditContent(editingContent.id, editingContent.id, contentData)}
        />
      )}
    </div>
  )
}

// Add Module Modal Component
function AddModuleModal({ onClose, onSave }: { onClose: () => void; onSave: (title: string, description: string) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSave(title.trim(), description.trim())
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Module</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
              placeholder="Module title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              placeholder="Module description"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Add Module
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Module Modal Component
function EditModuleModal({ module, onClose, onSave }: { module: Module; onClose: () => void; onSave: (title: string, description: string) => void }) {
  const [title, setTitle] = useState(module.title)
  const [description, setDescription] = useState(module.description || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSave(title.trim(), description.trim())
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Module</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Update Module
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Add Content Modal Component
function AddContentModal({ moduleId, onClose, onSave }: { moduleId: string; onClose: () => void; onSave: (contentData: any) => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('VIDEO')
  const [url, setUrl] = useState('')
  const [content, setContent] = useState('')
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (file: File) => {
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/admin/upload/video', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (response.ok) {
        setUrl(data.url)
      } else {
        alert(data.error || 'Error uploading file')
      }
    } catch (error) {
      console.error('Error uploading file:', error)
      alert('Error uploading file')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSave({
        title: title.trim(),
        description: description.trim(),
        type,
        url: url.trim(),
        content: content.trim()
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Content</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
                placeholder="Content title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="input-field"
              >
                <option value="VIDEO">Video</option>
                <option value="PDF">PDF</option>
                <option value="TEXT">Text</option>
                <option value="QUIZ">Quiz</option>
                <option value="ASSIGNMENT">Assignment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
              placeholder="Content description"
            />
          </div>

          {type === 'VIDEO' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Video File</label>
              <input
                type="file"
                accept="video/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) handleFileUpload(file)
                }}
                className="input-field"
                disabled={uploading}
              />
              {uploading && <p className="text-sm text-gray-600 mt-1">Uploading...</p>}
              {url && <p className="text-sm text-green-600 mt-1">✓ File uploaded successfully</p>}
            </div>
          )}

          {type === 'PDF' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">PDF URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input-field"
                placeholder="https://example.com/document.pdf"
              />
            </div>
          )}

          {type === 'TEXT' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Text Content</label>
              <textarea
                rows={6}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="input-field"
                placeholder="Enter text content here..."
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Add Content
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Edit Content Modal Component
function EditContentModal({ content, onClose, onSave }: { content: Content; onClose: () => void; onSave: (contentData: any) => void }) {
  const [title, setTitle] = useState(content.title)
  const [description, setDescription] = useState(content.description || '')
  const [type, setType] = useState(content.type)
  const [url, setUrl] = useState(content.url || '')
  const [textContent, setTextContent] = useState(content.content || '')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onSave({
        title: title.trim(),
        description: description.trim(),
        type,
        url: url.trim(),
        content: textContent.trim()
      })
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-60">
      <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Content</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="input-field"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="input-field"
              >
                <option value="VIDEO">Video</option>
                <option value="PDF">PDF</option>
                <option value="TEXT">Text</option>
                <option value="QUIZ">Quiz</option>
                <option value="ASSIGNMENT">Assignment</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-field"
            />
          </div>

          {type === 'VIDEO' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Video URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input-field"
                placeholder="https://example.com/video.mp4"
              />
            </div>
          )}

          {type === 'PDF' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">PDF URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="input-field"
                placeholder="https://example.com/document.pdf"
              />
            </div>
          )}

          {type === 'TEXT' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Text Content</label>
              <textarea
                rows={6}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                className="input-field"
                placeholder="Enter text content here..."
              />
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              Update Content
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
