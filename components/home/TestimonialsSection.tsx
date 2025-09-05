import { StarIcon } from '@heroicons/react/24/solid'
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    company: 'Google',
    image: '/api/placeholder/80/80',
    rating: 5,
    text: 'The web development bootcamp completely transformed my career. The instructors were amazing and the hands-on projects gave me the confidence to land my dream job at Google.',
    course: 'Complete Web Development Bootcamp'
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Data Scientist',
    company: 'Microsoft',
    image: '/api/placeholder/80/80',
    rating: 5,
    text: 'The Python for Data Science course was exactly what I needed to transition into data science. The curriculum was comprehensive and the mentorship was invaluable.',
    course: 'Python for Data Science and Machine Learning'
  },
  {
    id: 3,
    name: 'Emily Rodriguez',
    role: 'Marketing Director',
    company: 'Shopify',
    image: '/api/placeholder/80/80',
    rating: 5,
    text: 'The digital marketing masterclass helped me understand the latest trends and strategies. I was able to implement what I learned immediately and saw great results.',
    course: 'Digital Marketing Masterclass'
  },
  {
    id: 4,
    name: 'David Kim',
    role: 'Startup Founder',
    company: 'TechStart Inc.',
    image: '/api/placeholder/80/80',
    rating: 5,
    text: 'The Kalpla mentorship program was a game-changer for my startup. The guidance and connections I gained helped me raise ₹16.7Cr in Series A funding.',
    course: 'Kalpla Startup Mentorship Program'
  },
  {
    id: 5,
    name: 'Lisa Wang',
    role: 'Product Manager',
    company: 'Airbnb',
    image: '/api/placeholder/80/80',
    rating: 5,
    text: 'The JavaScript course was incredibly well-structured. The instructor explained complex concepts in a way that was easy to understand and apply.',
    course: 'The Complete JavaScript Course 2024'
  },
  {
    id: 6,
    name: 'James Thompson',
    role: 'MBA Graduate',
    company: 'McKinsey & Company',
    image: '/api/placeholder/80/80',
    rating: 5,
    text: 'The MBA program provided me with the business acumen and network I needed to advance my career. The quality of education was exceptional.',
    course: 'Master of Business Administration (MBA)'
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            What Our Learners Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what our students and graduates 
            have to say about their learning experience with us.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-200">
              {/* Quote Icon */}
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-primary-100 rounded-full">
                  <ChatBubbleLeftRightIcon className="h-6 w-6 text-primary-600" />
                </div>
              </div>

              {/* Rating */}
              <div className="flex justify-center mb-4">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${
                        i <= testimonial.rating
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 text-center mb-6 italic">
                "{testimonial.text}"
              </p>

              {/* Course */}
              <div className="text-center mb-6">
                <span className="text-sm bg-primary-50 text-primary-700 px-3 py-1 rounded-full">
                  {testimonial.course}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                  <span className="text-gray-600 font-semibold">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                  <div className="text-sm text-primary-600 font-medium">{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Success Statistics */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">95%</div>
              <div className="text-gray-600">Job Placement Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">$85K</div>
              <div className="text-gray-600">Average Salary Increase</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">4.9/5</div>
              <div className="text-gray-600">Average Course Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary-600 mb-2">50K+</div>
              <div className="text-gray-600">Successful Graduates</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
