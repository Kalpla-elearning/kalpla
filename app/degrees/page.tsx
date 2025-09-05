import { Suspense } from 'react'
import { 
  AcademicCapIcon, 
  MagnifyingGlassIcon,
  FunnelIcon,
  MapPinIcon,
  ClockIcon,
  UserGroupIcon,
  StarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'
import DegreeCard from '@/components/degrees/DegreeCard'
import { getRoleDisplayName, getRoleColor } from '@/lib/utils'

interface DegreeProgram {
  id: string
  title: string
  institution: string
  location: string
  duration: string
  format: string
  level: string
  price: number
  currency: string
  rating: number
  students: number
  description: string
  category: string
  tags: string[]
  features: string[]
}

const categories = [
  { id: "all", name: "All Categories", count: 0 },
  { id: "technology", name: "Technology", count: 0 },
  { id: "business", name: "Business", count: 0 },
  { id: "marketing", name: "Marketing", count: 0 },
  { id: "health-sciences", name: "Health Sciences", count: 0 },
  { id: "education", name: "Education", count: 0 }
]

const levels = [
  { id: "all", name: "All Levels", count: 0 },
  { id: "undergraduate", name: "Undergraduate", count: 0 },
  { id: "graduate", name: "Graduate", count: 0 }
]

async function getDegreePrograms() {
  try {
    // Return mock data for now since we don't have degree programs in Amplify yet
    const programs: DegreeProgram[] = []
    
    // Update category counts
    const updatedCategories = categories.map(cat => ({
      ...cat,
      count: cat.id === 'all' ? programs.length : programs.filter((p: DegreeProgram) => p.category.toLowerCase() === cat.id).length
    }))
    
    // Update level counts
    const updatedLevels = levels.map(level => ({
      ...level,
      count: level.id === 'all' ? programs.length : programs.filter((p: DegreeProgram) => p.level.toLowerCase() === level.id).length
    }))
    
    return { programs, categories: updatedCategories, levels: updatedLevels }
  } catch (error) {
    console.error('Error fetching degree programs:', error)
    return { programs: [], categories, levels }
  }
}

export default async function DegreesPage() {
  const { programs, categories, levels } = await getDegreePrograms()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              Degree Programs
            </h1>
            <p className="mt-6 text-xl text-primary-100 max-w-3xl mx-auto">
              Transform your career with our comprehensive degree programs designed for the modern workforce. 
              Choose from a wide range of disciplines and advance your professional journey.
            </p>
            <div className="mt-8 flex items-center justify-center space-x-4">
              <div className="flex items-center space-x-2">
                <AcademicCapIcon className="h-5 w-5" />
                <span className="text-sm">{programs.length} Programs</span>
              </div>
              <div className="flex items-center space-x-2">
                <UserGroupIcon className="h-5 w-5" />
                <span className="text-sm">5,000+ Students</span>
              </div>
              <div className="flex items-center space-x-2">
                <StarIcon className="h-5 w-5" />
                <span className="text-sm">4.7+ Average Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="lg:col-span-2">
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                Search Programs
              </label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  id="search"
                  placeholder="Search by program name, institution, or keywords..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                id="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name} ({category.count})
                  </option>
                ))}
              </select>
            </div>

            {/* Level Filter */}
            <div>
              <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-2">
                Level
              </label>
              <select
                id="level"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {levels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name} ({level.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Programs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            All Degree Programs
          </h2>
          <p className="text-gray-600">
            Discover {programs.length} degree programs designed to advance your career
          </p>
        </div>

        <Suspense fallback={
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded mb-4"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        }>
          {programs.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No programs available yet</h3>
              <p className="text-gray-600">Check back soon for new degree programs!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {programs.map((program: DegreeProgram) => (
                <DegreeCard key={program.id} program={program} />
              ))}
            </div>
          )}
        </Suspense>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-50 border-t border-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Academic Journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students who have transformed their careers with our degree programs. 
              Take the first step towards your future today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Contact Admissions
              </a>
              <a
                href="/mentorship"
                className="inline-flex items-center px-6 py-3 border border-primary-600 text-base font-medium rounded-lg text-primary-600 bg-white hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Learn About Mentorship
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
