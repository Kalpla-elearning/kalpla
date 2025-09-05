import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/lib/amplify-config'
import { getCurrentUser } from 'aws-amplify/auth'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

// GET /api/blog - Get all blog posts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const status = searchParams.get('status') || ''
    const category = searchParams.get('category') || ''

    // Build filter
    const filter: any = {}
    
    if (search) {
      filter.or = [
        { title: { contains: search } },
        { content: { contains: search } },
        { excerpt: { contains: search } }
      ]
    }

    if (status) {
      filter.status = { eq: status }
    }

    if (category) {
      filter.category = { eq: category }
    }

    // Get posts
    const { data: posts } = await client.models.Post.list({
      filter,
      limit,
    })

    return NextResponse.json({
      posts,
      pagination: {
        page,
        limit,
        total: posts.length,
        pages: Math.ceil(posts.length / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching posts:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/blog - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      title, 
      content, 
      excerpt,
      featuredImage,
      category,
      tags = []
    } = body

    // Validate required fields
    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    // Generate slug from title
    const slug = slugify(title)

    // Create post
    const { data: post } = await client.models.Post.create({
      title,
      slug,
      content,
      excerpt: excerpt || content.replace(/<[^>]*>/g, '').substring(0, 160),
      featuredImage: featuredImage || null,
      authorId: user.userId,
      category,
      tags,
      isPublished: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({ post }, { status: 201 })
  } catch (error) {
    console.error('Error creating post:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
