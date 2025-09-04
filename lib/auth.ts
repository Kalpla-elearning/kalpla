import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import GitHubProvider from 'next-auth/providers/github'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  // Use PrismaAdapter for OAuth providers, but handle credentials manually
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          }
        })

        if (!user) {
          return null
        }

        // Check if user has a password (not an OAuth user)
        if (!user.password) {
          return null // OAuth users can't sign in with credentials
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    })
  ],
  session: {
    strategy: 'database' // Use database strategy with PrismaAdapter
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Allow OAuth sign-ins
      if (account?.provider === 'google' || account?.provider === 'github') {
        return true
      }
      // Allow credentials sign-ins
      if (account?.provider === 'credentials') {
        return true
      }
      return false
    },
    async session({ session, user }) {
      // Add user role to session
      if (user) {
        session.user.id = user.id
        session.user.role = (user as any).role || 'STUDENT'
        session.user.image = (user as any).image
      }
      return session
    },
    async jwt({ token, user, account }) {
      // For credentials provider, add role to token
      if (user && account?.provider === 'credentials') {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    }
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
