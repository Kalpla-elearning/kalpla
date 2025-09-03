'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  CheckIcon,
  AcademicCapIcon,
  UserIcon,
  CreditCardIcon,
  StarIcon,
  ArrowRightIcon,
  ClockIcon,
  ShieldCheckIcon,
  SparklesIcon,
  UsersIcon
} from '@heroicons/react/24/outline'

interface SubscriptionPlan {
  id: string
  name: string
  description: string
  type: string
  price: number
  currency: string
  features: string[]
  isActive: boolean
  maxCourses?: number
  maxStudents?: number
  maxStorage?: number
  priority: number
}

export default function SubscriptionPlansPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [billingCycle, setBillingCycle] = useState<'MONTHLY' | 'YEARLY'>('MONTHLY')

  useEffect(() => {
    fetchSubscriptionPlans()
  }, [])

  const fetchSubscriptionPlans = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/subscription-plans?active=true')
      if (response.ok) {
        const data = await response.json()
        setPlans(data.plans)
      }
    } catch (error) {
      console.error('Error fetching subscription plans:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPlanIcon = (planName: string) => {
    const name = planName.toLowerCase()
    if (name.includes('basic')) return <AcademicCapIcon className="h-8 w-8 text-blue-600" />
    if (name.includes('pro')) return <StarIcon className="h-8 w-8 text-purple-600" />
    if (name.includes('enterprise')) return <SparklesIcon className="h-8 w-8 text-orange-600" />
    return <CreditCardIcon className="h-8 w-8 text-gray-600" />
  }

  const getPlanColor = (planName: string) => {
    const name = planName.toLowerCase()
    if (name.includes('basic')) return 'border-blue-200 bg-blue-50'
    if (name.includes('pro')) return 'border-purple-200 bg-purple-50'
    if (name.includes('enterprise')) return 'border-orange-200 bg-orange-50'
    return 'border-gray-200 bg-gray-50'
  }

  const getPlanButtonColor = (planName: string) => {
    const name = planName.toLowerCase()
    if (name.includes('basic')) return 'bg-blue-600 hover:bg-blue-700'
    if (name.includes('pro')) return 'bg-purple-600 hover:bg-purple-700'
    if (name.includes('enterprise')) return 'bg-orange-600 hover:bg-orange-700'
    return 'bg-gray-600 hover:bg-gray-700'
  }

  const calculatePrice = (plan: SubscriptionPlan) => {
    if (billingCycle === 'YEARLY' && plan.type === 'MONTHLY') {
      return plan.price * 12 * 0.8 // 20% discount for yearly
    }
    return plan.price
  }

  const handleSubscribe = (plan: SubscriptionPlan) => {
    if (!session?.user) {
      router.push('/auth/signin?callbackUrl=/subscription-plans')
      return
    }

    // Redirect to checkout with subscription plan details
    const checkoutUrl = `/checkout?type=SUBSCRIPTION&itemId=${plan.id}&itemTitle=${encodeURIComponent(plan.name)}&itemType=subscription&unitPrice=${calculatePrice(plan)}&currency=${plan.currency}`
    router.push(checkoutUrl)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Choose Your Subscription Plan
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock premium features and accelerate your learning journey with our flexible subscription options
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Billing Cycle Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
            <div className="flex">
              <button
                onClick={() => setBillingCycle('MONTHLY')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'MONTHLY'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('YEARLY')}
                className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'YEARLY'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="ml-1 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {plans
            .filter(plan => plan.type === billingCycle || plan.type === 'LIFETIME')
            .sort((a, b) => b.priority - a.priority)
            .map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white rounded-lg shadow-sm border-2 ${getPlanColor(plan.name)} p-8 hover:shadow-lg transition-shadow`}
              >
                {/* Popular Badge */}
                {plan.name.toLowerCase().includes('pro') && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className="flex justify-center mb-4">
                    {getPlanIcon(plan.name)}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900">
                    ₹{calculatePrice(plan).toLocaleString()}
                  </div>
                  <div className="text-gray-600">
                    {plan.type === 'LIFETIME' ? 'One-time payment' : 
                     billingCycle === 'YEARLY' ? 'per year' : 'per month'}
                  </div>
                  {billingCycle === 'YEARLY' && plan.type === 'MONTHLY' && (
                    <div className="text-sm text-green-600 mt-1">
                      Save ₹{(plan.price * 12 * 0.2).toLocaleString()} yearly
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-start">
                      <CheckIcon className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Limits */}
                {(plan.maxCourses || plan.maxStudents || plan.maxStorage) && (
                  <div className="border-t border-gray-200 pt-4 mb-6">
                    <div className="space-y-2 text-sm text-gray-600">
                      {plan.maxCourses && (
                        <div className="flex items-center">
                          <AcademicCapIcon className="h-4 w-4 mr-2" />
                          <span>Up to {plan.maxCourses} courses</span>
                        </div>
                      )}
                      {plan.maxStudents && (
                        <div className="flex items-center">
                          <UsersIcon className="h-4 w-4 mr-2" />
                          <span>Up to {plan.maxStudents} students</span>
                        </div>
                      )}
                      {plan.maxStorage && (
                        <div className="flex items-center">
                          <ShieldCheckIcon className="h-4 w-4 mr-2" />
                          <span>Up to {plan.maxStorage}MB storage</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Subscribe Button */}
                <button
                  onClick={() => handleSubscribe(plan)}
                  className={`w-full ${getPlanButtonColor(plan.name)} text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center`}
                >
                  <ArrowRightIcon className="h-5 w-5 mr-2" />
                  {plan.type === 'LIFETIME' ? 'Get Lifetime Access' : 'Subscribe Now'}
                </button>
              </div>
            ))}
        </div>

        {/* Features Comparison */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Compare Features
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 font-medium text-gray-900">Feature</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-900">Basic</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-900">Pro</th>
                  <th className="text-center py-4 px-6 font-medium text-gray-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-4 px-6 text-gray-700">Course Access</td>
                  <td className="py-4 px-6 text-center text-gray-900">Limited</td>
                  <td className="py-4 px-6 text-center text-gray-900">Unlimited</td>
                  <td className="py-4 px-6 text-center text-gray-900">Unlimited</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Certificate Generation</td>
                  <td className="py-4 px-6 text-center text-gray-900">✓</td>
                  <td className="py-4 px-6 text-center text-gray-900">✓</td>
                  <td className="py-4 px-6 text-center text-gray-900">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Priority Support</td>
                  <td className="py-4 px-6 text-center text-gray-900">✗</td>
                  <td className="py-4 px-6 text-center text-gray-900">✓</td>
                  <td className="py-4 px-6 text-center text-gray-900">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Advanced Analytics</td>
                  <td className="py-4 px-6 text-center text-gray-900">✗</td>
                  <td className="py-4 px-6 text-center text-gray-900">✓</td>
                  <td className="py-4 px-6 text-center text-gray-900">✓</td>
                </tr>
                <tr>
                  <td className="py-4 px-6 text-gray-700">Custom Branding</td>
                  <td className="py-4 px-6 text-center text-gray-900">✗</td>
                  <td className="py-4 px-6 text-center text-gray-900">✗</td>
                  <td className="py-4 px-6 text-center text-gray-900">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I cancel anytime?</h3>
              <p className="text-gray-600">Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your billing period.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Is there a free trial?</h3>
              <p className="text-gray-600">We offer a 7-day free trial for all subscription plans. No credit card required to start.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">We accept all major credit cards, debit cards, and digital wallets through our secure payment gateway.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Can I upgrade or downgrade?</h3>
              <p className="text-gray-600">Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated accordingly.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-600 mb-6">
            Join thousands of learners who have already transformed their careers with Kalpla
          </p>
          <Link
            href="/auth/signup"
            className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Start Free Trial
            <ArrowRightIcon className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  )
}
