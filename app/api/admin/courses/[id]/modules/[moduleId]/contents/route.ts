import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/admin/courses/[id]/modules/[moduleId]/contents - Get all contents for a module
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const contents = await prisma.content.findMany({
      where: { moduleId: params.moduleId },
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({ contents })
  } catch (error) {
    console.error('Error fetching contents:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/admin/courses/[id]/modules/[moduleId]/contents - Create new content
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, type, url, content } = body

    // Validate required fields
    if (!title || !type) {
      return NextResponse.json({ error: 'Title and type are required' }, { status: 400 })
    }

    // Check if module exists
    const module = await prisma.module.findUnique({
      where: { id: params.moduleId }
    })

    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }

    // Get the next order number
    const lastContent = await prisma.content.findFirst({
      where: { moduleId: params.moduleId },
      orderBy: { order: 'desc' }
    })

    const nextOrder = lastContent ? lastContent.order + 1 : 1

    // Create content
    const contentItem = await prisma.content.create({
      data: {
        title,
        description: description || null,
        type,
        url: url || null,
        content: content || null,
        moduleId: params.moduleId,
        order: nextOrder
      }
    })

    return NextResponse.json({ content: contentItem }, { status: 201 })
  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
