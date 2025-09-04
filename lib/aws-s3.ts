import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-south-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const bucketName = process.env.AWS_S3_BUCKET || process.env.AWS_S3_BUCKET_NAME || 'kalpla-drive'

// Upload file to S3
export async function uploadFileToS3(
  file: Buffer,
  fileName: string,
  contentType: string,
  folder: string = 'uploads'
): Promise<string> {
  try {
    const key = `${folder}/${Date.now()}-${fileName}`
    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: contentType,
      ACL: 'private', // Make files private by default
    })

    await s3Client.send(command)
    
    // Return the S3 URL
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
  } catch (error) {
    console.error('Error uploading file to S3:', error)
    throw new Error(`Failed to upload file: ${error}`)
  }
}

// Upload video file to S3 (with specific settings for videos)
export async function uploadVideoToS3(
  file: Buffer,
  fileName: string,
  folder: string = 'videos',
  contentType?: string
): Promise<string> {
  try {
    const key = `${folder}/${Date.now()}-${fileName}`
    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: contentType || 'video/mp4',
      ACL: 'private',
      Metadata: {
        'uploaded-by': 'kalpla-platform',
        'upload-date': new Date().toISOString(),
      },
    })

    await s3Client.send(command)
    
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
  } catch (error) {
    console.error('Error uploading video to S3:', error)
    throw new Error(`Failed to upload video: ${error}`)
  }
}

// Generate signed URL for private file access
export async function generateSignedUrl(
  key: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    })

    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn })
    return signedUrl
  } catch (error) {
    console.error('Error generating signed URL:', error)
    throw new Error(`Failed to generate signed URL: ${error}`)
  }
}

// Generate signed upload URL for direct browser uploads
export async function generateUploadUrl(
  fileName: string,
  contentType: string,
  folder: string = 'uploads',
  expiresIn: number = 3600
): Promise<{ uploadUrl: string; key: string }> {
  try {
    const key = `${folder}/${Date.now()}-${fileName}`
    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
      ACL: 'private',
    })

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn })
    
    return {
      uploadUrl,
      key,
    }
  } catch (error) {
    console.error('Error generating upload URL:', error)
    throw new Error(`Failed to generate upload URL: ${error}`)
  }
}

// Delete file from S3
export async function deleteFileFromS3(key: string): Promise<boolean> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key,
    })

    await s3Client.send(command)
    return true
  } catch (error) {
    console.error('Error deleting file from S3:', error)
    throw new Error(`Failed to delete file: ${error}`)
  }
}

// Check if file exists in S3
export async function fileExistsInS3(key: string): Promise<boolean> {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key,
    })

    await s3Client.send(command)
    return true
  } catch (error: any) {
    if (error.name === 'NotFound') {
      return false
    }
    throw error
  }
}

// Get file metadata from S3
export async function getFileMetadata(key: string) {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key,
    })

    const response = await s3Client.send(command)
    return {
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      lastModified: response.LastModified,
      metadata: response.Metadata,
    }
  } catch (error) {
    console.error('Error getting file metadata:', error)
    throw new Error(`Failed to get file metadata: ${error}`)
  }
}

// Extract key from S3 URL
export function getKeyFromS3Url(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.pathname.substring(1) // Remove leading slash
  } catch (error) {
    console.error('Error extracting key from S3 URL:', error)
    throw new Error(`Invalid S3 URL: ${url}`)
  }
}

// Generate unique filename
export function generateUniqueFileName(originalName: string, userId?: string): string {
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = originalName.split('.').pop()
  const userPrefix = userId ? `${userId}-` : ''
  return `${userPrefix}${timestamp}-${randomString}.${extension}`
}

// Get file type from filename
export function getFileType(fileName: string): string {
  const extension = fileName.split('.').pop()?.toLowerCase()
  
  const fileTypes: { [key: string]: string } = {
    // Images
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'gif': 'image/gif',
    'webp': 'image/webp',
    'svg': 'image/svg+xml',
    
    // Videos
    'mp4': 'video/mp4',
    'avi': 'video/x-msvideo',
    'mov': 'video/quicktime',
    'wmv': 'video/x-ms-wmv',
    'flv': 'video/x-flv',
    'webm': 'video/webm',
    
    // Documents
    'pdf': 'application/pdf',
    'doc': 'application/msword',
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'xls': 'application/vnd.ms-excel',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'ppt': 'application/vnd.ms-powerpoint',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    
    // Text
    'txt': 'text/plain',
    'md': 'text/markdown',
    'html': 'text/html',
    'css': 'text/css',
    'js': 'application/javascript',
    'json': 'application/json',
    
    // Archives
    'zip': 'application/zip',
    'rar': 'application/x-rar-compressed',
    '7z': 'application/x-7z-compressed',
    'tar': 'application/x-tar',
    'gz': 'application/gzip',
  }
  
  return fileTypes[extension || ''] || 'application/octet-stream'
}

// Validate file size
export function validateFileSize(fileSize: number, maxSize: number = 100 * 1024 * 1024): boolean {
  return fileSize <= maxSize // Default 100MB
}

// Validate file (combines size and type validation)
export function validateFile(file: File | Express.Multer.File, allowedTypes: string[] = [], maxSize: number = 100 * 1024 * 1024): { isValid: boolean; error?: string } {
  if (!validateFileSize(file.size, maxSize)) {
    return { isValid: false, error: `File size exceeds ${maxSize / (1024 * 1024)}MB limit` }
  }
  
  if (!validateFileType(file.name, allowedTypes)) {
    return { isValid: false, error: 'File type not allowed' }
  }
  
  return { isValid: true }
}

// Upload image to S3 (with image-specific settings)
export async function uploadImageToS3(
  file: Buffer,
  fileName: string,
  folder: string = 'images',
  contentType?: string
): Promise<string> {
  try {
    const key = `${folder}/${Date.now()}-${fileName}`
    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      Body: file,
      ContentType: contentType || getFileType(fileName),
      ACL: 'public-read', // Images are typically public
      Metadata: {
        'uploaded-by': 'kalpla-platform',
        'upload-date': new Date().toISOString(),
        'file-type': 'image',
      },
    })

    await s3Client.send(command)
    
    return `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`
  } catch (error) {
    console.error('Error uploading image to S3:', error)
    throw new Error(`Failed to upload image: ${error}`)
  }
}

// Validate file type
export function validateFileType(fileName: string, allowedTypes: string[] = []): boolean {
  if (allowedTypes.length === 0) {
    // Default allowed types
    allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'video/mp4', 'video/webm',
      'application/pdf',
      'text/plain', 'text/markdown',
      'application/zip'
    ]
  }
  
  const fileType = getFileType(fileName)
  return allowedTypes.includes(fileType)
}

// Convert file to buffer (for handling FormData files)
export async function convertFileToBuffer(file: File): Promise<Buffer> {
  const arrayBuffer = await file.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

// Get bucket information
export async function getBucketInfo() {
  try {
    const { ListBucketsCommand } = await import('@aws-sdk/client-s3')
    const command = new ListBucketsCommand({})
    const response = await s3Client.send(command)
    
    return {
      bucketName,
      region: process.env.AWS_REGION,
      availableBuckets: response.Buckets?.map(bucket => bucket.Name) || [],
    }
  } catch (error) {
    console.error('Error getting bucket info:', error)
    throw new Error(`Failed to get bucket info: ${error}`)
  }
}

export {
  s3Client,
  bucketName,
}
