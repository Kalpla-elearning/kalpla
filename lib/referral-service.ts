import { prisma } from './prisma'

export interface ReferralData {
  referrerId: string
  refereeId: string
  referralCode: string
  metadata?: any
}

export interface ReferralCodeData {
  userId: string
  code: string
  maxUses?: number
  discount?: number
  reward?: number
  expiresAt?: Date
}

export interface ReferralStats {
  totalReferrals: number
  successfulReferrals: number
  totalEarnings: number
  conversionRate: number
  rank?: number
}

export class ReferralService {
  // Generate a unique referral code
  static generateReferralCode(userId: string, prefix?: string): string {
    const timestamp = Date.now().toString(36)
    const random = Math.random().toString(36).substring(2, 8)
    const prefixCode = prefix || 'KALP'
    return `${prefixCode}${timestamp}${random}`.toUpperCase()
  }

  // Create a referral code for a user
  static async createReferralCode(data: ReferralCodeData) {
    try {
      const referralCode = await prisma.referralCode.create({
        data: {
          code: data.code,
          userId: data.userId,
          maxUses: data.maxUses,
          discount: data.discount,
          reward: data.reward,
          expiresAt: data.expiresAt,
        },
      })

      return { success: true, referralCode }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Get or create referral code for user
  static async getOrCreateReferralCode(userId: string) {
    try {
      // Check if user already has an active referral code
      let referralCode = await prisma.referralCode.findFirst({
        where: {
          userId,
          isActive: true,
        },
      })

      if (!referralCode) {
        // Generate new referral code
        const code = this.generateReferralCode(userId)
        const result = await this.createReferralCode({
          userId,
          code,
          maxUses: null, // Unlimited uses
          discount: 10, // 10% discount for referee
          reward: 500, // ₹500 reward for referrer
        })

        if (!result.success) {
          return { success: false, error: result.error }
        }

        referralCode = result.referralCode
      }

      return { success: true, referralCode }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Process a referral
  static async processReferral(data: ReferralData) {
    try {
      // Find the referral code
      const referralCode = await prisma.referralCode.findUnique({
        where: { code: data.referralCode },
        include: { user: true },
      })

      if (!referralCode) {
        return { success: false, error: 'Invalid referral code' }
      }

      if (!referralCode.isActive) {
        return { success: false, error: 'Referral code is not active' }
      }

      if (referralCode.expiresAt && referralCode.expiresAt < new Date()) {
        return { success: false, error: 'Referral code has expired' }
      }

      if (referralCode.maxUses && referralCode.currentUses >= referralCode.maxUses) {
        return { success: false, error: 'Referral code has reached maximum uses' }
      }

      // Check if user is trying to refer themselves
      if (data.referrerId === data.refereeId) {
        return { success: false, error: 'Cannot refer yourself' }
      }

      // Check if referral already exists
      const existingReferral = await prisma.referral.findFirst({
        where: {
          referrerId: data.referrerId,
          refereeId: data.refereeId,
        },
      })

      if (existingReferral) {
        return { success: false, error: 'Referral already exists' }
      }

      // Create the referral
      const referral = await prisma.referral.create({
        data: {
          referrerId: data.referrerId,
          refereeId: data.refereeId,
          referralCodeId: referralCode.id,
          metadata: data.metadata,
        },
      })

      // Update referral code usage
      await prisma.referralCode.update({
        where: { id: referralCode.id },
        data: { currentUses: { increment: 1 } },
      })

      return { success: true, referral }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Complete a referral (when referee makes a purchase)
  static async completeReferral(referralId: string, purchaseAmount: number) {
    try {
      const referral = await prisma.referral.findUnique({
        where: { id: referralId },
        include: { referralCode: true },
      })

      if (!referral) {
        return { success: false, error: 'Referral not found' }
      }

      if (referral.status !== 'PENDING') {
        return { success: false, error: 'Referral already processed' }
      }

      // Calculate rewards
      const rewardAmount = referral.referralCode.reward || 0
      const discountAmount = referral.referralCode.discount 
        ? (purchaseAmount * referral.referralCode.discount) / 100 
        : 0

      // Update referral status
      const updatedReferral = await prisma.referral.update({
        where: { id: referralId },
        data: {
          status: 'COMPLETED',
          rewardAmount,
          discountAmount,
          completedAt: new Date(),
        },
      })

      // Create reward record
      if (rewardAmount > 0) {
        await prisma.referralReward.create({
          data: {
            referralId: referralId,
            referralCodeId: referral.referralCodeId,
            userId: referral.referrerId,
            amount: rewardAmount,
            type: 'CASH',
            status: 'PENDING',
            description: `Referral reward for ${referral.refereeId}`,
          },
        })
      }

      // Update user stats
      await this.updateUserReferralStats(referral.referrerId)

      return { success: true, referral: updatedReferral }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Get referral stats for a user
  static async getUserReferralStats(userId: string): Promise<ReferralStats> {
    try {
      const stats = await prisma.referral.aggregate({
        where: { referrerId: userId },
        _count: { id: true },
        _sum: { rewardAmount: true },
      })

      const successfulStats = await prisma.referral.aggregate({
        where: { 
          referrerId: userId,
          status: 'COMPLETED',
        },
        _count: { id: true },
      })

      const totalReferrals = stats._count.id
      const successfulReferrals = successfulStats._count.id
      const totalEarnings = stats._sum.rewardAmount || 0
      const conversionRate = totalReferrals > 0 ? (successfulReferrals / totalReferrals) * 100 : 0

      return {
        totalReferrals,
        successfulReferrals,
        totalEarnings,
        conversionRate,
      }
    } catch (error: any) {
      console.error('Error getting referral stats:', error)
      return {
        totalReferrals: 0,
        successfulReferrals: 0,
        totalEarnings: 0,
        conversionRate: 0,
      }
    }
  }

  // Update user referral stats
  static async updateUserReferralStats(userId: string) {
    try {
      const stats = await this.getUserReferralStats(userId)
      
      await prisma.user.update({
        where: { id: userId },
        data: {
          totalReferrals: stats.totalReferrals,
          successfulReferrals: stats.successfulReferrals,
          totalEarnings: stats.totalEarnings,
        },
      })
    } catch (error: any) {
      console.error('Error updating user referral stats:', error)
    }
  }

  // Get referral leaderboard
  static async getReferralLeaderboard(limit: number = 10) {
    try {
      const leaderboard = await prisma.user.findMany({
        where: {
          totalReferrals: { gt: 0 },
        },
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
          totalReferrals: true,
          successfulReferrals: true,
          totalEarnings: true,
        },
        orderBy: [
          { successfulReferrals: 'desc' },
          { totalEarnings: 'desc' },
        ],
        take: limit,
      })

      // Add rank to each user
      const leaderboardWithRank = leaderboard.map((user, index) => ({
        ...user,
        rank: index + 1,
      }))

      return { success: true, leaderboard: leaderboardWithRank }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Get user's referral history
  static async getUserReferralHistory(userId: string, limit: number = 20) {
    try {
      const referrals = await prisma.referral.findMany({
        where: { referrerId: userId },
        include: {
          referee: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true,
            },
          },
          referralCode: {
            select: {
              code: true,
              discount: true,
              reward: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      })

      return { success: true, referrals }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Validate referral code
  static async validateReferralCode(code: string) {
    try {
      const referralCode = await prisma.referralCode.findUnique({
        where: { code },
        include: { user: true },
      })

      if (!referralCode) {
        return { success: false, error: 'Invalid referral code' }
      }

      if (!referralCode.isActive) {
        return { success: false, error: 'Referral code is not active' }
      }

      if (referralCode.expiresAt && referralCode.expiresAt < new Date()) {
        return { success: false, error: 'Referral code has expired' }
      }

      if (referralCode.maxUses && referralCode.currentUses >= referralCode.maxUses) {
        return { success: false, error: 'Referral code has reached maximum uses' }
      }

      return { 
        success: true, 
        referralCode: {
          code: referralCode.code,
          discount: referralCode.discount,
          reward: referralCode.reward,
          referrerName: referralCode.user.name,
        }
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  // Get referral analytics
  static async getReferralAnalytics(startDate: Date, endDate: Date) {
    try {
      const analytics = await prisma.referral.aggregate({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
        _count: { id: true },
        _sum: { 
          rewardAmount: true,
          discountAmount: true,
        },
      })

      const successfulReferrals = await prisma.referral.count({
        where: {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
          status: 'COMPLETED',
        },
      })

      const totalReferrals = analytics._count.id
      const conversionRate = totalReferrals > 0 ? (successfulReferrals / totalReferrals) * 100 : 0

      return {
        success: true,
        analytics: {
          totalReferrals,
          successfulReferrals,
          conversionRate,
          totalRewards: analytics._sum.rewardAmount || 0,
          totalDiscounts: analytics._sum.discountAmount || 0,
        },
      }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }
}

export default ReferralService
