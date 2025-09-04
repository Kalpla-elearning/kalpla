#!/bin/bash

# AWS Deployment Script for Kalpla eLearning Platform
# This script helps deploy your Next.js app to AWS

echo "🚀 AWS Deployment Script for Kalpla eLearning Platform"
echo "=================================================="

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "❌ AWS CLI is not installed. Please install it first:"
    echo "   https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
    exit 1
fi

# Check if user is logged in to AWS
if ! aws sts get-caller-identity &> /dev/null; then
    echo "❌ Not logged in to AWS. Please run 'aws configure' first"
    exit 1
fi

echo "✅ AWS CLI is configured"

# Function to deploy to AWS Amplify
deploy_amplify() {
    echo "🎯 Deploying to AWS Amplify..."
    echo "1. Go to https://console.aws.amazon.com/amplify/"
    echo "2. Click 'New app' → 'Host web app'"
    echo "3. Connect your GitHub repository: Kalpla-elearning/kalpla"
    echo "4. Select branch: main"
    echo "5. Add environment variables (see aws-deployment-guide.md)"
    echo "6. Click 'Save and deploy'"
    echo ""
    echo "Your app will be available at: https://your-app-id.amplifyapp.com"
}

# Function to deploy to AWS Elastic Beanstalk
deploy_beanstalk() {
    echo "🎯 Deploying to AWS Elastic Beanstalk..."
    
    # Build the application
    echo "📦 Building the application..."
    npm run build
    
    # Create deployment package
    echo "📦 Creating deployment package..."
    zip -r kalpla-deployment.zip .next package.json package-lock.json public prisma -x "node_modules/*" ".git/*"
    
    echo "✅ Deployment package created: kalpla-deployment.zip"
    echo ""
    echo "Next steps:"
    echo "1. Go to https://console.aws.amazon.com/elasticbeanstalk/"
    echo "2. Create a new application"
    echo "3. Upload kalpla-deployment.zip"
    echo "4. Configure environment variables"
    echo "5. Deploy"
}

# Function to deploy to AWS EC2 with Docker
deploy_ec2() {
    echo "🎯 Deploying to AWS EC2 with Docker..."
    
    # Build Docker image
    echo "🐳 Building Docker image..."
    docker build -t kalpla-elearning .
    
    # Tag for ECR (if using ECR)
    echo "🏷️  Tagging image for ECR..."
    aws ecr get-login-password --region ap-southeast-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.ap-southeast-1.amazonaws.com
    docker tag kalpla-elearning:latest your-account-id.dkr.ecr.ap-southeast-1.amazonaws.com/kalpla-elearning:latest
    
    # Push to ECR
    echo "📤 Pushing to ECR..."
    docker push your-account-id.dkr.ecr.ap-southeast-1.amazonaws.com/kalpla-elearning:latest
    
    echo "✅ Docker image pushed to ECR"
    echo ""
    echo "Next steps:"
    echo "1. Launch EC2 instance"
    echo "2. Install Docker on EC2"
    echo "3. Pull and run your image"
    echo "4. Configure load balancer and domain"
}

# Main menu
echo "Choose your deployment method:"
echo "1) AWS Amplify (Recommended)"
echo "2) AWS Elastic Beanstalk"
echo "3) AWS EC2 with Docker"
echo "4) Show all options"
echo ""

read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        deploy_amplify
        ;;
    2)
        deploy_beanstalk
        ;;
    3)
        deploy_ec2
        ;;
    4)
        echo "📋 All deployment options:"
        echo ""
        echo "1. AWS Amplify (Easiest)"
        echo "   - Automatic deployments from GitHub"
        echo "   - Global CDN"
        echo "   - SSL certificates"
        echo "   - Cost: $5-20/month"
        echo ""
        echo "2. AWS Elastic Beanstalk"
        echo "   - Container-based deployment"
        echo "   - Auto-scaling"
        echo "   - Load balancing"
        echo "   - Cost: $20-50/month"
        echo ""
        echo "3. AWS EC2 with Docker"
        echo "   - Full control"
        echo "   - Custom configuration"
        echo "   - Cost: $30-100/month"
        echo ""
        echo "4. AWS ECS/Fargate"
        echo "   - Serverless containers"
        echo "   - Auto-scaling"
        echo "   - Cost: $20-80/month"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📚 For detailed instructions, see aws-deployment-guide.md"
echo "🎉 Happy deploying!"
