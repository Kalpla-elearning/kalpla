# Production Configuration Guide

## 🔧 **Production Environment Variables**

Create a `.env.production` file with these variables:

```env
# Database - Neon PostgreSQL (Production)
DATABASE_URL="postgresql://neondb_owner:your-production-password@your-production-host/neondb?sslmode=require&channel_binding=require"

# NextAuth.js (Production)
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-nextauth-secret-key-here"

# Email (Production - Hostinger Mail)
EMAIL_SERVER_HOST="smtp.hostinger.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-production-email@yourdomain.com"
EMAIL_SERVER_PASSWORD="your-production-email-password"
EMAIL_FROM="noreply@yourdomain.com"

# AWS S3 Storage (Production)
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="your-production-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-production-aws-secret-access-key"
AWS_S3_BUCKET_NAME="your-production-s3-bucket-name"

# Razorpay Payment Gateway (Production)
RAZORPAY_KEY_ID="your-production-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-production-razorpay-key-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="your-production-razorpay-key-id"

# JWT (Production)
JWT_SECRET="your-production-jwt-secret-key-here"

# App Configuration (Production)
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_APP_NAME="Kalpla"

# Google OAuth (Production)
GOOGLE_CLIENT_ID="your-production-google-client-id"
GOOGLE_CLIENT_SECRET="your-production-google-client-secret"

# GitHub OAuth (Production)
GITHUB_ID="your-production-github-client-id"
GITHUB_SECRET="your-production-github-client-secret"

# Optional: Analytics
NEXT_PUBLIC_GA_ID="your-google-analytics-id"

# Optional: Sentry Error Tracking
SENTRY_DSN="your-sentry-dsn"
SENTRY_ORG="your-sentry-org"
SENTRY_PROJECT="your-sentry-project"
SENTRY_AUTH_TOKEN="your-sentry-auth-token"
```

## 🚀 **Quick Deployment Steps**

### **1. Vercel Deployment (Recommended)**

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for production deployment"
   git push origin main
   ```

2. **Deploy to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Sign up with GitHub
   - Click "New Project"
   - Import your repository
   - Add environment variables
   - Deploy!

3. **Set Environment Variables in Vercel:**
   - Go to Project Settings → Environment Variables
   - Add all production environment variables
   - Set environment to "Production"

### **2. Update OAuth Applications**

**Google OAuth:**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Update authorized redirect URIs:
  - `https://your-domain.vercel.app/api/auth/callback/google`

**GitHub OAuth:**
- Go to [GitHub Developer Settings](https://github.com/settings/developers)
- Update Authorization callback URL:
  - `https://your-domain.vercel.app/api/auth/callback/github`

### **3. Database Setup**
```bash
# Push schema to production database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

## 🔄 **Continuous Updates**

### **Automatic Deployments**
Every time you push to the main branch, Vercel automatically deploys:

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push origin main

# Vercel automatically deploys the changes
```

### **Preview Deployments**
For testing new features:

```bash
# Create feature branch
git checkout -b feature/new-feature
git push origin feature/new-feature

# Vercel creates preview deployment
# Test at: https://your-project-git-feature-new-feature.vercel.app
```

## 📊 **Monitoring Setup**

### **Vercel Analytics**
1. Enable in Vercel dashboard
2. Get performance insights
3. Monitor user behavior

### **Error Tracking (Optional)**
```bash
npm install @sentry/nextjs
```

## 🔒 **Security Checklist**

- ✅ Use strong, unique production secrets
- ✅ Enable HTTPS (automatic with Vercel)
- ✅ Set proper CORS policies
- ✅ Validate all inputs
- ✅ Use environment variables for secrets
- ✅ Regular security updates

## 🎯 **Post-Deployment Testing**

1. **Test Authentication:**
   - Email/password login
   - Google OAuth
   - GitHub OAuth

2. **Test Core Features:**
   - User registration
   - Course creation
   - Payment processing
   - File uploads

3. **Test Admin Features:**
   - Admin dashboard
   - User management
   - Course management

## 📱 **Mobile Optimization**

Your Next.js app is already mobile-responsive and can be configured as a PWA for app-like experience.

## 🚀 **Your Live Website**

Once deployed, your platform will be available at:
- **Main Site**: `https://your-domain.vercel.app`
- **Admin Panel**: `https://your-domain.vercel.app/admin`
- **User Dashboard**: `https://your-domain.vercel.app/dashboard`

## 📞 **Support & Maintenance**

### **Regular Tasks:**
- Keep dependencies updated
- Monitor performance
- Regular backups
- Security updates

### **Backup Strategy:**
- Database: Neon provides automatic backups
- Code: GitHub repository
- Files: AWS S3 with versioning

Your Kalpla eLearning Platform is ready for production! 🎉
