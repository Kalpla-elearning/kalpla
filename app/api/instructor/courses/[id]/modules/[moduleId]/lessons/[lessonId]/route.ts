import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const lessonUpdateSchema = z.object({
  title: z.string().min(1, 'Title is required').optional(),
  description: z.string().optional(),
  type: z.enum(['VIDEO', 'DOCUMENT', 'LINK']).optional(),
  content: z.string().optional(),
  videoUrl: z.string().url().optional(),
  documentUrl: z.string().url().optional(),
  externalUrl: z.string().url().optional(),
  isPublished: z.boolean().optional()
})

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string; lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Verify lesson exists and belongs to instructor's course
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: params.lessonId,
        module: {
          id: params.moduleId,
          course: {
            id: params.id,
            instructorId: session.user.id
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = lessonUpdateSchema.parse(body)

    const updatedLesson = await prisma.lesson.update({
      where: { id: params.lessonId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        type: validatedData.type,
        content: validatedData.content,
        videoUrl: validatedData.videoUrl,
        documentUrl: validatedData.documentUrl,
        externalUrl: validatedData.externalUrl,
        isPublished: validatedData.isPublished
      }
    })

    return NextResponse.json(updatedLesson)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error updating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string; lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Verify lesson exists and belongs to instructor's course
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: params.lessonId,
        module: {
          id: params.moduleId,
          course: {
            id: params.id,
            instructorId: session.user.id
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = lessonUpdateSchema.parse(body)

    const updatedLesson = await prisma.lesson.update({
      where: { id: params.lessonId },
      data: validatedData
    })

    return NextResponse.json(updatedLesson)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error updating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string; lessonId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Verify lesson exists and belongs to instructor's course
    const lesson = await prisma.lesson.findFirst({
      where: {
        id: params.lessonId,
        module: {
          id: params.moduleId,
          course: {
            id: params.id,
            instructorId: session.user.id
          }
        }
      }
    })

    if (!lesson) {
      return NextResponse.json({ error: 'Lesson not found' }, { status: 404 })
    }

    await prisma.lesson.delete({
      where: { id: params.lessonId }
    })

    return NextResponse.json({ message: 'Lesson deleted successfully' })
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
