'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/hooks/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  ExclamationTriangleIcon,
  AcademicCapIcon,
  ArrowRightIcon,
  ClockIcon,
  UserIcon,
  CreditCardIcon,
  ArrowPathIcon,
  PhoneIcon,
  EnvelopeIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'

interface PaymentFailureData {
  paymentId?: string
  orderId?: string
  orderNumber?: string
  amount?: number
  currency?: string
  itemTitle?: string
  itemType?: string
  orderType?: string
  errorCode?: string
  errorMessage?: string
}

export default function PaymentFailurePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<PaymentFailureData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'loading') return

    if (!session?.user) {
      router.push('/auth/signin')
      return
    }

    // Get payment data from URL params
    const paymentId = searchParams.get('payment_id')
    const orderId = searchParams.get('order_id')
    const orderNumber = searchParams.get('order_number')
    const errorCode = searchParams.get('error_code')
    const errorMessage = searchParams.get('error_message')

    if (!orderId) {
      router.push('/dashboard')
      return
    }

    // Set payment data from URL params
    setPaymentData({
      paymentId,
      orderId,
      orderNumber,
      errorCode,
      errorMessage,
      amount: parseFloat(searchParams.get('amount') || '0'),
      currency: searchParams.get('currency') || 'INR',
      itemTitle: searchParams.get('item_title') || 'Unknown Item',
      itemType: searchParams.get('item_type') || 'unknown',
      orderType: searchParams.get('order_type') || 'UNKNOWN',
    })

    setLoading(false)
  }, [session, status, router, searchParams])

  const getItemIcon = (itemType: string) => {
    switch (itemType) {
      case 'course':
        return <AcademicCapIcon className="h-6 w-6 text-blue-600" />
      case 'degree_program':
        return <DocumentTextIcon className="h-6 w-6 text-green-600" />
      case 'mentorship':
        return <UserIcon className="h-6 w-6 text-purple-600" />
      case 'subscription':
        return <CreditCardIcon className="h-6 w-6 text-orange-600" />
      default:
        return <AcademicCapIcon className="h-6 w-6 text-gray-600" />
    }
  }

  const getErrorMessage = (errorCode?: string) => {
    switch (errorCode) {
      case 'PAYMENT_DECLINED':
        return 'Your payment was declined by your bank or card issuer. Please try a different payment method.'
      case 'INSUFFICIENT_FUNDS':
        return 'Your account has insufficient funds to complete this transaction. Please check your balance.'
      case 'CARD_EXPIRED':
        return 'The card you used has expired. Please use a different card or update your card details.'
      case 'INVALID_CARD':
        return 'The card details provided are invalid. Please check and try again.'
      case 'NETWORK_ERROR':
        return 'A network error occurred during payment processing. Please try again.'
      case 'TIMEOUT':
        return 'The payment request timed out. Please try again.'
      default:
        return 'An unexpected error occurred during payment processing. Please try again or contact support.'
    }
  }

  const getRetryOptions = (orderType: string) => {
    switch (orderType) {
      case 'COURSE':
        return {
          primaryAction: {
            href: `/courses/${paymentData?.itemType}`,
            text: 'Retry Payment',
            icon: <ArrowPathIcon className="h-5 w-5" />
          },
          secondaryAction: {
            href: '/dashboard/courses',
            text: 'View My Courses',
            icon: <AcademicCapIcon className="h-5 w-5" />
          }
        }
      case 'DEGREE_PROGRAM':
        return {
          primaryAction: {
            href: `/degrees/${paymentData?.itemType}`,
            text: 'Retry Payment',
            icon: <ArrowPathIcon className="h-5 w-5" />
          },
          secondaryAction: {
            href: '/degrees',
            text: 'Browse Programs',
            icon: <DocumentTextIcon className="h-5 w-5" />
          }
        }
      case 'MENTORSHIP':
        return {
          primaryAction: {
            href: `/mentorship/mentor/${paymentData?.itemType}`,
            text: 'Retry Payment',
            icon: <ArrowPathIcon className="h-5 w-5" />
          },
          secondaryAction: {
            href: '/mentorship',
            text: 'Browse Mentorship',
            icon: <UserIcon className="h-5 w-5" />
          }
        }
      case 'SUBSCRIPTION':
        return {
          primaryAction: {
            href: '/subscription-plans',
            text: 'Retry Payment',
            icon: <ArrowPathIcon className="h-5 w-5" />
          },
          secondaryAction: {
            href: '/dashboard/subscription',
            text: 'View Subscriptions',
            icon: <CreditCardIcon className="h-5 w-5" />
          }
        }
      default:
        return {
          primaryAction: {
            href: '/dashboard',
            text: 'Go to Dashboard',
            icon: <ArrowRightIcon className="h-5 w-5" />
          },
          secondaryAction: {
            href: '/help',
            text: 'Get Help',
            icon: <ClockIcon className="h-5 w-5" />
          }
        }
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!paymentData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Failed</h2>
          <p className="text-gray-600 mb-4">Unable to retrieve payment details.</p>
          <Link
            href="/dashboard"
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  const retryOptions = getRetryOptions(paymentData.orderType)

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
              <div className="flex items-center space-x-2 text-sm text-yellow-600">
                <ExclamationTriangleIcon className="h-4 w-4" />
                <span>Payment Failed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Failure Message */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 mb-4">
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Failed</h1>
          <p className="text-lg text-gray-600">
            We couldn't process your payment. Don't worry, your order is safe and you can try again.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Details */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Details</h2>
              
              {/* Item Information */}
              <div className="flex items-start space-x-4 mb-6">
                <div className="flex-shrink-0">
                  {getItemIcon(paymentData.itemType || 'unknown')}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{paymentData.itemTitle}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {paymentData.itemType?.replace('_', ' ') || 'Unknown Item'}
                  </p>
                </div>
              </div>

              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {paymentData.orderNumber && (
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Order Number</dt>
                    <dd className="text-sm text-gray-900">{paymentData.orderNumber}</dd>
                  </div>
                )}
                {paymentData.paymentId && (
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Payment ID</dt>
                    <dd className="text-sm text-gray-900">{paymentData.paymentId}</dd>
                  </div>
                )}
                {paymentData.amount && (
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Amount</dt>
                    <dd className="text-sm text-gray-900">
                      {paymentData.currency} {paymentData.amount.toLocaleString()}
                    </dd>
                  </div>
                )}
                {paymentData.errorCode && (
                  <div>
                    <dt className="text-sm font-medium text-gray-600">Error Code</dt>
                    <dd className="text-sm text-gray-900">{paymentData.errorCode}</dd>
                  </div>
                )}
              </div>
            </div>

            {/* Error Details */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What Happened?</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-yellow-800">
                  {getErrorMessage(paymentData.errorCode)}
                </p>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">Common Solutions:</h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Check your card details and ensure they are correct</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Verify you have sufficient funds in your account</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Try using a different payment method</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-yellow-500 mt-1">•</span>
                    <span>Contact your bank if the issue persists</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">What Would You Like to Do?</h3>
              
              {/* Primary Action */}
              <Link
                href={retryOptions.primaryAction.href}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center mb-4"
              >
                {retryOptions.primaryAction.icon}
                <span className="ml-2">{retryOptions.primaryAction.text}</span>
              </Link>

              {/* Secondary Actions */}
              <div className="space-y-3">
                <Link
                  href={retryOptions.secondaryAction.href}
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  {retryOptions.secondaryAction.icon}
                  <span className="ml-2">{retryOptions.secondaryAction.text}</span>
                </Link>
                
                <Link
                  href="/dashboard"
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <ArrowRightIcon className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Link>

                <Link
                  href="/help"
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <ClockIcon className="h-4 w-4 mr-2" />
                  Get Help
                </Link>
              </div>

              {/* Contact Support */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Need Immediate Help?</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    <span>support@kalpla.in</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <PhoneIcon className="h-4 w-4 mr-2" />
                    <span>+91 98765 43210</span>
                  </div>
                </div>
                <Link
                  href="/contact"
                  className="text-primary-600 hover:text-primary-500 text-sm font-medium mt-3 inline-block"
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Important Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Your Order is Safe</h3>
              <p className="text-sm text-gray-600">
                Your order details have been saved and no charges have been made to your account. You can retry the payment at any time.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Payment Security</h3>
              <p className="text-sm text-gray-600">
                All payments are processed securely through Razorpay. Your card information is never stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
