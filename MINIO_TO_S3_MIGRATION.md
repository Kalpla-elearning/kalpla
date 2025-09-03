# 🔄 MinIO to AWS S3 Migration Guide

This guide helps you migrate from MinIO to AWS S3 in your Kalpla e-learning platform.

## 📋 Migration Overview

### What's Changing
- **Storage Provider**: MinIO → AWS S3
- **Configuration**: Local/MinIO settings → AWS S3 settings
- **File URLs**: MinIO URLs → S3 URLs
- **Dependencies**: MinIO SDK → AWS SDK

### What's Staying the Same
- ✅ File upload functionality
- ✅ File organization structure
- ✅ API endpoints
- ✅ User experience

## 🔧 Step 1: Backup Your Data

### 1.1 Export MinIO Data
If you have existing files in MinIO, export them:

```bash
# Using MinIO client (mc)
mc config host add minio http://localhost:9000 your-access-key your-secret-key
mc mirror minio/elearning-content ./backup-files

# Or manually download files from MinIO console
```

### 1.2 Database Backup
```bash
# Backup your database
pg_dump your_database > backup.sql
```

## 🔧 Step 2: Set Up AWS S3

### 2.1 Create AWS Account
1. Go to [AWS Console](https://console.aws.amazon.com/)
2. Create an account if you don't have one
3. Set up billing information

### 2.2 Create IAM User
1. Go to IAM service
2. Create user: `kalpla-s3-user`
3. Attach S3 permissions
4. Generate access keys

### 2.3 Create S3 Bucket
1. Go to S3 service
2. Create bucket: `kalpla-elearning-content`
3. Choose your preferred region
4. Configure bucket settings

## 🔧 Step 3: Update Configuration

### 3.1 Environment Variables
Replace MinIO variables with AWS S3:

**Before (MinIO):**
```env
MINIO_ENDPOINT="localhost"
MINIO_PORT=9000
MINIO_ACCESS_KEY="your-minio-access-key"
MINIO_SECRET_KEY="your-minio-secret-key"
MINIO_BUCKET_NAME="elearning-content"
MINIO_USE_SSL=false
```

**After (AWS S3):**
```env
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
AWS_S3_BUCKET_NAME="kalpla-elearning-content"
```

### 3.2 Update .env.local
Edit your `.env.local` file with the new AWS S3 configuration.

## 🔧 Step 4: Install New Dependencies

### 4.1 Remove MinIO
```bash
npm uninstall minio
```

### 4.2 Install AWS SDK
```bash
npm install aws-sdk @aws-sdk/client-s3 @aws-sdk/s3-request-presigner multer multer-s3
```

## 🔧 Step 5: Run Setup Script

### 5.1 Configure S3 Bucket
```bash
node scripts/setup-aws-s3.js
```

This script will:
- ✅ Create S3 bucket (if needed)
- ✅ Configure CORS
- ✅ Set bucket policy
- ✅ Verify configuration

## 🔧 Step 6: Migrate Existing Files

### 6.1 Upload Files to S3
If you have existing files, upload them to S3:

```bash
# Using AWS CLI
aws s3 sync ./backup-files s3://kalpla-elearning-content/

# Or use the migration script
node scripts/migrate-files-to-s3.js
```

### 6.2 Update Database URLs
Update file URLs in your database:

```sql
-- Update image URLs
UPDATE users 
SET image = REPLACE(image, 'http://localhost:9000/elearning-content', 'https://kalpla-elearning-content.s3.amazonaws.com')
WHERE image LIKE '%localhost:9000%';

-- Update course thumbnails
UPDATE courses 
SET thumbnail = REPLACE(thumbnail, 'http://localhost:9000/elearning-content', 'https://kalpla-elearning-content.s3.amazonaws.com')
WHERE thumbnail LIKE '%localhost:9000%';

-- Update video URLs
UPDATE content 
SET url = REPLACE(url, 'http://localhost:9000/elearning-content', 'https://kalpla-elearning-content.s3.amazonaws.com')
WHERE url LIKE '%localhost:9000%';
```

## 🔧 Step 7: Test Migration

### 7.1 Test File Uploads
1. Start your application: `npm run dev`
2. Go to profile edit: `http://localhost:3000/profile/edit`
3. Upload a new avatar image
4. Verify it appears in S3 bucket

### 7.2 Test Video Uploads
1. Go to course creation: `http://localhost:3000/instructor/courses/create`
2. Upload a video file
3. Verify it appears in S3 bucket under `videos/courses/`

### 7.3 Test Existing Files
1. Check if existing files load correctly
2. Verify image URLs work
3. Test video playback

## 🔧 Step 8: Clean Up

### 8.1 Remove MinIO Server
```bash
# Stop MinIO server
sudo systemctl stop minio

# Remove MinIO installation
sudo rm -rf /opt/minio
sudo rm /etc/systemd/system/minio.service
```

### 8.2 Update Documentation
- Update your deployment guides
- Update team documentation
- Update monitoring dashboards

## 🚨 Troubleshooting

### Common Issues

#### 1. Access Denied Error
```
Error: Access Denied
```
**Solution**: Check AWS IAM permissions and bucket policy

#### 2. File Not Found
```
Error: The specified key does not exist
```
**Solution**: Verify file paths and bucket name

#### 3. CORS Error
```
CORS policy: No 'Access-Control-Allow-Origin' header
```
**Solution**: Run the S3 setup script to configure CORS

#### 4. Old URLs Not Working
```
Error: Failed to load resource
```
**Solution**: Update database URLs to new S3 URLs

### Debug Commands

```bash
# Test S3 connection
node -e "
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3');
const client = new S3Client({ region: 'us-east-1' });
client.send(new ListBucketsCommand()).then(console.log).catch(console.error);
"

# List S3 bucket contents
aws s3 ls s3://kalpla-elearning-content --recursive

# Test file upload
aws s3 cp test.txt s3://kalpla-elearning-content/
```

## 📊 Benefits of Migration

### Performance
- **Global CDN**: CloudFront for faster delivery
- **Better Uptime**: 99.99% AWS S3 uptime
- **Scalability**: Handle thousands of concurrent users

### Cost
- **Pay-per-use**: Only pay for storage and requests
- **No server maintenance**: No MinIO server to manage
- **Automatic scaling**: No capacity planning needed

### Security
- **Encryption**: Server-side encryption by default
- **Access controls**: Fine-grained IAM policies
- **Compliance**: SOC, PCI, HIPAA compliance

## 🎉 Migration Complete!

After completing these steps:

- ✅ All new uploads go to AWS S3
- ✅ Existing files are migrated
- ✅ Database URLs are updated
- ✅ MinIO is completely removed
- ✅ Platform is using enterprise-grade storage

## 📞 Support

If you encounter issues during migration:

1. **Check AWS CloudTrail** for API logs
2. **Review CloudWatch metrics** for performance
3. **Verify IAM permissions** are correct
4. **Test with AWS CLI** for connectivity

For platform-specific issues, check the application logs and browser console.

## 🔄 Rollback Plan

If you need to rollback to MinIO:

1. **Keep MinIO server running** during migration
2. **Backup all data** before making changes
3. **Test thoroughly** before removing MinIO
4. **Have rollback scripts ready**

The migration is designed to be reversible if needed.
