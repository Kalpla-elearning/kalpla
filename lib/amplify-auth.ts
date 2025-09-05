import { Amplify } from 'aws-amplify'
import { getCurrentUser, signIn, signUp, signOut, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth'
import { fetchAuthSession } from 'aws-amplify/auth'

// Configure Amplify
const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_ID || '',
      userPoolClientId: process.env.NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_WEB_CLIENT_ID || '',
      loginWith: {
        email: true,
        oauth: {
          domain: process.env.NEXT_PUBLIC_AMPLIFY_AUTH_DOMAIN || '',
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [process.env.NEXT_PUBLIC_AMPLIFY_AUTH_REDIRECT_SIGN_IN || 'http://localhost:3000/auth/callback'],
          redirectSignOut: [process.env.NEXT_PUBLIC_AMPLIFY_AUTH_REDIRECT_SIGN_OUT || 'http://localhost:3000'],
          responseType: 'code',
        },
      },
    },
  },
}

// Only configure Amplify on the client side
if (typeof window !== 'undefined') {
  Amplify.configure(amplifyConfig)
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
  avatar?: string
}

export interface SignUpData {
  email: string
  password: string
  name: string
}

export interface SignInData {
  email: string
  password: string
}

export class AmplifyAuthService {
  // Sign up a new user
  static async signUp(data: SignUpData) {
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: data.email,
        password: data.password,
        options: {
          userAttributes: {
            email: data.email,
            name: data.name,
          },
        },
      })

      return {
        success: true,
        userId,
        isSignUpComplete,
        nextStep,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign up failed',
      }
    }
  }

  // Confirm sign up with verification code
  static async confirmSignUp(email: string, code: string) {
    try {
      const { isSignUpComplete } = await confirmSignUp({
        username: email,
        confirmationCode: code,
      })

      return {
        success: true,
        isSignUpComplete,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Confirmation failed',
      }
    }
  }

  // Resend verification code
  static async resendVerificationCode(email: string) {
    try {
      await resendSignUpCode({
        username: email,
      })

      return {
        success: true,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to resend code',
      }
    }
  }

  // Sign in user
  static async signIn(data: SignInData) {
    try {
      const { isSignedIn, nextStep } = await signIn({
        username: data.email,
        password: data.password,
      })

      if (isSignedIn) {
        const user = await this.getCurrentUser()
        return {
          success: true,
          user,
        }
      }

      return {
        success: false,
        error: 'Sign in failed',
        nextStep,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign in failed',
      }
    }
  }

  // Get current user
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const user = await getCurrentUser()
      const session = await fetchAuthSession()
      
      return {
        id: user.userId,
        email: user.signInDetails?.loginId || '',
        name: user.signInDetails?.loginId || '',
        role: 'STUDENT', // Default role, can be enhanced later
        avatar: undefined,
      }
    } catch (error) {
      return null
    }
  }

  // Sign out user
  static async signOut() {
    try {
      await signOut()
      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Sign out failed',
      }
    }
  }

  // Check if user is authenticated
  static async isAuthenticated(): Promise<boolean> {
    try {
      await getCurrentUser()
      return true
    } catch (error) {
      return false
    }
  }

  // Get user session
  static async getSession() {
    try {
      const session = await fetchAuthSession()
      return session
    } catch (error) {
      return null
    }
  }
}

export default AmplifyAuthService
