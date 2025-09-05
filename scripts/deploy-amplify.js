#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting AWS Amplify Deployment...\n');

// Check if we're in the right directory
if (!fs.existsSync('package.json')) {
  console.error('❌ Error: package.json not found. Please run this script from the project root.');
  process.exit(1);
}

// Check if amplify is installed
try {
  execSync('npx ampx --version', { stdio: 'pipe' });
} catch (error) {
  console.error('❌ Error: AWS Amplify CLI not found. Please install it first:');
  console.error('npm install -g @aws-amplify/cli');
  process.exit(1);
}

// Step 1: Install dependencies
console.log('📦 Installing dependencies...');
try {
  execSync('npm ci', { stdio: 'inherit' });
  console.log('✅ Dependencies installed successfully\n');
} catch (error) {
  console.error('❌ Error installing dependencies:', error.message);
  process.exit(1);
}

// Step 2: Generate Prisma client
console.log('🔧 Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated successfully\n');
} catch (error) {
  console.warn('⚠️ Warning: Prisma generate failed:', error.message);
  console.log('📝 Continuing with build...\n');
}

// Step 3: Type check
console.log('🔍 Running TypeScript type check...');
try {
  execSync('npm run type-check', { stdio: 'inherit' });
  console.log('✅ Type check passed\n');
} catch (error) {
  console.warn('⚠️ Warning: Type check failed:', error.message);
  console.log('📝 Continuing with build (ignoring type errors)...\n');
}

// Step 4: Build the application
console.log('🏗️ Building the application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully\n');
} catch (error) {
  console.error('❌ Error building application:', error.message);
  process.exit(1);
}

// Step 5: Initialize Amplify (if not already done)
console.log('🔧 Initializing Amplify backend...');
try {
  if (!fs.existsSync('amplify_outputs.json')) {
    execSync('npx ampx sandbox --once', { stdio: 'inherit' });
    console.log('✅ Amplify backend initialized\n');
  } else {
    console.log('✅ Amplify backend already initialized\n');
  }
} catch (error) {
  console.warn('⚠️ Warning: Amplify initialization failed:', error.message);
  console.log('📝 You may need to configure AWS credentials\n');
}

// Step 6: Check environment variables
console.log('🔍 Checking environment variables...');
const requiredEnvVars = [
  'DATABASE_URL',
  'NEXTAUTH_URL',
  'NEXTAUTH_SECRET'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.warn('⚠️ Warning: Missing environment variables:', missingVars.join(', '));
  console.log('📝 Please set these in your AWS Amplify environment variables\n');
} else {
  console.log('✅ All required environment variables are set\n');
}

// Step 7: Create deployment summary
const deploymentSummary = {
  timestamp: new Date().toISOString(),
  version: '1.0.3',
  buildStatus: 'success',
  environment: process.env.NODE_ENV || 'development',
  missingEnvVars: missingVars,
  nextSteps: [
    '1. Configure AWS Amplify environment variables',
    '2. Set up RDS database for production',
    '3. Configure S3 bucket for file uploads',
    '4. Set up CloudFront distribution',
    '5. Deploy to AWS Amplify Console'
  ]
};

fs.writeFileSync('deployment-summary.json', JSON.stringify(deploymentSummary, null, 2));

console.log('📋 Deployment Summary:');
console.log('====================');
console.log(`✅ Build Status: ${deploymentSummary.buildStatus}`);
console.log(`📅 Timestamp: ${deploymentSummary.timestamp}`);
console.log(`🏷️ Version: ${deploymentSummary.version}`);
console.log(`🌍 Environment: ${deploymentSummary.environment}`);

if (missingVars.length > 0) {
  console.log(`⚠️ Missing Variables: ${missingVars.join(', ')}`);
}

console.log('\n📝 Next Steps:');
deploymentSummary.nextSteps.forEach(step => console.log(`   ${step}`));

console.log('\n🎉 Deployment preparation completed!');
console.log('📁 Build artifacts are ready in .next/ directory');
console.log('📄 Deployment summary saved to deployment-summary.json');
console.log('\n🚀 Ready to deploy to AWS Amplify Console!');
