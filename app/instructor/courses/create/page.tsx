'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  PlusIcon, XMarkIcon, PhotoIcon, VideoCameraIcon, DocumentTextIcon,
  ClockIcon, CurrencyDollarIcon, TagIcon, AcademicCapIcon, CheckCircleIcon,
  ArrowRightIcon, ArrowLeftIcon, EyeIcon, SaveIcon, PlayIcon
} from '@heroicons/react/24/outline'

// Course Creation Steps
type Step = 'basic' | 'curriculum' | 'pricing' | 'preview' | 'publish'

interface CourseBasicInfo {
  title: string
  subtitle: string
  category: string
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  tags: string[]
  thumbnail: File | null
  trailerVideo: File | null
  description: string
  learningOutcomes: string[]
  targetAudience: string
}

interface Module {
  id: string
  title: string
  description: string
  order: number
  lessons: Lesson[]
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
}

interface CoursePricing {
  isFree: boolean
  price: number
  discountPrice?: number
  emiAvailable: boolean
  emiMonths: number
  currency: 'INR' | 'USD'
}

interface DripSettings {
  type: 'immediate' | 'sequential' | 'time_based' | 'date_based'
  timeDelay?: number // in days
  releaseDate?: string
  unlockAfterCompletion: boolean
}

export default function CreateCoursePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState<Step>('basic')
  const [isLoading, setIsLoading] = useState(false)
  
  // Form Data
  const [basicInfo, setBasicInfo] = useState<CourseBasicInfo>({
    title: '',
    subtitle: '',
    category: '',
    difficulty: 'beginner',
    tags: [],
    thumbnail: null,
    trailerVideo: null,
    description: '',
    learningOutcomes: [''],
    targetAudience: ''
  })
  
  const [modules, setModules] = useState<Module[]>([])
  const [pricing, setPricing] = useState<CoursePricing>({
    isFree: false,
    price: 0,
    currency: 'INR',
    emiAvailable: false,
    emiMonths: 3
  })
  
  const [dripSettings, setDripSettings] = useState<DripSettings>({
    type: 'immediate',
    unlockAfterCompletion: true
  })

  const steps = [
    { id: 'basic', name: 'Basic Info', icon: AcademicCapIcon },
    { id: 'curriculum', name: 'Curriculum', icon: DocumentTextIcon },
    { id: 'pricing', name: 'Pricing', icon: CurrencyDollarIcon },
    { id: 'preview', name: 'Preview', icon: EyeIcon },
    { id: 'publish', name: 'Publish', icon: CheckCircleIcon }
  ]

  const categories = [
    'Startup & Entrepreneurship',
    'Technology & Programming',
    'Business & Finance',
    'Marketing & Sales',
    'Design & Creative',
    'Personal Development',
    'Data Science & AI',
    'Digital Marketing'
  ]

  const handleBasicInfoChange = (field: keyof CourseBasicInfo, value: any) => {
    setBasicInfo(prev => ({ ...prev, [field]: value }))
  }

  const addModule = () => {
    const newModule: Module = {
      id: `module-${Date.now()}`,
      title: '',
      description: '',
      order: modules.length,
      lessons: []
    }
    setModules(prev => [...prev, newModule])
  }

  const updateModule = (moduleId: string, field: keyof Module, value: any) => {
    setModules(prev => prev.map(module => 
      module.id === moduleId ? { ...module, [field]: value } : module
    ))
  }

  const deleteModule = (moduleId: string) => {
    setModules(prev => prev.filter(module => module.id !== moduleId))
  }

  const addLesson = (moduleId: string) => {
    const newLesson: Lesson = {
      id: `lesson-${Date.now()}`,
      title: '',
      description: '',
      type: 'video',
      content: null,
      duration: 0,
      resources: [],
      order: 0,
      isPreview: false
    }
    
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, lessons: [...module.lessons, newLesson] }
        : module
    ))
  }

  const updateLesson = (moduleId: string, lessonId: string, field: keyof Lesson, value: any) => {
    setModules(prev => prev.map(module => 
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
    setModules(prev => prev.map(module => 
      module.id === moduleId 
        ? { ...module, lessons: module.lessons.filter(lesson => lesson.id !== lessonId) }
        : module
    ))
  }

  const handleFileUpload = (file: File, type: 'thumbnail' | 'trailer' | 'lesson') => {
    if (type === 'thumbnail') {
      setBasicInfo(prev => ({ ...prev, thumbnail: file }))
    } else if (type === 'trailer') {
      setBasicInfo(prev => ({ ...prev, trailerVideo: file }))
    }
  }

  const handleLessonFileUpload = (moduleId: string, lessonId: string, file: File) => {
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

  const addLearningOutcome = () => {
    setBasicInfo(prev => ({
      ...prev,
      learningOutcomes: [...prev.learningOutcomes, '']
    }))
  }

  const updateLearningOutcome = (index: number, value: string) => {
    setBasicInfo(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.map((outcome, i) => 
        i === index ? value : outcome
      )
    }))
  }

  const removeLearningOutcome = (index: number) => {
    setBasicInfo(prev => ({
      ...prev,
      learningOutcomes: prev.learningOutcomes.filter((_, i) => i !== index)
    }))
  }

  const nextStep = () => {
    const stepOrder = ['basic', 'curriculum', 'pricing', 'preview', 'publish']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1] as Step)
    }
  }

  const prevStep = () => {
    const stepOrder = ['basic', 'curriculum', 'pricing', 'preview', 'publish']
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1] as Step)
    }
  }

  const saveDraft = async () => {
    setIsLoading(true)
    try {
      // Save course as draft
      console.log('Saving course draft...', { basicInfo, modules, pricing, dripSettings })
      // API call to save draft
      setTimeout(() => {
        setIsLoading(false)
        alert('Course draft saved successfully!')
      }, 1000)
    } catch (error) {
      console.error('Error saving draft:', error)
      setIsLoading(false)
    }
  }

  const publishCourse = async () => {
    setIsLoading(true)
    try {
      // Publish course
      console.log('Publishing course...', { basicInfo, modules, pricing, dripSettings })
      // API call to publish
      setTimeout(() => {
        setIsLoading(false)
        alert('Course published successfully!')
        router.push('/instructor/courses')
      }, 2000)
    } catch (error) {
      console.error('Error publishing course:', error)
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case 'basic':
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Basic Information</h2>
              
              {/* Course Title & Subtitle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Title *
                  </label>
                  <input
                    type="text"
                    value={basicInfo.title}
                    onChange={(e) => handleBasicInfoChange('title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter course title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={basicInfo.subtitle}
                    onChange={(e) => handleBasicInfoChange('subtitle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Brief course description"
                  />
                </div>
              </div>

              {/* Category & Difficulty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    value={basicInfo.category}
                    onChange={(e) => handleBasicInfoChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">Select category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Difficulty Level *
                  </label>
                  <select
                    value={basicInfo.difficulty}
                    onChange={(e) => handleBasicInfoChange('difficulty', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={basicInfo.tags.join(', ')}
                  onChange={(e) => handleBasicInfoChange('tags', e.target.value.split(', ').filter(tag => tag.trim()))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter tags separated by commas"
                />
              </div>

              {/* Thumbnail Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Thumbnail *
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                        <span>Upload thumbnail</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'thumbnail')}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                </div>
                {basicInfo.thumbnail && (
                  <div className="mt-2 text-sm text-green-600">
                    ✓ {basicInfo.thumbnail.name} selected
                  </div>
                )}
              </div>

              {/* Trailer Video Upload */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Trailer Video (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500">
                        <span>Upload trailer</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept="video/*"
                          onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'trailer')}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">MP4, MOV up to 100MB</p>
                  </div>
                </div>
                {basicInfo.trailerVideo && (
                  <div className="mt-2 text-sm text-green-600">
                    ✓ {basicInfo.trailerVideo.name} selected
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Course Description *
                </label>
                <textarea
                  value={basicInfo.description}
                  onChange={(e) => handleBasicInfoChange('description', e.target.value)}
                  rows={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Describe what students will learn in this course..."
                />
              </div>

              {/* Learning Outcomes */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Outcomes *
                </label>
                {basicInfo.learningOutcomes.map((outcome, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={outcome}
                      onChange={(e) => updateLearningOutcome(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      placeholder="What will students learn?"
                    />
                    {basicInfo.learningOutcomes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLearningOutcome(index)}
                        className="ml-2 p-2 text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addLearningOutcome}
                  className="flex items-center text-primary-600 hover:text-primary-800"
                >
                  <PlusIcon className="h-4 w-4 mr-1" />
                  Add learning outcome
                </button>
              </div>

              {/* Target Audience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Audience
                </label>
                <textarea
                  value={basicInfo.targetAudience}
                  onChange={(e) => handleBasicInfoChange('targetAudience', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Who is this course for?"
                />
              </div>
            </div>
          </div>
        )

      case 'curriculum':
        return (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Course Curriculum</h2>
              <button
                type="button"
                onClick={addModule}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Module
              </button>
            </div>

            {modules.length === 0 ? (
              <div className="text-center py-12">
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
              <div className="space-y-6">
                {modules.map((module, moduleIndex) => (
                  <div key={module.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
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
                          className="w-full mt-2 text-sm text-gray-600 bg-transparent border-none focus:ring-0 p-0 resize-none"
                          placeholder="Module description"
                          rows={2}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteModule(module.id)}
                        className="ml-4 p-2 text-red-600 hover:text-red-800"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Lessons */}
                    <div className="space-y-3">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <div key={lesson.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={lesson.title}
                              onChange={(e) => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                              className="w-full font-medium text-gray-900 bg-transparent border-none focus:ring-0 p-0"
                              placeholder="Lesson title"
                            />
                            <div className="flex items-center space-x-4 mt-1">
                              <select
                                value={lesson.type}
                                onChange={(e) => updateLesson(module.id, lesson.id, 'type', e.target.value)}
                                className="text-sm text-gray-600 bg-transparent border-none focus:ring-0 p-0"
                              >
                                <option value="video">🎥 Video</option>
                                <option value="document">📄 Document</option>
                                <option value="quiz">📝 Quiz</option>
                                <option value="assignment">📂 Assignment</option>
                              </select>
                              {lesson.duration > 0 && (
                                <span className="text-sm text-gray-500">
                                  <ClockIcon className="h-4 w-4 inline mr-1" />
                                  {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <label className="relative cursor-pointer">
                              <input
                                type="file"
                                className="sr-only"
                                accept={lesson.type === 'video' ? 'video/*' : 'application/pdf,.doc,.docx'}
                                onChange={(e) => e.target.files?.[0] && handleLessonFileUpload(module.id, lesson.id, e.target.files[0])}
                              />
                              <div className="p-2 text-primary-600 hover:text-primary-800">
                                <ArrowUpTrayIcon className="h-4 w-4" />
                              </div>
                            </label>
                            <button
                              type="button"
                              onClick={() => deleteLesson(module.id, lesson.id)}
                              className="p-2 text-red-600 hover:text-red-800"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                      
                      <button
                        type="button"
                        onClick={() => addLesson(module.id)}
                        className="w-full flex items-center justify-center p-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-400"
                      >
                        <PlusIcon className="h-4 w-4 mr-2" />
                        Add Lesson
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )

      case 'pricing':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Course Pricing</h2>
            
            <div className="space-y-6">
              {/* Free/Paid Toggle */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isFree"
                  checked={pricing.isFree}
                  onChange={(e) => setPricing(prev => ({ ...prev, isFree: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isFree" className="ml-2 block text-sm text-gray-900">
                  This course is free
                </label>
              </div>

              {!pricing.isFree && (
                <>
                  {/* Price */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price *
                      </label>
                      <div className="relative">
                        <select
                          value={pricing.currency}
                          onChange={(e) => setPricing(prev => ({ ...prev, currency: e.target.value as 'INR' | 'USD' }))}
                          className="absolute left-0 top-0 h-full px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="INR">₹</option>
                          <option value="USD">$</option>
                        </select>
                        <input
                          type="number"
                          value={pricing.price}
                          onChange={(e) => setPricing(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                          className="w-full pl-16 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount Price (Optional)
                      </label>
                      <div className="relative">
                        <select
                          value={pricing.currency}
                          disabled
                          className="absolute left-0 top-0 h-full px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-500"
                        >
                          <option value="INR">₹</option>
                          <option value="USD">$</option>
                        </select>
                        <input
                          type="number"
                          value={pricing.discountPrice || ''}
                          onChange={(e) => setPricing(prev => ({ ...prev, discountPrice: parseFloat(e.target.value) || undefined }))}
                          className="w-full pl-16 pr-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  </div>

                  {/* EMI Options */}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="emiAvailable"
                        checked={pricing.emiAvailable}
                        onChange={(e) => setPricing(prev => ({ ...prev, emiAvailable: e.target.checked }))}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="emiAvailable" className="ml-2 block text-sm text-gray-900">
                        Enable EMI payments
                      </label>
                    </div>
                    
                    {pricing.emiAvailable && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          EMI Duration
                        </label>
                        <select
                          value={pricing.emiMonths}
                          onChange={(e) => setPricing(prev => ({ ...prev, emiMonths: parseInt(e.target.value) }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value={3}>3 months</option>
                          <option value={6}>6 months</option>
                          <option value={9}>9 months</option>
                          <option value={12}>12 months</option>
                        </select>
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Drip Release Settings */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Content Release Settings</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Release Type
                    </label>
                    <select
                      value={dripSettings.type}
                      onChange={(e) => setDripSettings(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value="immediate">Immediate Access (All content unlocked)</option>
                      <option value="sequential">Sequential (Complete one to unlock next)</option>
                      <option value="time_based">Time-based (Unlock after X days)</option>
                      <option value="date_based">Date-based (Release on specific date)</option>
                    </select>
                  </div>

                  {dripSettings.type === 'time_based' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Days to wait before unlocking next module
                      </label>
                      <input
                        type="number"
                        value={dripSettings.timeDelay || 7}
                        onChange={(e) => setDripSettings(prev => ({ ...prev, timeDelay: parseInt(e.target.value) || 7 }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                        min="1"
                      />
                    </div>
                  )}

                  {dripSettings.type === 'date_based' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Release Date
                      </label>
                      <input
                        type="date"
                        value={dripSettings.releaseDate || ''}
                        onChange={(e) => setDripSettings(prev => ({ ...prev, releaseDate: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  )}

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="unlockAfterCompletion"
                      checked={dripSettings.unlockAfterCompletion}
                      onChange={(e) => setDripSettings(prev => ({ ...prev, unlockAfterCompletion: e.target.checked }))}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="unlockAfterCompletion" className="ml-2 block text-sm text-gray-900">
                      Unlock next content only after completing previous content
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'preview':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Course Preview</h2>
            
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Preview Mode</h3>
                <button
                  type="button"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <EyeIcon className="h-4 w-4 mr-2" />
                  Preview as Student
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900">Course Title</h4>
                  <p className="text-gray-600">{basicInfo.title || 'Untitled Course'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Description</h4>
                  <p className="text-gray-600">{basicInfo.description || 'No description provided'}</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Curriculum Structure</h4>
                  <div className="mt-2 space-y-2">
                    {modules.map((module, index) => (
                      <div key={module.id} className="border border-gray-200 rounded p-3">
                        <h5 className="font-medium text-gray-800">Module {index + 1}: {module.title || 'Untitled Module'}</h5>
                        <p className="text-sm text-gray-600">{module.description || 'No description'}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          {module.lessons.length} lesson{module.lessons.length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900">Pricing</h4>
                  <p className="text-gray-600">
                    {pricing.isFree ? 'Free' : `${pricing.currency} ${pricing.price}${pricing.discountPrice ? ` (Discounted from ${pricing.currency} ${pricing.discountPrice})` : ''}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )

      case 'publish':
        return (
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-gray-900">Publish Course</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-center">
                <CheckCircleIcon className="h-6 w-6 text-green-600 mr-3" />
                <h3 className="text-lg font-semibold text-green-800">Ready to Publish!</h3>
              </div>
              <p className="mt-2 text-green-700">
                Your course is ready to be published. Once published, students will be able to enroll and access the content.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Publishing Options</h3>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="publishNow"
                    name="publishOption"
                    value="now"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="publishNow" className="ml-2 block text-sm text-gray-900">
                    Publish immediately
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="publishLater"
                    name="publishOption"
                    value="later"
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                  />
                  <label htmlFor="publishLater" className="ml-2 block text-sm text-gray-900">
                    Schedule for later
                  </label>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Course</h1>
              <p className="mt-2 text-gray-600">Build and publish your course step by step</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={saveDraft}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <SaveIcon className="h-4 w-4 mr-2" />
                Save Draft
              </button>
              {currentStep === 'publish' && (
                <button
                  type="button"
                  onClick={publishCourse}
                  disabled={isLoading}
                  className="inline-flex items-center px-6 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <CheckCircleIcon className="h-4 w-4 mr-2" />
                  )}
                  Publish Course
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <nav className="flex space-x-8" aria-label="Progress">
            {steps.map((step, stepIdx) => {
              const currentStepIndex = steps.findIndex(s => s.id === currentStep)
              const isCompleted = stepIdx < currentStepIndex
              const isCurrent = stepIdx === currentStepIndex
              
              return (
                <div key={step.id} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                    isCompleted 
                      ? 'bg-primary-600 text-white' 
                      : isCurrent 
                        ? 'bg-primary-100 text-primary-600' 
                        : 'bg-gray-200 text-gray-500'
                  }`}>
                    {isCompleted ? (
                      <CheckCircleIcon className="w-5 h-5" />
                    ) : (
                      <step.icon className="w-5 h-5" />
                    )}
                  </div>
                  <div className="ml-3">
                    <p className={`text-sm font-medium ${
                      isCurrent ? 'text-primary-600' : isCompleted ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.name}
                    </p>
                  </div>
                  {stepIdx < steps.length - 1 && (
                    <div className={`ml-8 w-16 h-0.5 ${
                      isCompleted ? 'bg-primary-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              )
            })}
          </nav>
        </div>

        {/* Step Content */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-8">
            {renderStepContent()}
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 flex justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 'basic'}
            className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Previous
          </button>
          
          {currentStep !== 'publish' && (
            <button
              type="button"
              onClick={nextStep}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
            >
              Next
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}