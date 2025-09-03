import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { 
  uploadVideoToS3, 
  generateUniqueFileName, 
  validateFile 
} from '@/lib/aws-s3'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if user is instructor or admin
    if (!['INSTRUCTOR', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Parse multipart form data
    const formData = await request.formData()
    const videoFile = formData.get('video') as File
    const courseId = formData.get('courseId') as string
    
    if (!videoFile) {
      return NextResponse.json({ error: 'No video file provided' }, { status: 400 })
    }

    // Validate video file
    const videoValidation = validateFile({
      originalname: videoFile.name,
      size: videoFile.size,
      mimetype: videoFile.type
    } as any)

    if (!videoValidation.isValid) {
      return NextResponse.json({ error: videoValidation.error }, { status: 400 })
    }

    // Check if it's actually a video file
    if (!videoFile.type.startsWith('video/')) {
      return NextResponse.json({ error: 'File must be a video' }, { status: 400 })
    }

    // Convert File to Buffer
    const bytes = await videoFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const fileName = generateUniqueFileName(videoFile.name, session.user.id)
    
    // Upload to S3 with course-specific folder
    const s3Url = await uploadVideoToS3(buffer, fileName, videoFile.type, courseId)

    return NextResponse.json({
      success: true,
      url: s3Url,
      fileName: fileName,
      originalName: videoFile.name,
      fileType: 'VIDEO',
      size: videoFile.size,
      courseId: courseId || null
    })

  } catch (error) {
    console.error('Video upload error:', error)
    return NextResponse.json({ error: 'Video upload failed' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url } = await request.json()
    
    if (!url) {
      return NextResponse.json({ error: 'No video URL provided' }, { status: 400 })
    }

    // Extract key from S3 URL and delete
    const { getKeyFromS3Url, deleteFileFromS3 } = await import('@/lib/aws-s3')
    const key = getKeyFromS3Url(url)
    const deleted = await deleteFileFromS3(key)

    if (deleted) {
      return NextResponse.json({ success: true, message: 'Video deleted successfully' })
    } else {
      return NextResponse.json({ error: 'Failed to delete video' }, { status: 500 })
    }

  } catch (error) {
    console.error('Video delete error:', error)
    return NextResponse.json({ error: 'Video delete failed' }, { status: 500 })
  }
}
