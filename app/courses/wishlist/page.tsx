'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  HeartIcon,
  TrashIcon,
  ShoppingCartIcon,
  AcademicCapIcon,
  StarIcon,
  ClockIcon,
  UserIcon,
  EyeIcon
} from '@heroicons/react/24/outline'

interface WishlistItem {
  id: string
  course: {
    id: string
    title: string
    description: string
    slug: string
    thumbnail?: string
    price: number
    instructor: {
      name: string
      avatar?: string
    }
    _count: {
      enrollments: number
      reviews: number
    }
    reviews: Array<{
      rating: number
    }>
  }
  addedAt: string
}

export default function WishlistPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    
    if (!session) {
      router.push('/auth/signin')
      return
    }

    fetchWishlist()
  }, [session, status])

  const fetchWishlist = async () => {
    try {
      const response = await fetch('/api/courses/wishlist')
      if (!response.ok) {
        throw new Error('Failed to load wishlist')
      }
      const data = await response.json()
      setWishlist(data)
    } catch (error) {
      setError('Failed to load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const removeFromWishlist = async (courseId: string) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/wishlist`, {
        method: 'DELETE'
      })

      if (response.ok) {
        setWishlist(wishlist.filter(item => item.course.id !== courseId))
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error)
    }
  }

  const addToCart = async (courseId: string) => {
    try {
      const response = await fetch('/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId })
      })

      if (response.ok) {
        // Optionally show success message or redirect to cart
        router.push('/cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
    }
  }

  const getAverageRating = (reviews: Array<{ rating: number }>) => {
    if (reviews.length === 0) return 0
    return reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!session) {
    return null // Will redirect to signin
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
              <p className="text-gray-600 mt-2">
                {wishlist.length} course{wishlist.length !== 1 ? 's' : ''} saved
              </p>
            </div>
            
            <Link href="/courses" className="btn-primary">
              Browse Courses
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error ? (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Wishlist</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <button onClick={fetchWishlist} className="btn-primary">
              Try Again
            </button>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center">
            <HeartIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Wishlist is Empty</h2>
            <p className="text-gray-600 mb-6">
              Start exploring courses and add them to your wishlist to save them for later.
            </p>
            <Link href="/courses" className="btn-primary">
              Browse Courses
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlist.map((item) => (
              <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Course Image */}
                <div className="aspect-video bg-gray-200 relative">
                  {item.course.thumbnail ? (
                    <img
                      src={item.course.thumbnail}
                      alt={item.course.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <AcademicCapIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={() => removeFromWishlist(item.course.id)}
                    className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-red-500"
                  >
                    <HeartIcon className="h-5 w-5 fill-current" />
                  </button>
                </div>

                {/* Course Info */}
                <div className="p-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center">
                      {item.course.instructor.avatar ? (
                        <img
                          src={item.course.instructor.avatar}
                          alt={item.course.instructor.name}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                      ) : (
                        <UserIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                    <span className="text-sm text-gray-600">{item.course.instructor.name}</span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {item.course.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {item.course.description}
                  </p>

                  {/* Rating and Stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center">
                        <StarIcon className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {getAverageRating(item.course.reviews).toFixed(1)}
                        </span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        {item.course._count.reviews} review{item.course._count.reviews !== 1 ? 's' : ''}
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        {item.course._count.enrollments} student{item.course._count.enrollments !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Price and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-bold text-gray-900">
                      {item.course.price === 0 ? 'Free' : `$${item.course.price}`}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/courses/${item.course.slug}`}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
                      >
                        <EyeIcon className="h-5 w-5" />
                      </Link>
                      
                      <button
                        onClick={() => addToCart(item.course.id)}
                        className="flex items-center px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700"
                      >
                        <ShoppingCartIcon className="h-4 w-4 mr-1" />
                        Add to Cart
                      </button>
                    </div>
                  </div>

                  {/* Added Date */}
                  <div className="mt-3 text-xs text-gray-500">
                    Added {new Date(item.addedAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
