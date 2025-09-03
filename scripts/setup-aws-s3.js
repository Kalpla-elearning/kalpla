const { S3Client, CreateBucketCommand, PutBucketCorsCommand, PutBucketPolicyCommand } = require('@aws-sdk/client-s3')

async function setupAWSS3() {
  console.log('🚀 Setting up AWS S3 for Kalpla E-Learning Platform...\n')

  // Check environment variables
  const requiredEnvVars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY', 
    'AWS_REGION',
    'AWS_S3_BUCKET_NAME'
  ]

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName])
  
  if (missingVars.length > 0) {
    console.log('❌ Missing required environment variables:')
    missingVars.forEach(varName => console.log(`  - ${varName}`))
    console.log('\n📝 Please add these to your .env.local file:')
    console.log(`
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
AWS_S3_BUCKET_NAME="kalpla-elearning-content"
    `)
    return
  }

  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  })

  const bucketName = process.env.AWS_S3_BUCKET_NAME

  try {
    console.log('📦 Creating S3 bucket...')
    
    // Create bucket
    await s3Client.send(new CreateBucketCommand({
      Bucket: bucketName,
      CreateBucketConfiguration: {
        LocationConstraint: process.env.AWS_REGION === 'us-east-1' ? undefined : process.env.AWS_REGION
      }
    }))

    console.log('✅ Bucket created successfully')

    console.log('🔧 Configuring CORS...')
    
    // Configure CORS
    const corsConfig = {
      Bucket: bucketName,
      CORSConfiguration: {
        CORSRules: [
          {
            AllowedHeaders: ['*'],
            AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
            AllowedOrigins: ['*'], // In production, specify your domain
            ExposeHeaders: ['ETag']
          }
        ]
      }
    }

    await s3Client.send(new PutBucketCorsCommand(corsConfig))
    console.log('✅ CORS configured successfully')

    console.log('🔒 Setting bucket policy...')
    
    // Set bucket policy for public read access
    const bucketPolicy = {
      Bucket: bucketName,
      Policy: JSON.stringify({
        Version: '2012-10-17',
        Statement: [
          {
            Sid: 'PublicReadGetObject',
            Effect: 'Allow',
            Principal: '*',
            Action: 's3:GetObject',
            Resource: `arn:aws:s3:::${bucketName}/*`
          }
        ]
      })
    }

    await s3Client.send(new PutBucketPolicyCommand(bucketPolicy))
    console.log('✅ Bucket policy configured successfully')

    console.log('\n🎉 AWS S3 setup completed successfully!')
    console.log('\n📋 Next steps:')
    console.log('1. Configure CloudFront (optional but recommended for better performance)')
    console.log('2. Set up lifecycle policies for cost optimization')
    console.log('3. Configure monitoring and alerts')
    console.log('4. Test file uploads using the platform')

    console.log('\n🔗 Your S3 bucket URL:')
    console.log(`https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/`)

  } catch (error) {
    if (error.name === 'BucketAlreadyExists') {
      console.log('⚠️  Bucket already exists, checking configuration...')
      
      try {
        // Try to configure CORS and policy anyway
        await s3Client.send(new PutBucketCorsCommand({
          Bucket: bucketName,
          CORSConfiguration: {
            CORSRules: [
              {
                AllowedHeaders: ['*'],
                AllowedMethods: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                AllowedOrigins: ['*'],
                ExposeHeaders: ['ETag']
              }
            ]
          }
        }))
        console.log('✅ CORS updated successfully')
      } catch (corsError) {
        console.log('⚠️  Could not update CORS configuration')
      }
      
      console.log('✅ Bucket is ready to use')
    } else {
      console.error('❌ Error setting up S3:', error.message)
      console.log('\n🔧 Troubleshooting tips:')
      console.log('1. Check your AWS credentials')
      console.log('2. Ensure your AWS user has S3 permissions')
      console.log('3. Verify the bucket name is globally unique')
      console.log('4. Check if the region is correct')
    }
  }
}

// AWS IAM Policy for S3 access
const iamPolicy = {
  Version: '2012-10-17',
  Statement: [
    {
      Effect: 'Allow',
      Action: [
        's3:GetObject',
        's3:PutObject',
        's3:DeleteObject',
        's3:ListBucket',
        's3:PutObjectAcl',
        's3:GetObjectAcl'
      ],
      Resource: [
        'arn:aws:s3:::kalpla-elearning-content',
        'arn:aws:s3:::kalpla-elearning-content/*'
      ]
    }
  ]
}

console.log('📋 Required IAM Policy for S3 access:')
console.log(JSON.stringify(iamPolicy, null, 2))
console.log('\n')

setupAWSS3().catch(console.error)
