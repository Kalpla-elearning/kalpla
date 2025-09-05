'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { PlayCircleIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon, SparklesIcon, RocketLaunchIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

const heroSlides = [
  {
    id: 1,
    title: "Master the Future of Technology",
    subtitle: "Learn cutting-edge skills from industry experts",
    description: "Join 50,000+ professionals who have transformed their careers with our comprehensive learning platform.",
    backgroundImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&h=1080&fit=crop&crop=center",
    overlay: "bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-indigo-700/90",
    ctaText: "Start Learning Today",
    ctaLink: "/courses",
    icon: AcademicCapIcon,
    stats: "50,000+ Students"
  },
  {
    id: 2,
    title: "Build Your Dream Startup",
    subtitle: "12-Month Mentorship Program",
    description: "Get personalized guidance from successful entrepreneurs and build your next unicorn startup.",
    backgroundImage: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=1920&h=1080&fit=crop&crop=center",
    overlay: "bg-gradient-to-br from-emerald-600/90 via-teal-600/90 to-cyan-700/90",
    ctaText: "Join Mentorship",
    ctaLink: "/mentorship",
    icon: RocketLaunchIcon,
    stats: "500+ Startups Launched"
  },
  {
    id: 3,
    title: "Earn Industry-Recognized Degrees",
    subtitle: "Accredited Online Programs",
    description: "Advance your career with our comprehensive degree programs designed by top universities.",
    backgroundImage: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&h=1080&fit=crop&crop=center",
    overlay: "bg-gradient-to-br from-orange-600/90 via-red-600/90 to-pink-700/90",
    ctaText: "Explore Degrees",
    ctaLink: "/degrees",
    icon: SparklesIcon,
    stats: "95% Success Rate"
  }
]

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    setIsAutoPlaying(false)
  }

  return (
    <section className="relative h-screen overflow-hidden">
      {/* Background Slides with Images */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="absolute inset-0">
            <Image
              src={slide.backgroundImage}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            <div className={`absolute inset-0 ${slide.overlay}`} />
          </div>
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex items-center z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <div className="space-y-6">
                {/* Icon and Stats */}
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl">
                    {(() => {
                      const IconComponent = heroSlides[currentSlide].icon
                      return <IconComponent className="h-8 w-8 text-white" />
                    })()}
                  </div>
                  <div className="text-sm font-medium text-white/90">
                    {heroSlides[currentSlide].stats}
                  </div>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>
                <h2 className="text-2xl md:text-3xl text-white/90 font-semibold">
                  {heroSlides[currentSlide].subtitle}
                </h2>
                <p className="text-xl text-white/80 max-w-2xl leading-relaxed">
                  {heroSlides[currentSlide].description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={heroSlides[currentSlide].ctaLink}
                  className="group bg-white text-gray-900 hover:bg-gray-100 font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-lg inline-flex items-center justify-center shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
                >
                  <span>{heroSlides[currentSlide].ctaText}</span>
                  <ArrowRightIcon className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
                <button className="group border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 font-semibold py-4 px-8 rounded-xl transition-all duration-300 text-lg inline-flex items-center justify-center backdrop-blur-sm">
                  <PlayCircleIcon className="h-6 w-6 mr-2 group-hover:scale-110 transition-transform duration-200" />
                  <span>Watch Demo</span>
                </button>
              </div>

              {/* Trust Indicators */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm">
                <div className="flex items-center">
                  <div className="flex -space-x-2 mr-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-10 h-10 rounded-full bg-white border-2 border-white shadow-lg"
                      />
                    ))}
                  </div>
                  <span className="text-white/90">Join 50,000+ students</span>
                </div>
                
                <div className="flex items-center">
                  <div className="flex items-center mr-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <svg
                        key={i}
                        className="w-5 h-5 text-yellow-400 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-white/90">4.9/5 average rating</span>
                </div>
              </div>
            </div>

            {/* Right Visual - Enhanced */}
            <div className="hidden lg:block">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 transform rotate-2 hover:rotate-0 transition-all duration-700 shadow-2xl border border-white/20">
                  <div className="aspect-video bg-white/20 rounded-2xl mb-6 flex items-center justify-center relative overflow-hidden">
                    <Image
                      src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop&crop=center"
                      alt="Learning Platform"
                      fill
                      className="object-cover rounded-2xl"
                    />
                    <div className="absolute inset-0 bg-black/30 rounded-2xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300">
                          <PlayCircleIcon className="h-10 w-10 text-gray-900" />
                        </div>
                        <p className="text-white font-medium">Interactive Learning</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-4 bg-white/30 rounded w-3/4"></div>
                    <div className="h-3 bg-white/20 rounded w-1/2"></div>
                    <div className="h-3 bg-white/20 rounded w-2/3"></div>
                  </div>
                </div>

                {/* Floating Elements - Enhanced */}
                <div className="absolute -top-6 -right-6 bg-green-500 rounded-full p-4 shadow-xl animate-bounce">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-green-500 text-sm font-bold">✓</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-yellow-500 rounded-full p-4 shadow-xl animate-pulse">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-yellow-500 text-sm font-bold">★</span>
                  </div>
                </div>

                {/* Additional floating elements */}
                <div className="absolute top-1/2 -left-4 bg-blue-500 rounded-full p-3 shadow-lg animate-ping">
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <span className="text-blue-500 text-xs font-bold">💡</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls - Enhanced */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-4 h-4 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white shadow-lg scale-125' 
                : 'bg-white/50 hover:bg-white/70 hover:scale-110'
            }`}
          />
        ))}
      </div>

      {/* Arrow Controls - Enhanced */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-110 z-20"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-4 rounded-full transition-all duration-300 backdrop-blur-sm border border-white/30 hover:scale-110 z-20"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
        <div 
          className="h-full bg-white transition-all duration-1000 ease-out"
          style={{ width: `${((currentSlide + 1) / heroSlides.length) * 100}%` }}
        />
      </div>
    </section>
  )
}
