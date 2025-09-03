# Authentication System Guide

## 🔐 Overview

The e-learning platform includes a comprehensive authentication system with role-based access control for three user types:

- **ADMIN** - Full platform management
- **INSTRUCTOR** - Course creation and management
- **STUDENT** - Learning and course enrollment

## 🚀 Quick Start

### 1. Environment Setup

The `.env.local` file has been created with default values. Update these key variables:

```bash
# Required for authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secure-secret-key-here"

# Required for database
DATABASE_URL="postgresql://username:password@localhost:5432/elearning_db"
```

### 2. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run database migrations
npm run db:migrate
```

### 3. Demo Users

For testing, use these pre-generated demo accounts:

#### Admin User
- **Email:** `admin@example.com`
- **Password:** `admin123`
- **Access:** Full platform management, user management, analytics

#### Instructor User
- **Email:** `instructor@example.com`
- **Password:** `instructor123`
- **Access:** Course creation, student management, earnings tracking

#### Student User
- **Email:** `student@example.com`
- **Password:** `student123`
- **Access:** Course enrollment, learning progress, certificates

## 🛡️ Authentication Flow

### Sign Up Process
1. User visits `/auth/signup`
2. Selects role (Student/Instructor)
3. Provides name, email, password
4. Account created with selected role
5. Redirected to appropriate dashboard

### Sign In Process
1. User visits `/auth/signin`
2. Enters email and password
3. System validates credentials
4. Redirected based on role:
   - **ADMIN** → `/admin/dashboard`
   - **INSTRUCTOR** → `/instructor/dashboard`
   - **STUDENT** → `/dashboard`

## 🎯 Role-Based Access Control

### Admin Dashboard (`/admin/dashboard`)
- **User Management** - View, edit, delete users
- **Course Oversight** - Approve/reject courses
- **Analytics** - Platform-wide statistics
- **Content Management** - Manage blog posts
- **Payment Processing** - Handle refunds and disputes

### Instructor Dashboard (`/instructor/dashboard`)
- **Course Creation** - Build and publish courses
- **Student Management** - View enrolled students
- **Earnings Tracking** - Monitor revenue and payouts
- **Analytics** - Course performance metrics
- **Content Upload** - Videos, documents, assignments

### Student Dashboard (`/dashboard`)
- **Course Library** - Enrolled and available courses
- **Learning Progress** - Track completion and certificates
- **Assignments** - Submit and view grades
- **Profile Management** - Update personal information
- **Payment History** - View transaction records

## 🔒 Security Features

### Password Security
- **bcrypt hashing** with salt rounds of 12
- **Minimum 6 characters** required
- **Secure password validation**

### Session Management
- **JWT-based sessions** via NextAuth.js
- **Automatic token refresh**
- **Secure cookie handling**

### Route Protection
- **Middleware-based protection** for sensitive routes
- **Role-based redirects** after authentication
- **Automatic logout** on token expiration

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login (handled by NextAuth)
- `GET /api/auth/session` - Get current session

### Protected Routes
All API routes under `/api/protected/` require authentication.

## 📱 User Interface

### Sign Up Page (`/auth/signup`)
- Role selection (Student/Instructor)
- Form validation with real-time feedback
- Password strength indicators
- Terms and conditions acceptance

### Sign In Page (`/auth/signin`)
- Clean, modern design
- Remember me functionality
- Forgot password link
- Social login options (configurable)

### Dashboards
- **Responsive design** for all devices
- **Role-specific navigation** and features
- **Real-time data** and statistics
- **Quick action buttons** for common tasks

## 🔧 Configuration

### NextAuth.js Setup
```javascript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // Email/password authentication
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    // Role-based session handling
  }
}
```

### Middleware Protection
```javascript
// middleware.ts
export default withAuth(middleware, {
  callbacks: {
    authorized: ({ token, req }) => {
      // Route protection logic
    }
  }
})
```

## 🚨 Troubleshooting

### Common Issues

1. **"NEXTAUTH_SECRET not found"**
   - Add `NEXTAUTH_SECRET` to your `.env.local`
   - Generate a secure random string

2. **"DATABASE_URL not found"**
   - Set up PostgreSQL database
   - Update `DATABASE_URL` in `.env.local`

3. **"User not found"**
   - Ensure user exists in database
   - Check email/password combination

4. **"Access denied"**
   - Verify user role in database
   - Check middleware configuration

### Debug Mode
Enable NextAuth debug mode:
```bash
NEXTAUTH_DEBUG=true
```

## 📊 Database Schema

### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  password      String
  role          UserRole  @default(STUDENT)
  avatar        String?
  bio           String?
  isVerified    Boolean   @default(false)
  emailVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}
```

## 🔄 Next Steps

1. **Set up your database** with the provided schema
2. **Configure environment variables** in `.env.local`
3. **Run database migrations** to create tables
4. **Test authentication** with demo users
5. **Customize dashboards** for your specific needs
6. **Add social login** providers (Google, GitHub)
7. **Implement email verification** for new users
8. **Set up password reset** functionality

## 📞 Support

For authentication-related issues:
1. Check the console for error messages
2. Verify environment variables are set correctly
3. Ensure database is running and accessible
4. Test with demo user credentials first

---

**Happy Learning! 🎓**
