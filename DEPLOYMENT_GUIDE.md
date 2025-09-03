# Kalpla eLearning Platform - Deployment Guide

## 🚀 **Deployment Options**

### **Recommended: Vercel (Easiest for Next.js)**
- ✅ Zero-config deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions
- ✅ Automatic deployments from GitHub

### **Alternative: Netlify**
- ✅ Great for static sites
- ✅ Easy GitHub integration
- ✅ Form handling
- ✅ Edge functions

### **Advanced: AWS/DigitalOcean**
- ✅ Full control
- ✅ Custom server setup
- ✅ More complex but flexible

## 📋 **Pre-Deployment Checklist**

### **1. Environment Variables Setup**
Create production environment variables:

```env
# Production Database (Neon PostgreSQL)
DATABASE_URL="postgresql://neondb_owner:npg_EFRtiQy2xBr5@ep-red-math-a1if7t7d-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"

# NextAuth.js (Production)
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="your-production-secret-key-here"

# Email (Production)
EMAIL_SERVER_HOST="smtp.hostinger.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-production-email@yourdomain.com"
EMAIL_SERVER_PASSWORD="your-production-email-password"
EMAIL_FROM="noreply@yourdomain.com"

# AWS S3 (Production)
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="your-production-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-production-aws-secret-key"
AWS_S3_BUCKET_NAME="your-production-s3-bucket"

# Razorpay (Production)
RAZORPAY_KEY_ID="your-production-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-production-razorpay-key-secret"
NEXT_PUBLIC_RAZORPAY_KEY_ID="your-production-razorpay-key-id"

# JWT
JWT_SECRET="your-production-jwt-secret-key"

# App Configuration (Production)
NEXT_PUBLIC_APP_URL="https://your-domain.com"
NEXT_PUBLIC_APP_NAME="Kalpla"

# Google OAuth (Production)
GOOGLE_CLIENT_ID="your-production-google-client-id"
GOOGLE_CLIENT_SECRET="your-production-google-client-secret"

# GitHub OAuth (Production)
GITHUB_ID="your-production-github-client-id"
GITHUB_SECRET="your-production-github-client-secret"
```

### **2. Update OAuth Callback URLs**
Update your OAuth applications with production URLs:

**Google OAuth:**
- Go to [Google Cloud Console](https://console.cloud.google.com/)
- Update authorized redirect URIs:
  - `https://your-domain.com/api/auth/callback/google`

**GitHub OAuth:**
- Go to [GitHub Developer Settings](https://github.com/settings/developers)
- Update Authorization callback URL:
  - `https://your-domain.com/api/auth/callback/github`

### **3. Database Migration**
Ensure your production database is up to date:

```bash
# Push schema to production database
npx prisma db push

# Generate Prisma client
npx prisma generate
```

## 🚀 **Vercel Deployment (Recommended)**

### **Step 1: Prepare Repository**
1. Push your code to GitHub
2. Ensure all files are committed
3. Create a production branch (optional)

### **Step 2: Deploy to Vercel**
1. Go to [Vercel](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next` (default)

### **Step 3: Environment Variables**
1. In Vercel dashboard, go to your project
2. Go to "Settings" → "Environment Variables"
3. Add all production environment variables
4. Set environment to "Production"

### **Step 4: Deploy**
1. Click "Deploy"
2. Wait for deployment to complete
3. Your site will be live at `https://your-project.vercel.app`

### **Step 5: Custom Domain (Optional)**
1. In Vercel dashboard, go to "Domains"
2. Add your custom domain
3. Configure DNS settings as instructed

## 🔄 **Continuous Updates Setup**

### **Automatic Deployments**
Vercel automatically deploys when you push to your main branch:

```bash
# Make changes to your code
git add .
git commit -m "Update feature X"
git push origin main

# Vercel automatically deploys the changes
```

### **Branch-based Deployments**
Set up preview deployments for testing:

```bash
# Create a feature branch
git checkout -b feature/new-feature
git push origin feature/new-feature

# Vercel creates a preview deployment
# Test at: https://your-project-git-feature-new-feature.vercel.app
```

### **Environment-specific Deployments**
- **Production**: `main` branch → `https://your-domain.com`
- **Preview**: Feature branches → `https://your-project-git-branch.vercel.app`
- **Development**: Local development → `http://localhost:3000`

## 📊 **Monitoring & Analytics**

### **Vercel Analytics**
1. Enable Vercel Analytics in your project
2. Get insights on:
   - Page views
   - Performance metrics
   - User behavior
   - Core Web Vitals

### **Error Monitoring**
Add error tracking:

```bash
npm install @sentry/nextjs
```

### **Database Monitoring**
- Use Neon's built-in monitoring
- Set up alerts for database issues
- Monitor query performance

## 🔒 **Security Checklist**

### **Production Security**
- ✅ Use strong, unique secrets
- ✅ Enable HTTPS (automatic with Vercel)
- ✅ Set up proper CORS policies
- ✅ Validate all inputs
- ✅ Use environment variables for secrets
- ✅ Regular security updates

### **OAuth Security**
- ✅ Use production OAuth credentials
- ✅ Set proper redirect URIs
- ✅ Enable OAuth app restrictions
- ✅ Monitor OAuth usage

## 🚀 **Deployment Commands**

### **Local Production Build Test**
```bash
# Test production build locally
npm run build
npm start
```

### **Database Operations**
```bash
# Push schema changes
npx prisma db push

# Generate client
npx prisma generate

# View database (optional)
npx prisma studio
```

### **Environment Setup**
```bash
# Install dependencies
npm install

# Set up environment
cp env.example .env.local
# Edit .env.local with your values
```

## 📱 **Mobile & PWA Setup**

### **Progressive Web App**
Your Next.js app can be configured as a PWA:

1. Add PWA configuration
2. Enable offline functionality
3. Add app manifest
4. Configure service worker

## 🔧 **Troubleshooting**

### **Common Issues**

1. **Build Failures**
   - Check environment variables
   - Verify all dependencies are installed
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check database permissions
   - Ensure database is accessible

3. **OAuth Issues**
   - Verify callback URLs
   - Check OAuth credentials
   - Ensure OAuth apps are configured

4. **File Upload Issues**
   - Check AWS S3 credentials
   - Verify S3 bucket permissions
   - Check file size limits

## 📈 **Performance Optimization**

### **Next.js Optimizations**
- ✅ Image optimization
- ✅ Code splitting
- ✅ Static generation where possible
- ✅ Edge functions for API routes

### **Database Optimizations**
- ✅ Proper indexing
- ✅ Query optimization
- ✅ Connection pooling
- ✅ Caching strategies

## 🎯 **Post-Deployment Tasks**

1. **Test All Features**
   - User registration/login
   - OAuth authentication
   - Course creation
   - Payment processing
   - File uploads

2. **Set Up Monitoring**
   - Error tracking
   - Performance monitoring
   - User analytics

3. **Backup Strategy**
   - Database backups
   - File storage backups
   - Code repository backups

4. **Documentation**
   - Update README
   - Document API endpoints
   - Create user guides

## 🚀 **Your Live Website**

Once deployed, your Kalpla eLearning Platform will be available at:
- **Production URL**: `https://your-domain.com`
- **Admin Panel**: `https://your-domain.com/admin`
- **User Dashboard**: `https://your-domain.com/dashboard`

## 📞 **Support & Maintenance**

### **Regular Updates**
- Keep dependencies updated
- Monitor security advisories
- Regular database maintenance
- Performance optimization

### **Backup Strategy**
- Daily database backups
- Regular code repository backups
- File storage backups

Your Kalpla eLearning Platform is now ready for production deployment! 🎉
