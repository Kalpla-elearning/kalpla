
import Link from 'next/link'
import { format } from 'date-fns'
import { 
  CalendarIcon, 
  UserIcon, 
  ChatBubbleLeftIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { PostCard } from '@/components/blog/PostCard'

export const dynamic = 'force-dynamic'

async function searchPosts(searchParams: { q?: string; category?: string; author?: string; sort?: string; date?: string }) {
  const { q, category, author, sort, date } = searchParams

  // Build where clause
  const where: any = {
    status: 'PUBLISHED'
  }

  // Search query
  if (q) {
    where.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { content: { contains: q, mode: 'insensitive' } },
      { excerpt: { contains: q, mode: 'insensitive' } },
      { author: { name: { contains: q, mode: 'insensitive' } } }
    ]
  }

  // Category filter
  if (category) {
    where.categories = {
      some: {
        category: {
          slug: category
        }
      }
    }
  }

  // Author filter
  if (author) {
    where.author = {
      id: author
    }
  }

  // Date filter
  if (date) {
    const now = new Date()
    let startDate: Date

    switch (date) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        break
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case 'month':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())
        break
      case 'year':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
        break
      default:
        startDate = new Date(0)
    }

    where.publishedAt = {
      gte: startDate
    }
  }

  // Build orderBy clause
  let orderBy: any = { publishedAt: 'desc' }

  if (sort) {
    switch (sort) {
      case 'newest':
        orderBy = { publishedAt: 'desc' }
        break
      case 'oldest':
        orderBy = { publishedAt: 'asc' }
        break
      case 'most-commented':
        orderBy = { comments: { _count: 'desc' } }
        break
      case 'title':
        orderBy = { title: 'asc' }
        break
      case 'author':
        orderBy = { author: { name: 'asc' } }
        break
    }
  }

  const posts = await prisma.post.findMany({
    where,
    orderBy,
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      featuredImage: true,
      publishedAt: true,
      author: { 
        select: { 
          id: true, 
          name: true,
          image: true
        } 
      },
      categories: {
        include: {
          category: {
            select: {
              id: true,
              name: true,
              color: true,
              slug: true
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
    },
  })

  return posts
}

async function getCategories() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
      _count: {
        select: {
          posts: {
            where: {
              post: {
                status: 'PUBLISHED'
              }
            }
          }
        }
      }
    }
  })
  return categories
}

async function getAuthors() {
  const authors = await prisma.user.findMany({
    where: {
      posts: {
        some: {
          status: 'PUBLISHED'
        }
      }
    },
    select: {
      id: true,
      name: true,
      image: true,
      _count: {
        select: {
          posts: {
            where: { status: 'PUBLISHED' }
          }
        }
      }
    }
  })
  return authors
}

export default async function SearchPage({ 
  searchParams 
}: { 
  searchParams: { q?: string; category?: string; author?: string; sort?: string; date?: string }
}) {
  const [posts, categories, authors] = await Promise.all([
    searchPosts(searchParams),
    getCategories(),
    getAuthors()
  ])

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

  const buildSearchUrl = (newParams: Record<string, string>) => {
    const params = new URLSearchParams()
    
    // Add existing params
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value) params.set(key, value)
    })
    
    // Add new params
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    
    return `/blog/search?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center">
              <MagnifyingGlassIcon className="h-8 w-8 mr-3 text-primary-600" />
              Search Results
            </h1>
            {searchParams.q && (
              <p className="text-xl text-gray-600 mb-4">
                Results for "<span className="font-medium">{searchParams.q}</span>"
              </p>
            )}
            <p className="text-gray-600">
              Found {posts.length} post{posts.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search Form */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
              <form method="GET" className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="relative">
                      <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="q"
                        placeholder="Search posts..."
                        defaultValue={searchParams.q}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn-primary flex items-center"
                  >
                    <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
                    Search
                  </button>
                </div>

                {/* Advanced Filters */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                    <select
                      name="category"
                      defaultValue={searchParams.category}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">All Categories</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.slug}>
                          {category.name} ({category._count.posts})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
                    <select
                      name="author"
                      defaultValue={searchParams.author}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">All Authors</option>
                      {authors.map((author) => (
                        <option key={author.id} value={author.id}>
                          {author.name} ({author._count.posts})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <select
                      name="date"
                      defaultValue={searchParams.date}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="">All Time</option>
                      <option value="today">Today</option>
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                      <option value="year">This Year</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FunnelIcon className="h-5 w-5 text-gray-400" />
                    <label className="text-sm font-medium text-gray-700">Sort by:</label>
                    <select
                      name="sort"
                      defaultValue={searchParams.sort || 'newest'}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    >
                      <option value="newest">Newest First</option>
                      <option value="oldest">Oldest First</option>
                      <option value="most-commented">Most Commented</option>
                      <option value="title">Alphabetical</option>
                      <option value="author">Author Name</option>
                    </select>
                  </div>
                  <Link
                    href="/blog/search"
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear all filters
                  </Link>
                </div>
              </form>
            </div>

            {/* Search Results */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {posts.length === 0 ? (
                <div className="text-center py-12">
                  <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No posts found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchParams.q 
                      ? `No posts match your search for "${searchParams.q}". Try adjusting your search terms or filters.`
                      : 'Try adjusting your filters to find more posts.'
                    }
                  </p>
                  <Link href="/blog" className="btn-primary">
                    Browse All Posts
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      Search Results ({posts.length})
                    </h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {posts.map((post) => (
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
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center">
                                <UserIcon className="h-4 w-4 mr-1" />
                                <Link href={`/blog/author/${post.author.id}`} className="hover:text-primary-600">
                                  {post.author.name}
                                </Link>
                              </div>
                              <div className="flex items-center">
                                <CalendarIcon className="h-4 w-4 mr-1" />
                                {post.publishedAt ? formatDate(post.publishedAt) : 'Draft'}
                              </div>
                            </div>
                            <div className="flex items-center">
                              <ChatBubbleLeftIcon className="h-4 w-4 mr-1" />
                              {post._count.comments}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Search Stats */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Results</span>
                  <span className="font-medium">{posts.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Categories</span>
                  <span className="font-medium">{categories.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Authors</span>
                  <span className="font-medium">{authors.length}</span>
                </div>
              </div>
            </div>

            {/* Popular Categories */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Categories</h3>
              <div className="space-y-3">
                {categories
                  .sort((a, b) => b._count.posts - a._count.posts)
                  .slice(0, 5)
                  .map((category) => (
                    <Link
                      key={category.id}
                      href={buildSearchUrl({ category: category.slug })}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <span className={`w-3 h-3 rounded-full ${getCategoryColor(category.color).replace('bg-', 'bg-').replace(' text-', '')}`}></span>
                        <span className="text-gray-900">{category.name}</span>
                      </div>
                      <span className="text-sm text-gray-500">{category._count.posts}</span>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Top Authors */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Authors</h3>
              <div className="space-y-3">
                {authors
                  .sort((a, b) => b._count.posts - a._count.posts)
                  .slice(0, 5)
                  .map((author) => (
                    <Link
                      key={author.id}
                      href={buildSearchUrl({ author: author.id })}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {author.image ? (
                          <img 
                            src={author.image} 
                            alt={author.name}
                            className="h-8 w-8 rounded-full object-cover"
                          />
                        ) : (
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{author.name}</div>
                        <div className="text-sm text-gray-500">{author._count.posts} posts</div>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
