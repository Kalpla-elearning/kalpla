#!/bin/bash

# Kalpla eLearning Platform - Deployment Script
echo "🚀 Starting deployment process..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "⚠️  Warning: You have uncommitted changes. Please commit them first."
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run type checking
echo "🔍 Running type checking..."
npm run type-check

# Run linting
echo "🧹 Running linting..."
npm run lint

# Build the application
echo "🏗️  Building application..."
npm run build

# Generate Prisma client
echo "🗄️  Generating Prisma client..."
npm run db:generate

echo "✅ Build completed successfully!"

# Deployment options
echo "🚀 Deployment options:"
echo "1. AWS Amplify: Connect your GitHub repository to AWS Amplify"
echo "2. AWS EC2: Use the provided Docker configuration"
echo "3. Other platforms: Deploy using standard Next.js build process"

echo "🎉 Deployment process completed!"
echo "📋 Next steps:"
echo "   1. Test your live site"
echo "   2. Update OAuth callback URLs"
echo "   3. Set up monitoring"
echo "   4. Share with users!"
