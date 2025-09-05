import { StarIcon, AcademicCapIcon, TrophyIcon, UserGroupIcon } from '@heroicons/react/24/outline'

export default function InstructorSuccessStoriesPage() {
  const successStories = [
    {
      name: 'Sarah Johnson',
      title: 'Data Science Expert',
      image: '/api/placeholder/150/150',
      earnings: '₹37,50,000',
      students: '2,500+',
      courses: 8,
      rating: 4.9,
      quote: 'Teaching on Kalpla has transformed my career. I\'ve been able to reach students worldwide and build a sustainable income stream while sharing my passion for data science.',
      story: 'Sarah started teaching on Kalpla three years ago with just one course on Python basics. Today, she has 8 courses and has earned over ₹37,50,000 while helping more than 2,500 students advance their careers in data science.',
      achievements: [
        'Top 1% of instructors on the platform',
        'Featured instructor in our monthly newsletter',
        'Created best-selling course on Machine Learning',
        'Mentored 50+ aspiring data scientists'
      ]
    },
    {
      name: 'Michael Chen',
      title: 'Web Development Instructor',
      image: '/api/placeholder/150/150',
      earnings: '₹26,70,000',
      students: '1,800+',
      courses: 6,
      rating: 4.8,
      quote: 'The platform gave me the tools and audience I needed to turn my expertise into a thriving teaching business. The support from Kalpla has been incredible.',
      story: 'Michael, a senior developer at a tech company, started teaching part-time to share his knowledge. Within two years, he was earning more from teaching than his day job and decided to become a full-time instructor.',
      achievements: [
        'Quit his corporate job to teach full-time',
        'Created comprehensive web development bootcamp',
        'Featured in tech industry publications',
        'Built a community of 5,000+ developers'
      ]
    },
    {
      name: 'Dr. Emily Rodriguez',
      title: 'Digital Marketing Specialist',
      image: '/api/placeholder/150/150',
      earnings: '₹23,40,000',
      students: '1,200+',
      courses: 5,
      rating: 4.9,
      quote: 'Teaching on Kalpla has allowed me to reach a global audience and make a real impact on people\'s careers. The flexibility is perfect for my lifestyle.',
      story: 'Dr. Rodriguez, a marketing professor, started teaching on Kalpla to supplement her university income. Her courses on digital marketing strategy became so popular that she now teaches exclusively online.',
      achievements: [
        'Awarded "Instructor of the Year" 2023',
        'Created industry-recognized certification program',
        'Featured speaker at major marketing conferences',
        'Helped 200+ students land marketing jobs'
      ]
    },
    {
      name: 'James Wilson',
      title: 'UI/UX Design Expert',
      image: '/api/placeholder/150/150',
      earnings: '₹31,70,000',
      students: '2,100+',
      courses: 7,
      rating: 4.7,
      quote: 'The community aspect of Kalpla is amazing. I\'ve built lasting relationships with students and other instructors that have opened up new opportunities.',
      story: 'James started as a freelance designer and used Kalpla to build his reputation. His design courses became so popular that he now runs a design agency with many of his former students as employees.',
      achievements: [
        'Launched successful design agency',
        'Created award-winning course series',
        'Featured in design industry magazines',
        'Mentored 100+ designers to success'
      ]
    }
  ]

  const stats = [
    {
      icon: UserGroupIcon,
      number: '50,000+',
      label: 'Students Taught',
      description: 'Our instructors have helped thousands of students achieve their learning goals'
    },
    {
      icon: TrophyIcon,
      number: '₹16.7Cr+',
      label: 'Total Earnings',
      description: 'Instructors have earned over ₹16.7 crores through our platform'
    },
    {
      icon: AcademicCapIcon,
      number: '500+',
      label: 'Active Instructors',
      description: 'Join our community of expert instructors from around the world'
    },
    {
      icon: StarIcon,
      number: '4.8',
      label: 'Average Rating',
      description: 'Students consistently rate our instructors highly for quality and engagement'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Instructor Success Stories
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover how our instructors have built successful teaching careers and made a real impact on students worldwide.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-primary-100 font-semibold mb-2">{stat.label}</div>
                <div className="text-primary-200 text-sm">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
          Meet Our Successful Instructors
        </h2>
        <div className="space-y-16">
          {successStories.map((story, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 p-8">
                  <div className="text-center">
                    <img
                      src={story.image}
                      alt={story.name}
                      className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                    />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{story.name}</h3>
                    <p className="text-primary-600 font-semibold mb-4">{story.title}</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>Earnings:</span>
                        <span className="font-semibold text-green-600">{story.earnings}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Students:</span>
                        <span className="font-semibold">{story.students}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Courses:</span>
                        <span className="font-semibold">{story.courses}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Rating:</span>
                        <span className="font-semibold flex items-center">
                          <StarIcon className="h-4 w-4 text-yellow-400 mr-1" />
                          {story.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="md:w-2/3 p-8">
                  <blockquote className="text-lg text-gray-700 mb-6 italic">
                    "{story.quote}"
                  </blockquote>
                  <p className="text-gray-600 mb-6">{story.story}</p>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Key Achievements:</h4>
                    <ul className="space-y-2">
                      {story.achievements.map((achievement, achievementIndex) => (
                        <li key={achievementIndex} className="flex items-start">
                          <div className="flex-shrink-0">
                            <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                          </div>
                          <p className="ml-3 text-gray-700">{achievement}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Start Your Teaching Journey?
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Join our community of successful instructors and start sharing your expertise with students worldwide. 
              With our platform, you can build a sustainable teaching business while making a real impact.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/instructors/apply"
                className="bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
              >
                Apply to Teach
              </a>
              <a
                href="/instructors/guidelines"
                className="border-2 border-primary-600 text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-600 hover:text-white transition-colors"
              >
                Read Guidelines
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
