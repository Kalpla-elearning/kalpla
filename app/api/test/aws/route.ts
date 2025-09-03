import { NextRequest, NextResponse } from 'next/server'
import { S3Client, HeadBucketCommand, CreateBucketCommand } from '@aws-sdk/client-s3'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    // Check if AWS credentials are configured
    const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
    const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
    const awsRegion = process.env.AWS_REGION
    const awsBucket = process.env.AWS_S3_BUCKET || process.env.AWS_S3_BUCKET_NAME

    // Environment check
    const envCheck = {
      AWS_ACCESS_KEY_ID: awsAccessKeyId ? '✅ Configured' : '❌ Missing',
      AWS_SECRET_ACCESS_KEY: awsSecretAccessKey ? '✅ Configured' : '❌ Missing',
      AWS_REGION: awsRegion ? `✅ ${awsRegion}` : '❌ Missing',
      AWS_S3_BUCKET: awsBucket ? `✅ ${awsBucket}` : '❌ Missing'
    }

    if (!awsAccessKeyId || !awsSecretAccessKey || !awsRegion) {
      return NextResponse.json({
        status: 'error',
        message: 'AWS credentials not configured',
        environment: envCheck,
        instructions: [
          '1. Add AWS credentials to your .env.local file:',
          '   AWS_ACCESS_KEY_ID="your-access-key"',
          '   AWS_SECRET_ACCESS_KEY="your-secret-key"',
          '   AWS_REGION="ap-south-1"',
          '   AWS_S3_BUCKET="kalpla-drive"',
          '2. Restart your development server',
          '3. Test again'
        ]
      }, { status: 400 })
    }

    // Initialize S3 client
    const s3Client = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    })

    console.log('Testing AWS S3 connectivity...')

    // Test 1: Check if our bucket exists and is accessible
    if (awsBucket) {
      try {
        const headBucketCommand = new HeadBucketCommand({ Bucket: awsBucket })
        await s3Client.send(headBucketCommand)
        console.log(`Bucket ${awsBucket} exists and is accessible`)
      } catch (bucketError: any) {
        console.error('Bucket access error:', bucketError)
        
        // If bucket doesn't exist, try to create it
        if (bucketError.name === 'NotFound' || bucketError.Code === 'NoSuchBucket') {
          try {
            console.log(`Bucket ${awsBucket} doesn't exist, attempting to create it...`)
            const createBucketCommand = new CreateBucketCommand({ 
              Bucket: awsBucket,
              CreateBucketConfiguration: awsRegion !== 'us-east-1' ? {
                LocationConstraint: awsRegion as any
              } : undefined
            })
            await s3Client.send(createBucketCommand)
            console.log(`Bucket ${awsBucket} created successfully`)
          } catch (createError: any) {
            console.error('Bucket creation failed:', createError)
            return NextResponse.json({
              status: 'error',
              message: `Bucket ${awsBucket} doesn't exist and couldn't be created`,
              error: createError.message,
              environment: envCheck,
              instructions: [
                '1. Create the bucket manually in AWS S3 Console',
                '2. Ensure bucket name is globally unique',
                '3. Check if you have s3:CreateBucket permission',
                '4. Verify the bucket name follows S3 naming rules',
                '5. Make sure the bucket doesn\'t exist in another region'
              ]
            }, { status: 400 })
          }
        } else {
          return NextResponse.json({
            status: 'error',
            message: `Bucket ${awsBucket} not accessible`,
            error: bucketError.message,
            environment: envCheck,
            instructions: [
              '1. Check if the bucket name is correct',
              '2. Verify your AWS credentials have access to this bucket',
              '3. Ensure the bucket exists in the specified region',
              '4. Check bucket permissions',
              '5. Add s3:ListBucket permission to your IAM user'
            ]
          }, { status: 400 })
        }
      }
    }

    // Test 2: Try to create a test file
    try {
      const { PutObjectCommand } = await import('@aws-sdk/client-s3')
      const testContent = `Test file created at ${new Date().toISOString()}`
      const putObjectCommand = new PutObjectCommand({
        Bucket: awsBucket,
        Key: 'test-connection.txt',
        Body: testContent,
        ContentType: 'text/plain'
      })
      
      await s3Client.send(putObjectCommand)
      console.log('Test file uploaded successfully')
    } catch (uploadError: any) {
      console.error('Upload test failed:', uploadError)
      return NextResponse.json({
        status: 'partial',
        message: 'AWS S3 connected but upload test failed',
        error: uploadError.message,
        environment: envCheck,
        instructions: [
          '1. Check bucket write permissions',
          '2. Verify bucket CORS configuration',
          '3. Add s3:PutObject permission to your IAM user',
          '4. Check if bucket allows public access (if needed)',
          '5. Ensure bucket policy allows uploads'
        ]
      }, { status: 200 })
    }

    return NextResponse.json({
      status: 'success',
      message: 'AWS S3 connection successful',
      environment: envCheck,
      bucketAccess: awsBucket ? `✅ ${awsBucket} accessible` : '⚠️ No bucket specified',
      uploadTest: '✅ Test file uploaded successfully',
      timestamp: new Date().toISOString()
    })

  } catch (error: any) {
    console.error('AWS S3 test error:', error)
    
    return NextResponse.json({
      status: 'error',
      message: 'AWS S3 connection failed',
      error: error.message,
      errorCode: error.Code,
      errorType: error.name,
      environment: {
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? '✅ Configured' : '❌ Missing',
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? '✅ Configured' : '❌ Missing',
        AWS_REGION: process.env.AWS_REGION ? `✅ ${process.env.AWS_REGION}` : '❌ Missing',
        AWS_S3_BUCKET: process.env.AWS_S3_BUCKET || process.env.AWS_S3_BUCKET_NAME ? 
          `✅ ${process.env.AWS_S3_BUCKET || process.env.AWS_S3_BUCKET_NAME}` : '❌ Missing'
      },
      instructions: [
        '1. Verify AWS credentials are correct',
        '2. Check AWS region configuration',
        '3. Ensure AWS S3 service is available',
        '4. Check network connectivity',
        '5. Verify IAM permissions for S3 access'
      ]
    }, { status: 500 })
  }
}
