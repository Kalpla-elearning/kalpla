import Link from 'next/link'
import { ArrowRightIcon, RocketLaunchIcon, UserGroupIcon, TrophyIcon, SparklesIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

const mentorshipFeatures = [
  {
    icon: UserGroupIcon,
    title: '1-on-1 Mentorship',
    description: 'Personal guidance from successful entrepreneurs and industry experts'
  },
  {
    icon: RocketLaunchIcon,
    title: 'Startup Incubator',
    description: 'Access to our exclusive startup incubator with funding opportunities'
  },
  {
    icon: TrophyIcon,
    title: 'Industry Connections',
    description: 'Network with VCs, investors, and successful entrepreneurs'
  },
  {
    icon: SparklesIcon,
    title: 'Hands-on Projects',
    description: 'Build real products and gain practical experience'
  }
]

const programHighlights = [
  '12-month intensive program',
  'Weekly 1-on-1 mentorship sessions',
  'Access to ₹8.35Cr+ funding network',
  'Pitch deck development',
  'Market validation support',
  'Legal and business setup guidance',
  'Marketing and growth strategies',
  'Exit strategy planning'
]

export function KalplaMentorship() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-600 via-accent-500 to-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white">
            <div className="mb-8">
              <div className="inline-flex items-center bg-white bg-opacity-20 rounded-full px-4 py-2 mb-6">
                <RocketLaunchIcon className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">Exclusive Program</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Kalpla Startup Mentorship Program
              </h2>
              
              <p className="text-xl text-blue-100 mb-8">
                Transform your idea into a successful startup with our comprehensive 12-month mentorship program. 
                Get personalized guidance from industry experts and access to our exclusive funding network.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {mentorshipFeatures.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                    <p className="text-blue-100 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/mentorship"
                className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg inline-flex items-center justify-center"
              >
                <span>Apply Now</span>
                <ArrowRightIcon className="h-5 w-5 ml-2" />
              </Link>
              <Link
                href="/mentorship/info"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg inline-flex items-center justify-center"
              >
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Content */}
          <div className="space-y-6">
            {/* Program Highlights */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Program Highlights</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {programHighlights.map((highlight, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-5 w-5 text-green-400 flex-shrink-0" />
                    <span className="text-blue-100">{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Success Stats */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">85%</div>
                <div className="text-blue-100 text-sm">Success Rate</div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-white mb-2">₹417Cr+</div>
                <div className="text-blue-100 text-sm">Total Funding Raised</div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">JS</span>
                </div>
                <div>
                  <div className="text-white font-semibold">John Smith</div>
                  <div className="text-blue-100 text-sm">Founder, TechStart Inc.</div>
                </div>
              </div>
              <p className="text-blue-100 italic">
                "The Kalpla mentorship program was a game-changer for my startup. 
                The guidance and connections I gained helped me raise ₹16.7Cr in Series A funding."
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
