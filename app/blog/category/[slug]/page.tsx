import { notFound } from 'next/navigation'

import Link from 'next/link'
import { format } from 'date-fns'
import { 
  CalendarIcon, 
  UserIcon, 
  ChatBubbleLeftIcon,
  ArrowLeftIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'
import { PostCard } from '@/components/blog/PostCard'



async function getCategory(slug: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      description: true,
      color: true,
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
          author: { select: { id: true, name: true } },
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
  return category
}

async function getAllCategories() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
      _count: {
        select: {
          posts: {
            where: { status: 'PUBLISHED' }
          }
        }
      }
    }
  })
  return categories
}

export default async function CategoryPage({ 
  params, 
  searchParams 
}: { 
  params: { slug: string }
  searchParams: { sort?: string; search?: string }
}) {
  const [category, allCategories] = await Promise.all([
    getCategory(params.slug),
    getAllCategories()
  ])

  if (!category) {
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

  // Filter and sort posts
  let filteredPosts = category.posts

  // Apply search filter
  if (searchParams.search) {
    const searchTerm = searchParams.search.toLowerCase()
    filteredPosts = filteredPosts.filter(post => 
      post.title.toLowerCase().includes(searchTerm) ||
      post.excerpt?.toLowerCase().includes(searchTerm) ||
      post.author.name.toLowerCase().includes(searchTerm)
    )
  }

  // Apply sorting
  if (searchParams.sort) {
    switch (searchParams.sort) {
      case 'newest':
        filteredPosts = [...filteredPosts].sort((a, b) => 
          new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
        )
        break
      case 'oldest':
        filteredPosts = [...filteredPosts].sort((a, b) => 
          new Date(a.publishedAt || 0).getTime() - new Date(b.publishedAt || 0).getTime()
        )
        break
      case 'most-commented':
        filteredPosts = [...filteredPosts].sort((a, b) => 
          b._count.comments - a._count.comments
        )
        break
      case 'title':
        filteredPosts = [...filteredPosts].sort((a, b) => 
          a.title.localeCompare(b.title)
        )
        break
    }
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
            <Link href="/blog" className="hover:text-primary-600">
              Categories
            </Link>
            <span>/</span>
            <span className="text-gray-900">{category.name}</span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Category Header */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getCategoryColor(category.color)}`}>
                    {category.name}
                  </span>
                  <span className="text-sm text-gray-600">
                    {category._count.posts} posts
                  </span>
                </div>
              </div>
              
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {category.name}
              </h1>
              
              {category.description && (
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  {category.description}
                </p>
              )}

              {/* Search and Filter */}
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <form method="GET" className="relative">
                    <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="search"
                      placeholder="Search posts..."
                      defaultValue={searchParams.search}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </form>
                </div>
                <div className="flex items-center space-x-2">
                  <FunnelIcon className="h-5 w-5 text-gray-400" />
                  <select
                    name="sort"
                    defaultValue={searchParams.sort || 'newest'}
                    onChange={(e) => {
                      const url = new URL(window.location.href)
                      url.searchParams.set('sort', e.target.value)
                      window.location.href = url.toString()
                    }}
                    className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="most-commented">Most Commented</option>
                    <option value="title">Alphabetical</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Posts Grid */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchParams.search ? 'No posts match your search' : 'No posts in this category yet'}
                  </h3>
                  <p className="text-gray-600">
                    {searchParams.search 
                      ? 'Try adjusting your search terms or browse other categories.'
                      : 'Check back soon for new content in this category!'
                    }
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {searchParams.search ? `Search Results (${filteredPosts.length})` : `All Posts (${filteredPosts.length})`}
                    </h2>
                    {searchParams.search && (
                      <Link 
                        href={`/blog/category/${params.slug}`}
                        className="text-primary-600 hover:text-primary-700 text-sm"
                      >
                        Clear search
                      </Link>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredPosts.map((post) => (
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
            {/* Category Info */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Info</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Posts</span>
                  <span className="font-medium">{category._count.posts}</span>
                </div>
                
                {category.description && (
                  <div>
                    <p className="text-sm text-gray-700 leading-relaxed">{category.description}</p>
                  </div>
                )}
              </div>
            </div>

            {/* All Categories */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">All Categories</h3>
              <div className="space-y-3">
                {allCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/blog/category/${cat.slug}`}
                    className={`flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                      cat.slug === params.slug ? 'bg-primary-50 border border-primary-200' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className={`w-3 h-3 rounded-full ${getCategoryColor(cat.color).replace('bg-', 'bg-').replace(' text-', '')}`}></span>
                      <span className={`font-medium ${
                        cat.slug === params.slug ? 'text-primary-600' : 'text-gray-900'
                      }`}>
                        {cat.name}
                      </span>
                    </div>
                    <span className="text-sm text-gray-500">{cat._count.posts}</span>
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
