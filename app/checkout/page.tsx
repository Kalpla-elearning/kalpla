'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/hooks/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  LockClosedIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  ClockIcon,
  UserIcon,
  MapPinIcon,
  PhoneIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { useRazorpayPayment } from '@/lib/hooks/useRazorpayPayment'

interface CheckoutData {
  programId: string
  programTitle: string
  institution: string
  duration: string
  format: string
  level: string
  price: number
  currency: string
}

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const { initializePayment, loading, error, clearError } = useRazorpayPayment()
  
  const [checkoutData, setCheckoutData] = useState<CheckoutData | null>(null)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'India',
    agreeToTerms: false,
    agreeToMarketing: false
  })
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=/checkout')
      return
    }

    // Get checkout data from URL params
    const programId = searchParams.get('programId')
    const programTitle = searchParams.get('programTitle')
    const institution = searchParams.get('institution')
    const duration = searchParams.get('duration')
    const format = searchParams.get('format')
    const level = searchParams.get('level')
    const price = searchParams.get('price')

    if (!programId || !programTitle || !price) {
      router.push('/degrees')
      return
    }

    setCheckoutData({
      programId,
      programTitle,
      institution: institution || 'Kalpla University',
      duration: duration || '4 years',
      format: format || 'Online',
      level: level || 'Undergraduate',
      price: parseFloat(price),
      currency: 'INR'
    })

    // Pre-fill form with user data
    if (session.user) {
      const [firstName, ...lastNameParts] = (session.user.name || '').split(' ')
      const lastName = lastNameParts.join(' ')
      
      setFormData(prev => ({
        ...prev,
        firstName: firstName || '',
        lastName: lastName || '',
        email: session.user.email || ''
      }))
    }
  }, [session, status, router, searchParams])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handlePayment = async () => {
    if (!checkoutData || !formData.agreeToTerms) {
      return
    }

    setIsProcessing(true)
    clearError()

    const result = await initializePayment({
      programId: checkoutData.programId,
      programTitle: checkoutData.programTitle,
      amount: checkoutData.price,
      currency: checkoutData.currency,
    })

    if (result.success) {
      // Payment initiated successfully
      console.log('Payment initiated for:', checkoutData.programTitle)
    } else {
      // Handle payment error
      console.error('Payment failed:', result.error)
    }

    setIsProcessing(false)
  }

  const calculateTotal = () => {
    if (!checkoutData) return 0
    const subtotal = checkoutData.price
    const processingFee = Math.round(subtotal * 0.02) // 2% processing fee
    return subtotal + processingFee
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!checkoutData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Invalid Checkout</h2>
          <p className="text-gray-600 mb-4">Please select a degree program to continue.</p>
          <button
            onClick={() => router.push('/degrees')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Browse Programs
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AcademicCapIcon className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">Kalpla</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <ShieldCheckIcon className="h-4 w-4 text-green-500" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <LockClosedIcon className="h-4 w-4 text-green-500" />
                <span>SSL Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Complete Your Enrollment</h1>
              
              {/* Program Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Program Details</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Program:</span>
                    <p className="font-medium text-gray-900">{checkoutData.programTitle}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Institution:</span>
                    <p className="font-medium text-gray-900">{checkoutData.institution}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <p className="font-medium text-gray-900">{checkoutData.duration}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Format:</span>
                    <p className="font-medium text-gray-900">{checkoutData.format}</p>
                  </div>
                </div>
              </div>

              {/* Personal Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Address Information */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP/Postal Code *
                      </label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="mb-6">
                <div className="space-y-3">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      required
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="/terms" className="text-primary-600 hover:text-primary-500 underline">
                        Terms and Conditions
                      </a>{' '}
                      and{' '}
                      <a href="/privacy" className="text-primary-600 hover:text-primary-500 underline">
                        Privacy Policy
                      </a>
                      *
                    </label>
                  </div>
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      name="agreeToMarketing"
                      checked={formData.agreeToMarketing}
                      onChange={handleInputChange}
                      className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      I would like to receive updates about my program and educational opportunities
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              {/* Program Details */}
              <div className="border-b border-gray-200 pb-4 mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{checkoutData.programTitle}</h3>
                    <p className="text-sm text-gray-600">{checkoutData.institution}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      <span className="flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {checkoutData.duration}
                      </span>
                      <span className="flex items-center">
                        <MapPinIcon className="h-3 w-3 mr-1" />
                        {checkoutData.format}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Program Fee</span>
                  <span className="text-gray-900">₹{checkoutData.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Processing Fee (2%)</span>
                  <span className="text-gray-900">₹{Math.round(checkoutData.price * 0.02).toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-200 pt-2 flex justify-between font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">₹{calculateTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center">
                  <ShieldCheckIcon className="h-5 w-5 text-green-500 mr-2" />
                  <div className="text-sm">
                    <p className="font-medium text-green-800">Secure Payment</p>
                    <p className="text-green-700">Your payment is protected by SSL encryption</p>
                  </div>
                </div>
              </div>

              {/* Payment Button */}
              <button
                onClick={handlePayment}
                disabled={!formData.agreeToTerms || isProcessing || loading}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isProcessing || loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCardIcon className="h-5 w-5 mr-2" />
                    Pay ₹{calculateTotal().toLocaleString()}
                  </>
                )}
              </button>

              {/* Error Message */}
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-red-600">{error}</p>
                    <button
                      onClick={clearError}
                      className="text-red-400 hover:text-red-600"
                    >
                      ×
                    </button>
                  </div>
                </div>
              )}

              {/* Trust Indicators */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center">
                    <LockClosedIcon className="h-3 w-3 mr-1" />
                    <span>SSL Secure</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircleIcon className="h-3 w-3 mr-1" />
                    <span>PCI Compliant</span>
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
