import multer from 'multer'
import { NextRequest } from 'next/server'
import { validateFile } from './aws-s3'

// Memory storage for temporary file handling
const storage = multer.memoryStorage()

// File filter function
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const validation = validateFile(file)
  
  if (validation.isValid) {
    cb(null, true)
  } else {
    cb(new Error(validation.error || 'Invalid file type'))
  }
}

// Multer configuration
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 500 * 1024 * 1024, // 500MB max file size
    files: 10 // Maximum 10 files per request
  }
})

// Specific upload configurations
export const uploadSingle = upload.single('file')
export const uploadMultiple = upload.array('files', 10)
export const uploadFields = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 },
  { name: 'document', maxCount: 5 },
  { name: 'image', maxCount: 5 }
])

// Course-specific upload
export const uploadCourseContent = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'promoVideo', maxCount: 1 },
  { name: 'courseMaterials', maxCount: 10 }
])

// Profile avatar upload
export const uploadAvatar = upload.single('avatar')

// Blog image upload
export const uploadBlogImage = upload.single('image')

// Video upload
export const uploadVideo = upload.single('video')

// Document upload
export const uploadDocument = upload.single('document')

// Helper function to handle multer errors
export const handleUploadError = (error: any) => {
  if (error instanceof multer.MulterError) {
    switch (error.code) {
      case 'LIMIT_FILE_SIZE':
        return { error: 'File too large', status: 400 }
      case 'LIMIT_FILE_COUNT':
        return { error: 'Too many files', status: 400 }
      case 'LIMIT_UNEXPECTED_FILE':
        return { error: 'Unexpected file field', status: 400 }
      default:
        return { error: 'File upload error', status: 400 }
    }
  }
  
  if (error.message) {
    return { error: error.message, status: 400 }
  }
  
  return { error: 'Unknown upload error', status: 500 }
}

// Helper function to extract files from request
export const extractFilesFromRequest = (req: any) => {
  const files: any = {}
  
  if (req.files) {
    // Handle multiple files
    if (Array.isArray(req.files)) {
      files.files = req.files
    } else {
      // Handle field-specific files
      Object.keys(req.files).forEach(key => {
        files[key] = req.files[key]
      })
    }
  }
  
  if (req.file) {
    files.file = req.file
  }
  
  return files
}

// Helper function to validate file types for specific uploads
export const validateFileForUpload = (
  file: Express.Multer.File, 
  allowedTypes: string[]
): { isValid: boolean; error?: string } => {
  const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'))
  
  if (!allowedTypes.includes(fileExtension)) {
    return { 
      isValid: false, 
      error: `File type ${fileExtension} is not allowed. Allowed types: ${allowedTypes.join(', ')}` 
    }
  }
  
  return { isValid: true }
}

// Predefined file type validators
export const FILE_VALIDATORS = {
  VIDEO: (file: Express.Multer.File) => validateFileForUpload(file, ['.mp4', '.avi', '.mov', '.wmv', '.flv', '.webm', '.mkv']),
  IMAGE: (file: Express.Multer.File) => validateFileForUpload(file, ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']),
  DOCUMENT: (file: Express.Multer.File) => validateFileForUpload(file, ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.txt']),
  AUDIO: (file: Express.Multer.File) => validateFileForUpload(file, ['.mp3', '.wav', '.ogg', '.m4a', '.aac'])
}

export default upload
