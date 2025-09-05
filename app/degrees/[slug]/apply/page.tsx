'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ArrowLeftIcon,
  AcademicCapIcon,
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
  DocumentTextIcon,
  CalendarIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

interface DegreeProgram {
  id: string
  title: string
  institution: string
  price: number
  currency: string
  duration: string
  level: string
}

interface ApplicationForm {
  // Personal Information
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  gender: string
  nationality: string
  
  // Address Information
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  
  // Educational Background
  highestEducation: string
  institution: string
  graduationYear: string
  gpa: string
  major: string
  
  // Work Experience
  workExperience: string
  currentEmployer: string
  jobTitle: string
  yearsOfExperience: string
  
  // Program Specific
  motivation: string
  careerGoals: string
  expectedStartDate: string
  
  // Additional Information
  emergencyContact: string
  emergencyPhone: string
  emergencyRelationship: string
  
  // Documents
  resume: File | null
  transcripts: File | null
  recommendationLetter: File | null
  personalStatement: File | null
}

export default function ApplyPage({ params }: { params: { slug: string } }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [program, setProgram] = useState<DegreeProgram | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState('')

  const [formData, setFormData] = useState<ApplicationForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    nationality: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postalCode: '',
    highestEducation: '',
    institution: '',
    graduationYear: '',
    gpa: '',
    major: '',
    workExperience: '',
    currentEmployer: '',
    jobTitle: '',
    yearsOfExperience: '',
    motivation: '',
    careerGoals: '',
    expectedStartDate: '',
    emergencyContact: '',
    emergencyPhone: '',
    emergencyRelationship: '',
    resume: null,
    transcripts: null,
    recommendationLetter: null,
    personalStatement: null
  })

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push(`/auth/signin?callbackUrl=/degrees/${params.slug}/apply`)
      return
    }

    fetchProgram()
  }, [session, status, params.slug])

  const fetchProgram = async () => {
    try {
      const response = await fetch(`/api/degree-programs/${params.slug}`)
      if (response.ok) {
        const data = await response.json()
        setProgram(data.program)
      }
    } catch (error) {
      console.error('Error fetching program:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof ApplicationForm, value: string | File | null) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName.trim()) newErrors.firstName = 'First name is required'
        if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required'
        if (!formData.email.trim()) newErrors.email = 'Email is required'
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required'
        if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required'
        if (!formData.gender) newErrors.gender = 'Gender is required'
        if (!formData.nationality.trim()) newErrors.nationality = 'Nationality is required'
        break

      case 2: // Address Information
        if (!formData.address.trim()) newErrors.address = 'Address is required'
        if (!formData.city.trim()) newErrors.city = 'City is required'
        if (!formData.state.trim()) newErrors.state = 'State is required'
        if (!formData.country.trim()) newErrors.country = 'Country is required'
        if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required'
        break

      case 3: // Educational Background
        if (!formData.highestEducation) newErrors.highestEducation = 'Highest education level is required'
        if (!formData.institution.trim()) newErrors.institution = 'Institution name is required'
        if (!formData.graduationYear) newErrors.graduationYear = 'Graduation year is required'
        if (!formData.major.trim()) newErrors.major = 'Major/Field of study is required'
        break

      case 4: // Program Specific
        if (!formData.motivation.trim()) newErrors.motivation = 'Motivation statement is required'
        if (!formData.careerGoals.trim()) newErrors.careerGoals = 'Career goals are required'
        if (!formData.expectedStartDate) newErrors.expectedStartDate = 'Expected start date is required'
        break

      case 5: // Documents
        if (!formData.resume) newErrors.resume = 'Resume is required'
        if (!formData.transcripts) newErrors.transcripts = 'Transcripts are required'
        break
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 5))
    }
  }

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return

    setSubmitting(true)
    try {
      const formDataToSend = new FormData()
      
      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSend.append(key, value)
        } else if (value !== null) {
          formDataToSend.append(key, value)
        }
      })

      formDataToSend.append('programId', program!.id)

      const response = await fetch('/api/degree-programs/apply', {
        method: 'POST',
        body: formDataToSend
      })

      if (response.ok) {
        setSuccess('Application submitted successfully! You will receive a confirmation email shortly.')
        setTimeout(() => {
          router.push('/degrees/applications')
        }, 3000)
      } else {
        const error = await response.json()
        setErrors({ submit: error.message || 'Failed to submit application' })
      }
    } catch (error) {
      setErrors({ submit: 'An error occurred while submitting your application' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!program) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Program Not Found</h2>
          <p className="text-gray-600 mb-4">The degree program you're looking for doesn't exist.</p>
          <Link href="/degrees" className="btn-primary">
            Browse Degree Programs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/degrees" className="hover:text-primary-600 flex items-center">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Degree Programs
            </Link>
            <span>/</span>
            <Link href={`/degrees/${params.slug}`} className="hover:text-primary-600">
              {program.title}
            </Link>
            <span>/</span>
            <span className="text-gray-900">Apply</span>
          </nav>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Program Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{program.title}</h1>
              <p className="text-gray-600 mb-2">{program.institution}</p>
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <span className="flex items-center">
                  <AcademicCapIcon className="h-4 w-4 mr-1" />
                  {program.level}
                </span>
                <span className="flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-1" />
                  {program.duration}
                </span>
                <span className="flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-1" />
                  ₹{program.price.toLocaleString()}
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">₹{program.price.toLocaleString()}</div>
              <div className="text-sm text-gray-500">{program.currency}</div>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4, 5].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                  step <= currentStep ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {step < currentStep ? (
                    <CheckCircleIcon className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{step}</span>
                  )}
                </div>
                {step < 5 && (
                  <div className={`w-16 h-1 mx-2 ${
                    step < currentStep ? 'bg-primary-600' : 'bg-gray-200'
                  }`}></div>
                )}
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Step {currentStep} of 5: {
                currentStep === 1 ? 'Personal Information' :
                currentStep === 2 ? 'Address Information' :
                currentStep === 3 ? 'Educational Background' :
                currentStep === 4 ? 'Program Specific' : 'Documents'
              }
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-800">{errors.submit}</p>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className={`input-field ${errors.firstName ? 'border-red-500' : ''}`}
                    placeholder="Enter your first name"
                  />
                  {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className={`input-field ${errors.lastName ? 'border-red-500' : ''}`}
                    placeholder="Enter your last name"
                  />
                  {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`input-field ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className={`input-field ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date of Birth *</label>
                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className={`input-field ${errors.dateOfBirth ? 'border-red-500' : ''}`}
                  />
                  {errors.dateOfBirth && <p className="text-red-500 text-sm mt-1">{errors.dateOfBirth}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => handleInputChange('gender', e.target.value)}
                    className={`input-field ${errors.gender ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nationality *</label>
                  <input
                    type="text"
                    value={formData.nationality}
                    onChange={(e) => handleInputChange('nationality', e.target.value)}
                    className={`input-field ${errors.nationality ? 'border-red-500' : ''}`}
                    placeholder="Enter your nationality"
                  />
                  {errors.nationality && <p className="text-red-500 text-sm mt-1">{errors.nationality}</p>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Address Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <textarea
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className={`input-field ${errors.address ? 'border-red-500' : ''}`}
                    rows={3}
                    placeholder="Enter your full address"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      className={`input-field ${errors.city ? 'border-red-500' : ''}`}
                      placeholder="Enter your city"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State/Province *</label>
                    <input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      className={`input-field ${errors.state ? 'border-red-500' : ''}`}
                      placeholder="Enter your state/province"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                    <input
                      type="text"
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      className={`input-field ${errors.country ? 'border-red-500' : ''}`}
                      placeholder="Enter your country"
                    />
                    {errors.country && <p className="text-red-500 text-sm mt-1">{errors.country}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code *</label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleInputChange('postalCode', e.target.value)}
                      className={`input-field ${errors.postalCode ? 'border-red-500' : ''}`}
                      placeholder="Enter your postal code"
                    />
                    {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Educational Background</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Highest Education Level *</label>
                  <select
                    value={formData.highestEducation}
                    onChange={(e) => handleInputChange('highestEducation', e.target.value)}
                    className={`input-field ${errors.highestEducation ? 'border-red-500' : ''}`}
                  >
                    <option value="">Select education level</option>
                    <option value="high-school">High School</option>
                    <option value="associate">Associate Degree</option>
                    <option value="bachelor">Bachelor's Degree</option>
                    <option value="master">Master's Degree</option>
                    <option value="phd">PhD</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.highestEducation && <p className="text-red-500 text-sm mt-1">{errors.highestEducation}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Institution Name *</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => handleInputChange('institution', e.target.value)}
                    className={`input-field ${errors.institution ? 'border-red-500' : ''}`}
                    placeholder="Enter institution name"
                  />
                  {errors.institution && <p className="text-red-500 text-sm mt-1">{errors.institution}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year *</label>
                  <input
                    type="number"
                    value={formData.graduationYear}
                    onChange={(e) => handleInputChange('graduationYear', e.target.value)}
                    className={`input-field ${errors.graduationYear ? 'border-red-500' : ''}`}
                    placeholder="Enter graduation year"
                    min="1950"
                    max="2030"
                  />
                  {errors.graduationYear && <p className="text-red-500 text-sm mt-1">{errors.graduationYear}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GPA (Optional)</label>
                  <input
                    type="number"
                    value={formData.gpa}
                    onChange={(e) => handleInputChange('gpa', e.target.value)}
                    className="input-field"
                    placeholder="Enter GPA (e.g., 3.5)"
                    min="0"
                    max="4"
                    step="0.1"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Major/Field of Study *</label>
                  <input
                    type="text"
                    value={formData.major}
                    onChange={(e) => handleInputChange('major', e.target.value)}
                    className={`input-field ${errors.major ? 'border-red-500' : ''}`}
                    placeholder="Enter your major or field of study"
                  />
                  {errors.major && <p className="text-red-500 text-sm mt-1">{errors.major}</p>}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Program Specific Information</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to join this program? *</label>
                  <textarea
                    value={formData.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    className={`input-field ${errors.motivation ? 'border-red-500' : ''}`}
                    rows={4}
                    placeholder="Explain your motivation for joining this program..."
                  />
                  {errors.motivation && <p className="text-red-500 text-sm mt-1">{errors.motivation}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">What are your career goals? *</label>
                  <textarea
                    value={formData.careerGoals}
                    onChange={(e) => handleInputChange('careerGoals', e.target.value)}
                    className={`input-field ${errors.careerGoals ? 'border-red-500' : ''}`}
                    rows={4}
                    placeholder="Describe your career goals and how this program will help you achieve them..."
                  />
                  {errors.careerGoals && <p className="text-red-500 text-sm mt-1">{errors.careerGoals}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Start Date *</label>
                  <input
                    type="date"
                    value={formData.expectedStartDate}
                    onChange={(e) => handleInputChange('expectedStartDate', e.target.value)}
                    className={`input-field ${errors.expectedStartDate ? 'border-red-500' : ''}`}
                  />
                  {errors.expectedStartDate && <p className="text-red-500 text-sm mt-1">{errors.expectedStartDate}</p>}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Work Experience</label>
                    <select
                      value={formData.workExperience}
                      onChange={(e) => handleInputChange('workExperience', e.target.value)}
                      className="input-field"
                    >
                      <option value="">Select work experience</option>
                      <option value="none">No work experience</option>
                      <option value="less-than-1">Less than 1 year</option>
                      <option value="1-3">1-3 years</option>
                      <option value="3-5">3-5 years</option>
                      <option value="5-10">5-10 years</option>
                      <option value="more-than-10">More than 10 years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Employer (Optional)</label>
                    <input
                      type="text"
                      value={formData.currentEmployer}
                      onChange={(e) => handleInputChange('currentEmployer', e.target.value)}
                      className="input-field"
                      placeholder="Enter current employer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Required Documents</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resume/CV *</label>
                  <input
                    type="file"
                    onChange={(e) => handleInputChange('resume', e.target.files?.[0] || null)}
                    className={`input-field ${errors.resume ? 'border-red-500' : ''}`}
                    accept=".pdf,.doc,.docx"
                  />
                  <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                  {errors.resume && <p className="text-red-500 text-sm mt-1">{errors.resume}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Transcripts *</label>
                  <input
                    type="file"
                    onChange={(e) => handleInputChange('transcripts', e.target.files?.[0] || null)}
                    className={`input-field ${errors.transcripts ? 'border-red-500' : ''}`}
                    accept=".pdf,.doc,.docx"
                  />
                  <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                  {errors.transcripts && <p className="text-red-500 text-sm mt-1">{errors.transcripts}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recommendation Letter (Optional)</label>
                  <input
                    type="file"
                    onChange={(e) => handleInputChange('recommendationLetter', e.target.files?.[0] || null)}
                    className="input-field"
                    accept=".pdf,.doc,.docx"
                  />
                  <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Personal Statement (Optional)</label>
                  <input
                    type="file"
                    onChange={(e) => handleInputChange('personalStatement', e.target.files?.[0] || null)}
                    className="input-field"
                    accept=".pdf,.doc,.docx"
                  />
                  <p className="text-sm text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX (Max 5MB)</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center space-x-4">
              {currentStep < 5 ? (
                <button
                  onClick={nextStep}
                  className="btn-primary flex items-center"
                >
                  Next
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-primary flex items-center"
                >
                  {submitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <ArrowRightIcon className="h-4 w-4 ml-2" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
