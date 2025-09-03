import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const moduleSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional()
})

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (session.user.role !== 'INSTRUCTOR' && session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Verify course exists and belongs to instructor
    const course = await prisma.course.findFirst({
      where: {
        id: params.id,
        instructorId: session.user.id
      }
    })

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = moduleSchema.parse(body)

    // Get the highest order number for modules in this course
    const lastModule = await prisma.module.findFirst({
      where: { courseId: params.id },
      orderBy: { order: 'desc' }
    })

    const newOrder = (lastModule?.order || 0) + 1

    const module = await prisma.module.create({
      data: {
        title: validatedData.title,
        description: validatedData.description || '',
        order: newOrder,
        courseId: params.id,
        isPublished: false
      }
    })

    return NextResponse.json(module, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error creating module:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
