'use client'

import { useState, useEffect } from 'react'
import { 
  DocumentTextIcon, 
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  StarIcon,
  ArrowUpTrayIcon as UploadIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon
} from '@heroicons/react/24/outline'

interface Assignment {
  id: string
  title: string
  description: string
  phase: number
  phaseTitle: string
  dueDate: string
  points: number
  status: 'not-started' | 'in-progress' | 'submitted' | 'graded' | 'late'
  submittedAt?: string
  grade?: number
  feedback?: string
  attachments: string[]
  content: string
  instructions: string[]
  resources: string[]
}

interface Submission {
  id: string
  assignmentId: string
  content: string
  attachments: File[]
  submittedAt: string
  status: 'draft' | 'submitted'
}

export default function AssignmentsPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null)
  const [showSubmissionModal, setShowSubmissionModal] = useState(false)
  const [submission, setSubmission] = useState<Submission>({
    id: '',
    assignmentId: '',
    content: '',
    attachments: [],
    submittedAt: '',
    status: 'draft'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPhase, setFilterPhase] = useState('all')

  useEffect(() => {
    // Mock data - in production, this would come from your API
    const mockAssignments: Assignment[] = [
      {
        id: '1',
        title: 'Personal Vision Statement',
        description: 'Write a comprehensive personal vision statement for your startup journey. This should reflect your long-term goals, values, and the impact you want to make.',
        phase: 1,
        phaseTitle: 'Foundation & Mindset',
        dueDate: '2024-01-15',
        points: 25,
        status: 'graded',
        submittedAt: '2024-01-14T10:30:00Z',
        grade: 23,
        feedback: 'Excellent vision statement! You clearly articulated your goals and values. Consider adding more specific metrics for success.',
        attachments: ['vision_statement.pdf'],
        content: 'My vision is to create a sustainable food delivery platform that reduces waste and supports local farmers. I want to build a company that not only generates profit but also creates positive social and environmental impact...',
        instructions: [
          'Write 500-800 words',
          'Include your core values',
          'Define success metrics',
          'Explain your motivation'
        ],
        resources: [
          'Vision Statement Template',
          'Examples from Successful Entrepreneurs',
          'Values Assessment Tool'
        ]
      },
      {
        id: '2',
        title: 'Market Validation Report',
        description: 'Conduct market research and create a comprehensive validation report for your business idea.',
        phase: 2,
        phaseTitle: 'Idea Validation & Market Research',
        dueDate: '2024-01-20',
        points: 50,
        status: 'in-progress',
        attachments: [],
        content: '',
        instructions: [
          'Interview at least 20 potential customers',
          'Analyze market size and trends',
          'Identify key competitors',
          'Create customer personas',
          'Include data visualization'
        ],
        resources: [
          'Customer Interview Guide',
          'Market Research Templates',
          'Survey Tools',
          'Competitor Analysis Framework'
        ]
      },
      {
        id: '3',
        title: 'Business Model Canvas',
        description: 'Complete a detailed business model canvas for your startup idea.',
        phase: 3,
        phaseTitle: 'Business Model & Strategy',
        dueDate: '2024-01-25',
        points: 60,
        status: 'not-started',
        attachments: [],
        content: '',
        instructions: [
          'Fill out all 9 sections of the canvas',
          'Provide detailed explanations for each section',
          'Include assumptions and hypotheses',
          'Add visual elements and diagrams'
        ],
        resources: [
          'Business Model Canvas Template',
          'Value Proposition Design Guide',
          'Customer Segment Analysis',
          'Revenue Stream Examples'
        ]
      },
      {
        id: '4',
        title: 'MVP Prototype',
        description: 'Create a minimum viable product prototype for your startup idea.',
        phase: 4,
        phaseTitle: 'Product Development',
        dueDate: '2024-02-10',
        points: 80,
        status: 'not-started',
        attachments: [],
        content: '',
        instructions: [
          'Build a working prototype',
          'Document the development process',
          'Test with potential users',
          'Create a demo video',
          'Include technical specifications'
        ],
        resources: [
          'Prototyping Tools',
          'User Testing Guide',
          'Technical Documentation Template',
          'Demo Video Examples'
        ]
      }
    ]

    setAssignments(mockAssignments)
  }, [])

  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus
    const matchesPhase = filterPhase === 'all' || assignment.phase.toString() === filterPhase
    return matchesSearch && matchesStatus && matchesPhase
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'graded':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircleIcon className="w-3 h-3 mr-1" />
          Graded
        </span>
      case 'submitted':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <ClockIcon className="w-3 h-3 mr-1" />
          Submitted
        </span>
      case 'in-progress':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <PencilIcon className="w-3 h-3 mr-1" />
          In Progress
        </span>
      case 'late':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <ExclamationTriangleIcon className="w-3 h-3 mr-1" />
          Late
        </span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          Not Started
        </span>
    }
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleStartAssignment = (assignment: Assignment) => {
    setSelectedAssignment(assignment)
    setSubmission({
      id: '',
      assignmentId: assignment.id,
      content: assignment.content,
      attachments: [],
      submittedAt: '',
      status: 'draft'
    })
    setShowSubmissionModal(true)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSubmission(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }))
  }

  const handleSubmitAssignment = () => {
    // In production, this would submit to your API
    console.log('Submitting assignment:', submission)
    setShowSubmissionModal(false)
    // Update assignment status
    setAssignments(prev => prev.map(assignment => 
      assignment.id === submission.assignmentId 
        ? { ...assignment, status: 'submitted' as const, submittedAt: new Date().toISOString() }
        : assignment
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Assignments</h1>
            <p className="mt-2 text-indigo-100">Complete your assignments to unlock the next phase</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {assignments.filter(a => a.status === 'graded').length}/{assignments.length}
            </div>
            <div className="text-sm text-indigo-100">Completed</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Assignments</p>
              <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {assignments.filter(a => a.status === 'graded').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">
                {assignments.filter(a => a.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <StarIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-gray-900">
                {assignments.reduce((sum, a) => sum + (a.grade || 0), 0)}/{assignments.reduce((sum, a) => sum + a.points, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search assignments..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-4">
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="not-started">Not Started</option>
              <option value="in-progress">In Progress</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
              <option value="late">Late</option>
            </select>
            <select
              className="border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={filterPhase}
              onChange={(e) => setFilterPhase(e.target.value)}
            >
              <option value="all">All Phases</option>
              <option value="1">Phase 1</option>
              <option value="2">Phase 2</option>
              <option value="3">Phase 3</option>
              <option value="4">Phase 4</option>
            </select>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {filteredAssignments.map((assignment) => (
          <div key={assignment.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{assignment.title}</h3>
                  {getStatusBadge(assignment.status)}
                </div>
                <p className="text-sm text-gray-600 mb-2">{assignment.description}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span>Phase {assignment.phase}: {assignment.phaseTitle}</span>
                  <span>{assignment.points} points</span>
                  <span className="flex items-center">
                    <ClockIcon className="h-4 w-4 mr-1" />
                    Due: {assignment.dueDate}
                    {getDaysUntilDue(assignment.dueDate) < 0 && (
                      <span className="text-red-500 ml-1">(Overdue)</span>
                    )}
                    {getDaysUntilDue(assignment.dueDate) >= 0 && getDaysUntilDue(assignment.dueDate) <= 3 && (
                      <span className="text-yellow-500 ml-1">({getDaysUntilDue(assignment.dueDate)} days left)</span>
                    )}
                  </span>
                </div>
                
                {assignment.grade && (
                  <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-green-800">
                        Grade: {assignment.grade}/{assignment.points}
                      </span>
                      <span className="text-sm text-green-600">
                        {Math.round((assignment.grade / assignment.points) * 100)}%
                      </span>
                    </div>
                    {assignment.feedback && (
                      <p className="text-sm text-green-700 mt-1">{assignment.feedback}</p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="ml-6 flex space-x-2">
                <button
                  onClick={() => handleStartAssignment(assignment)}
                  className="px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-md"
                >
                  {assignment.status === 'not-started' ? 'Start' : 'Continue'}
                </button>
                <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md">
                  <EyeIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Submission Modal */}
      {showSubmissionModal && selectedAssignment && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">{selectedAssignment.title}</h3>
                <button
                  onClick={() => setShowSubmissionModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-4">
                <h4 className="text-md font-medium text-gray-900 mb-2">Instructions</h4>
                <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                  {selectedAssignment.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-4">
                <h4 className="text-md font-medium text-gray-900 mb-2">Resources</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedAssignment.resources.map((resource, index) => (
                    <a
                      key={index}
                      href="#"
                      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200"
                    >
                      {resource}
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Submission
                </label>
                <textarea
                  rows={8}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Write your assignment here..."
                  value={submission.content}
                  onChange={(e) => setSubmission(prev => ({ ...prev, content: e.target.value }))}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attachments
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <UploadIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Upload files
                        </span>
                        <input
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={handleFileUpload}
                        />
                      </label>
                      <p className="mt-1 text-xs text-gray-500">
                        PDF, DOC, DOCX, or images up to 10MB each
                      </p>
                    </div>
                  </div>
                  
                  {submission.attachments.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Uploaded Files</h4>
                      <div className="space-y-2">
                        {submission.attachments.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-900">{file.name}</span>
                            <button
                              onClick={() => setSubmission(prev => ({
                                ...prev,
                                attachments: prev.attachments.filter((_, i) => i !== index)
                              }))}
                              className="text-red-500 hover:text-red-700"
                            >
                              <TrashIcon className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowSubmissionModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitAssignment}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
                >
                  Submit Assignment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}