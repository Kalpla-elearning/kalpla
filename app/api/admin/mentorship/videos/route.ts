import { NextRequest } from 'next/server'
import { 
  requireAuth, 
  successResponse, 
  errorResponse, 
  withErrorHandling
} from '@/lib/api-utils'
import { prisma } from '@/lib/prisma'

export const GET = withErrorHandling(async (request: NextRequest) => {
  // Check authentication - only admin can view all videos
  const authResult = await requireAuth(['ADMIN'])
  if ('error' in authResult) {
    return errorResponse(authResult.error, authResult.status)
  }

  try {
    // For now, return mock data since we don't have a videos table yet
    // In a real implementation, you'd query a videos table
    const mockVideos = [
      {
        id: '1',
        fileName: 'intro-video-2024-09-02.mp4',
        originalName: 'Introduction to Startup Mentorship.mp4',
        url: 'https://kalpla-drive.s3.ap-south-1.amazonaws.com/mentorship-videos/intro-video-2024-09-02.mp4',
        size: 52428800, // 50MB
        uploadedBy: 'admin',
        uploadedAt: '2024-09-02T10:30:00Z'
      },
      {
        id: '2',
        fileName: 'phase1-lesson1-2024-09-02.mp4',
        originalName: 'Phase 1 - Lesson 1: Understanding Your Market.mp4',
        url: 'https://kalpla-drive.s3.ap-south-1.amazonaws.com/mentorship-videos/phase1-lesson1-2024-09-02.mp4',
        size: 104857600, // 100MB
        uploadedBy: 'admin',
        uploadedAt: '2024-09-02T11:15:00Z'
      },
      {
        id: '3',
        fileName: 'pitch-deck-workshop-2024-09-02.mp4',
        originalName: 'Pitch Deck Workshop.mp4',
        url: 'https://kalpla-drive.s3.ap-south-1.amazonaws.com/mentorship-videos/pitch-deck-workshop-2024-09-02.mp4',
        size: 78643200, // 75MB
        uploadedBy: 'admin',
        uploadedAt: '2024-09-02T14:20:00Z'
      }
    ]

    return successResponse(mockVideos)
  } catch (error: any) {
    console.error('Error fetching videos:', error)
    return errorResponse('Failed to fetch videos', 500)
  }
})
