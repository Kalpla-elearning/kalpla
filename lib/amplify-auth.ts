import { getCurrentUser, signIn, signUp, signOut, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { client } from './amplify-config';
import type { Schema } from '../amplify/data/resource';

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar?: string;
  phone?: string;
  bio?: string;
  points?: number;
  level?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export class AmplifyAuthService {
  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const user = await getCurrentUser();
      
      // Get user data from our database
      const { data: userData } = await client.models.User.list({
        filter: { email: { eq: user.signInDetails?.loginId } }
      });
      
      if (userData && userData.length > 0) {
        return userData[0] as AuthUser;
      }
      
      // If user doesn't exist in our database, create them
      const { data: newUser } = await client.models.User.create({
        email: user.signInDetails?.loginId || '',
        name: user.username,
        role: 'STUDENT',
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      return newUser as AuthUser;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  static async signIn({ email, password }: { email: string; password: string }) {
    try {
      const result = await signIn({
        username: email,
        password,
      });

      if (result.isSignedIn) {
        const user = await this.getCurrentUser();
        return {
          success: true,
          user,
        };
      }

      return {
        success: false,
        error: 'Sign in failed',
      };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return {
        success: false,
        error: error.message || 'Sign in failed',
      };
    }
  }

  static async signUp({ email, password, name }: { email: string; password: string; name: string }) {
    try {
      const result = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
            name,
          },
        },
      });

      return {
        success: true,
        userId: result.userId,
      };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return {
        success: false,
        error: error.message || 'Sign up failed',
      };
    }
  }

  static async signOut() {
    try {
      await signOut();
      return {
        success: true,
      };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return {
        success: false,
        error: error.message || 'Sign out failed',
      };
    }
  }

  static async confirmSignUp(email: string, code: string) {
    try {
      await confirmSignUp({
        username: email,
        confirmationCode: code,
      });

      return {
        success: true,
      };
    } catch (error: any) {
      console.error('Confirm sign up error:', error);
      return {
        success: false,
        error: error.message || 'Confirmation failed',
      };
    }
  }

  static async resendVerificationCode(email: string) {
    try {
      await resendSignUpCode({
        username: email,
      });

      return {
        success: true,
      };
    } catch (error: any) {
      console.error('Resend verification code error:', error);
      return {
        success: false,
        error: error.message || 'Failed to resend verification code',
      };
    }
  }
}