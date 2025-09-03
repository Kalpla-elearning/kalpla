# OAuth Setup Guide for Google and GitHub Login

This guide will help you set up Google and GitHub OAuth authentication for your Kalpla eLearning Platform.

## 🔧 Prerequisites

- Google Cloud Console account
- GitHub account
- Access to your application's environment variables

## 📱 Google OAuth Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Select a project" → "New Project"
3. Enter project name: `Kalpla eLearning Platform`
4. Click "Create"

### Step 2: Enable Google+ API

1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google OAuth2 API"

### Step 3: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Set the name: `Kalpla eLearning Platform`
5. Add authorized redirect URIs:
   - For development: `http://localhost:3000/api/auth/callback/google`
   - For production: `https://yourdomain.com/api/auth/callback/google`
6. Click "Create"
7. Copy the **Client ID** and **Client Secret**

### Step 4: Configure Environment Variables

Add these to your `.env.local` file:

```env
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"
```

## 🐙 GitHub OAuth Setup

### Step 1: Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: `Kalpla eLearning Platform`
   - **Homepage URL**: 
     - Development: `http://localhost:3000`
     - Production: `https://yourdomain.com`
   - **Authorization callback URL**:
     - Development: `http://localhost:3000/api/auth/callback/github`
     - Production: `https://yourdomain.com/api/auth/callback/github`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

### Step 2: Configure Environment Variables

Add these to your `.env.local` file:

```env
GITHUB_ID="your-github-client-id-here"
GITHUB_SECRET="your-github-client-secret-here"
```

## 🔐 Complete Environment Variables

Your `.env.local` file should include all OAuth credentials:

```env
# Database - Neon PostgreSQL
DATABASE_URL="postgresql://neondb_owner:npg_EFRtiQy2xBr5@ep-red-math-a1if7t7d-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key-for-nextauth-jwt-encryption-2024"

# Email (Hostinger Mail)
EMAIL_SERVER_HOST="smtp.hostinger.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@example.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@example.com"

# AWS S3 Storage
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
AWS_S3_BUCKET_NAME="your-s3-bucket-name"

# Razorpay Payment Gateway
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="your-razorpay-key-id"

# JWT
JWT_SECRET="development-jwt-secret-key-2024"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Kalpla"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id-here"
GOOGLE_CLIENT_SECRET="your-google-client-secret-here"

# GitHub OAuth
GITHUB_ID="your-github-client-id-here"
GITHUB_SECRET="your-github-client-secret-here"
```

## 🧪 Testing OAuth Integration

### Test Google OAuth

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/auth/signin`
3. Click the "Google" button
4. Complete the Google OAuth flow
5. Verify you're redirected to the dashboard

### Test GitHub OAuth

1. On the same signin page
2. Click the "GitHub" button
3. Complete the GitHub OAuth flow
4. Verify you're redirected to the dashboard

## 🔍 Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**
   - Ensure the callback URL in your OAuth app matches exactly
   - Check for trailing slashes or HTTP vs HTTPS

2. **"Client ID not found" error**
   - Verify your environment variables are set correctly
   - Restart your development server after adding new env vars

3. **"Access denied" error**
   - Check if the OAuth app is properly configured
   - Ensure the app is not in development mode restrictions

4. **Database errors during OAuth sign-in**
   - Check if the Prisma schema includes all required fields
   - Verify database connection is working

### Debug Steps

1. Check browser console for errors
2. Check server logs for OAuth callback errors
3. Verify environment variables are loaded: `console.log(process.env.GOOGLE_CLIENT_ID)`
4. Test with a fresh browser session (incognito mode)

## 🚀 Production Deployment

### For Production

1. Update OAuth app settings with production URLs
2. Set production environment variables
3. Ensure HTTPS is enabled
4. Update `NEXTAUTH_URL` to your production domain

### Security Considerations

- Never commit OAuth secrets to version control
- Use environment variables for all sensitive data
- Regularly rotate OAuth client secrets
- Monitor OAuth usage and access logs

## 📊 OAuth User Flow

1. User clicks "Sign in with Google/GitHub"
2. Redirected to OAuth provider
3. User authorizes the application
4. OAuth provider redirects back with authorization code
5. NextAuth exchanges code for access token
6. User profile is fetched from OAuth provider
7. User is created/updated in database
8. JWT session is created
9. User is redirected to dashboard

## 🎯 Features Enabled

With OAuth integration, users can:

- ✅ Sign in with Google account
- ✅ Sign in with GitHub account
- ✅ Automatic account creation
- ✅ Profile information sync
- ✅ Seamless authentication flow
- ✅ Role-based access control
- ✅ Session management

## 📞 Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify all environment variables are set
3. Test with a fresh browser session
4. Check server logs for detailed error messages

Your OAuth integration is now ready! 🎉
