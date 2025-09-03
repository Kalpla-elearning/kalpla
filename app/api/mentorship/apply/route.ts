import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const mentorApplicationSchema = z.object({
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  expertise: z.string().min(10, 'Please list your areas of expertise'),
  experience: z.string().min(1, 'Experience is required'),
  hourlyRate: z.string().min(1, 'Hourly rate is required'),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  portfolioUrl: z.string().url().optional().or(z.literal('')),
  motivation: z.string().min(100, 'Motivation must be at least 100 characters')
})

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is already a mentor
    const existingMentor = await prisma.mentor.findUnique({
      where: { userId: session.user.id }
    })

    if (existingMentor) {
      return NextResponse.json({ error: 'You are already a mentor' }, { status: 400 })
    }

    const body = await request.json()
    const validatedData = mentorApplicationSchema.parse(body)

    // Create mentor profile
    const mentor = await prisma.mentor.create({
      data: {
        userId: session.user.id,
        bio: validatedData.bio,
        expertise: validatedData.expertise,
        experience: parseInt(validatedData.experience),
        hourlyRate: parseFloat(validatedData.hourlyRate),
        isVerified: false, // Will be verified after review
        isActive: false // Will be activated after approval
      }
    })

    return NextResponse.json({ 
      message: 'Application submitted successfully',
      mentorId: mentor.id 
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }
    console.error('Error submitting mentor application:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
