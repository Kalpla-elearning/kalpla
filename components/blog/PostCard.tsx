import Link from 'next/link'
import Image from 'next/image'
import { CalendarIcon, UserIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'

interface PostCardProps {
  post: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    featuredImage: string | null
    publishedAt: Date | null
    author: {
      id: string
      name: string
    }
    categories: {
      category: {
        id: string
        name: string
        color: string | null
      }
    }[]
    tags: {
      tag: {
        id: string
        name: string
        color: string | null
      }
    }[]
    _count: {
      comments: number
    }
  }
}

export function PostCard({ post }: PostCardProps) {
  const formatDate = (date: Date | null) => {
    if (!date) return 'Draft'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getCategoryColor = (color: string | null) => {
    if (!color) return 'bg-gray-100 text-gray-800'
    
    // Map common color names to Tailwind classes
    const colorMap: { [key: string]: string } = {
      'blue': 'bg-blue-100 text-blue-800',
      'green': 'bg-green-100 text-green-800',
      'red': 'bg-red-100 text-red-800',
      'yellow': 'bg-yellow-100 text-yellow-800',
      'purple': 'bg-purple-100 text-purple-800',
      'pink': 'bg-pink-100 text-pink-800',
      'indigo': 'bg-indigo-100 text-indigo-800',
      'gray': 'bg-gray-100 text-gray-800'
    }
    
    return colorMap[color.toLowerCase()] || 'bg-gray-100 text-gray-800'
  }

  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200">
      {/* Featured Image */}
      {post.featuredImage && (
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      
      {/* Content */}
      <div className="p-6">
        {/* Categories */}
        {post.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {post.categories.slice(0, 2).map(({ category }) => (
              <span
                key={category.id}
                className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(category.color)}`}
              >
                {category.name}
              </span>
            ))}
            {post.categories.length > 2 && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                +{post.categories.length - 2}
              </span>
            )}
          </div>
        )}
        
        {/* Title */}
        <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary-600 transition-colors">
            {post.title}
          </Link>
        </h2>
        
        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-gray-600 mb-4 line-clamp-3">
            {post.excerpt}
          </p>
        )}
        
        {/* Meta */}
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-1" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              <span>{formatDate(post.publishedAt)}</span>
            </div>
            <div className="flex items-center">
              <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
              <span>{post._count.comments} comments</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
