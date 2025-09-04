# 🚀 AWS Amplify Deployment Guide for Kalpla eLearning Platform

## Prerequisites
- AWS Account
- GitHub repository (already done ✅)
- Domain name (optional)

## Step 1: Set up AWS Amplify

### 1.1 Go to AWS Amplify Console
1. Visit [AWS Amplify Console](https://console.aws.amazon.com/amplify/)
2. Click "New app" → "Host web app"

### 1.2 Connect GitHub Repository
1. Select "GitHub" as source
2. Authorize AWS to access your GitHub
3. Select repository: `Kalpla-elearning/kalpla`
4. Select branch: `main`

## Step 2: Configure Build Settings

### 2.1 Build Specification
Amplify will auto-detect Next.js, but you can customize:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
        - npx prisma generate
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### 2.2 Environment Variables
Add these environment variables in Amplify console:

```bash
# Database
DATABASE_URL=postgresql://neondb_owner:npg_EFRtiQy2xBr5@ep-red-math-a1if7t7d-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# NextAuth
NEXTAUTH_URL=https://your-app-id.amplifyapp.com
NEXTAUTH_SECRET=your-secret-key
JWT_SECRET=your-jwt-secret

# AWS S3
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-southeast-1
S3_BUCKET_NAME=your-bucket-name

# Razorpay
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret

# OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_ID=your-github-id
GITHUB_SECRET=your-github-secret
```

## Step 3: Deploy

### 3.1 Start Deployment
1. Click "Save and deploy"
2. Amplify will automatically:
   - Clone your repository
   - Install dependencies
   - Run Prisma generate
   - Build your Next.js app
   - Deploy to global CDN

### 3.2 Monitor Build
- Watch the build logs in real-time
- Fix any issues that arise
- Your app will be available at: `https://your-app-id.amplifyapp.com`

## Step 4: Custom Domain (Optional)

### 4.1 Add Custom Domain
1. Go to "Domain management" in Amplify console
2. Click "Add domain"
3. Enter your domain name
4. Follow DNS configuration instructions

### 4.2 SSL Certificate
- Amplify automatically provides SSL certificates
- Your site will be available at `https://yourdomain.com`

## Step 5: Environment Management

### 5.1 Production Environment
- Use production database URL
- Use production S3 bucket
- Use production Razorpay keys

### 5.2 Staging Environment
- Create a separate Amplify app for staging
- Use staging database and services
- Test before promoting to production

## Cost Estimation

### AWS Amplify Pricing
- **Build minutes**: $0.01 per minute
- **Data transfer**: $0.15 per GB
- **Hosting**: $0.15 per GB stored
- **Estimated monthly cost**: $5-20 for small to medium traffic

### Additional AWS Services
- **S3**: $0.023 per GB stored
- **RDS** (if you switch from Neon): $15-50/month
- **Route 53** (DNS): $0.50 per hosted zone

## Benefits of AWS Amplify

✅ **Automatic Deployments**: Push to GitHub → Auto deploy
✅ **Global CDN**: Fast loading worldwide
✅ **SSL Certificates**: Automatic HTTPS
✅ **Custom Domains**: Easy domain setup
✅ **Environment Variables**: Secure configuration
✅ **Build Logs**: Easy debugging
✅ **Rollback**: Easy to revert deployments
✅ **Monitoring**: Built-in analytics

## Next Steps After Deployment

1. **Test all features** on the live site
2. **Configure custom domain** if needed
3. **Set up monitoring** and alerts
4. **Configure backup** for database
5. **Set up CI/CD** for automated testing

## Support

- AWS Amplify Documentation: https://docs.aws.amazon.com/amplify/
- AWS Support: Available in AWS Console
- Community: AWS Amplify Discord/Forums
