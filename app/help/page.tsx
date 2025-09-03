'use client'

import { useState } from 'react'
import { 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  QuestionMarkCircleIcon,
  AcademicCapIcon,
  CreditCardIcon,
  UserIcon,
  CogIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null)

  const categories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: AcademicCapIcon,
      description: 'Learn how to get started with Kalpla',
      faqs: [
        {
          id: 'gs-1',
          question: 'How do I create an account?',
          answer: 'Creating an account is simple! Click the "Sign Up" button in the top right corner of our homepage. You can sign up using your email address or connect with your Google or GitHub account for faster registration.'
        },
        {
          id: 'gs-2',
          question: 'How do I enroll in my first course?',
          answer: 'Browse our course catalog, find a course that interests you, and click "Enroll Now". You\'ll be guided through the payment process, and once completed, you\'ll have immediate access to the course content.'
        },
        {
          id: 'gs-3',
          question: 'Can I try a course before buying?',
          answer: 'Yes! Most of our courses offer free preview lessons. You can watch the first few lessons of any course to get a feel for the content and teaching style before making a purchase.'
        },
        {
          id: 'gs-4',
          question: 'How do I access my enrolled courses?',
          answer: 'After enrollment, you can access your courses from your dashboard. Simply log in and click on "My Courses" to see all your enrolled courses and continue learning.'
        }
      ]
    },
    {
      id: 'account-billing',
      title: 'Account & Billing',
      icon: CreditCardIcon,
      description: 'Manage your account and billing information',
      faqs: [
        {
          id: 'ab-1',
          question: 'What payment methods do you accept?',
          answer: 'We accept all major credit cards (Visa, MasterCard, American Express), debit cards, and digital wallets including PayPal, Apple Pay, and Google Pay. We also support bank transfers for corporate clients.'
        },
        {
          id: 'ab-2',
          question: 'How do I update my payment information?',
          answer: 'Go to your account settings and click on "Billing". You can update your payment method, view your billing history, and manage your subscription settings there.'
        },
        {
          id: 'ab-3',
          question: 'Can I get a refund?',
          answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied with your course within 30 days of purchase, you can request a full refund through your account dashboard.'
        },
        {
          id: 'ab-4',
          question: 'How do I cancel my subscription?',
          answer: 'You can cancel your subscription at any time from your account settings. Go to "Billing" and click "Cancel Subscription". You\'ll continue to have access until the end of your current billing period.'
        }
      ]
    },
    {
      id: 'courses-learning',
      title: 'Courses & Learning',
      icon: BookOpenIcon,
      description: 'Everything about our courses and learning experience',
      faqs: [
        {
          id: 'cl-1',
          question: 'How long do I have access to my courses?',
          answer: 'You have lifetime access to all courses you purchase. This means you can watch the content as many times as you want, and you\'ll always have access to updated versions of the courses.'
        },
        {
          id: 'cl-2',
          question: 'Do you offer certificates?',
          answer: 'Yes! All our courses provide certificates of completion. These certificates are recognized by employers and can be shared on professional platforms like LinkedIn. You\'ll receive your certificate automatically upon completing a course.'
        },
        {
          id: 'cl-3',
          question: 'Can I download course materials?',
          answer: 'Yes, most courses include downloadable resources like PDFs, templates, and code files. These are available in the course dashboard and can be downloaded for offline use.'
        },
        {
          id: 'cl-4',
          question: 'What if I have questions about course content?',
          answer: 'Each course has a discussion forum where you can ask questions and interact with instructors and other students. Instructors typically respond within 24-48 hours.'
        }
      ]
    },
    {
      id: 'technical-support',
      title: 'Technical Support',
      icon: CogIcon,
      description: 'Technical issues and platform support',
      faqs: [
        {
          id: 'ts-1',
          question: 'What browsers do you support?',
          answer: 'We support all modern browsers including Chrome, Firefox, Safari, and Edge. For the best experience, we recommend using the latest version of Chrome or Firefox.'
        },
        {
          id: 'ts-2',
          question: 'The video isn\'t playing. What should I do?',
          answer: 'First, check your internet connection. If that\'s fine, try refreshing the page or clearing your browser cache. If the issue persists, contact our support team with details about your browser and operating system.'
        },
        {
          id: 'ts-3',
          question: 'Can I watch courses on mobile devices?',
          answer: 'Yes! Our platform is fully responsive and works great on mobile devices. You can watch courses on your smartphone or tablet through any web browser.'
        },
        {
          id: 'ts-4',
          question: 'How do I reset my password?',
          answer: 'Click "Forgot Password" on the login page. Enter your email address, and we\'ll send you a link to reset your password. Make sure to check your spam folder if you don\'t see the email.'
        }
      ]
    }
  ]

  const filteredCategories = categories.map(category => ({
    ...category,
    faqs: category.faqs.filter(faq => 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.faqs.length > 0)

  const handleCategoryToggle = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId)
  }

  const handleFaqToggle = (faqId: string) => {
    setExpandedFaq(expandedFaq === faqId ? null : faqId)
  }

  const contactMethods = [
    {
      icon: EnvelopeIcon,
      title: 'Email Support',
      description: 'Get help via email',
      contact: 'support@kalpla.com',
      responseTime: 'Within 24 hours'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      description: 'Chat with our support team',
      contact: 'Available Mon-Fri, 9AM-6PM',
      responseTime: 'Instant'
    },
    {
      icon: PhoneIcon,
      title: 'Phone Support',
      description: 'Call us directly',
      contact: '+1 (555) 123-4567',
      responseTime: 'Mon-Fri, 9AM-6PM'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Help Center
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Find answers to common questions and get the support you need to succeed with Kalpla.
            </p>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for help articles, courses, or topics..."
              className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          {searchQuery && (
            <p className="mt-4 text-sm text-gray-600">
              Found {filteredCategories.reduce((acc, cat) => acc + cat.faqs.length, 0)} results for "{searchQuery}"
            </p>
          )}
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Browse our help categories to find answers to common questions about using Kalpla.
            </p>
          </div>

          <div className="space-y-8">
            {filteredCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => handleCategoryToggle(category.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mr-4">
                      <category.icon className="h-6 w-6 text-primary-600" />
                    </div>
                    <div className="text-left">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {category.title}
                      </h3>
                      <p className="text-gray-600">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  {expandedCategory === category.id ? (
                    <ChevronUpIcon className="h-6 w-6 text-gray-400" />
                  ) : (
                    <ChevronDownIcon className="h-6 w-6 text-gray-400" />
                  )}
                </button>

                {expandedCategory === category.id && (
                  <div className="border-t border-gray-200">
                    <div className="p-6 space-y-4">
                      {category.faqs.map((faq) => (
                        <div key={faq.id} className="border border-gray-200 rounded-lg">
                          <button
                            onClick={() => handleFaqToggle(faq.id)}
                            className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                          >
                            <span className="font-medium text-gray-900">
                              {faq.question}
                            </span>
                            {expandedFaq === faq.id ? (
                              <ChevronUpIcon className="h-5 w-5 text-gray-400" />
                            ) : (
                              <ChevronDownIcon className="h-5 w-5 text-gray-400" />
                            )}
                          </button>
                          {expandedFaq === faq.id && (
                            <div className="px-4 pb-4">
                              <p className="text-gray-600 leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {searchQuery && filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <QuestionMarkCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No results found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any help articles matching "{searchQuery}".
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Contact Support */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Still Need Help?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Can't find what you're looking for? Our support team is here to help you succeed.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactMethods.map((method, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <method.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {method.title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {method.description}
                </p>
                <p className="text-primary-600 font-medium mb-2">
                  {method.contact}
                </p>
                <p className="text-sm text-gray-500">
                  {method.responseTime}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="/contact"
              className="inline-flex items-center bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
              Contact Support
            </a>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Quick Links
            </h2>
            <p className="text-lg text-gray-600">
              Popular resources and helpful links
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <a
              href="/courses"
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
            >
              <BookOpenIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Browse Courses
              </h3>
              <p className="text-gray-600 text-sm">
                Explore our course catalog
              </p>
            </a>

            <a
              href="/auth/signup"
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
            >
              <UserIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Create Account
              </h3>
              <p className="text-gray-600 text-sm">
                Join our learning community
              </p>
            </a>

            <a
              href="/about"
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
            >
              <AcademicCapIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                About Kalpla
              </h3>
              <p className="text-gray-600 text-sm">
                Learn more about our mission
              </p>
            </a>

            <a
              href="/contact"
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow text-center"
            >
              <ChatBubbleLeftRightIcon className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Contact Us
              </h3>
              <p className="text-gray-600 text-sm">
                Get in touch with our team
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
