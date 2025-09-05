import { notFound } from 'next/navigation'

import Link from 'next/link'
import { format } from 'date-fns'
import { 
  CalendarIcon, 
  UserIcon, 
  ChatBubbleLeftIcon,
  MapPinIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  ArrowLeftIcon,
  EyeIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { PostCard } from '@/components/blog/PostCard'

export const dynamic = 'force-dynamic'

async function getAuthor(id: string) {
  const author = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      bio: true,
      location: true,
      website: true,
      createdAt: true,
      posts: {
        where: { status: 'PUBLISHED' },
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          publishedAt: true,
          categories: {
            include: {
              category: {
                select: {
                  id: true,
                  name: true,
                  color: true
                }
              }
            }
          },
          tags: {
            include: {
              tag: {
                select: {
                  id: true,
                  name: true,
                  color: true
                }
              }
            }
          },
          _count: {
            select: {
              comments: true
            }
          }
        }
      },
      _count: {
        select: {
          posts: {
            where: { status: 'PUBLISHED' }
          }
        }
      }
    }
  })
  return author
}

export default async function AuthorPage({ params }: { params: { id: string } }) {
  const author = await getAuthor(params.id)

  if (!author) {
    notFound()
  }

  const formatDate = (date: Date) => {
    return format(date, 'MMMM dd, yyyy')
  }

  const getCategoryColor = (color: string | null) => {
    if (!color) return 'bg-gray-100 text-gray-800'
    
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
    
    return colorMap[color] || 'bg-gray-100 text-gray-800'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/blog" className="hover:text-primary-600 flex items-center">
              <ArrowLeftIcon className="h-4 w-4 mr-1" />
              Blog
            </Link>
            <span>/</span>
            <span className="text-gray-900">Author</span>
            <span>/</span>
            <span className="text-gray-900">{author.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Author Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0">
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    {author.image ? (
                      <img 
                        src={author.image} 
                        alt={author.name}
                        className="h-24 w-24 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-12 w-12 text-gray-400" />
                    )}
                  </div>
                </div>
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{author.name}</h1>
                  
                  {author.bio && (
                    <p className="text-gray-600 mb-4 leading-relaxed">{author.bio}</p>
                  )}

                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    {author.location && (
                      <div className="flex items-center">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {author.location}
                      </div>
                    )}
                    <div className="flex items-center">
                      <CalendarIcon className="h-4 w-4 mr-1" />
                      Member since {formatDate(author.createdAt)}
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {author.website && (
                      <a
                        href={author.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-primary-600 hover:text-primary-700"
                      >
                        <GlobeAltIcon className="h-4 w-4 mr-1" />
                        Website
                      </a>
                    )}
                    <div className="flex items-center text-gray-600">
                      <EnvelopeIcon className="h-4 w-4 mr-1" />
                      {author.email}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Author Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Author Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary-600 mb-2">
                    {author._count.posts}
                  </div>
                  <div className="text-sm text-gray-600">Published Posts</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {author.posts.reduce((sum, post) => sum + post._count.comments, 0)}
                  </div>
                  <div className="text-sm text-gray-600">Total Comments</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {Math.floor((Date.now() - author.createdAt.getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-sm text-gray-600">Days as Member</div>
                </div>
              </div>
            </div>

            {/* Author's Posts */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Posts by {author.name}
              </h2>
              
              {author.posts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts published yet</h3>
                  <p className="text-gray-600">This author hasn't published any posts yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {author.posts.map((post) => (
                    <div key={post.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                      {post.featuredImage && (
                        <div className="aspect-video bg-gray-200">
                          <img
                            src={post.featuredImage}
                            alt={post.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <div className="flex items-center space-x-2 mb-3">
                          {post.categories.map(({ category }) => (
                            <span
                              key={category.id}
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(category.color)}`}
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          <Link href={`/blog/${post.slug}`} className="hover:text-primary-600">
                            {post.title}
                          </Link>
                        </h3>
                        {post.excerpt && (
                          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center">
                            <CalendarIcon className="h-4 w-4 mr-1" />
                            {post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                              <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                              {post._count.comments}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Author Info Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">About the Author</h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                    {author.image ? (
                      <img 
                        src={author.image} 
                        alt={author.name}
                        className="h-16 w-16 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{author.name}</h4>
                    <p className="text-sm text-gray-600">
                      {author._count.posts} posts published
                    </p>
                  </div>
                </div>

                {author.bio && (
                  <div>
                    <p className="text-sm text-gray-700 leading-relaxed">{author.bio}</p>
                  </div>
                )}

                <div className="space-y-2">
                  {author.location && (
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPinIcon className="h-4 w-4 mr-2" />
                      {author.location}
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Member since {formatDate(author.createdAt)}
                  </div>
                  {author.website && (
                    <a
                      href={author.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-primary-600 hover:text-primary-700"
                    >
                      <GlobeAltIcon className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Recent Posts */}
            {author.posts.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Posts</h3>
                <div className="space-y-4">
                  {author.posts.slice(0, 5).map((post) => (
                    <div key={post.id} className="border-b border-gray-100 pb-4 last:border-b-0">
                      <h4 className="font-medium text-gray-900 mb-1">
                        <Link href={`/blog/${post.slug}`} className="hover:text-primary-600">
                          {post.title}
                        </Link>
                      </h4>
                      <div className="flex items-center text-sm text-gray-500">
                        <CalendarIcon className="h-3 w-3 mr-1" />
                        {post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
