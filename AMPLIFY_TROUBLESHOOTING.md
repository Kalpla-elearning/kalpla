# 🔧 AWS Amplify Troubleshooting Guide

## ❌ **Current Issues:**

### **1. AWS IAM Permissions Error**
```
[SSMCredentialsError] AccessDeniedException: User: arn:aws:iam::112914241644:user/kalpla-course is not authorized to perform: ssm:GetParameter on resource: arn:aws:ssm:ap-south-1:112914241644:parameter/cdk-bootstrap/hnb659fds/version
```

### **2. Auth Page Server Error**
```
Server error
There is a problem with the server configuration.
Check the server logs for more information.
```

## 🛠️ **Solutions:**

### **Fix 1: AWS IAM Permissions**

The AWS user `kalpla-course` needs additional permissions. Here's how to fix it:

#### **Option A: Add Required Permissions (Recommended)**

1. **Go to AWS IAM Console:**
   - Navigate to [AWS IAM Console](https://console.aws.amazon.com/iam/)
   - Go to "Users" → "kalpla-course"

2. **Attach Additional Policies:**
   - Click "Add permissions" → "Attach policies directly"
   - Add these policies:
     - `AmazonSSMReadOnlyAccess`
     - `AWSCloudFormationFullAccess`
     - `IAMFullAccess`
     - `AmazonS3FullAccess`
     - `AmazonCognitoPowerUser`

3. **Create Custom Policy (Alternative):**
   ```json
   {
     "Version": "2012-10-17",
     "Statement": [
       {
         "Effect": "Allow",
         "Action": [
           "ssm:GetParameter",
           "ssm:GetParameters",
           "ssm:GetParametersByPath",
           "cloudformation:*",
           "iam:*",
           "s3:*",
           "cognito-idp:*",
           "cognito-identity:*",
           "lambda:*",
           "apigateway:*",
           "dynamodb:*"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

#### **Option B: Use AWS Administrator (Quick Fix)**

1. **Create a new IAM user with AdministratorAccess:**
   - Go to IAM Console → Users → Create user
   - Name: `amplify-admin`
   - Attach policy: `AdministratorAccess`

2. **Update AWS credentials:**
   ```bash
   aws configure
   # Enter new credentials
   ```

### **Fix 2: Auth Page Configuration**

The auth page error is because it's trying to use NextAuth.js but Amplify has its own auth system.

#### **Solution: Use Amplify Auth Page**

1. **Access the Amplify-compatible auth page:**
   - Go to: `http://localhost:3000/auth/signin-amplify`
   - This uses AWS Amplify authentication

2. **Or update the main auth page:**
   - Replace `app/auth/signin/page.tsx` with Amplify version
   - Update imports to use `aws-amplify/auth`

### **Fix 3: Deploy Without Sandbox (Alternative)**

If sandbox continues to fail, deploy directly to Amplify:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Fix Amplify configuration"
   git push origin main
   ```

2. **Deploy via Amplify Console:**
   - Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify)
   - Connect your GitHub repository
   - Deploy without local testing

## 🚀 **Step-by-Step Fix Process:**

### **Step 1: Fix AWS Permissions**
```bash
# Option 1: Update existing user permissions in AWS Console
# Option 2: Create new admin user
aws configure
# Enter new credentials
```

### **Step 2: Test Amplify Sandbox**
```bash
npx ampx sandbox
```

### **Step 3: If Sandbox Still Fails, Deploy Directly**
```bash
# Push to GitHub
git add .
git commit -m "Fix Amplify auth configuration"
git push origin main

# Deploy via Amplify Console
# Go to: https://console.aws.amazon.com/amplify
```

### **Step 4: Test Authentication**
1. **Local Testing:**
   - Go to: `http://localhost:3000/auth/signin-amplify`
   - Test email/password sign in

2. **Production Testing:**
   - Go to your Amplify app URL
   - Test authentication flow

## 🔍 **Debugging Commands:**

### **Check AWS Credentials:**
```bash
aws sts get-caller-identity
```

### **Check Amplify Status:**
```bash
npx ampx sandbox --debug
```

### **View Amplify Logs:**
```bash
npx ampx sandbox --stream-function-logs
```

## 📋 **Environment Variables Needed:**

Create `.env.local` with:
```bash
# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key

# Amplify Auth (will be provided by Amplify)
NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_ID=your_user_pool_id
NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_WEB_CLIENT_ID=your_client_id
NEXT_PUBLIC_AMPLIFY_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_AMPLIFY_AUTH_REDIRECT_SIGN_IN=http://localhost:3000
NEXT_PUBLIC_AMPLIFY_AUTH_REDIRECT_SIGN_OUT=http://localhost:3000

# Database (keep existing)
DATABASE_URL=your_neon_database_url
```

## 🎯 **Quick Fix Summary:**

1. **Fix AWS IAM permissions** (most important)
2. **Use Amplify auth page** instead of NextAuth
3. **Deploy via Amplify Console** if sandbox fails
4. **Test authentication** on both local and production

## 🆘 **If Still Having Issues:**

1. **Check AWS CloudTrail** for detailed error logs
2. **Verify IAM policies** are properly attached
3. **Try different AWS region** (us-east-1 recommended)
4. **Contact AWS Support** if needed

---

**The main issue is AWS IAM permissions. Fix that first, then everything else should work!** 🎉
