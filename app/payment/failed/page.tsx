'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  ExclamationTriangleIcon,
  AcademicCapIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
  ArrowPathIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline'

interface PaymentError {
  code: string
  description: string
  orderId?: string
  programId?: string
}

export default function PaymentFailedPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentError, setPaymentError] = useState<PaymentError | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const errorCode = searchParams.get('error_code')
    const errorDescription = searchParams.get('error_description')
    const orderId = searchParams.get('order_id')
    const programId = searchParams.get('program_id')

    if (!errorCode) {
      router.push('/degrees')
      return
    }

    setPaymentError({
      code: errorCode,
      description: errorDescription || 'Payment processing failed',
      orderId: orderId || undefined,
      programId: programId || undefined
    })
    setIsLoading(false)
  }, [searchParams, router])

  const handleRetryPayment = () => {
    if (paymentError?.programId) {
      router.push(`/checkout?programId=${paymentError.programId}`)
    } else {
      router.push('/degrees')
    }
  }

  const handleContactSupport = () => {
    // In a real application, this would open a support chat or redirect to contact page
    window.open('mailto:support@kalpla.com?subject=Payment%20Failed%20-%20Order%20' + paymentError?.orderId, '_blank')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!paymentError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Error Found</h2>
          <p className="text-gray-600 mb-4">Unable to find payment error details.</p>
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
          <div className="flex items-center space-x-2">
            <AcademicCapIcon className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">Kalpla</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Error Message */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-lg text-gray-600">We couldn't process your payment. Please try again.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Error Details */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Error Details</h2>
            <div className="space-y-4">
              <div>
                <span className="text-sm text-gray-600">Error Code</span>
                <p className="font-medium text-gray-900">{paymentError.code}</p>
              </div>
              <div>
                <span className="text-sm text-gray-600">Description</span>
                <p className="font-medium text-gray-900">{paymentError.description}</p>
              </div>
              {paymentError.orderId && (
                <div>
                  <span className="text-sm text-gray-600">Order ID</span>
                  <p className="font-medium text-gray-900">{paymentError.orderId}</p>
                </div>
              )}
            </div>
          </div>

          {/* Common Solutions */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Common Solutions</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <CreditCardIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Check Payment Method</h3>
                  <p className="text-sm text-gray-600">Ensure your card details are correct and the card has sufficient funds.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <ArrowPathIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Try Again</h3>
                  <p className="text-sm text-gray-600">Sometimes temporary network issues can cause payment failures.</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <PhoneIcon className="h-5 w-5 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Contact Support</h3>
                  <p className="text-sm text-gray-600">Our team can help resolve payment issues quickly.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleRetryPayment}
            className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center"
          >
            <ArrowPathIcon className="h-5 w-5 mr-2" />
            Try Again
          </button>
          
          <button
            onClick={handleContactSupport}
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            <EnvelopeIcon className="h-5 w-5 mr-2" />
            Contact Support
          </button>
          
          <button
            onClick={() => router.push('/degrees')}
            className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            Back to Programs
          </button>
        </div>

        {/* Support Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-blue-900 mb-4">Need Immediate Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Email Support</h3>
              <p className="text-sm text-blue-700 mb-2">Get a response within 2 hours</p>
              <a 
                href="mailto:support@kalpla.com" 
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                support@kalpla.com
              </a>
            </div>
            <div>
              <h3 className="font-medium text-blue-900 mb-2">Phone Support</h3>
              <p className="text-sm text-blue-700 mb-2">Available 24/7 for urgent issues</p>
              <a 
                href="tel:+919876543210" 
                className="text-primary-600 hover:text-primary-500 font-medium"
              >
                +91 98765 43210
              </a>
            </div>
          </div>
        </div>

        {/* Error Codes Reference */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Common Error Codes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-900">PAYMENT_DECLINED</span>
              <p className="text-gray-600">Your bank declined the transaction</p>
            </div>
            <div>
              <span className="font-medium text-gray-900">INSUFFICIENT_FUNDS</span>
              <p className="text-gray-600">Your account doesn't have enough funds</p>
            </div>
            <div>
              <span className="font-medium text-gray-900">INVALID_CARD</span>
              <p className="text-gray-600">The card details provided are incorrect</p>
            </div>
            <div>
              <span className="font-medium text-gray-900">NETWORK_ERROR</span>
              <p className="text-gray-600">Temporary network issue, please try again</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
