'use client'

import { useState } from 'react'
import {
  PlusIcon, XMarkIcon, Bars3Icon, VideoCameraIcon, DocumentTextIcon,
  ClipboardDocumentListIcon, QuestionMarkCircleIcon, ClockIcon,
  ArrowUpTrayIcon, EyeIcon, LockClosedIcon, PlayIcon
} from '@heroicons/react/24/outline'

interface Module {
  id: string
  title: string
  description: string
  order: number
  lessons: Lesson[]
  isLocked: boolean
  unlockAfterDays?: number
  unlockDate?: string
}

interface Lesson {
  id: string
  title: string
  description: string
  type: 'video' | 'document' | 'quiz' | 'assignment'
  content: File | null
  duration: number // in seconds
  resources: { name: string; file: File | null; url: string }[]
  order: number
  isPreview: boolean
  isLocked: boolean
}

interface CurriculumBuilderProps {
  modules: Module[]
  onModulesChange: (modules: Module[]) => void
  onSave: () => void
}

export default function CurriculumBuilder({ modules, onModulesChange, onSave }: CurriculumBuilderProps) {
  const [draggedItem, setDraggedItem] = useState<{ type: 'module' | 'lesson', moduleId?: string, lessonId?: string } | null>(null)
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set())

  const addModule = () => {
    const newModule: Module = {
      id: `module-${Date.now()}`,
      title: '',
      description: '',
      order: modules.length,
      lessons: [],
      isLocked: false
    }
    onModulesChange([...modules, newModule])
    setExpandedModules(prev => new Set([...prev, newModule.id]))
  }

  const updateModule = (moduleId: string, field: keyof Module, value: any) => {
    onModulesChange(modules.map(module => 
      module.id === moduleId ? { ...module, [field]: value } : module
    ))
  }

  const deleteModule = (moduleId: string) => {
    onModulesChange(modules.filter(module => module.id !== moduleId))
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      newSet.delete(moduleId)
      return newSet
    })
  }

  const addLesson = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId)
    if (!module) return

    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: '',
      description: '',
      type: 'video',
      content: null,
      duration: 0,
      resources: [],
      order: module.lessons.length,
      isPreview: false,
      isLocked: false
    }
    
    onModulesChange(modules.map(module => 
      module.id === moduleId 
        ? { ...module, lessons: [...module.lessons, newLesson] }
        : module
    ))
  }

  const updateLesson = (moduleId: string, lessonId: string, field: keyof Lesson, value: any) => {
    onModulesChange(modules.map(module => 
      module.id === moduleId 
        ? {
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
            )
          }
        : module
    ))
  }

  const deleteLesson = (moduleId: string, lessonId: string) => {
    onModulesChange(modules.map(module => 
      module.id === moduleId 
        ? { ...module, lessons: module.lessons.filter(lesson => lesson.id !== lessonId) }
        : module
    ))
  }

  const handleFileUpload = (moduleId: string, lessonId: string, file: File) => {
    updateLesson(moduleId, lessonId, 'content', file)
    
    // Auto-detect duration for video files
    if (file.type.startsWith('video/')) {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.onloadedmetadata = () => {
        updateLesson(moduleId, lessonId, 'duration', Math.round(video.duration))
      }
      video.src = URL.createObjectURL(file)
    }
  }

  const toggleModuleExpansion = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev)
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId)
      } else {
        newSet.add(moduleId)
      }
      return newSet
    })
  }

  const getLessonIcon = (type: string) => {
    switch (type) {
      case 'video': return <VideoCameraIcon className="h-4 w-4" />
      case 'document': return <DocumentTextIcon className="h-4 w-4" />
      case 'quiz': return <QuestionMarkCircleIcon className="h-4 w-4" />
      case 'assignment': return <ClipboardDocumentListIcon className="h-4 w-4" />
      default: return <DocumentTextIcon className="h-4 w-4" />
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const handleDragStart = (e: React.DragEvent, type: 'module' | 'lesson', moduleId?: string, lessonId?: string) => {
    setDraggedItem({ type, moduleId, lessonId })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetModuleId: string, targetLessonId?: string) => {
    e.preventDefault()
    
    if (!draggedItem) return

    if (draggedItem.type === 'module') {
      // Reorder modules
      const draggedModule = modules.find(m => m.id === draggedItem.moduleId)
      const targetModule = modules.find(m => m.id === targetModuleId)
      
      if (draggedModule && targetModule) {
        const newModules = modules.filter(m => m.id !== draggedModule.id)
        const targetIndex = newModules.findIndex(m => m.id === targetModuleId)
        newModules.splice(targetIndex, 0, draggedModule)
        
        // Update order
        const updatedModules = newModules.map((module, index) => ({
          ...module,
          order: index
        }))
        
        onModulesChange(updatedModules)
      }
    } else if (draggedItem.type === 'lesson' && draggedItem.moduleId) {
      // Move lesson between modules or reorder within module
      const sourceModule = modules.find(m => m.id === draggedItem.moduleId)
      const targetModule = modules.find(m => m.id === targetModuleId)
      
      if (sourceModule && targetModule) {
        const draggedLesson = sourceModule.lessons.find(l => l.id === draggedItem.lessonId)
        
        if (draggedLesson) {
          // Remove from source module
          const updatedSourceModule = {
            ...sourceModule,
            lessons: sourceModule.lessons.filter(l => l.id !== draggedLesson.id)
          }
          
          // Add to target module
          const updatedTargetModule = {
            ...targetModule,
            lessons: [...targetModule.lessons, { ...draggedLesson, order: targetModule.lessons.length }]
          }
          
          onModulesChange(modules.map(module => 
            module.id === sourceModule.id ? updatedSourceModule :
            module.id === targetModule.id ? updatedTargetModule : module
          ))
        }
      }
    }
    
    setDraggedItem(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
          <p className="text-gray-600">Build your course structure with modules and lessons</p>
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <EyeIcon className="h-4 w-4 mr-2" />
            Preview
          </button>
          <button
            type="button"
            onClick={addModule}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Module
          </button>
        </div>
      </div>

      {/* Modules List */}
      {modules.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No modules yet</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first module.</p>
          <div className="mt-6">
            <button
              type="button"
              onClick={addModule}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
            >
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Module
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {modules.map((module, moduleIndex) => (
            <div
              key={module.id}
              className="border border-gray-200 rounded-lg bg-white shadow-sm"
              draggable
              onDragStart={(e) => handleDragStart(e, 'module', module.id)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, module.id)}
            >
              {/* Module Header */}
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Bars3Icon className="h-5 w-5 text-gray-400 cursor-move" />
                    <div className="flex-1">
                      <input
                        type="text"
                        value={module.title}
                        onChange={(e) => updateModule(module.id, 'title', e.target.value)}
                        className="w-full text-lg font-semibold text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                        placeholder="Module title"
                      />
                      <textarea
                        value={module.description}
                        onChange={(e) => updateModule(module.id, 'description', e.target.value)}
                        className="w-full mt-1 text-sm text-gray-600 bg-transparent border-none focus:ring-0 p-0 resize-none"
                        placeholder="Module description"
                        rows={2}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">
                      {module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => toggleModuleExpansion(module.id)}
                      className="p-2 text-gray-400 hover:text-gray-600"
                    >
                      {expandedModules.has(module.id) ? (
                        <XMarkIcon className="h-4 w-4" />
                      ) : (
                        <PlusIcon className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteModule(module.id)}
                      className="p-2 text-red-600 hover:text-red-800"
                    >
                      <XMarkIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Module Content */}
              {expandedModules.has(module.id) && (
                <div className="p-4">
                  {/* Drip Settings */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Module Release Settings</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`module-locked-${module.id}`}
                          checked={module.isLocked}
                          onChange={(e) => updateModule(module.id, 'isLocked', e.target.checked)}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`module-locked-${module.id}`} className="ml-2 text-sm text-gray-700">
                          Lock this module
                        </label>
                      </div>
                      
                      {module.isLocked && (
                        <div>
                          <label className="block text-xs text-gray-600 mb-1">
                            Unlock after (days)
                          </label>
                          <input
                            type="number"
                            value={module.unlockAfterDays || 7}
                            onChange={(e) => updateModule(module.id, 'unlockAfterDays', parseInt(e.target.value) || 7)}
                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500"
                            min="1"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Lessons */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">Lessons</h4>
                      <button
                        type="button"
                        onClick={() => addLesson(module.id)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <PlusIcon className="h-3 w-3 mr-1" />
                        Add Lesson
                      </button>
                    </div>

                    {module.lessons.length === 0 ? (
                      <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
                        <DocumentTextIcon className="mx-auto h-8 w-8 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">No lessons yet</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div
                            key={lesson.id}
                            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                            draggable
                            onDragStart={(e) => handleDragStart(e, 'lesson', module.id, lesson.id)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, module.id, lesson.id)}
                          >
                            <Bars3Icon className="h-4 w-4 text-gray-400 cursor-move" />
                            
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                {getLessonIcon(lesson.type)}
                                <input
                                  type="text"
                                  value={lesson.title}
                                  onChange={(e) => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                                  className="flex-1 text-sm font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                                  placeholder="Lesson title"
                                />
                                {lesson.duration > 0 && (
                                  <span className="text-xs text-gray-500 flex items-center">
                                    <ClockIcon className="h-3 w-3 mr-1" />
                                    {formatDuration(lesson.duration)}
                                  </span>
                                )}
                                {lesson.isPreview && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                    Preview
                                  </span>
                                )}
                                {lesson.isLocked && (
                                  <LockClosedIcon className="h-4 w-4 text-gray-400" />
                                )}
                              </div>
                              
                              <textarea
                                value={lesson.description}
                                onChange={(e) => updateLesson(module.id, lesson.id, 'description', e.target.value)}
                                className="w-full mt-1 text-xs text-gray-600 bg-transparent border-none focus:ring-0 p-0 resize-none"
                                placeholder="Lesson description"
                                rows={1}
                              />
                            </div>

                            <div className="flex items-center space-x-2">
                              <select
                                value={lesson.type}
                                onChange={(e) => updateLesson(module.id, lesson.id, 'type', e.target.value)}
                                className="text-xs border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="video">🎥 Video</option>
                                <option value="document">📄 Document</option>
                                <option value="quiz">📝 Quiz</option>
                                <option value="assignment">📂 Assignment</option>
                              </select>

                              <label className="relative cursor-pointer">
                                <input
                                  type="file"
                                  className="sr-only"
                                  accept={lesson.type === 'video' ? 'video/*' : 'application/pdf,.doc,.docx'}
                                  onChange={(e) => e.target.files?.[0] && handleFileUpload(module.id, lesson.id, e.target.files[0])}
                                />
                                <div className="p-1 text-primary-600 hover:text-primary-800">
                                  <ArrowUpTrayIcon className="h-4 w-4" />
                                </div>
                              </label>

                              <div className="flex items-center space-x-1">
                                <button
                                  type="button"
                                  onClick={() => updateLesson(module.id, lesson.id, 'isPreview', !lesson.isPreview)}
                                  className={`p-1 rounded ${
                                    lesson.isPreview 
                                      ? 'text-blue-600 bg-blue-100' 
                                      : 'text-gray-400 hover:text-gray-600'
                                  }`}
                                  title="Toggle preview"
                                >
                                  <EyeIcon className="h-4 w-4" />
                                </button>
                                
                                <button
                                  type="button"
                                  onClick={() => updateLesson(module.id, lesson.id, 'isLocked', !lesson.isLocked)}
                                  className={`p-1 rounded ${
                                    lesson.isLocked 
                                      ? 'text-red-600 bg-red-100' 
                                      : 'text-gray-400 hover:text-gray-600'
                                  }`}
                                  title="Toggle lock"
                                >
                                  <LockClosedIcon className="h-4 w-4" />
                                </button>

                                <button
                                  type="button"
                                  onClick={() => deleteLesson(module.id, lesson.id)}
                                  className="p-1 text-red-600 hover:text-red-800"
                                >
                                  <XMarkIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Summary */}
      {modules.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-2">Course Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-blue-700">Modules:</span>
              <span className="ml-1 font-medium">{modules.length}</span>
            </div>
            <div>
              <span className="text-blue-700">Total Lessons:</span>
              <span className="ml-1 font-medium">
                {modules.reduce((total, module) => total + module.lessons.length, 0)}
              </span>
            </div>
            <div>
              <span className="text-blue-700">Video Lessons:</span>
              <span className="ml-1 font-medium">
                {modules.reduce((total, module) => 
                  total + module.lessons.filter(lesson => lesson.type === 'video').length, 0
                )}
              </span>
            </div>
            <div>
              <span className="text-blue-700">Total Duration:</span>
              <span className="ml-1 font-medium">
                {formatDuration(modules.reduce((total, module) => 
                  total + module.lessons.reduce((lessonTotal, lesson) => lessonTotal + lesson.duration, 0), 0
                ))}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
