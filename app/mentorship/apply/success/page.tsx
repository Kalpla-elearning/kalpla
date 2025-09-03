import Link from 'next/link'
import { CheckCircleIcon, ClockIcon, EnvelopeIcon } from '@heroicons/react/24/outline'

export default function MentorApplicationSuccessPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500 mb-6" />
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Application Submitted Successfully!
          </h1>
          
          <p className="text-lg text-gray-600 mb-8">
            Thank you for applying to become a mentor. We're excited to have you join our community of experts.
          </p>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">What happens next?</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <ClockIcon className="h-6 w-6 text-blue-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Review Process</h3>
                  <p className="text-gray-600 mt-1">
                    Our team will review your application within 3-5 business days. We'll carefully evaluate your experience, expertise, and motivation.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <EnvelopeIcon className="h-6 w-6 text-green-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Email Notification</h3>
                  <p className="text-gray-600 mt-1">
                    You'll receive an email notification once your application has been reviewed. If approved, we'll schedule a brief interview call.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-purple-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Interview Call</h3>
                  <p className="text-gray-600 mt-1">
                    A 15-20 minute video call to discuss your mentoring approach, availability, and answer any questions you may have.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  <CheckCircleIcon className="h-6 w-6 text-yellow-500" />
                </div>
                <div className="text-left">
                  <h3 className="font-medium text-gray-900">Profile Activation</h3>
                  <p className="text-gray-600 mt-1">
                    Once approved, your mentor profile will be activated and you can start accepting mentorship requests from students.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">While you wait...</h3>
            <p className="text-blue-700 mb-4">
              Take some time to prepare for your potential role as a mentor:
            </p>
            <ul className="text-left text-blue-700 space-y-2">
              <li>• Think about your mentoring style and approach</li>
              <li>• Prepare examples of your best work or achievements</li>
              <li>• Consider your availability and preferred session times</li>
              <li>• Review our mentoring guidelines and best practices</li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
            <Link href="/mentorship" className="btn-secondary">
              Browse Mentorship Programs
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
