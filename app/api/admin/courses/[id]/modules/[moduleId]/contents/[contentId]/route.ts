import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT /api/admin/courses/[id]/modules/[moduleId]/contents/[contentId] - Update content
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string; contentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, type, url, content, order } = body

    // Check if content exists
    const existingContent = await prisma.content.findUnique({
      where: { id: params.contentId }
    })

    if (!existingContent) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Prepare update data
    const updateData: any = {}
    
    if (title) updateData.title = title
    if (description !== undefined) updateData.description = description
    if (type) updateData.type = type
    if (url !== undefined) updateData.url = url
    if (content !== undefined) updateData.content = content
    if (order !== undefined) updateData.order = parseInt(order)

    // Update content
    const contentItem = await prisma.content.update({
      where: { id: params.contentId },
      data: updateData
    })

    return NextResponse.json({ content: contentItem })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/admin/courses/[id]/modules/[moduleId]/contents/[contentId] - Delete content
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string; contentId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if content exists
    const existingContent = await prisma.content.findUnique({
      where: { id: params.contentId }
    })

    if (!existingContent) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 })
    }

    // Delete content (cascade will handle related records)
    await prisma.content.delete({
      where: { id: params.contentId }
    })

    return NextResponse.json({ message: 'Content deleted successfully' })
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
