import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  errorFormat: 'pretty',
  // Connection pool configuration
  __internal: {
    engine: {
      connectTimeout: 60000,
      queryTimeout: 60000,
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Graceful shutdown with better error handling
const gracefulShutdown = async () => {
  try {
    await prisma.$disconnect()
    console.log('Prisma client disconnected gracefully')
  } catch (error) {
    console.error('Error during Prisma disconnect:', error)
  }
}

// Remove existing listeners to prevent memory leaks
process.removeAllListeners('beforeExit')
process.removeAllListeners('SIGINT')
process.removeAllListeners('SIGTERM')

process.on('beforeExit', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)
process.on('SIGTERM', gracefulShutdown)
