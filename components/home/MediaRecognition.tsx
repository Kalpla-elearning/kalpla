import { NewspaperIcon, TvIcon, RadioIcon } from '@heroicons/react/24/outline'

const publications = [
  {
    name: 'TechCrunch',
    logo: 'TC',
    description: 'Leading technology news and startup coverage'
  },
  {
    name: 'Forbes',
    logo: 'F',
    description: 'Business and entrepreneurship insights'
  },
  {
    name: 'Harvard Business Review',
    logo: 'HBR',
    description: 'Management and leadership expertise'
  },
  {
    name: 'MIT Technology Review',
    logo: 'MIT',
    description: 'Innovation and emerging technologies'
  },
  {
    name: 'Wired',
    logo: 'W',
    description: 'Technology and culture intersection'
  },
  {
    name: 'Fast Company',
    logo: 'FC',
    description: 'Business innovation and design'
  }
]

const mediaTypes = [
  {
    icon: NewspaperIcon,
    title: 'Featured Articles',
    count: '50+',
    description: 'In-depth coverage of our programs and success stories'
  },
  {
    icon: TvIcon,
    title: 'TV Appearances',
    count: '25+',
    description: 'Interviews and features on major networks'
  },
  {
    icon: RadioIcon,
    title: 'Podcast Features',
    count: '100+',
    description: 'Discussions on entrepreneurship and education'
  }
]

export function MediaRecognition() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Featured in Leading Publications
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our innovative approach to education and entrepreneurship has been recognized 
            by the world's most respected media outlets and industry publications.
          </p>
        </div>

        {/* Publication Logos */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 mb-16">
          {publications.map((publication, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-accent-100 transition-colors duration-200">
                <span className="text-2xl font-bold text-gray-600 group-hover:text-accent-600">
                  {publication.logo}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 text-center mb-1">
                {publication.name}
              </h3>
              <p className="text-xs text-gray-500 text-center">
                {publication.description}
              </p>
            </div>
          ))}
        </div>

        {/* Media Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {mediaTypes.map((media, index) => (
            <div key={index} className="text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary-100 rounded-full">
                  <media.icon className="h-8 w-8 text-primary-600" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{media.count}</h3>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">{media.title}</h4>
              <p className="text-gray-600">{media.description}</p>
            </div>
          ))}
        </div>

        {/* Recent Features */}
        <div className="bg-gray-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Recent Media Features
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-red-600 font-bold text-sm">TC</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">TechCrunch</div>
                  <div className="text-sm text-gray-500">2 days ago</div>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                "How Kalpla is Revolutionizing Online Education"
              </h4>
              <p className="text-sm text-gray-600">
                An in-depth look at our innovative approach to mentorship and startup incubation.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold text-sm">F</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Forbes</div>
                  <div className="text-sm text-gray-500">1 week ago</div>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                "The Future of Entrepreneurship Education"
              </h4>
              <p className="text-sm text-gray-600">
                Exploring how our mentorship program is shaping the next generation of entrepreneurs.
              </p>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-bold text-sm">HBR</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">Harvard Business Review</div>
                  <div className="text-sm text-gray-500">2 weeks ago</div>
                </div>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                "Case Study: Kalpla's Success Model"
              </h4>
              <p className="text-sm text-gray-600">
                A detailed analysis of our unique approach to startup mentorship and education.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
