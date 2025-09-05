export interface LeaderboardEntry {
  id: string
  name: string
  email: string
  cohort: string
  currentPhase: number
  totalPoints: number
  rank: number
  previousRank: number
  avatar?: string
  badges: Badge[]
  weeklyPoints: number
  monthlyPoints: number
  completedAssignments: number
  totalAssignments: number
  lastActive: string
  level: number
  experience: number
  nextLevelExp: number
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  color: string
  earnedAt: string
  category: 'achievement' | 'milestone' | 'special' | 'social'
}

export interface Level {
  level: number
  name: string
  requiredExp: number
  benefits: string[]
  color: string
}

export interface PointsRule {
  id: string
  name: string
  description: string
  points: number
  category: 'assignment' | 'bonus' | 'social' | 'milestone'
  conditions: string[]
  multiplier?: number
}

export class LeaderboardSystem {
  private static instance: LeaderboardSystem
  private pointsRules: PointsRule[] = []
  private badges: Badge[] = []
  private levels: Level[] = []

  constructor() {
    this.initializePointsRules()
    this.initializeBadges()
    this.initializeLevels()
  }

  static getInstance(): LeaderboardSystem {
    if (!LeaderboardSystem.instance) {
      LeaderboardSystem.instance = new LeaderboardSystem()
    }
    return LeaderboardSystem.instance
  }

  private initializePointsRules(): void {
    this.pointsRules = [
      // Assignment Points
      {
        id: 'assignment_submit',
        name: 'Assignment Submission',
        description: 'Points for submitting an assignment',
        points: 10,
        category: 'assignment',
        conditions: ['assignment_submitted']
      },
      {
        id: 'assignment_early',
        name: 'Early Submission Bonus',
        description: 'Bonus points for submitting before deadline',
        points: 5,
        category: 'bonus',
        conditions: ['assignment_submitted_early'],
        multiplier: 1.5
      },
      {
        id: 'assignment_perfect',
        name: 'Perfect Score',
        description: 'Bonus points for perfect assignment score',
        points: 20,
        category: 'bonus',
        conditions: ['assignment_perfect_score']
      },
      {
        id: 'assignment_grade_90',
        name: 'High Grade (90%+)',
        description: 'Points for scoring 90% or higher',
        points: 15,
        category: 'assignment',
        conditions: ['assignment_grade_90_plus']
      },
      {
        id: 'assignment_grade_80',
        name: 'Good Grade (80%+)',
        description: 'Points for scoring 80% or higher',
        points: 10,
        category: 'assignment',
        conditions: ['assignment_grade_80_plus']
      },
      {
        id: 'assignment_grade_70',
        name: 'Passing Grade (70%+)',
        description: 'Points for scoring 70% or higher',
        points: 5,
        category: 'assignment',
        conditions: ['assignment_grade_70_plus']
      },

      // Milestone Points
      {
        id: 'phase_complete',
        name: 'Phase Completion',
        description: 'Points for completing a phase',
        points: 50,
        category: 'milestone',
        conditions: ['phase_completed']
      },
      {
        id: 'module_complete',
        name: 'Module Completion',
        description: 'Points for completing a module',
        points: 25,
        category: 'milestone',
        conditions: ['module_completed']
      },
      {
        id: 'video_watch',
        name: 'Video Watched',
        description: 'Points for watching a video',
        points: 5,
        category: 'milestone',
        conditions: ['video_watched']
      },

      // Social Points
      {
        id: 'peer_review',
        name: 'Peer Review',
        description: 'Points for reviewing peer assignments',
        points: 10,
        category: 'social',
        conditions: ['peer_review_submitted']
      },
      {
        id: 'forum_participation',
        name: 'Forum Participation',
        description: 'Points for active forum participation',
        points: 5,
        category: 'social',
        conditions: ['forum_post_created']
      },
      {
        id: 'mentor_feedback',
        name: 'Mentor Feedback',
        description: 'Points for providing mentor feedback',
        points: 15,
        category: 'social',
        conditions: ['mentor_feedback_provided']
      },

      // Streak Points
      {
        id: 'daily_login',
        name: 'Daily Login',
        description: 'Points for daily platform login',
        points: 2,
        category: 'bonus',
        conditions: ['daily_login']
      },
      {
        id: 'weekly_streak',
        name: 'Weekly Streak',
        description: 'Bonus points for weekly activity streak',
        points: 25,
        category: 'bonus',
        conditions: ['weekly_streak_maintained']
      },
      {
        id: 'monthly_streak',
        name: 'Monthly Streak',
        description: 'Bonus points for monthly activity streak',
        points: 100,
        category: 'bonus',
        conditions: ['monthly_streak_maintained']
      }
    ]
  }

  private initializeBadges(): void {
    this.badges = [
      // Achievement Badges
      {
        id: 'first_assignment',
        name: 'Quick Starter',
        description: 'Submitted your first assignment',
        icon: '🚀',
        color: 'bg-green-100 text-green-800',
        earnedAt: '',
        category: 'achievement'
      },
      {
        id: 'perfect_score',
        name: 'Perfectionist',
        description: 'Scored 100% on an assignment',
        icon: '⭐',
        color: 'bg-yellow-100 text-yellow-800',
        earnedAt: '',
        category: 'achievement'
      },
      {
        id: 'early_bird',
        name: 'Early Bird',
        description: 'Submitted 5 assignments early',
        icon: '🐦',
        color: 'bg-blue-100 text-blue-800',
        earnedAt: '',
        category: 'achievement'
      },
      {
        id: 'speed_demon',
        name: 'Speed Demon',
        description: 'Completed 3 assignments in one day',
        icon: '⚡',
        color: 'bg-red-100 text-red-800',
        earnedAt: '',
        category: 'achievement'
      },

      // Milestone Badges
      {
        id: 'phase_1_complete',
        name: 'Foundation Master',
        description: 'Completed Phase 1: Foundation & Mindset',
        icon: '🏗️',
        color: 'bg-purple-100 text-purple-800',
        earnedAt: '',
        category: 'milestone'
      },
      {
        id: 'phase_3_complete',
        name: 'Business Strategist',
        description: 'Completed Phase 3: Business Model & Strategy',
        icon: '📊',
        color: 'bg-indigo-100 text-indigo-800',
        earnedAt: '',
        category: 'milestone'
      },
      {
        id: 'phase_6_complete',
        name: 'Funding Expert',
        description: 'Completed Phase 6: Funding & Investment',
        icon: '💰',
        color: 'bg-green-100 text-green-800',
        earnedAt: '',
        category: 'milestone'
      },
      {
        id: 'phase_12_complete',
        name: 'Startup Graduate',
        description: 'Completed all 12 phases of the program',
        icon: '🎓',
        color: 'bg-gold-100 text-gold-800',
        earnedAt: '',
        category: 'milestone'
      },

      // Social Badges
      {
        id: 'helpful_peer',
        name: 'Helpful Peer',
        description: 'Provided 10 helpful peer reviews',
        icon: '🤝',
        color: 'bg-teal-100 text-teal-800',
        earnedAt: '',
        category: 'social'
      },
      {
        id: 'forum_champion',
        name: 'Forum Champion',
        description: 'Active in forum discussions',
        icon: '💬',
        color: 'bg-pink-100 text-pink-800',
        earnedAt: '',
        category: 'social'
      },
      {
        id: 'mentor_favorite',
        name: 'Mentor Favorite',
        description: 'Recognized by mentors for excellence',
        icon: '👨‍🏫',
        color: 'bg-orange-100 text-orange-800',
        earnedAt: '',
        category: 'social'
      },

      // Special Badges
      {
        id: 'top_performer',
        name: 'Top Performer',
        description: 'Reached top 3 in leaderboard',
        icon: '🏆',
        color: 'bg-yellow-100 text-yellow-800',
        earnedAt: '',
        category: 'special'
      },
      {
        id: 'consistency_king',
        name: 'Consistency King',
        description: 'Maintained 30-day activity streak',
        icon: '🔥',
        color: 'bg-red-100 text-red-800',
        earnedAt: '',
        category: 'special'
      },
      {
        id: 'first_place',
        name: 'First Place',
        description: 'Achieved #1 rank in leaderboard',
        icon: '🥇',
        color: 'bg-gold-100 text-gold-800',
        earnedAt: '',
        category: 'special'
      }
    ]
  }

  private initializeLevels(): void {
    this.levels = [
      {
        level: 1,
        name: 'Novice',
        requiredExp: 0,
        benefits: ['Basic platform access', 'Assignment submissions'],
        color: 'bg-gray-100 text-gray-800'
      },
      {
        level: 2,
        name: 'Apprentice',
        requiredExp: 100,
        benefits: ['Forum access', 'Peer reviews'],
        color: 'bg-blue-100 text-blue-800'
      },
      {
        level: 3,
        name: 'Learner',
        requiredExp: 250,
        benefits: ['Mentor access', 'Advanced assignments'],
        color: 'bg-green-100 text-green-800'
      },
      {
        level: 4,
        name: 'Practitioner',
        requiredExp: 500,
        benefits: ['Live classes', 'Group projects'],
        color: 'bg-purple-100 text-purple-800'
      },
      {
        level: 5,
        name: 'Expert',
        requiredExp: 1000,
        benefits: ['Investor access', 'Mentoring opportunities'],
        color: 'bg-orange-100 text-orange-800'
      },
      {
        level: 6,
        name: 'Master',
        requiredExp: 2000,
        benefits: ['Premium features', 'Exclusive events'],
        color: 'bg-red-100 text-red-800'
      },
      {
        level: 7,
        name: 'Grandmaster',
        requiredExp: 5000,
        benefits: ['All features', 'Platform ambassador'],
        color: 'bg-gold-100 text-gold-800'
      }
    ]
  }

  calculatePoints(action: string, context: any): number {
    const rule = this.pointsRules.find(r => r.conditions.includes(action))
    if (!rule) return 0

    let points = rule.points

    // Apply multiplier if conditions are met
    if (rule.multiplier && this.checkMultiplierConditions(rule, context)) {
      points *= rule.multiplier
    }

    return Math.round(points)
  }

  private checkMultiplierConditions(rule: PointsRule, context: any): boolean {
    // Check if multiplier conditions are met
    // This would be implemented based on specific business logic
    return true
  }

  calculateLevel(experience: number): Level {
    const level = this.levels
      .slice()
      .reverse()
      .find(l => experience >= l.requiredExp)
    
    return level || this.levels[0]
  }

  getNextLevel(currentLevel: number): Level | null {
    return this.levels.find(l => l.level === currentLevel + 1) || null
  }

  getExperienceToNextLevel(currentExp: number, currentLevel: number): number {
    const nextLevel = this.getNextLevel(currentLevel)
    if (!nextLevel) return 0
    return nextLevel.requiredExp - currentExp
  }

  checkBadgeEligibility(user: LeaderboardEntry, action: string, context: any): Badge[] {
    const eligibleBadges: Badge[] = []

    // Check each badge for eligibility
    this.badges.forEach(badge => {
      if (this.isBadgeEligible(badge, user, action, context)) {
        eligibleBadges.push({
          ...badge,
          earnedAt: new Date().toISOString()
        })
      }
    })

    return eligibleBadges
  }

  private isBadgeEligible(badge: Badge, user: LeaderboardEntry, action: string, context: any): boolean {
    // Implement badge eligibility logic based on user stats and actions
    switch (badge.id) {
      case 'first_assignment':
        return user.completedAssignments >= 1
      case 'perfect_score':
        return context.hasPerfectScore || false
      case 'early_bird':
        return context.earlySubmissions >= 5
      case 'speed_demon':
        return context.assignmentsInOneDay >= 3
      case 'phase_1_complete':
        return user.currentPhase >= 2
      case 'phase_3_complete':
        return user.currentPhase >= 4
      case 'phase_6_complete':
        return user.currentPhase >= 7
      case 'phase_12_complete':
        return user.currentPhase >= 12
      case 'top_performer':
        return user.rank <= 3
      case 'first_place':
        return user.rank === 1
      case 'consistency_king':
        return context.streakDays >= 30
      default:
        return false
    }
  }

  updateLeaderboard(entries: LeaderboardEntry[]): LeaderboardEntry[] {
    // Sort by total points (descending)
    const sorted = entries.sort((a, b) => b.totalPoints - a.totalPoints)
    
    // Update ranks
    return sorted.map((entry, index) => ({
      ...entry,
      rank: index + 1,
      previousRank: entry.rank || index + 1
    }))
  }

  getLeaderboardStats(entries: LeaderboardEntry[]): {
    totalStudents: number
    averagePoints: number
    topPerformer: string
    mostActiveCohort: string
    totalPointsAwarded: number
  } {
    const totalStudents = entries.length
    const averagePoints = entries.reduce((sum, entry) => sum + entry.totalPoints, 0) / totalStudents
    const topPerformer = entries[0]?.name || 'N/A'
    const mostActiveCohort = this.getMostActiveCohort(entries)
    const totalPointsAwarded = entries.reduce((sum, entry) => sum + entry.totalPoints, 0)

    return {
      totalStudents,
      averagePoints: Math.round(averagePoints),
      topPerformer,
      mostActiveCohort,
      totalPointsAwarded
    }
  }

  private getMostActiveCohort(entries: LeaderboardEntry[]): string {
    const cohortCounts = entries.reduce((acc, entry) => {
      acc[entry.cohort] = (acc[entry.cohort] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return Object.entries(cohortCounts)
      .sort(([,a], [,b]) => b - a)[0]?.[0] || 'N/A'
  }

  getPointsRules(): PointsRule[] {
    return this.pointsRules
  }

  getBadges(): Badge[] {
    return this.badges
  }

  getLevels(): Level[] {
    return this.levels
  }
}

// Export singleton instance
export const leaderboardSystem = LeaderboardSystem.getInstance()
