const fs = require('fs')
const path = require('path')

console.log('🔐 Setting up Authentication for Kalpla...\n')

// Create .env.local file with authentication configuration
const envContent = `# Database
DATABASE_URL="postgresql://neondb_owner:npg_EFRtiQy2xBr5@ep-red-math-a1if7t7d-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require&connection_limit=3&pool_timeout=20&connect_timeout=60"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-please-change-this"

# AWS Amplify Auth (Configure these with your Amplify values)
NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_ID=""
NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_WEB_CLIENT_ID=""
NEXT_PUBLIC_AMPLIFY_AUTH_DOMAIN=""
NEXT_PUBLIC_AMPLIFY_AUTH_REDIRECT_SIGN_IN="http://localhost:3000/auth/callback"
NEXT_PUBLIC_AMPLIFY_AUTH_REDIRECT_SIGN_OUT="http://localhost:3000"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
GITHUB_ID=""
GITHUB_SECRET=""

# Email Configuration
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=""
EMAIL_SERVER_PASSWORD=""
EMAIL_FROM=""

# AWS S3
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="ap-south-1"
AWS_S3_BUCKET=""

# Razorpay
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""

# JWT Secret
JWT_SECRET="your-jwt-secret-here-please-change-this"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Kalpla"
`

const envPath = path.join(__dirname, '..', '.env.local')

try {
  fs.writeFileSync(envPath, envContent)
  console.log('✅ Created .env.local file')
} catch (error) {
  console.log('❌ Error creating .env.local:', error.message)
}

console.log('\n📋 Next Steps:')
console.log('1. Configure AWS Amplify Auth:')
console.log('   - Run: npx ampx sandbox')
console.log('   - Copy the generated values to .env.local')
console.log('   - Update NEXT_PUBLIC_AMPLIFY_AUTH_* variables')

console.log('\n2. Generate secrets:')
console.log('   - Run: openssl rand -base64 32')
console.log('   - Update NEXTAUTH_SECRET and JWT_SECRET')

console.log('\n3. Optional OAuth setup:')
console.log('   - Configure Google OAuth: https://console.developers.google.com/')
console.log('   - Configure GitHub OAuth: https://github.com/settings/applications/new')

console.log('\n4. Start the development server:')
console.log('   - Run: npm run dev')

console.log('\n🎉 Authentication setup complete!')
console.log('   - Sign up: http://localhost:3000/auth/signup')
console.log('   - Sign in: http://localhost:3000/auth/signin-amplify')
console.log('   - Dashboard: http://localhost:3000/dashboard')
