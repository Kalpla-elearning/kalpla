'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { PlayCircleIcon, ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

const heroSlides = [
  {
    id: 1,
    title: "Master the Future of Technology",
    subtitle: "Learn cutting-edge skills from industry experts",
            description: "Join 50,000+ professionals who have transformed their careers with our comprehensive learning platform.",
    backgroundImage: "bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700",
    ctaText: "Start Learning Today",
    ctaLink: "/courses"
  },
  {
    id: 2,
    title: "Build Your Dream Startup",
    subtitle: "12-Month Mentorship Program",
    description: "Get personalized guidance from successful entrepreneurs and build your next unicorn startup.",
    backgroundImage: "bg-gradient-to-br from-accent-500 via-accent-600 to-accent-700",
    ctaText: "Join Mentorship",
    ctaLink: "/mentorship"
  },
  {
    id: 3,
    title: "Earn Industry-Recognized Degrees",
    subtitle: "Accredited Online Programs",
    description: "Advance your career with our comprehensive degree programs designed by top universities.",
    backgroundImage: "bg-gradient-to-br from-primary-600 via-accent-500 to-primary-700",
    ctaText: "Explore Degrees",
    ctaLink: "/degrees"
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
      {/* Background Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className={`absolute inset-0 ${slide.backgroundImage}`}>
            <div className="absolute inset-0 bg-black bg-opacity-40" />
          </div>
        </div>
      ))}

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-white space-y-8">
              <div className="space-y-4">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                  {heroSlides[currentSlide].title}
                </h1>
                <h2 className="text-2xl md:text-3xl text-blue-200 font-semibold">
                  {heroSlides[currentSlide].subtitle}
                </h2>
                <p className="text-xl text-gray-200 max-w-2xl">
                  {heroSlides[currentSlide].description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href={heroSlides[currentSlide].ctaLink}
                  className="bg-white text-gray-900 hover:bg-gray-100 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg inline-flex items-center justify-center"
                >
                  <span>{heroSlides[currentSlide].ctaText}</span>
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </Link>
                <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 font-semibold py-4 px-8 rounded-lg transition-colors duration-200 text-lg inline-flex items-center justify-center">
                  <PlayCircleIcon className="h-6 w-6 mr-2" />
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
                  <span className="text-white">Join 50,000+ students</span>
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
                  <span className="text-white">4.9/5 average rating</span>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="hidden lg:block">
              <div className="relative">
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-3xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="aspect-video bg-white bg-opacity-20 rounded-2xl mb-6 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <PlayCircleIcon className="h-10 w-10 text-gray-900" />
                      </div>
                      <p className="text-white font-medium">Interactive Learning</p>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="h-4 bg-white bg-opacity-30 rounded w-3/4"></div>
                    <div className="h-3 bg-white bg-opacity-20 rounded w-1/2"></div>
                    <div className="h-3 bg-white bg-opacity-20 rounded w-2/3"></div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-6 -right-6 bg-green-500 rounded-full p-4 shadow-lg">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-green-500 text-sm font-bold">✓</span>
                  </div>
                </div>
                
                <div className="absolute -bottom-6 -left-6 bg-yellow-500 rounded-full p-4 shadow-lg">
                  <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                    <span className="text-yellow-500 text-sm font-bold">★</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-colors duration-200 ${
              index === currentSlide ? 'bg-white' : 'bg-white bg-opacity-50'
            }`}
          />
        ))}
      </div>

      {/* Arrow Controls */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-colors duration-200"
      >
        <ChevronLeftIcon className="h-6 w-6" />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-3 rounded-full transition-colors duration-200"
      >
        <ChevronRightIcon className="h-6 w-6" />
      </button>
    </section>
  )
}
