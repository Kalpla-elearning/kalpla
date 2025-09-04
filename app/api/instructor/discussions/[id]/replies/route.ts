import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const replySchema = z.object({
  content: z.string().min(1, 'Reply content is required')
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

    // Verify discussion exists and belongs to instructor's course
    const discussion = await prisma.discussion.findFirst({
      where: {
        id: params.id,
        course: {
          instructorId: session.user.id
        }
      }
    })

    if (!discussion) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = replySchema.parse(body)

    const reply = await prisma.reply.create({
      data: {
        content: validatedData.content,
        discussionId: params.id,
        authorId: session.user.id
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    })

    return NextResponse.json(reply, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error creating reply:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
