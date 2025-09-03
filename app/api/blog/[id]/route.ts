import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const post = await prisma.post.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      excerpt: true,
      featuredImage: true,
      tags: true,
      status: true,
      publishedAt: true,
      createdAt: true,
      updatedAt: true,
      author: { select: { id: true, name: true } },
    },
  })

  if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ post })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !['ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, content, tags, coverImage, status, excerpt } = body as Partial<{
    title: string
    content: string
    tags: string[]
    coverImage: string
    status: 'DRAFT' | 'PUBLISHED'
    excerpt: string
  }>

  const data: any = { }
  if (title) {
    data.title = title
    data.slug = slugify(title)
  }
  if (typeof content === 'string') data.content = content
  if (Array.isArray(tags)) data.tags = tags
  if (typeof coverImage === 'string') data.coverImage = coverImage
  if (typeof excerpt === 'string') data.excerpt = excerpt
  if (status === 'DRAFT' || status === 'PUBLISHED') {
    data.status = status
    data.publishedAt = status === 'PUBLISHED' ? new Date() : null
  }

  try {
    const post = await prisma.post.update({
      where: { id: params.id },
      data,
      select: { id: true, slug: true },
    })
    return NextResponse.json({ message: 'Post updated', post })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    if (error?.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 409 })
    }
    console.error('Update post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session || !['ADMIN', 'INSTRUCTOR'].includes(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    await prisma.post.delete({ where: { id: params.id } })
    return NextResponse.json({ message: 'Post deleted' })
  } catch (error: any) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }
    console.error('Delete post error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
