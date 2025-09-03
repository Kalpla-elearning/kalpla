import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const lessonSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  type: z.enum(['VIDEO', 'DOCUMENT', 'LINK']),
  content: z.string().optional(),
  videoUrl: z.string().url().optional(),
  documentUrl: z.string().url().optional(),
  externalUrl: z.string().url().optional()
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string; moduleId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Verify module exists and belongs to instructor's course
    const module = await prisma.module.findFirst({
      where: {
        id: params.moduleId,
        course: {
          id: params.id,
          instructorId: session.user.id
        }
      }
    })

    if (!module) {
      return NextResponse.json({ error: 'Module not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = lessonSchema.parse(body)

    // Get the highest order number for lessons in this module
    const lastLesson = await prisma.lesson.findFirst({
      where: { moduleId: params.moduleId },
      orderBy: { order: 'desc' }
    })

    const newOrder = (lastLesson?.order || 0) + 1

    const lesson = await prisma.lesson.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || '',
        type: validatedData.type,
        content: validatedData.content,
        videoUrl: validatedData.videoUrl,
        documentUrl: validatedData.documentUrl,
        externalUrl: validatedData.externalUrl,
        order: newOrder,
        moduleId: params.moduleId,
        isPublished: false
      }
    })

    return NextResponse.json(lesson, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error creating lesson:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
