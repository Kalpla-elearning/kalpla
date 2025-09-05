import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { 
  LockClosedIcon,
  PlayIcon,
  CheckCircleIcon,
  ClockIcon,
  BookOpenIcon,
  VideoCameraIcon,
  DocumentTextIcon,
  TrophyIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const phases = [
  {
    id: 1,
    title: 'Foundation & Ideation',
    description: 'Learn the basics of entrepreneurship and validate your idea',
    duration: '2 weeks',
    status: 'completed',
    progress: 100,
    modules: [
      { id: 1, title: 'Introduction to Entrepreneurship', type: 'video', duration: '45 min', status: 'completed' },
      { id: 2, title: 'Idea Validation Framework', type: 'video', duration: '60 min', status: 'completed' },
      { id: 3, title: 'Market Research Basics', type: 'video', duration: '50 min', status: 'completed' },
      { id: 4, title: 'Assignment: Idea Validation', type: 'assignment', duration: '2 hours', status: 'completed' }
    ]
  },
  {
    id: 2,
    title: 'Business Model Development',
    description: 'Create a sustainable business model for your startup',
    duration: '2 weeks',
    status: 'completed',
    progress: 100,
    modules: [
      { id: 5, title: 'Business Model Canvas', type: 'video', duration: '55 min', status: 'completed' },
      { id: 6, title: 'Value Proposition Design', type: 'video', duration: '40 min', status: 'completed' },
      { id: 7, title: 'Revenue Streams', type: 'video', duration: '35 min', status: 'completed' },
      { id: 8, title: 'Assignment: Business Model Canvas', type: 'assignment', duration: '3 hours', status: 'completed' }
    ]
  },
  {
    id: 3,
    title: 'Product Development',
    description: 'Build your MVP and validate with users',
    duration: '3 weeks',
    status: 'in-progress',
    progress: 60,
    modules: [
      { id: 9, title: 'MVP Development Strategy', type: 'video', duration: '50 min', status: 'completed' },
      { id: 10, title: 'User Research & Testing', type: 'video', duration: '45 min', status: 'completed' },
      { id: 11, title: 'Prototyping Tools', type: 'video', duration: '40 min', status: 'in-progress' },
      { id: 12, title: 'Assignment: MVP Prototype', type: 'assignment', duration: '5 hours', status: 'pending' }
    ]
  },
  {
    id: 4,
    title: 'Marketing & Sales',
    description: 'Learn to market and sell your product effectively',
    duration: '2 weeks',
    status: 'locked',
    progress: 0,
    modules: [
      { id: 13, title: 'Digital Marketing Strategy', type: 'video', duration: '60 min', status: 'locked' },
      { id: 14, title: 'Sales Funnel Design', type: 'video', duration: '45 min', status: 'locked' },
      { id: 15, title: 'Customer Acquisition', type: 'video', duration: '50 min', status: 'locked' },
      { id: 16, title: 'Assignment: Marketing Plan', type: 'assignment', duration: '4 hours', status: 'locked' }
    ]
  },
  {
    id: 5,
    title: 'Funding & Investment',
    description: 'Prepare for fundraising and investor meetings',
    duration: '2 weeks',
    status: 'locked',
    progress: 0,
    modules: [
      { id: 17, title: 'Pitch Deck Creation', type: 'video', duration: '55 min', status: 'locked' },
      { id: 18, title: 'Valuation Methods', type: 'video', duration: '40 min', status: 'locked' },
      { id: 19, title: 'Investor Relations', type: 'video', duration: '45 min', status: 'locked' },
      { id: 20, title: 'Assignment: Pitch Deck', type: 'assignment', duration: '6 hours', status: 'locked' }
    ]
  }
]

export default async function LearningPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Learning Hub</h1>
        <p className="text-blue-100">
          Master the fundamentals of entrepreneurship through our structured 12-phase program
        </p>
      </div>

      {/* Progress Overview */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Learning Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">2</div>
            <div className="text-sm text-gray-500">Phases Completed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">1</div>
            <div className="text-sm text-gray-500">Phase In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-400">9</div>
            <div className="text-sm text-gray-500">Phases Remaining</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">25%</div>
            <div className="text-sm text-gray-500">Overall Progress</div>
          </div>
        </div>
      </div>

      {/* Phases */}
      <div className="space-y-6">
        {phases.map((phase) => (
          <div key={phase.id} className="bg-white rounded-lg shadow overflow-hidden">
            <div className={`px-6 py-4 ${
              phase.status === 'completed' ? 'bg-green-50 border-l-4 border-green-400' :
              phase.status === 'in-progress' ? 'bg-blue-50 border-l-4 border-blue-400' :
              'bg-gray-50 border-l-4 border-gray-300'
            }`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
                    phase.status === 'completed' ? 'bg-green-100' :
                    phase.status === 'in-progress' ? 'bg-blue-100' :
                    'bg-gray-100'
                  }`}>
                    {phase.status === 'completed' ? (
                      <CheckCircleIcon className="h-6 w-6 text-green-600" />
                    ) : phase.status === 'in-progress' ? (
                      <PlayIcon className="h-6 w-6 text-blue-600" />
                    ) : (
                      <LockClosedIcon className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Phase {phase.id}: {phase.title}
                    </h3>
                    <p className="text-sm text-gray-600">{phase.description}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs text-gray-500">Duration: {phase.duration}</span>
                      {phase.status !== 'locked' && (
                        <span className="text-xs text-gray-500">Progress: {phase.progress}%</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    phase.status === 'completed' ? 'bg-green-100 text-green-800' :
                    phase.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {phase.status === 'completed' ? 'Completed' :
                     phase.status === 'in-progress' ? 'In Progress' : 'Locked'}
                  </span>
                </div>
              </div>
              
              {phase.status !== 'locked' && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        phase.status === 'completed' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${phase.progress}%` }}
                    ></div>
                  </div>
                </div>
              )}
            </div>

            {/* Modules */}
            <div className="px-6 py-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Modules</h4>
              <div className="space-y-3">
                {phase.modules.map((module) => (
                  <div key={module.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${
                        module.status === 'completed' ? 'bg-green-100' :
                        module.status === 'in-progress' ? 'bg-blue-100' :
                        module.status === 'pending' ? 'bg-yellow-100' :
                        'bg-gray-100'
                      }`}>
                        {module.type === 'video' ? (
                          <VideoCameraIcon className={`h-4 w-4 ${
                            module.status === 'completed' ? 'text-green-600' :
                            module.status === 'in-progress' ? 'text-blue-600' :
                            module.status === 'pending' ? 'text-yellow-600' :
                            'text-gray-400'
                          }`} />
                        ) : (
                          <DocumentTextIcon className={`h-4 w-4 ${
                            module.status === 'completed' ? 'text-green-600' :
                            module.status === 'in-progress' ? 'text-blue-600' :
                            module.status === 'pending' ? 'text-yellow-600' :
                            'text-gray-400'
                          }`} />
                        )}
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">{module.title}</h5>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <ClockIcon className="h-3 w-3" />
                          <span>{module.duration}</span>
                          <span>•</span>
                          <span className="capitalize">{module.type}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {module.status === 'completed' && (
                        <CheckCircleIcon className="h-5 w-5 text-green-500" />
                      )}
                      {module.status === 'in-progress' && (
                        <PlayIcon className="h-5 w-5 text-blue-500" />
                      )}
                      {module.status === 'pending' && (
                        <ClockIcon className="h-5 w-5 text-yellow-500" />
                      )}
                      {module.status === 'locked' && (
                        <LockClosedIcon className="h-5 w-5 text-gray-400" />
                      )}
                      {module.status !== 'locked' && (
                        <button className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                          {module.status === 'completed' ? 'Review' : 'Start'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Phase Actions */}
            {phase.status === 'in-progress' && (
              <div className="px-6 py-4 bg-blue-50 border-t border-blue-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-blue-700">
                    Complete all modules and assignments to unlock Phase {phase.id + 1}
                  </div>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                    Continue Learning
                  </button>
                </div>
              </div>
            )}

            {phase.status === 'locked' && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Complete Phase {phase.id - 1} to unlock this phase
                  </div>
                  <div className="flex items-center text-gray-400">
                    <LockClosedIcon className="h-4 w-4 mr-1" />
                    <span className="text-sm">Locked</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Live Classes Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Live Classes</h2>
          <Link href="/dashboard/live-classes" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <VideoCameraIcon className="h-5 w-5 text-red-500" />
              <span className="text-sm font-medium text-gray-900">Pitch Deck Workshop</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Learn to create compelling pitch decks</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Today, 2:00 PM</span>
              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">Live</span>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-2">
              <VideoCameraIcon className="h-5 w-5 text-blue-500" />
              <span className="text-sm font-medium text-gray-900">Financial Modeling</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Master startup financial projections</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">Tomorrow, 10:00 AM</span>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Upcoming</span>
            </div>
          </div>
        </div>
      </div>

      {/* Resources Section */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Learning Resources</h2>
          <Link href="/dashboard/resources" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <BookOpenIcon className="h-8 w-8 text-blue-500 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Startup Playbook</h3>
            <p className="text-sm text-gray-600 mb-3">Complete guide to building a startup</p>
            <button className="text-primary-600 hover:text-primary-500 text-sm font-medium">
              Download PDF
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <DocumentTextIcon className="h-8 w-8 text-green-500 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Templates Library</h3>
            <p className="text-sm text-gray-600 mb-3">Business model canvas, pitch decks, etc.</p>
            <button className="text-primary-600 hover:text-primary-500 text-sm font-medium">
              Browse Templates
            </button>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <TrophyIcon className="h-8 w-8 text-yellow-500 mb-2" />
            <h3 className="font-medium text-gray-900 mb-1">Case Studies</h3>
            <p className="text-sm text-gray-600 mb-3">Real startup success stories</p>
            <button className="text-primary-600 hover:text-primary-500 text-sm font-medium">
              Read Stories
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
