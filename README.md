# Kalpla

A comprehensive, modern e-learning platform built with Next.js, TypeScript, and Prisma. This platform provides a complete solution for online education with features for students, instructors, and administrators.

## 🚀 Features

### For Students
- Browse and search courses
- Enroll in courses with secure payment processing
- Track learning progress
- Submit assignments and take quizzes
- Access course materials (videos, PDFs, etc.)
- Receive certificates upon completion
- Interact with instructors and fellow students

### For Instructors
- Create and manage courses
- Upload course content (videos, documents, assignments)
- Track student progress and performance
- Grade assignments and provide feedback
- Manage course enrollments
- Earn revenue from course sales

### For Administrators
- User management and role assignment
- Course approval and moderation
- Platform analytics and reporting
- Payment processing oversight
- Content management

## 🛠 Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **File Storage**: AWS S3
- **Payment Processing**: Razorpay
- **Email**: Hostinger Mail (SMTP)
- **Video Streaming**: React Player
- **Form Handling**: React Hook Form with Zod validation

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js 18+ 
- npm or yarn
- PostgreSQL database
- AWS S3 bucket (for file storage)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd elearning-platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
cp env.example .env.local
```

Edit `.env.local` with your configuration:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/elearning_db"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret-key-here"

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
```

### 4. Set up the database
```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Seed the database with sample data
npm run db:seed
```

### 5. Start the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
├── app/                    # Next.js 13+ app directory
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── courses/           # Course-related pages
│   ├── dashboard/         # User dashboard
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── courses/          # Course-related components
│   ├── dashboard/        # Dashboard components
│   ├── layout/           # Layout components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   ├── auth.ts           # Authentication configuration
│   ├── prisma.ts         # Prisma client
│   └── utils.ts          # Utility functions
├── prisma/               # Database schema and migrations
│   └── schema.prisma     # Prisma schema
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🔧 Configuration

### Database Setup

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in your `.env.local`
3. Run migrations: `npm run db:migrate`

### AWS S3 Setup

1. Create an AWS S3 bucket
2. Create a bucket named `kalpla-elearning-content`
3. Generate AWS access keys and update environment variables
4. Run the setup script: `node scripts/setup-aws-s3.js`

### Email Configuration

1. Set up Hostinger Mail or any SMTP service
2. Update email configuration in environment variables

### Payment Gateway

1. Create a Razorpay account
2. Get API keys and update environment variables

## 🚀 Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Self-Hosted Deployment

1. Build the application: `npm run build`
2. Start the production server: `npm start`
3. Set up a reverse proxy (nginx) if needed
4. Configure SSL certificates

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Role-based access control
- Input validation with Zod
- CSRF protection
- Secure headers with Helmet.js
- File upload validation

## 📊 Performance Optimizations

- Server-side rendering (SSR)
- Image optimization
- Code splitting
- Caching strategies
- Database query optimization
- CDN integration for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Contact the development team

## 🔄 Updates

Stay updated with the latest features and security patches by regularly pulling from the main branch:

```bash
git pull origin main
npm install
npm run db:migrate
```

## 📈 Roadmap

- [ ] Live streaming capabilities
- [ ] Mobile app development
- [ ] Advanced analytics dashboard
- [ ] AI-powered course recommendations
- [ ] Multi-language support
- [ ] Advanced assessment tools
- [ ] Integration with external LMS platforms

---

Built with ❤️ using modern web technologies
# Deployment fix - Thu Sep  4 01:53:59 IST 2025
# Force new deployment - 1756931313
