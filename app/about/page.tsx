import { 
  AcademicCapIcon,
  UsersIcon,
  GlobeAltIcon,
  LightBulbIcon,
  HeartIcon,
  StarIcon,
  CheckCircleIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'

export default function AboutPage() {
  const stats = [
    { label: 'Students Enrolled', value: '10,000+' },
    { label: 'Courses Available', value: '500+' },
    { label: 'Expert Instructors', value: '100+' },
    { label: 'Countries Reached', value: '50+' }
  ]

  const values = [
    {
      icon: AcademicCapIcon,
      title: 'Excellence in Education',
      description: 'We believe in delivering the highest quality education through expert-led courses and comprehensive learning experiences.'
    },
    {
      icon: UsersIcon,
      title: 'Student-Centric Approach',
      description: 'Every decision we make is centered around our students\' success and learning journey.'
    },
    {
      icon: GlobeAltIcon,
      title: 'Global Accessibility',
      description: 'Making world-class education accessible to learners from all corners of the globe.'
    },
    {
      icon: LightBulbIcon,
      title: 'Innovation in Learning',
      description: 'Continuously evolving our platform with cutting-edge technology and modern learning methodologies.'
    }
  ]

  const team = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Chief Executive Officer',
      bio: 'Former professor with 15+ years in educational technology and online learning platforms.',
      image: '/team/sarah.jpg'
    },
    {
      name: 'Michael Chen',
      role: 'Chief Technology Officer',
      bio: 'Tech visionary with expertise in building scalable educational platforms and AI-driven learning systems.',
      image: '/team/michael.jpg'
    },
    {
      name: 'Dr. Priya Patel',
      role: 'Head of Academic Affairs',
      bio: 'Educational psychologist specializing in online learning methodologies and student engagement.',
      image: '/team/priya.jpg'
    },
    {
      name: 'David Rodriguez',
      role: 'Head of Product',
      bio: 'Product strategist focused on creating intuitive learning experiences and user-centered design.',
      image: '/team/david.jpg'
    }
  ]

  const milestones = [
    {
      year: '2020',
      title: 'Platform Launch',
      description: 'Kalpla was founded with a vision to democratize education through technology.'
    },
    {
      year: '2021',
      title: 'First 1,000 Students',
      description: 'Reached our first major milestone with 1,000 enrolled students across 20 countries.'
    },
    {
      year: '2022',
      title: 'Partnership Expansion',
      description: 'Formed strategic partnerships with leading universities and industry experts.'
    },
    {
      year: '2023',
      title: 'Global Recognition',
      description: 'Recognized as one of the top emerging ed-tech platforms with 10,000+ active learners.'
    },
    {
      year: '2024',
      title: 'Innovation Hub',
      description: 'Launched advanced features including AI-powered learning paths and mentorship programs.'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              About Kalpla
            </h1>
            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Empowering learners worldwide with accessible, high-quality education through innovative technology and expert-led instruction.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
              At Kalpla, we believe that education should be accessible to everyone, regardless of their location, background, or circumstances. 
              Our mission is to break down barriers to learning by providing world-class educational content through an intuitive, 
              technology-driven platform that adapts to each learner's unique needs and goals.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at Kalpla
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-200 text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Kalpla was born from a simple yet powerful idea: education should be accessible to everyone. 
                Founded by a team of educators, technologists, and entrepreneurs, we recognized that traditional 
                education systems often create barriers that prevent talented individuals from reaching their full potential.
              </p>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                What started as a small platform with a few courses has grown into a global learning community 
                serving thousands of students across 50+ countries. Our journey has been driven by continuous 
                innovation, student feedback, and an unwavering commitment to educational excellence.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                Today, Kalpla stands as a testament to what's possible when technology meets education with 
                purpose. We're not just building a platform; we're building futures, one learner at a time.
              </p>
            </div>
            <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8">
              <div className="text-center">
                <RocketLaunchIcon className="h-24 w-24 text-primary-600 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  From Vision to Reality
                </h3>
                <p className="text-gray-600">
                  Every feature, every course, every interaction is designed with our learners in mind. 
                  We're constantly evolving, learning, and growing together with our community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Our Journey
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Key milestones in our mission to transform education
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary-200 h-full"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={index} className={`relative flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Timeline dot */}
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-primary-600 rounded-full border-4 border-white shadow-lg"></div>
                  
                  {/* Content */}
                  <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="text-2xl font-bold text-primary-600 mb-2">
                        {milestone.year}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Meet Our Team
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The passionate individuals behind Kalpla's mission to transform education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
                <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4 flex items-center justify-center">
                  <UsersIcon className="h-12 w-12 text-gray-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-gradient-to-r from-primary-600 to-primary-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Learning Community
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Ready to start your learning journey? Explore our courses and discover your potential with Kalpla.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/courses"
              className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Explore Courses
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
