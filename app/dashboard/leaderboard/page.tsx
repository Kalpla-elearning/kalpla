'use client'

import { useState, useEffect } from 'react'
import { 
  TrophyIcon, 
  StarIcon, 
  FireIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  AcademicCapIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  MinusIcon,
  SparklesIcon,
  BoltIcon,
  HeartIcon
} from '@heroicons/react/24/outline'
import { leaderboardSystem, LeaderboardEntry, Badge, Level } from '@/lib/leaderboard-system'

interface LeaderboardStats {
  totalStudents: number
  averagePoints: number
  topPerformer: string
  mostActiveCohort: string
  totalPointsAwarded: number
}

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [stats, setStats] = useState<LeaderboardStats | null>(null)
  const [timeframe, setTimeframe] = useState<'all' | 'weekly' | 'monthly'>('all')
  const [cohort, setCohort] = useState<'all' | string>('all')
  const [currentUser, setCurrentUser] = useState<LeaderboardEntry | null>(null)
  const [levels, setLevels] = useState<Level[]>([])
  const [badges, setBadges] = useState<Badge[]>([])

  useEffect(() => {
    // Mock data - in production, this would come from your API
    const mockLeaderboard: LeaderboardEntry[] = [
      {
        id: '1',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        cohort: 'Cohort 2024-01',
        currentPhase: 4,
        totalPoints: 285,
        rank: 1,
        previousRank: 2,
        badges: [
          { id: 'first_place', name: 'First Place', description: 'Achieved #1 rank', icon: '🥇', color: 'bg-gold-100 text-gold-800', earnedAt: '2024-01-20', category: 'special' },
          { id: 'speed_demon', name: 'Speed Demon', description: 'Completed 3 assignments in one day', icon: '⚡', color: 'bg-red-100 text-red-800', earnedAt: '2024-01-18', category: 'achievement' },
          { id: 'perfect_score', name: 'Perfectionist', description: 'Scored 100% on an assignment', icon: '⭐', color: 'bg-yellow-100 text-yellow-800', earnedAt: '2024-01-15', category: 'achievement' }
        ],
        weeklyPoints: 45,
        monthlyPoints: 180,
        completedAssignments: 8,
        totalAssignments: 8,
        lastActive: '2 hours ago',
        level: 5,
        experience: 1200,
        nextLevelExp: 800
      },
      {
        id: '2',
        name: 'Mike Chen',
        email: 'mike@example.com',
        cohort: 'Cohort 2024-01',
        currentPhase: 3,
        totalPoints: 265,
        rank: 2,
        previousRank: 1,
        badges: ['consistency', 'mentor-favorite'],
        weeklyPoints: 35,
        monthlyPoints: 165,
        completedAssignments: 7,
        totalAssignments: 8,
        lastActive: '1 hour ago'
      },
      {
        id: '3',
        name: 'Emily Rodriguez',
        email: 'emily@example.com',
        cohort: 'Cohort 2024-01',
        currentPhase: 3,
        totalPoints: 240,
        rank: 3,
        previousRank: 3,
        badges: ['creative-thinker'],
        weeklyPoints: 30,
        monthlyPoints: 140,
        completedAssignments: 6,
        totalAssignments: 8,
        lastActive: '30 minutes ago'
      },
      {
        id: '4',
        name: 'David Kim',
        email: 'david@example.com',
        cohort: 'Cohort 2024-01',
        currentPhase: 2,
        totalPoints: 195,
        rank: 4,
        previousRank: 5,
        badges: ['rising-star'],
        weeklyPoints: 25,
        monthlyPoints: 95,
        completedAssignments: 5,
        totalAssignments: 6,
        lastActive: '3 hours ago'
      },
      {
        id: '5',
        name: 'Lisa Wang',
        email: 'lisa@example.com',
        cohort: 'Cohort 2024-01',
        currentPhase: 2,
        totalPoints: 180,
        rank: 5,
        previousRank: 4,
        badges: ['team-player'],
        weeklyPoints: 20,
        monthlyPoints: 80,
        completedAssignments: 4,
        totalAssignments: 6,
        lastActive: '1 day ago'
      },
      {
        id: '6',
        name: 'Alex Thompson',
        email: 'alex@example.com',
        cohort: 'Cohort 2024-02',
        currentPhase: 1,
        totalPoints: 120,
        rank: 6,
        previousRank: 8,
        badges: ['newcomer'],
        weeklyPoints: 40,
        monthlyPoints: 120,
        completedAssignments: 3,
        totalAssignments: 4,
        lastActive: '4 hours ago'
      },
      {
        id: '7',
        name: 'Maria Garcia',
        email: 'maria@example.com',
        cohort: 'Cohort 2024-01',
        currentPhase: 2,
        totalPoints: 165,
        rank: 7,
        previousRank: 6,
        badges: ['persistent'],
        weeklyPoints: 15,
        monthlyPoints: 65,
        completedAssignments: 4,
        totalAssignments: 6,
        lastActive: '2 days ago'
      },
      {
        id: '8',
        name: 'James Wilson',
        email: 'james@example.com',
        cohort: 'Cohort 2024-02',
        currentPhase: 1,
        totalPoints: 95,
        rank: 8,
        previousRank: 7,
        badges: [],
        weeklyPoints: 10,
        monthlyPoints: 95,
        completedAssignments: 2,
        totalAssignments: 4,
        lastActive: '1 week ago'
      }
    ]

    const mockStats: LeaderboardStats = {
      totalStudents: 150,
      averagePoints: 145,
      topPerformer: 'Sarah Johnson',
      mostActiveCohort: 'Cohort 2024-01',
      totalPointsAwarded: 21750
    }

    setLeaderboard(mockLeaderboard)
    setStats(mockStats)
    setCurrentUser(mockLeaderboard[4]) // Lisa Wang as current user
    setLevels(leaderboardSystem.getLevels())
    setBadges(leaderboardSystem.getBadges())
  }, [])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <TrophyIcon className="h-6 w-6 text-yellow-500" />
      case 2:
        return <TrophyIcon className="h-6 w-6 text-gray-400" />
      case 3:
        return <TrophyIcon className="h-6 w-6 text-amber-600" />
      default:
        return <span className="text-lg font-bold text-gray-500">#{rank}</span>
    }
  }

  const getRankChange = (current: number, previous: number) => {
    if (current < previous) {
      return <ArrowUpIcon className="h-4 w-4 text-green-500" />
    } else if (current > previous) {
      return <ArrowDownIcon className="h-4 w-4 text-red-500" />
    } else {
      return <MinusIcon className="h-4 w-4 text-gray-400" />
    }
  }

  const getLevelInfo = (level: number) => {
    return levels.find(l => l.level === level) || levels[0]
  }

  const getLevelProgress = (experience: number, level: number) => {
    const currentLevel = getLevelInfo(level)
    const nextLevel = levels.find(l => l.level === level + 1)
    if (!nextLevel) return 100
    
    const progress = ((experience - currentLevel.requiredExp) / (nextLevel.requiredExp - currentLevel.requiredExp)) * 100
    return Math.min(100, Math.max(0, progress))
  }

  const filteredLeaderboard = leaderboard.filter(entry => {
    const matchesCohort = cohort === 'all' || entry.cohort === cohort
    return matchesCohort
  })

  const getPointsForTimeframe = (entry: LeaderboardEntry) => {
    switch (timeframe) {
      case 'weekly':
        return entry.weeklyPoints
      case 'monthly':
        return entry.monthlyPoints
      default:
        return entry.totalPoints
    }
  }

  const sortedLeaderboard = [...filteredLeaderboard].sort((a, b) => {
    const aPoints = getPointsForTimeframe(a)
    const bPoints = getPointsForTimeframe(b)
    return bPoints - aPoints
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Leaderboard</h1>
            <p className="mt-2 text-yellow-100">Compete with your peers and climb the ranks!</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">{stats?.totalStudents} Students</div>
            <div className="text-sm text-yellow-100">Total participants</div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-blue-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Points</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.averagePoints}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrophyIcon className="h-8 w-8 text-yellow-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Top Performer</p>
              <p className="text-lg font-bold text-gray-900">{stats?.topPerformer}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-green-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Most Active Cohort</p>
              <p className="text-lg font-bold text-gray-900">{stats?.mostActiveCohort}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <StarIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Points Awarded</p>
              <p className="text-2xl font-bold text-gray-900">{stats?.totalPointsAwarded?.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Timeframe</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-yellow-500 focus:border-yellow-500"
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value as any)}
            >
              <option value="all">All Time</option>
              <option value="weekly">This Week</option>
              <option value="monthly">This Month</option>
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Cohort</label>
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-yellow-500 focus:border-yellow-500"
              value={cohort}
              onChange={(e) => setCohort(e.target.value)}
            >
              <option value="all">All Cohorts</option>
              <option value="Cohort 2024-01">Cohort 2024-01</option>
              <option value="Cohort 2024-02">Cohort 2024-02</option>
            </select>
          </div>
        </div>
      </div>

      {/* Current User Card */}
      {currentUser && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-lg font-medium text-white">
                  {currentUser.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Ranking</h3>
                <p className="text-sm text-gray-600">{currentUser.name} • {currentUser.cohort}</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center">
                {getRankIcon(currentUser.rank)}
                <span className="ml-2 text-2xl font-bold text-gray-900">#{currentUser.rank}</span>
                {getRankChange(currentUser.rank, currentUser.previousRank)}
              </div>
              <p className="text-sm text-gray-600">{getPointsForTimeframe(currentUser)} points</p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {timeframe === 'all' ? 'All Time' : timeframe === 'weekly' ? 'This Week' : 'This Month'} Leaderboard
          </h3>
        </div>
        <div className="divide-y divide-gray-200">
          {sortedLeaderboard.map((entry, index) => (
            <div key={entry.id} className={`p-6 ${entry.id === currentUser?.id ? 'bg-blue-50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex items-center mr-6">
                    {getRankIcon(entry.rank)}
                    <span className="ml-2 text-lg font-bold text-gray-900">#{entry.rank}</span>
                    {getRankChange(entry.rank, entry.previousRank)}
                  </div>
                  
                  <div className="h-12 w-12 bg-gray-300 rounded-full flex items-center justify-center">
                    <span className="text-lg font-medium text-gray-700">
                      {entry.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  
                  <div className="ml-4">
                    <div className="flex items-center space-x-2">
                      <h4 className="text-lg font-medium text-gray-900">{entry.name}</h4>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLevelInfo(entry.level).color}`}>
                        Level {entry.level} - {getLevelInfo(entry.level).name}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{entry.cohort} • Phase {entry.currentPhase}</p>
                    <div className="flex items-center mt-1 space-x-4 text-xs text-gray-500">
                      <span>{entry.completedAssignments}/{entry.totalAssignments} assignments</span>
                      <span className="flex items-center">
                        <ClockIcon className="h-3 w-3 mr-1" />
                        {entry.lastActive}
                      </span>
                    </div>
                    {/* Level Progress Bar */}
                    <div className="mt-2">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Level Progress</span>
                        <span>{Math.round(getLevelProgress(entry.experience, entry.level))}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                          style={{ width: `${getLevelProgress(entry.experience, entry.level)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {getPointsForTimeframe(entry)}
                  </div>
                  <p className="text-sm text-gray-500">points</p>
                  
                  {entry.badges.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {entry.badges.slice(0, 3).map((badge) => (
                        <span
                          key={badge.id}
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
                          title={badge.description}
                        >
                          <span className="mr-1">{badge.icon}</span>
                          {badge.name}
                        </span>
                      ))}
                      {entry.badges.length > 3 && (
                        <span className="text-xs text-gray-500">+{entry.badges.length - 3} more</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Levels System */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Level System</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {levels.slice(0, 7).map((level) => (
              <div key={level.level} className={`text-center p-4 rounded-lg border-2 ${level.color}`}>
                <div className="text-2xl font-bold mb-1">Level {level.level}</div>
                <div className="font-medium text-gray-900 mb-2">{level.name}</div>
                <div className="text-xs text-gray-600 mb-2">{level.requiredExp} XP required</div>
                <div className="text-xs text-gray-500">
                  {level.benefits.slice(0, 2).map((benefit, index) => (
                    <div key={index}>• {benefit}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Badges Showcase */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Available Badges</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {badges.slice(0, 12).map((badge) => (
              <div key={badge.id} className="flex items-center p-3 border border-gray-200 rounded-lg">
                <div className="text-2xl mr-3">{badge.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{badge.name}</div>
                  <div className="text-sm text-gray-600">{badge.description}</div>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${badge.color}`}>
                    {badge.category.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
