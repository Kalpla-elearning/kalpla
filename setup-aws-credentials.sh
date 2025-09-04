#!/bin/bash

echo "🔧 AWS Credentials Setup for Amplify"
echo "====================================="
echo ""

echo "This script will help you set up AWS credentials for Amplify."
echo ""

echo "📋 What you need:"
echo "1. AWS Access Key ID"
echo "2. AWS Secret Access Key"
echo "3. Default region (recommended: us-east-1)"
echo ""

echo "🚀 Let's set up your credentials:"
echo ""

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed."
    echo "Please install it first: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

echo "✅ AWS CLI is installed."
echo ""

# Run aws configure
echo "🔑 Running 'aws configure'..."
echo "Enter your credentials when prompted:"
echo ""

aws configure

echo ""
echo "🧪 Testing your credentials..."

# Test the credentials
if aws sts get-caller-identity &> /dev/null; then
    echo "✅ AWS credentials are working!"
    echo ""
    
    # Run the permissions test
    echo "🔍 Testing permissions for Amplify..."
    node test-aws-permissions.js
    
    echo ""
    echo "🎉 Setup complete!"
    echo ""
    echo "Next steps:"
    echo "1. If all tests passed, run: npx ampx sandbox"
    echo "2. If some tests failed, check the error messages above"
    echo "3. You may need to add more permissions to your AWS user"
    
else
    echo "❌ AWS credentials are not working."
    echo "Please check your access key and secret key."
    echo ""
    echo "To try again, run: aws configure"
fi
