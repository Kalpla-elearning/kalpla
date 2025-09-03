import Link from 'next/link'
import { 
  PlayCircleIcon, 
  AcademicCapIcon, 
  UsersIcon, 
  StarIcon,
  ArrowRightIcon,
  BookOpenIcon,
  ClockIcon,
  UserGroupIcon,
  TrophyIcon,
  SparklesIcon,
  RocketLaunchIcon
} from '@heroicons/react/24/outline'
import CourseCard from '@/components/courses/CourseCard'
import { HeroCarousel } from '@/components/home/HeroCarousel'
import { FeaturedCourses } from '@/components/home/FeaturedCourses'
import { FeaturedDegreePrograms } from '@/components/home/FeaturedDegreePrograms'
import { FeaturedMiniCourses } from '@/components/home/FeaturedMiniCourses'
import { KalplaMentorship } from '@/components/home/KalplaMentorship'
import { MediaRecognition } from '@/components/home/MediaRecognition'
import { TestimonialsSection } from '@/components/home/TestimonialsSection'
import { StatsSection } from '@/components/home/StatsSection'

export default function HomePage() {
  const stats = [
    { label: 'Active Students', value: '50,000+', icon: UsersIcon },
    { label: 'Expert Instructors', value: '500+', icon: AcademicCapIcon },
    { label: 'Online Courses', value: '1,000+', icon: BookOpenIcon },
    { label: 'Success Rate', value: '95%', icon: StarIcon },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Carousel Section */}
      <HeroCarousel />

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* Featured Courses */}
      <FeaturedCourses />

      {/* Featured Degree Programs */}
      <FeaturedDegreePrograms />

      {/* Featured Mini-Courses */}
      <FeaturedMiniCourses />

      {/* Kalpla Startup Mentorship Program */}
      <KalplaMentorship />

      {/* Media Recognition */}
      <MediaRecognition />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-accent-500 to-primary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-primary-100 mb-10 max-w-3xl mx-auto">
            Join thousands of professionals who have already accelerated their careers 
            with our cutting-edge learning platform and mentorship programs.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Start Learning Today
            </Link>
            <Link
              href="/mentorship"
              className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg"
            >
              Join Mentorship Program
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
