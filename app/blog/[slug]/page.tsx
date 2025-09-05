'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { format } from 'date-fns'
import { CalendarIcon, UserIcon, ChatBubbleLeftIcon } from '@heroicons/react/24/outline'

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string
  featuredImage: string
  status: string
  publishedAt: string
  createdAt: string
  updatedAt: string
  author: {
    id: string
    name: string
    image: string
  }
  categories: any[]
  tags: any[]
  _count: {
    comments: number
  }
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  
  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPost()
  }, [slug])

  const fetchPost = async () => {
    try {
      setLoading(true)
      // For now, we'll use mock data since we don't have the API route yet
      const mockPost: BlogPost = {
        id: '1',
        title: 'The Future of Web Development: Trends to Watch in 2024',
        slug: slug,
        content: `
          <p>Web development is constantly evolving, and 2024 promises to bring exciting new trends and technologies. In this comprehensive guide, we'll explore the key trends that are shaping the future of web development.</p>
          
          <h2>1. Artificial Intelligence Integration</h2>
          <p>AI is becoming increasingly integrated into web development workflows. From automated code generation to intelligent testing, AI tools are helping developers work more efficiently.</p>
          
          <h2>2. Progressive Web Apps (PWAs)</h2>
          <p>PWAs continue to gain momentum as they bridge the gap between web and mobile applications. They offer native app-like experiences while maintaining the accessibility of web technologies.</p>
          
          <h2>3. WebAssembly (WASM)</h2>
          <p>WebAssembly is enabling high-performance applications to run in the browser. This technology is particularly exciting for applications that require intensive computations.</p>
          
          <h2>4. Edge Computing</h2>
          <p>Edge computing is bringing computation closer to users, reducing latency and improving performance. This trend is particularly important for real-time applications.</p>
          
          <h2>5. Sustainability in Web Development</h2>
          <p>As environmental concerns grow, developers are focusing on creating more sustainable web applications. This includes optimizing for energy efficiency and reducing carbon footprints.</p>
          
          <p>These trends represent just the beginning of what's possible in web development. As we move forward, it's important to stay updated and adapt to these changes.</p>
        `,
        excerpt: 'Explore the key trends shaping the future of web development in 2024, from AI integration to sustainability practices.',
        featuredImage: '/api/placeholder/800/400',
        status: 'published',
        publishedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: {
          id: '1',
          name: 'John Doe',
          image: '/api/placeholder/100/100'
        },
        categories: [],
        tags: [],
        _count: {
          comments: 12
        }
      }
      
      setPost(mockPost)
    } catch (err) {
      setError('Failed to fetch post')
      console.error('Error fetching post:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading post...</p>
        </div>
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Post not found'}</p>
          <a href="/blog" className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
            Back to Blog
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{post.title}</h1>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <UserIcon className="h-4 w-4" />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CalendarIcon className="h-4 w-4" />
              <span>{format(new Date(post.publishedAt), 'MMMM d, yyyy')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ChatBubbleLeftIcon className="h-4 w-4" />
              <span>{post._count.comments} comments</span>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        {post.featuredImage && (
          <div className="mb-8">
            <img 
              src={post.featuredImage} 
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Author Info */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-4">
            <img 
              src={post.author.image} 
              alt={post.author.name}
              className="h-16 w-16 rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{post.author.name}</h3>
              <p className="text-gray-600">Author</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}