import { AcademicCapIcon, BookOpenIcon, UserGroupIcon, TrophyIcon } from '@heroicons/react/24/outline'

export default function HowItWorksPage() {
  const steps = [
    {
      icon: BookOpenIcon,
      title: 'Browse Courses',
      description: 'Explore our extensive library of courses across various subjects and skill levels.',
      details: [
        'Search by category, skill level, or instructor',
        'Read detailed course descriptions and reviews',
        'Preview course content and curriculum'
      ]
    },
    {
      icon: UserGroupIcon,
      title: 'Enroll & Learn',
      description: 'Join courses and start your learning journey with expert instructors.',
      details: [
        'Access course materials anytime, anywhere',
        'Learn at your own pace with flexible scheduling',
        'Interact with instructors and fellow students'
      ]
    },
    {
      icon: TrophyIcon,
      title: 'Get Certified',
      description: 'Earn certificates and credentials to advance your career.',
      details: [
        'Complete courses to earn certificates',
        'Build a professional portfolio',
        'Showcase your skills to employers'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Learn how to get started with Kalpla and make the most of your online learning experience.
            </p>
          </div>
        </div>
      </div>

      {/* Steps */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-16">
          {steps.map((step, index) => (
            <div key={step.title} className="flex flex-col lg:flex-row items-center">
              <div className="flex-1 lg:pr-12">
                <div className="flex items-center mb-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                      <step.icon className="h-6 w-6 text-primary-600" />
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-2xl font-bold text-gray-900">{step.title}</h3>
                    <p className="text-lg text-gray-600">{step.description}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {step.details.map((detail, detailIndex) => (
                    <li key={detailIndex} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                      </div>
                      <p className="ml-3 text-gray-700">{detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8 lg:mt-0 lg:ml-12">
                <div className="w-64 h-64 bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl flex items-center justify-center">
                  <step.icon className="h-32 w-32 text-primary-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join thousands of students who are already advancing their careers with Kalpla.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/courses"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Browse Courses
              </a>
              <a
                href="/auth/signup"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Sign Up Free
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
