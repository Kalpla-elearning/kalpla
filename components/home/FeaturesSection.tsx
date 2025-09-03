import { 
  AcademicCapIcon, 
  ClockIcon, 
  DevicePhoneMobileIcon,
  GlobeAltIcon,
  UserGroupIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

const features = [
  {
    icon: AcademicCapIcon,
    title: 'Expert Instructors',
    description: 'Learn from industry professionals and certified experts who are passionate about teaching.'
  },
  {
    icon: ClockIcon,
    title: 'Learn at Your Pace',
    description: 'Access course content 24/7 and progress through lessons at your own comfortable speed.'
  },
  {
    icon: DevicePhoneMobileIcon,
    title: 'Mobile Learning',
    description: 'Study anywhere with our mobile-optimized platform that works on all devices.'
  },
  {
    icon: GlobeAltIcon,
    title: 'Global Community',
    description: 'Connect with learners from around the world and share knowledge and experiences.'
  },
  {
    icon: UserGroupIcon,
    title: 'Interactive Learning',
    description: 'Engage with instructors and fellow students through discussions, assignments, and live sessions.'
  },
  {
    icon: ShieldCheckIcon,
    title: 'Certified Courses',
    description: 'Earn certificates upon completion that are recognized by employers worldwide.'
  }
]

export function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Why Choose Our Platform?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We provide everything you need to succeed in your learning journey, 
            from expert instruction to flexible scheduling and community support.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card-hover text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-primary-100 rounded-full">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
