'use client'

import { useState, useRef } from 'react'
import { 
  CloudArrowUpIcon, 
  XMarkIcon, 
  DocumentIcon,
  PhotoIcon,
  VideoCameraIcon,
  MusicalNoteIcon
} from '@heroicons/react/24/outline'
import { validateFileType, validateFileSize, FILE_TYPES } from '@/lib/utils'

interface FileUploadProps {
  onUpload: (fileUrl: string, fileName: string) => void
  onError: (error: string) => void
  accept?: string
  maxSize?: number
  fileType?: 'image' | 'video' | 'document' | 'audio' | 'any'
  multiple?: boolean
  className?: string
  disabled?: boolean
}

export default function FileUpload({
  onUpload,
  onError,
  accept,
  maxSize = 50 * 1024 * 1024, // 50MB default
  fileType = 'any',
  multiple = false,
  className = '',
  disabled = false
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return PhotoIcon
    if (file.type.startsWith('video/')) return VideoCameraIcon
    if (file.type.startsWith('audio/')) return MusicalNoteIcon
    return DocumentIcon
  }

  const getAcceptTypes = () => {
    if (accept) return accept
    
    switch (fileType) {
      case 'image':
        return 'image/*'
      case 'video':
        return 'video/*'
      case 'audio':
        return 'audio/*'
      case 'document':
        return '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt'
      default:
        return '*'
    }
  }

  const validateFile = (file: File): { isValid: boolean; error?: string } => {
    // Check file size
    const sizeValidation = validateFileSize(file, maxSize)
    if (!sizeValidation.isValid) {
      return sizeValidation
    }

    // Check file type
    if (fileType !== 'any') {
      const fileTypeConfig = FILE_TYPES[fileType.toUpperCase() as keyof typeof FILE_TYPES]
      if (fileTypeConfig) {
        const typeValidation = validateFileType(file, [...fileTypeConfig.extensions])
        if (!typeValidation.isValid) {
          return typeValidation
        }
      }
    }

    return { isValid: true }
  }

  const uploadFile = async (file: File) => {
    const validation = validateFile(file)
    if (!validation.isValid) {
      onError(validation.error!)
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const result = await response.json()
      onUpload(result.url, result.fileName)
      setUploadProgress(100)
    } catch (error) {
      onError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    if (!multiple && fileArray.length > 1) {
      onError('Only one file can be uploaded')
      return
    }

    fileArray.forEach(uploadFile)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${dragActive ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={getAcceptTypes()}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          disabled={disabled}
        />

        <div className="space-y-2">
          <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
          <div className="text-sm text-gray-600">
            <span className="font-medium text-primary-600 hover:text-primary-500">
              Click to upload
            </span>{' '}
            or drag and drop
          </div>
          <p className="text-xs text-gray-500">
            {fileType === 'any' ? 'Any file type' : `${fileType.toUpperCase()} files`} up to {maxSize / (1024 * 1024)}MB
          </p>
        </div>

        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Uploading...</p>
              {uploadProgress > 0 && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Specialized upload components
export const ImageUpload = (props: Omit<FileUploadProps, 'fileType'>) => (
  <FileUpload {...props} fileType="image" maxSize={10 * 1024 * 1024} />
)

export const VideoUpload = (props: Omit<FileUploadProps, 'fileType'>) => (
  <FileUpload {...props} fileType="video" maxSize={500 * 1024 * 1024} />
)

export const DocumentUpload = (props: Omit<FileUploadProps, 'fileType'>) => (
  <FileUpload {...props} fileType="document" maxSize={50 * 1024 * 1024} />
)

export const AudioUpload = (props: Omit<FileUploadProps, 'fileType'>) => (
  <FileUpload {...props} fileType="audio" maxSize={100 * 1024 * 1024} />
)
