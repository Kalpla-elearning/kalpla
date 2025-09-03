# 🚀 AWS S3 Setup Guide for Kalpla E-Learning Platform

This guide will help you set up AWS S3 for video storage and file management in your Kalpla e-learning platform.

## 📋 Prerequisites

- AWS Account
- AWS CLI installed (optional but recommended)
- Node.js and npm installed

## 🔧 Step 1: Create AWS IAM User

### 1.1 Log into AWS Console
- Go to [AWS Console](https://console.aws.amazon.com/)
- Navigate to IAM service

### 1.2 Create IAM User
1. Click "Users" → "Add user"
2. Enter username: `kalpla-s3-user`
3. Select "Programmatic access"
4. Click "Next: Permissions"

### 1.3 Attach S3 Policy
1. Click "Attach existing policies directly"
2. Search for "AmazonS3FullAccess" or create custom policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject",
        "s3:ListBucket",
        "s3:PutObjectAcl",
        "s3:GetObjectAcl",
        "s3:CreateBucket",
        "s3:PutBucketCors",
        "s3:PutBucketPolicy"
      ],
      "Resource": [
        "arn:aws:s3:::kalpla-elearning-content",
        "arn:aws:s3:::kalpla-elearning-content/*"
      ]
    }
  ]
}
```

### 1.4 Get Access Keys
1. Complete user creation
2. **IMPORTANT**: Download the CSV file with Access Key ID and Secret Access Key
3. Store these securely - you won't be able to see the secret key again

## 🔧 Step 2: Configure Environment Variables

### 2.1 Update .env.local
Add these variables to your `.env.local` file:

```env
# AWS S3 Storage
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
AWS_S3_BUCKET_NAME="kalpla-elearning-content"
```

### 2.2 Choose Your Region
Common regions:
- `us-east-1` (N. Virginia) - Default, most services available
- `us-west-2` (Oregon) - Good performance for US West Coast
- `eu-west-1` (Ireland) - Good for European users
- `ap-south-1` (Mumbai) - Good for Indian users

## 🔧 Step 3: Run Setup Script

### 3.1 Install Dependencies
```bash
npm install aws-sdk @aws-sdk/client-s3 @aws-sdk/s3-request-presigner multer multer-s3
```

### 3.2 Run Setup Script
```bash
node scripts/setup-aws-s3.js
```

This script will:
- ✅ Create S3 bucket
- ✅ Configure CORS for web access
- ✅ Set bucket policy for public read access
- ✅ Verify configuration

## 🔧 Step 4: Test Upload

### 4.1 Test File Upload
1. Start your development server: `npm run dev`
2. Go to profile edit page: `http://localhost:3000/profile/edit`
3. Try uploading an avatar image
4. Check if the file appears in your S3 bucket

### 4.2 Test Video Upload
1. Go to course creation: `http://localhost:3000/instructor/courses/create`
2. Try uploading a video file
3. Verify it appears in the S3 bucket under `videos/courses/` folder

## 📁 S3 Bucket Structure

Your S3 bucket will be organized as follows:

```
kalpla-elearning-content/
├── images/
│   ├── avatar/          # User profile pictures
│   ├── thumbnail/       # Course thumbnails
│   ├── course/         # Course images
│   └── blog/           # Blog post images
├── videos/
│   ├── courses/        # Course videos
│   └── promos/         # Promotional videos
├── documents/
│   ├── course/         # Course materials
│   ├── assignment/     # Assignment files
│   └── resource/       # Learning resources
└── audio/
    └── courses/        # Audio content
```

## 🔧 Step 5: Advanced Configuration (Optional)

### 5.1 CloudFront CDN Setup
For better performance, set up CloudFront:

1. Go to CloudFront service
2. Create distribution
3. Origin: Your S3 bucket
4. Configure caching rules
5. Update environment variables:

```env
AWS_CLOUDFRONT_DOMAIN="your-cloudfront-domain.cloudfront.net"
```

### 5.2 Lifecycle Policies
Set up lifecycle policies for cost optimization:

1. Go to S3 bucket → Management → Lifecycle
2. Create rules for:
   - Move old files to IA (Infrequent Access)
   - Delete old versions
   - Delete incomplete multipart uploads

### 5.3 Monitoring and Alerts
Set up CloudWatch monitoring:

1. Create CloudWatch dashboard
2. Monitor:
   - S3 request count
   - S3 bytes transferred
   - Error rates
   - Costs

## 🔧 Step 6: Security Best Practices

### 6.1 Bucket Policy
Your bucket allows public read access for course content. For stricter security:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowPublicReadForCourseContent",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::kalpla-elearning-content/courses/*"
    },
    {
      "Sid": "DenyPublicReadForPrivateContent",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::kalpla-elearning-content/private/*"
    }
  ]
}
```

### 6.2 CORS Configuration
For production, restrict CORS origins:

```json
{
  "CORSRules": [
    {
      "AllowedHeaders": ["*"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedOrigins": ["https://yourdomain.com"],
      "ExposeHeaders": ["ETag"]
    }
  ]
}
```

## 🔧 Step 7: Cost Optimization

### 7.1 Storage Classes
- **Standard**: For frequently accessed content
- **IA (Infrequent Access)**: For older course content
- **Glacier**: For archived content

### 7.2 Compression
Enable compression for text files:
- PDFs, documents
- Course materials
- Transcripts

### 7.3 CDN
Use CloudFront to:
- Reduce S3 requests
- Improve global performance
- Reduce bandwidth costs

## 🚨 Troubleshooting

### Common Issues

#### 1. Access Denied Error
```
Error: Access Denied
```
**Solution**: Check IAM permissions and bucket policy

#### 2. CORS Error
```
CORS policy: No 'Access-Control-Allow-Origin' header
```
**Solution**: Verify CORS configuration in S3 bucket

#### 3. Bucket Not Found
```
Error: The specified bucket does not exist
```
**Solution**: Check bucket name and region

#### 4. Upload Timeout
```
Error: Request timeout
```
**Solution**: 
- Check file size limits
- Verify network connection
- Consider using multipart upload for large files

### Debug Commands

```bash
# Test S3 connection
node -e "
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
const client = new S3Client({ region: 'us-east-1' });
client.send(new ListBucketsCommand()).then(console.log).catch(console.error);
"

# List bucket contents
aws s3 ls s3://kalpla-elearning-content --recursive

# Test upload
aws s3 cp test.txt s3://kalpla-elearning-content/
```

## 📊 Monitoring and Analytics

### S3 Metrics to Monitor
- **Request Count**: Total API requests
- **Bytes Transferred**: Data transfer volume
- **Error Rate**: 4xx and 5xx errors
- **Latency**: Request response times

### Cost Monitoring
- **Storage Costs**: GB stored × storage class rate
- **Request Costs**: API calls × request rate
- **Data Transfer**: Outbound data × transfer rate

## 🎉 Success!

Your AWS S3 integration is now complete! Your Kalpla platform can now:

- ✅ Upload and store videos securely
- ✅ Serve course content globally
- ✅ Handle high-traffic loads
- ✅ Scale automatically
- ✅ Provide reliable file storage

## 📞 Support

If you encounter issues:
1. Check AWS CloudTrail for API logs
2. Review CloudWatch metrics
3. Verify IAM permissions
4. Test with AWS CLI

For platform-specific issues, check the application logs and browser console.
