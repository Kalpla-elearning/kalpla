# 🔧 Fix AWS IAM Permissions for Amplify Sandbox

## ❌ **Current Error:**
```
[SSMCredentialsError] AccessDeniedException: User: arn:aws:iam::112914241644:user/kalpla-course is not authorized to perform: ssm:GetParameter on resource: arn:aws:ssm:ap-south-1:112914241644:parameter/cdk-bootstrap/hnb659fds/version
```

## 🛠️ **Solution: Add Required IAM Permissions**

### **Step 1: Access AWS IAM Console**

1. **Go to AWS IAM Console:**
   - Open: https://console.aws.amazon.com/iam/
   - Make sure you're in the correct region (ap-south-1)

2. **Navigate to Users:**
   - Click "Users" in the left sidebar
   - Find and click on "kalpla-course"

### **Step 2: Add Required Policies**

#### **Option A: Attach AWS Managed Policies (Quick Fix)**

1. **Click "Add permissions" → "Attach policies directly"**

2. **Search and attach these policies:**
   - `AmazonSSMReadOnlyAccess`
   - `AWSCloudFormationFullAccess`
   - `IAMFullAccess`
   - `AmazonS3FullAccess`
   - `AmazonCognitoPowerUser`
   - `AWSLambdaFullAccess`
   - `AmazonAPIGatewayAdministrator`

3. **Click "Next" → "Add permissions"**

#### **Option B: Create Custom Policy (Recommended)**

1. **Go to Policies → Create Policy**

2. **Use JSON editor and paste this policy:**
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
           "ssm:DescribeParameters",
           "ssm:ListParameters",
           "cloudformation:*",
           "iam:*",
           "s3:*",
           "cognito-idp:*",
           "cognito-identity:*",
           "lambda:*",
           "apigateway:*",
           "dynamodb:*",
           "logs:*",
           "events:*",
           "sts:AssumeRole",
           "sts:GetCallerIdentity"
         ],
         "Resource": "*"
       }
     ]
   }
   ```

3. **Name the policy:** `AmplifyFullAccess`
4. **Create policy and attach to user**

### **Step 3: Verify Permissions**

1. **Check attached policies:**
   - Go to Users → kalpla-course → Permissions
   - Verify all required policies are attached

2. **Test AWS CLI access:**
   ```bash
   aws sts get-caller-identity
   aws ssm get-parameter --name "/cdk-bootstrap/hnb659fds/version" --region ap-south-1
   ```

### **Step 4: Test Amplify Sandbox**

1. **Try running sandbox again:**
   ```bash
   npx ampx sandbox
   ```

2. **If still failing, try with debug:**
   ```bash
   npx ampx sandbox --debug
   ```

## 🚀 **Alternative: Use Different AWS Profile**

If you can't modify the existing user, create a new one:

### **Step 1: Create New IAM User**

1. **Go to IAM → Users → Create user**
2. **Username:** `amplify-admin`
3. **Attach policy:** `AdministratorAccess`
4. **Create access key**

### **Step 2: Configure New Credentials**

```bash
aws configure
# Enter new credentials when prompted
```

### **Step 3: Test with New Credentials**

```bash
aws sts get-caller-identity
npx ampx sandbox
```

## 🔍 **Troubleshooting Commands**

### **Check Current AWS Identity:**
```bash
aws sts get-caller-identity
```

### **Test SSM Access:**
```bash
aws ssm get-parameter --name "/cdk-bootstrap/hnb659fds/version" --region ap-south-1
```

### **List User Policies:**
```bash
aws iam list-attached-user-policies --user-name kalpla-course
aws iam list-user-policies --user-name kalpla-course
```

### **Check CloudFormation Stacks:**
```bash
aws cloudformation list-stacks --region ap-south-1
```

## 📋 **Required Permissions Summary**

The user needs these permissions:
- **SSM:** Read parameters (for CDK bootstrap)
- **CloudFormation:** Full access (for stack management)
- **IAM:** Full access (for role creation)
- **S3:** Full access (for artifacts)
- **Cognito:** Full access (for auth)
- **Lambda:** Full access (for functions)
- **API Gateway:** Full access (for APIs)
- **DynamoDB:** Full access (for data)

## ⚡ **Quick Fix (If You Have Admin Access)**

If you have admin access to the AWS account:

1. **Go to IAM → Users → kalpla-course**
2. **Click "Add permissions" → "Attach policies directly"**
3. **Search for "AdministratorAccess"**
4. **Attach it temporarily**
5. **Test Amplify sandbox**
6. **Remove AdministratorAccess after testing**

## 🎯 **Expected Result**

After fixing permissions, you should see:
```
✅ Sandbox environment created successfully
✅ Auth resource deployed
✅ Data resource deployed
✅ Ready for development
```

## 🆘 **If Still Having Issues**

1. **Check AWS CloudTrail** for detailed error logs
2. **Verify the user has the correct policies**
3. **Try a different AWS region** (us-east-1)
4. **Contact AWS Support** if needed

---

**The main issue is that the `kalpla-course` user needs SSM and CloudFormation permissions to work with Amplify sandbox!** 🎉
