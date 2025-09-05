import { AcademicCapIcon, DocumentTextIcon, UsersIcon, TrophyIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline'

export default function InstructorGuidelinesPage() {
  const guidelines = [
    {
      icon: DocumentTextIcon,
      title: 'Course Content Standards',
      description: 'Create high-quality, original content that provides real value to students',
      details: [
        'All content must be original and created by you',
        'Courses should be comprehensive and well-structured',
        'Include practical exercises and real-world examples',
        'Ensure content is up-to-date and relevant',
        'Provide clear learning objectives for each lesson'
      ]
    },
    {
      icon: UsersIcon,
      title: 'Student Engagement',
      description: 'Foster a positive learning environment and engage with your students',
      details: [
        'Respond to student questions within 24-48 hours',
        'Provide constructive feedback on assignments',
        'Encourage discussion and interaction',
        'Be patient and supportive with all skill levels',
        'Create a welcoming and inclusive environment'
      ]
    },
    {
      icon: ClockIcon,
      title: 'Course Structure',
      description: 'Organize your content in a logical, easy-to-follow format',
      details: [
        'Break content into digestible lessons (10-20 minutes each)',
        'Include clear introductions and summaries',
        'Provide downloadable resources when appropriate',
        'Use consistent formatting and presentation',
        'Include quizzes and assessments to reinforce learning'
      ]
    },
    {
      icon: StarIcon,
      title: 'Quality Standards',
      description: 'Maintain high production quality and professional presentation',
      details: [
        'Use clear audio and video recording equipment',
        'Ensure good lighting and clear visuals',
        'Edit content to remove unnecessary pauses or errors',
        'Use professional presentation software',
        'Test all content before publishing'
      ]
    }
  ]

  const requirements = [
    {
      title: 'Technical Requirements',
      items: [
        'HD video recording (1080p minimum)',
        'Clear audio with minimal background noise',
        'Stable internet connection for live sessions',
        'Professional presentation software',
        'Screen recording capability for technical courses'
      ]
    },
    {
      title: 'Content Requirements',
      items: [
        'Minimum 2 hours of video content per course',
        'At least 5 lessons per course',
        'Comprehensive course description and outline',
        'Clear learning objectives',
        'Practical exercises or projects'
      ]
    },
    {
      title: 'Professional Standards',
      items: [
        'Maintain professional appearance and demeanor',
        'Use appropriate language and tone',
        'Respect intellectual property rights',
        'Follow platform community guidelines',
        'Provide accurate and up-to-date information'
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
              Instructor Guidelines
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to know to create successful courses and provide an excellent learning experience for your students.
            </p>
          </div>
        </div>
      </div>

      {/* Guidelines Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Instructor Guidelines
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {guidelines.map((guideline, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-start mb-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                    <guideline.icon className="h-6 w-6 text-primary-600" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {guideline.title}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {guideline.description}
                  </p>
                </div>
              </div>
              <ul className="space-y-2">
                {guideline.details.map((detail, detailIndex) => (
                  <li key={detailIndex} className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    </div>
                    <p className="ml-3 text-gray-700">{detail}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
            Requirements & Standards
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {requirements.map((requirement, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {requirement.title}
                </h3>
                <ul className="space-y-3">
                  {requirement.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start">
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                      </div>
                      <p className="ml-3 text-gray-700">{item}</p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Practices Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Best Practices for Success
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Course Creation Tips
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                </div>
                <p className="ml-3 text-gray-700">Start with a clear course outline and learning objectives</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                </div>
                <p className="ml-3 text-gray-700">Create engaging introductions and conclusions for each lesson</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                </div>
                <p className="ml-3 text-gray-700">Use a mix of teaching methods (lecture, demonstration, hands-on)</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                </div>
                <p className="ml-3 text-gray-700">Include practical exercises and real-world examples</p>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Student Engagement
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                </div>
                <p className="ml-3 text-gray-700">Encourage questions and discussion in the comments</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                </div>
                <p className="ml-3 text-gray-700">Provide timely feedback on assignments and projects</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                </div>
                <p className="ml-3 text-gray-700">Create a supportive and inclusive learning environment</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                </div>
                <p className="ml-3 text-gray-700">Update content regularly to keep it current and relevant</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Ready to Start Teaching?
            </h2>
            <p className="text-xl text-primary-100 mb-8">
              Join our community of expert instructors and start sharing your knowledge today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/instructors/apply"
                className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                Apply to Teach
              </a>
              <a
                href="/instructors/success-stories"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Read Success Stories
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
