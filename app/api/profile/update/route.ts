import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import { uploadImageToS3, generateUniqueFileName, validateFile } from '@/lib/aws-s3'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const phone = formData.get('phone') as string
    const bio = formData.get('bio') as string
    const location = formData.get('location') as string
    const website = formData.get('website') as string
    const avatar = formData.get('avatar') as File | null

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    // Check if email is already taken by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: { not: session.user.id }
      }
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Email is already taken' }, { status: 400 })
    }

    // Handle avatar upload
    let avatarUrl = null
    if (avatar) {
      try {
        // Validate avatar file
        const avatarValidation = validateFile({
          originalname: avatar.name,
          size: avatar.size,
          mimetype: avatar.type
        } as any)

        if (!avatarValidation.isValid) {
          return NextResponse.json({ error: avatarValidation.error }, { status: 400 })
        }

        // Check if it's actually an image
        if (!avatar.type.startsWith('image/')) {
          return NextResponse.json({ error: 'File must be an image' }, { status: 400 })
        }

        // Convert File to Buffer
        const bytes = await avatar.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate unique filename
        const fileName = generateUniqueFileName(avatar.name, session.user.id)
        
        // Upload to S3
        avatarUrl = await uploadImageToS3(buffer, fileName, avatar.type, 'avatar')
      } catch (error) {
        console.error('Error uploading avatar to S3:', error)
        return NextResponse.json({ error: 'Failed to upload avatar' }, { status: 500 })
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        email,
        phone: phone || null,
        bio: bio || null,
        location: location || null,
        website: website || null,
        image: avatarUrl || undefined
      }
    })

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
        role: updatedUser.role
      },
      avatar: avatarUrl
    })

  } catch (error) {
    console.error('Error updating profile:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}
