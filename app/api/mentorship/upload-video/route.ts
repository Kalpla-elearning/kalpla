import { NextRequest } from 'next/server'
import { 
  uploadVideoToS3, 
  generateUniqueFileName, 
  validateFileSize,
  validateFileType
} from '@/lib/aws-s3'
import { 
  requireAuth, 
  successResponse, 
  errorResponse, 
  extractFileFromFormData,
  convertFileToBuffer,
  withErrorHandling
} from '@/lib/api-utils'

export const POST = withErrorHandling(async (request: NextRequest) => {
  // Check authentication - only admin and instructors can upload
  const authResult = await requireAuth(['ADMIN', 'INSTRUCTOR'])
  if ('error' in authResult) {
    return errorResponse(authResult.error, authResult.status)
  }
  const { session } = authResult

  // Extract file from form data
  const formData = await request.formData()
  const fileResult = await extractFileFromFormData(formData, 'video')
  if ('error' in fileResult) {
    return errorResponse(fileResult.error, 400)
  }
  const { file } = fileResult

  // Convert file to buffer
  const bufferResult = await convertFileToBuffer(file)
  if ('error' in bufferResult) {
    return errorResponse(bufferResult.error, 500)
  }
  const { buffer } = bufferResult

  // Validate file size (500MB max for videos)
  if (!validateFileSize(file.size, 500 * 1024 * 1024)) {
    return errorResponse('Video file too large. Maximum size is 500MB.', 400)
  }

  // Validate file type - only video files
  const allowedVideoTypes = ['video/mp4', 'video/webm', 'video/avi', 'video/mov', 'video/wmv']
  if (!validateFileType(file.name, allowedVideoTypes)) {
    return errorResponse('Only video files are allowed.', 400)
  }

  // Generate unique filename with user ID and timestamp
  const fileName = generateUniqueFileName(file.name, session.user.id)
  
  // Upload to S3 in videos folder
  const s3Url = await uploadVideoToS3(buffer, fileName, 'mentorship-videos/')

  return successResponse({
    url: s3Url,
    fileName: fileName,
    originalName: file.name,
    size: file.size,
    uploadedBy: session.user.id,
    uploadedAt: new Date().toISOString()
  })
})

export const DELETE = withErrorHandling(async (request: NextRequest) => {
  const authResult = await requireAuth(['ADMIN', 'INSTRUCTOR'])
  if ('error' in authResult) {
    return errorResponse(authResult.error, authResult.status)
  }

  const { url } = await request.json()
  
  if (!url) {
    return errorResponse('No video URL provided', 400)
  }

  // Extract key from S3 URL and delete
  const { getKeyFromS3Url, deleteFileFromS3 } = await import('@/lib/aws-s3')
  const key = getKeyFromS3Url(url)
  const deleted = await deleteFileFromS3(key)

  if (deleted) {
    return successResponse({ message: 'Video deleted successfully' })
  } else {
    return errorResponse('Failed to delete video', 500)
  }
})
