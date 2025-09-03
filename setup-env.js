const fs = require('fs');
const path = require('path');

const envContent = `# Database
DATABASE_URL="postgresql://username:password@localhost:5432/elearning_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here-change-this-in-production"

# Email (Hostinger Mail)
EMAIL_SERVER_HOST="smtp.hostinger.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@yourdomain.com"
EMAIL_SERVER_PASSWORD="your-email-password"
EMAIL_FROM="noreply@yourdomain.com"

# AWS S3 Storage
AWS_REGION="us-east-1"
AWS_ACCESS_KEY_ID="your-aws-access-key-id"
AWS_SECRET_ACCESS_KEY="your-aws-secret-access-key"
AWS_S3_BUCKET_NAME="kalpla-elearning-content"

# Razorpay Payment Gateway
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-secret-key"

# JWT
JWT_SECRET="your-jwt-secret-key"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="Kalpla"

# Optional: Google OAuth (for social login)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Optional: GitHub OAuth (for social login)
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"
`;

const envPath = path.join(__dirname, '.env.local');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file');
  console.log('📝 Please update the environment variables with your actual values');
} else {
  console.log('⚠️  .env.local already exists');
}

console.log('\n🚀 Next steps:');
console.log('1. Update DATABASE_URL with your PostgreSQL connection string');
console.log('2. Generate a secure NEXTAUTH_SECRET');
console.log('3. Configure your email settings');
console.log('4. Set up AWS S3 for file storage');
console.log('5. Configure Razorpay for payments');
console.log('6. Run: npm run db:migrate');
