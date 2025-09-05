'use client'

import { useState, useEffect } from 'react'
import { useSession } from '@/lib/hooks/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { 
  CheckCircleIcon,
  AcademicCapIcon,
  DocumentTextIcon,
  ArrowRightIcon,
  ClockIcon,
  UserIcon,
  CreditCardIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface PaymentSuccessData {
  paymentId: string
  orderId: string
  orderNumber: string
  amount: number
  currency: string
  itemTitle: string
  itemType: string
  orderType: string
  status: string
  createdAt: string
}

export default function PaymentSuccessPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [paymentData, setPaymentData] = useState<PaymentSuccessData | null>(null)
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

    if (!paymentId || !orderId) {
      router.push('/dashboard')
      return
    }

    // Fetch payment details from API
    fetchPaymentDetails(paymentId, orderId)
  }, [session, status, router, searchParams])

  const fetchPaymentDetails = async (paymentId: string, orderId: string) => {
    try {
      const response = await fetch(`/api/payments/${paymentId}`)
      if (response.ok) {
        const data = await response.json()
        setPaymentData(data.payment)
      } else {
        console.error('Failed to fetch payment details')
      }
    } catch (error) {
      console.error('Error fetching payment details:', error)
    } finally {
      setLoading(false)
    }
  }

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

  const getNextSteps = (orderType: string) => {
    switch (orderType) {
      case 'COURSE':
        return [
          'Access your course immediately from your dashboard',
          'Start learning with video lessons and assignments',
          'Track your progress and earn certificates',
          'Join course discussions and ask questions'
        ]
      case 'DEGREE_PROGRAM':
        return [
          'Complete your enrollment verification',
          'Access your degree program curriculum',
          'Connect with your academic advisor',
          'Start your first semester courses'
        ]
      case 'MENTORSHIP':
        return [
          'Schedule your first mentorship session',
          'Review your mentor\'s profile and expertise',
          'Prepare questions for your mentor',
          'Access mentorship resources and materials'
        ]
      case 'SUBSCRIPTION':
        return [
          'Access all premium features immediately',
          'Create unlimited courses and content',
          'Access advanced analytics and insights',
          'Get priority support and assistance'
        ]
      default:
        return [
          'Check your email for confirmation details',
          'Access your purchased content from dashboard',
          'Contact support if you need assistance'
        ]
    }
  }

  const getActionButton = (orderType: string) => {
    switch (orderType) {
      case 'COURSE':
        return {
          href: '/dashboard/courses',
          text: 'Go to My Courses',
          icon: <AcademicCapIcon className="h-5 w-5" />
        }
      case 'DEGREE_PROGRAM':
        return {
          href: '/dashboard/degrees',
          text: 'View Degree Program',
          icon: <DocumentTextIcon className="h-5 w-5" />
        }
      case 'MENTORSHIP':
        return {
          href: '/dashboard/mentorship/sessions',
          text: 'Schedule Sessions',
          icon: <UserIcon className="h-5 w-5" />
        }
      case 'SUBSCRIPTION':
        return {
          href: '/dashboard/subscription',
          text: 'Manage Subscription',
          icon: <CreditCardIcon className="h-5 w-5" />
        }
      default:
        return {
          href: '/dashboard',
          text: 'Go to Dashboard',
          icon: <ArrowRightIcon className="h-5 w-5" />
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
          <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">Your payment has been processed successfully.</p>
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

  const actionButton = getActionButton(paymentData.orderType)

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
              <div className="flex items-center space-x-2 text-sm text-green-600">
                <CheckCircleIcon className="h-4 w-4" />
                <span>Payment Successful</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        <div className="text-center mb-8">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful!</h1>
          <p className="text-lg text-gray-600">
            Thank you for your purchase. Your order has been confirmed and processed.
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
                  {getItemIcon(paymentData.itemType)}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">{paymentData.itemTitle}</h3>
                  <p className="text-sm text-gray-600 capitalize">
                    {paymentData.itemType.replace('_', ' ')}
                  </p>
                </div>
              </div>

              {/* Order Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <dt className="text-sm font-medium text-gray-600">Order Number</dt>
                  <dd className="text-sm text-gray-900">{paymentData.orderNumber}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Payment ID</dt>
                  <dd className="text-sm text-gray-900">{paymentData.paymentId}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Amount Paid</dt>
                  <dd className="text-sm text-gray-900">
                    {paymentData.currency} {paymentData.amount.toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Payment Status</dt>
                  <dd className="text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {paymentData.status}
                    </span>
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Order Date</dt>
                  <dd className="text-sm text-gray-900">
                    {new Date(paymentData.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Order Type</dt>
                  <dd className="text-sm text-gray-900 capitalize">
                    {paymentData.orderType.replace('_', ' ')}
                  </dd>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
              <div className="space-y-3">
                {getNextSteps(paymentData.orderType).map((step, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary-100">
                        <span className="text-xs font-medium text-primary-600">{index + 1}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              {/* Primary Action */}
              <Link
                href={actionButton.href}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center mb-4"
              >
                {actionButton.icon}
                <span className="ml-2">{actionButton.text}</span>
              </Link>

              {/* Secondary Actions */}
              <div className="space-y-3">
                <Link
                  href="/dashboard"
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <ArrowRightIcon className="h-4 w-4 mr-2" />
                  Go to Dashboard
                </Link>
                
                <Link
                  href="/dashboard/payments"
                  className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <CreditCardIcon className="h-4 w-4 mr-2" />
                  View Payment History
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
                <p className="text-sm text-gray-600 mb-2">Need assistance?</p>
                <Link
                  href="/contact"
                  className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                >
                  Contact Support →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
