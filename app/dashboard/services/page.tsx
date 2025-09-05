

import { 
  ShoppingBagIcon,
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  PaintBrushIcon,
  MegaphoneIcon,
  ScaleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

const serviceCategories = [
  {
    id: 'web-dev',
    name: 'Web Development',
    description: 'Build your startup\'s web presence with modern, scalable applications',
    icon: CodeBracketIcon,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
    services: [
      {
        id: 1,
        name: 'Landing Page',
        description: 'High-converting landing page for your startup',
        price: 15000,
        duration: '1-2 weeks',
        features: ['Responsive design', 'SEO optimized', 'Contact forms', 'Analytics setup']
      },
      {
        id: 2,
        name: 'SaaS MVP',
        description: 'Minimum viable product for your SaaS startup',
        price: 50000,
        duration: '4-6 weeks',
        features: ['User authentication', 'Dashboard', 'Payment integration', 'Admin panel']
      },
      {
        id: 3,
        name: 'E-commerce Platform',
        description: 'Complete online store with payment processing',
        price: 75000,
        duration: '6-8 weeks',
        features: ['Product catalog', 'Shopping cart', 'Payment gateway', 'Order management']
      }
    ]
  },
  {
    id: 'app-dev',
    name: 'App Development',
    description: 'Native and cross-platform mobile applications',
    icon: DevicePhoneMobileIcon,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
    services: [
      {
        id: 4,
        name: 'iOS App',
        description: 'Native iOS application for iPhone and iPad',
        price: 60000,
        duration: '6-8 weeks',
        features: ['Native performance', 'App Store optimization', 'Push notifications', 'Offline support']
      },
      {
        id: 5,
        name: 'Android App',
        description: 'Native Android application',
        price: 55000,
        duration: '6-8 weeks',
        features: ['Material Design', 'Google Play optimization', 'Push notifications', 'Offline support']
      },
      {
        id: 6,
        name: 'Cross-Platform App',
        description: 'React Native app for both iOS and Android',
        price: 80000,
        duration: '8-10 weeks',
        features: ['Single codebase', 'Native performance', 'Both platforms', 'Faster development']
      }
    ]
  },
  {
    id: 'branding',
    name: 'Branding & Design',
    description: 'Create a strong brand identity for your startup',
    icon: PaintBrushIcon,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
    services: [
      {
        id: 7,
        name: 'Logo Design',
        description: 'Professional logo design with brand guidelines',
        price: 8000,
        duration: '1 week',
        features: ['3 logo concepts', 'Brand guidelines', 'Multiple formats', 'Revisions included']
      },
      {
        id: 8,
        name: 'Pitch Deck Design',
        description: 'Investor-ready pitch deck design',
        price: 12000,
        duration: '1-2 weeks',
        features: ['10-15 slides', 'Professional design', 'Data visualization', 'Presentation coaching']
      },
      {
        id: 9,
        name: 'Complete Brand Kit',
        description: 'Full brand identity package',
        price: 25000,
        duration: '2-3 weeks',
        features: ['Logo design', 'Brand guidelines', 'Business cards', 'Letterhead', 'Social media templates']
      }
    ]
  },
  {
    id: 'marketing',
    name: 'Digital Marketing',
    description: 'Grow your startup with data-driven marketing strategies',
    icon: MegaphoneIcon,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
    services: [
      {
        id: 10,
        name: 'SEO Optimization',
        description: 'Improve your website\'s search engine ranking',
        price: 20000,
        duration: '4-6 weeks',
        features: ['Keyword research', 'On-page optimization', 'Technical SEO', 'Monthly reporting']
      },
      {
        id: 11,
        name: 'Social Media Management',
        description: 'Complete social media strategy and management',
        price: 15000,
        duration: 'Ongoing',
        features: ['Content creation', 'Posting schedule', 'Community management', 'Analytics reporting']
      },
      {
        id: 12,
        name: 'Google Ads Campaign',
        description: 'Targeted advertising campaigns for maximum ROI',
        price: 10000,
        duration: '1 month',
        features: ['Campaign setup', 'Ad creation', 'Keyword research', 'Performance optimization']
      }
    ]
  },
  {
    id: 'legal',
    name: 'Legal Services',
    description: 'Protect your startup with proper legal documentation',
    icon: ScaleIcon,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
    services: [
      {
        id: 13,
        name: 'Company Registration',
        description: 'Register your startup as a legal entity',
        price: 5000,
        duration: '1-2 weeks',
        features: ['Company incorporation', 'GST registration', 'PAN application', 'Bank account setup']
      },
      {
        id: 14,
        name: 'IP Protection',
        description: 'Protect your intellectual property',
        price: 15000,
        duration: '2-3 weeks',
        features: ['Trademark filing', 'Copyright registration', 'Patent search', 'IP strategy']
      },
      {
        id: 15,
        name: 'Legal Documentation',
        description: 'Essential legal documents for your startup',
        price: 20000,
        duration: '2-3 weeks',
        features: ['Terms of Service', 'Privacy Policy', 'User Agreement', 'Employment contracts']
      }
    ]
  },
  {
    id: 'fundraising',
    name: 'Fundraising Support',
    description: 'Get help with raising capital for your startup',
    icon: CurrencyDollarIcon,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
    services: [
      {
        id: 16,
        name: 'Pitch Deck Review',
        description: 'Expert review and feedback on your pitch deck',
        price: 5000,
        duration: '3-5 days',
        features: ['Deck analysis', 'Feedback report', 'Improvement suggestions', 'Follow-up call']
      },
      {
        id: 17,
        name: 'Investor Connect',
        description: 'Connect with relevant investors for your startup',
        price: 25000,
        duration: '2-4 weeks',
        features: ['Investor research', 'Warm introductions', 'Meeting coordination', 'Follow-up support']
      },
      {
        id: 18,
        name: 'Fundraising Strategy',
        description: 'Complete fundraising strategy and execution plan',
        price: 50000,
        duration: '4-6 weeks',
        features: ['Valuation analysis', 'Fundraising timeline', 'Investor targeting', 'Pitch preparation']
      }
    ]
  }
]

const recentRequests = [
  {
    id: 1,
    service: 'Landing Page',
    category: 'Web Development',
    status: 'in-progress',
    requestedAt: '2024-01-10',
    estimatedDelivery: '2024-01-24',
    price: 15000
  },
  {
    id: 2,
    service: 'Logo Design',
    category: 'Branding',
    status: 'completed',
    requestedAt: '2024-01-05',
    completedAt: '2024-01-12',
    price: 8000
  },
  {
    id: 3,
    service: 'SEO Optimization',
    category: 'Marketing',
    status: 'pending',
    requestedAt: '2024-01-15',
    estimatedDelivery: '2024-02-15',
    price: 20000
  }
]

export default async function ServicesPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    return <div>Loading...</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in-progress': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Startup Services</h1>
        <p className="text-indigo-100">
          Get professional help to build and grow your startup with our curated service marketplace
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <ShoppingBagIcon className="h-6 w-6 text-indigo-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Services</p>
              <p className="text-2xl font-semibold text-gray-900">
                {serviceCategories.reduce((acc, cat) => acc + cat.services.length, 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircleIcon className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {recentRequests.filter(r => r.status === 'completed').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ClockIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {recentRequests.filter(r => r.status === 'in-progress').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CurrencyDollarIcon className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Spent</p>
              <p className="text-2xl font-semibold text-gray-900">
                ₹{recentRequests.filter(r => r.status === 'completed').reduce((acc, r) => acc + r.price, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories */}
      <div className="space-y-6">
        {serviceCategories.map((category) => (
          <div key={category.id} className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-lg ${category.bgColor}`}>
                  <category.icon className={`h-8 w-8 ${category.color}`} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{category.name}</h2>
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.services.map((service) => (
                  <div key={service.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{service.name}</h3>
                    <p className="text-gray-600 mb-4">{service.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-gray-900">₹{service.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500">{service.duration}</span>
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">Includes:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {service.features.map((feature, index) => (
                          <li key={index} className="flex items-center">
                            <CheckCircleIcon className="h-4 w-4 text-green-500 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-md font-medium hover:bg-primary-700 transition-colors">
                      Request Service
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
          <Link href="/dashboard/services/requests" className="text-primary-600 hover:text-primary-500 text-sm font-medium">
            View All
          </Link>
        </div>
        
        <div className="space-y-4">
          {recentRequests.map((request) => (
            <div key={request.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{request.service}</h3>
                  <p className="text-sm text-gray-600">{request.category}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>Requested: {new Date(request.requestedAt).toLocaleDateString()}</span>
                    {request.estimatedDelivery && (
                      <span>Delivery: {new Date(request.estimatedDelivery).toLocaleDateString()}</span>
                    )}
                    {request.completedAt && (
                      <span>Completed: {new Date(request.completedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-gray-900">₹{request.price.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                      {request.status.replace('-', ' ')}
                    </span>
                  </div>
                  <button className="text-primary-600 hover:text-primary-500 text-sm font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold text-lg">1</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Choose Service</h3>
            <p className="text-sm text-gray-600">Browse our curated services and select what you need for your startup</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold text-lg">2</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Get Quote</h3>
            <p className="text-sm text-gray-600">Receive a detailed quote and timeline from our expert team</p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary-600 font-bold text-lg">3</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Track Progress</h3>
            <p className="text-sm text-gray-600">Monitor your project progress and communicate with the team</p>
          </div>
        </div>
      </div>

      {/* Student Discount */}
      <div className="bg-gradient-to-r from-green-500 to-teal-500 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">Student Discount</h3>
            <p className="text-green-100">Get 20% off on all services as a Kalpla student</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">20% OFF</div>
            <div className="text-sm text-green-100">All Services</div>
          </div>
        </div>
      </div>
    </div>
  )
}
