import { NextRequest } from 'next/server'
import { 
  uploadFileToS3, 
  generateUniqueFileName, 
  getFileType,
  validateFileSize,
  validateFileType
} from '@/lib/aws-s3'
import { uploadSingle, handleUploadError } from '@/lib/upload-middleware'
import { 
  requireAuth, 
  successResponse, 
  errorResponse, 
  extractFileFromFormData,
  convertFileToBuffer,
  withErrorHandling
} from '@/lib/api-utils'

export const POST = withErrorHandling(async (request: NextRequest) => {
  // Check authentication
  const authResult = await requireAuth()
  if ('error' in authResult) {
    return errorResponse(authResult.error, authResult.status)
  }
  const { session } = authResult

  // Extract file from form data
  const formData = await request.formData()
  const fileResult = await extractFileFromFormData(formData, 'file')
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

  // Validate file size (100MB max)
  if (!validateFileSize(file.size, 100 * 1024 * 1024)) {
    return errorResponse('File size too large. Maximum size is 100MB.', 400)
  }

  // Validate file type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm', 'application/pdf', 'text/plain']
  if (!validateFileType(file.name, allowedTypes)) {
    return errorResponse('File type not allowed.', 400)
  }

  // Generate unique filename
  const fileName = generateUniqueFileName(file.name, session.user.id)
  
  // Determine file type and folder
  const fileType = getFileType(file.name)
  let folder = ''
  
  switch (fileType) {
    case 'VIDEO':
      folder = 'videos/'
      break
    case 'IMAGE':
      folder = 'images/'
      break
    case 'DOCUMENT':
      folder = 'documents/'
      break
    case 'AUDIO':
      folder = 'audio/'
      break
    default:
      folder = 'misc/'
  }

  // Upload to S3
  const s3Url = await uploadFileToS3(buffer, fileName, file.type, folder)

  return successResponse({
    url: s3Url,
    fileName: fileName,
    originalName: file.name,
    fileType: fileType,
    size: file.size
  })
})

export const DELETE = withErrorHandling(async (request: NextRequest) => {
  const authResult = await requireAuth()
  if ('error' in authResult) {
    return errorResponse(authResult.error, authResult.status)
  }

  const { url } = await request.json()
  
  if (!url) {
    return errorResponse('No file URL provided', 400)
  }

  // Extract key from S3 URL and delete
  const { getKeyFromS3Url, deleteFileFromS3 } = await import('@/lib/aws-s3')
  const key = getKeyFromS3Url(url)
  const deleted = await deleteFileFromS3(key)

  if (deleted) {
    return successResponse({ message: 'File deleted successfully' })
  } else {
    return errorResponse('Failed to delete file', 500)
  }
})
