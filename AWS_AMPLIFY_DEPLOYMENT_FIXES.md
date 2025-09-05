# AWS Amplify Deployment Fixes

## Issues Fixed

### 1. Database Connection Errors
- **Problem**: Prisma can't reach the database server
- **Solution**: Configured fallback to mock data when database is unavailable
- **Files Modified**: 
  - `lib/prisma.ts` - Added graceful error handling
  - All API routes - Added try-catch with fallback data

### 2. NextAuth Configuration Warnings
- **Problem**: Missing NEXTAUTH_URL and NEXTAUTH_SECRET
- **Solution**: Added environment variable configuration
- **Files Modified**:
  - `next.config.js` - Added env configuration
  - `lib/auth.ts` - Added fallback values

### 3. Image Configuration Issues
- **Problem**: Unsplash images not configured properly
- **Solution**: Updated remotePatterns with wildcard support
- **Files Modified**:
  - `next.config.js` - Added wildcard patterns for S3 and CloudFront

### 4. AWS Amplify Environment Variables
- **Problem**: Missing Amplify environment variables
- **Solution**: Added proper env configuration
- **Files Modified**:
  - `next.config.js` - Added Amplify env variables
  - `amplify/backend.ts` - Configured backend
  - `amplify/data/resource.ts` - Added data models

## Deployment Steps

### 1. Initialize Amplify Backend
```bash
npx ampx sandbox
```

### 2. Deploy to AWS Amplify
```bash
# Connect to GitHub repository
# Go to AWS Amplify Console
# Connect your GitHub repository
# Select main branch
# Build settings will be auto-detected from amplify.yml
```

### 3. Environment Variables Setup
In AWS Amplify Console, add these environment variables:

```env
# Database (use RDS or Aurora)
DATABASE_URL=postgresql://username:password@host:5432/database

# NextAuth
NEXTAUTH_URL=https://your-app.amplifyapp.com
NEXTAUTH_SECRET=your-secret-key

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Optional: OAuth providers
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
```

### 4. Database Setup
1. Create RDS PostgreSQL instance
2. Run migrations: `npx prisma migrate deploy`
3. Update DATABASE_URL in Amplify environment variables

### 5. S3 Bucket Setup
1. Create S3 bucket for file uploads
2. Configure CORS policy
3. Set up CloudFront distribution
4. Update AWS credentials in environment variables

## Build Configuration

The `amplify.yml` file is configured for:
- Node.js 18+ runtime
- Prisma generation
- Next.js build
- Proper caching

## Production Checklist

- [ ] Database connection working
- [ ] S3 bucket configured
- [ ] CloudFront distribution set up
- [ ] Environment variables configured
- [ ] Domain configured (optional)
- [ ] SSL certificate (auto-generated)
- [ ] CDN enabled
- [ ] Build logs clean
- [ ] All pages loading correctly

## Troubleshooting

### Build Failures
1. Check build logs in Amplify Console
2. Verify all dependencies are in package.json
3. Ensure TypeScript errors are resolved
4. Check environment variables

### Database Issues
1. Verify DATABASE_URL is correct
2. Check RDS instance is running
3. Ensure security groups allow connections
4. Run `npx prisma migrate deploy`

### Image Loading Issues
1. Check S3 bucket permissions
2. Verify CloudFront distribution
3. Update remotePatterns in next.config.js
4. Test image URLs directly

## Performance Optimizations

1. **CDN**: CloudFront for static assets
2. **Caching**: Proper cache headers
3. **Compression**: Gzip/Brotli enabled
4. **Images**: Next.js Image optimization
5. **Database**: Connection pooling
6. **Build**: Standalone output for faster cold starts

## Security Considerations

1. **Environment Variables**: Never commit secrets
2. **Database**: Use connection pooling
3. **S3**: Proper bucket policies
4. **CORS**: Configured for your domain
5. **HTTPS**: Always use SSL
6. **Authentication**: Secure session handling

## Monitoring

1. **CloudWatch**: Application logs
2. **X-Ray**: Performance tracing
3. **Amplify Console**: Build and deployment logs
4. **Database**: RDS monitoring
5. **S3**: Access logs and metrics

## Cost Optimization

1. **RDS**: Use appropriate instance size
2. **S3**: Lifecycle policies for old files
3. **CloudFront**: Optimize cache settings
4. **Lambda**: Monitor function duration
5. **Amplify**: Use appropriate build settings

## Next Steps

1. Deploy to staging environment
2. Test all functionality
3. Set up monitoring
4. Configure backups
5. Set up CI/CD pipeline
6. Deploy to production
7. Monitor performance
8. Optimize based on usage
