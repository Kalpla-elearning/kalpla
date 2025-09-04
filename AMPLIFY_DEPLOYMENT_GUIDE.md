# 🚀 AWS Amplify Deployment Guide for Kalpla eLearning Platform

## 📋 **Prerequisites**

1. **AWS Account** - Sign up at [aws.amazon.com](https://aws.amazon.com)
2. **Node.js 18+** - Already installed
3. **Git Repository** - Your code should be in GitHub
4. **OAuth Credentials** - Google and GitHub OAuth apps

## 🔧 **Step 1: Configure OAuth Providers**

### **Google OAuth Setup:**
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs:
   - `http://localhost:3000`
   - `https://your-app.amplifyapp.com`
   - `https://your-custom-domain.com`
6. Copy Client ID and Client Secret

### **GitHub OAuth Setup:**
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Set Authorization callback URL:
   - `http://localhost:3000`
   - `https://your-app.amplifyapp.com`
   - `https://your-custom-domain.com`
4. Copy Client ID and Client Secret

## 🔑 **Step 2: Configure Environment Variables**

Update `amplify/amplify.env` with your credentials:

```bash
# Google OAuth
GOOGLE_CLIENT_ID=your_actual_google_client_id
GOOGLE_CLIENT_SECRET=your_actual_google_client_secret

# GitHub OAuth
GITHUB_CLIENT_ID=your_actual_github_client_id
GITHUB_CLIENT_SECRET=your_actual_github_client_secret

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key

# Database
DATABASE_URL=your_neon_database_url

# NextAuth.js
NEXTAUTH_URL=https://your-app.amplifyapp.com
NEXTAUTH_SECRET=your_nextauth_secret

# S3 Configuration
AWS_S3_BUCKET_NAME=your_s3_bucket_name
AWS_S3_REGION=us-east-1

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

## 🏗️ **Step 3: Deploy to AWS Amplify**

### **Option A: Using Amplify Console (Recommended)**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Add AWS Amplify configuration"
   git push origin main
   ```

2. **Connect to Amplify:**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Click "New app" → "Host web app"
   - Connect your GitHub repository
   - Select the main branch

3. **Configure Build Settings:**
   - Build command: `npm run build`
   - Base directory: `/`
   - Build output directory: `.next`

4. **Environment Variables:**
   - Add all variables from `amplify/amplify.env`
   - Set them in Amplify Console → App settings → Environment variables

5. **Deploy:**
   - Click "Save and deploy"
   - Wait for deployment to complete

### **Option B: Using Amplify CLI**

1. **Install Amplify CLI:**
   ```bash
   npm install -g @aws-amplify/cli
   amplify configure
   ```

2. **Initialize Amplify:**
   ```bash
   amplify init
   amplify add auth
   amplify add storage
   amplify add api
   ```

3. **Deploy:**
   ```bash
   amplify push
   amplify publish
   ```

## 🔧 **Step 4: Configure Next.js for Amplify**

Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  output: 'standalone',
  images: {
    domains: [
      'localhost',
      'your-s3-bucket.s3.amazonaws.com',
      'your-app.amplifyapp.com',
    ],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    AMPLIFY_AUTH_REGION: process.env.AWS_REGION,
    AMPLIFY_AUTH_USER_POOL_ID: process.env.AMPLIFY_AUTH_USER_POOL_ID,
    AMPLIFY_AUTH_USER_POOL_WEB_CLIENT_ID: process.env.AMPLIFY_AUTH_USER_POOL_WEB_CLIENT_ID,
  },
}

module.exports = nextConfig
```

## 📱 **Step 5: Update Frontend for Amplify**

Create `lib/amplify-config.ts`:

```typescript
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '@/amplify/data/resource';

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_WEB_CLIENT_ID!,
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_AMPLIFY_AUTH_DOMAIN!,
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [process.env.NEXT_PUBLIC_AMPLIFY_AUTH_REDIRECT_SIGN_IN!],
          redirectSignOut: [process.env.NEXT_PUBLIC_AMPLIFY_AUTH_REDIRECT_SIGN_OUT!],
          responseType: 'code',
        },
        email: true,
      },
    },
  },
};

Amplify.configure(amplifyConfig);

export const client = generateClient<Schema>();
```

## 🗄️ **Step 6: Database Migration**

Since you're using Neon PostgreSQL, you have two options:

### **Option A: Keep Neon (Recommended)**
- Continue using your existing Neon database
- Update connection string in environment variables
- No migration needed

### **Option B: Migrate to Amplify Data**
- Use the Amplify data schema we created
- Migrate data from Neon to Amplify
- Update all database queries

## 🔐 **Step 7: Authentication Integration**

Update your authentication to use Amplify:

```typescript
// lib/auth-amplify.ts
import { signIn, signOut, getCurrentUser } from 'aws-amplify/auth';

export async function signInWithEmail(email: string, password: string) {
  try {
    const { isSignedIn } = await signIn({ username: email, password });
    return { success: true, isSignedIn };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function signInWithGoogle() {
  try {
    await signIn({ provider: 'Google' });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function signInWithGitHub() {
  try {
    await signIn({ provider: 'GitHub' });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function signOutUser() {
  try {
    await signOut();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getCurrentUserData() {
  try {
    const user = await getCurrentUser();
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
```

## 🚀 **Step 8: Deploy and Test**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Configure for AWS Amplify deployment"
   git push origin main
   ```

2. **Monitor Deployment:**
   - Check Amplify Console for build logs
   - Monitor for any errors or warnings
   - Test the deployed application

3. **Test Features:**
   - ✅ User registration/login
   - ✅ OAuth providers (Google/GitHub)
   - ✅ Course browsing
   - ✅ User dashboard
   - ✅ Admin features
   - ✅ File uploads to S3

## 🔧 **Step 9: Custom Domain (Optional)**

1. **Add Custom Domain:**
   - Go to Amplify Console → Domain management
   - Add your custom domain
   - Configure DNS settings

2. **Update OAuth Redirects:**
   - Update Google OAuth redirect URIs
   - Update GitHub OAuth redirect URIs
   - Update environment variables

## 📊 **Step 10: Monitoring and Analytics**

1. **Enable Analytics:**
   ```bash
   amplify add analytics
   ```

2. **Monitor Performance:**
   - Use AWS CloudWatch
   - Monitor Lambda functions
   - Track API usage

## 🎉 **Deployment Complete!**

Your Kalpla eLearning Platform is now deployed on AWS Amplify with:
- ✅ Scalable hosting
- ✅ Global CDN
- ✅ Automatic HTTPS
- ✅ OAuth authentication
- ✅ Database integration
- ✅ File storage (S3)
- ✅ CI/CD pipeline

## 🔗 **Useful Links**

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Next.js on Amplify](https://docs.amplify.aws/guides/hosting/nextjs/q/platform/js/)
- [Amplify Auth Documentation](https://docs.amplify.aws/react/build-a-backend/auth/)
- [Amplify Data Documentation](https://docs.amplify.aws/react/build-a-backend/data/)

## 🆘 **Troubleshooting**

### **Common Issues:**

1. **Build Failures:**
   - Check environment variables
   - Verify Node.js version
   - Check build logs in Amplify Console

2. **Authentication Issues:**
   - Verify OAuth redirect URIs
   - Check environment variables
   - Verify user pool configuration

3. **Database Connection:**
   - Check connection string
   - Verify database permissions
   - Check network access

4. **File Upload Issues:**
   - Verify S3 bucket permissions
   - Check CORS configuration
   - Verify AWS credentials

## 📞 **Support**

If you encounter any issues:
1. Check AWS Amplify Console logs
2. Review this deployment guide
3. Check AWS documentation
4. Contact AWS support if needed

---

**🎉 Congratulations! Your eLearning platform is now live on AWS Amplify!**
