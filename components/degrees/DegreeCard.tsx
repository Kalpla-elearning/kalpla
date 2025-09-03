'use client'

import { useSession } from 'next-auth/react'
import { 
  AcademicCapIcon, 
  MapPinIcon, 
  ClockIcon, 
  UserGroupIcon, 
  StarIcon,
  CurrencyDollarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

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
  features: string[]
  category: string
  tags: string[]
}

interface DegreeCardProps {
  program: DegreeProgram
  variant?: 'default' | 'featured'
}

export default function DegreeCard({ program, variant = 'default' }: DegreeCardProps) {
  const { data: session } = useSession()

  const handleEnrollment = async () => {
    if (!session?.user) {
      // Redirect to login if not authenticated
      window.location.href = '/auth/signin'
      return
    }

    // Navigate to checkout page with program details
    const params = new URLSearchParams({
      programId: program.id,
      programTitle: program.title,
      institution: program.institution,
      duration: program.duration,
      format: program.format,
      level: program.level,
      price: program.price.toString(),
      currency: program.currency
    })
    
    window.location.href = `/checkout?${params.toString()}`
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 ${variant === 'featured' ? 'ring-2 ring-primary-500' : ''}`}>
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2">
              {program.title}
            </h3>
            <p className="text-sm text-gray-600 mb-2">{program.institution}</p>
          </div>
          {variant === 'featured' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
              Featured
            </span>
          )}
        </div>

        {/* Program Details */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <MapPinIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{program.location}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ClockIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{program.duration} • {program.format}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <AcademicCapIcon className="h-4 w-4 mr-2 flex-shrink-0" />
            <span>{program.level}</span>
          </div>
        </div>

        {/* Rating and Students */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
            <span className="text-sm font-medium text-gray-900">{program.rating}</span>
            <span className="text-sm text-gray-500 ml-1">({program.students} students)</span>
          </div>
          <div className="text-sm text-gray-500">
            {program.category}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-3">
          {program.description}
        </p>

        {/* Features */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {program.features.slice(0, 3).map((feature, index) => (
              <span
                key={index}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <CurrencyDollarIcon className="h-5 w-5 text-green-600 mr-1" />
            <span className="text-lg font-bold text-gray-900">
              {formatPrice(program.price, program.currency)}
            </span>
          </div>
          <button 
            onClick={handleEnrollment}
            className="px-4 py-2 border border-primary-600 text-primary-600 rounded-lg font-medium hover:bg-primary-50 transition-colors flex items-center gap-2"
          >
            <span>Enroll Now</span>
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
