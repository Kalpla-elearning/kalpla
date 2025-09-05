import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // User Management
  User: a
    .model({
      email: a.string().required(),
      name: a.string(),
      role: a.enum(['STUDENT', 'MENTOR', 'ADMIN']).default('STUDENT'),
      avatar: a.string(),
      phone: a.string(),
      bio: a.string(),
      points: a.integer().default(0),
      level: a.integer().default(1),
      isActive: a.boolean().default(true),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
      allow.authenticated().role('ADMIN').to(['create', 'update', 'delete']),
    ]),

  // Course Management
  Course: a
    .model({
      title: a.string().required(),
      subtitle: a.string(),
      description: a.string(),
      thumbnail: a.string(),
      trailerVideo: a.string(),
      category: a.string(),
      difficulty: a.enum(['beginner', 'intermediate', 'advanced']),
      tags: a.string().array(),
      price: a.float(),
      discountPrice: a.float(),
      isFree: a.boolean(),
      currency: a.enum(['INR', 'USD']).default('INR'),
      emiAvailable: a.boolean(),
      emiMonths: a.integer(),
      learningOutcomes: a.string().array(),
      targetAudience: a.string(),
      status: a.enum(['draft', 'published', 'archived']),
      instructorId: a.string().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
      allow.authenticated().role('ADMIN').to(['create', 'update', 'delete']),
    ]),

  // Course Modules
  Module: a
    .model({
      title: a.string().required(),
      description: a.string(),
      order: a.integer(),
      courseId: a.string().required(),
      isLocked: a.boolean(),
      unlockAfterDays: a.integer(),
      unlockDate: a.datetime(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
      allow.authenticated().role('ADMIN').to(['create', 'update', 'delete']),
    ]),

  // Course Lessons
  Lesson: a
    .model({
      title: a.string().required(),
      description: a.string(),
      type: a.enum(['video', 'document', 'quiz', 'assignment']),
      content: a.string(), // S3 URL
      duration: a.integer(), // in seconds
      order: a.integer(),
      moduleId: a.string().required(),
      isPreview: a.boolean(),
      isLocked: a.boolean(),
      resources: a.json(), // Array of resource objects
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
      allow.authenticated().role('ADMIN').to(['create', 'update', 'delete']),
    ]),

  // Student Progress
  LessonProgress: a
    .model({
      userId: a.string().required(),
      lessonId: a.string().required(),
      watchedSeconds: a.integer(),
      completed: a.boolean(),
      completedAt: a.datetime(),
      lastWatchedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  // Enrollments
  Enrollment: a
    .model({
      userId: a.string().required(),
      courseId: a.string().required(),
      enrolledAt: a.datetime(),
      progress: a.float(), // 0-100
      completedAt: a.datetime(),
      status: a.enum(['active', 'completed', 'paused']),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
      allow.authenticated().role('ADMIN').to(['create', 'update', 'delete']),
    ]),

  // Blog Posts
  Post: a
    .model({
      title: a.string().required(),
      slug: a.string().required(),
      content: a.string(),
      excerpt: a.string(),
      featuredImage: a.string(),
      authorId: a.string().required(),
      category: a.string(),
      tags: a.string().array(),
      isPublished: a.boolean().default(false),
      publishedAt: a.datetime(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
      allow.authenticated().role('ADMIN').to(['create', 'update', 'delete']),
    ]),

  // Degree Programs
  DegreeProgram: a
    .model({
      title: a.string().required(),
      description: a.string(),
      duration: a.string(),
      requirements: a.string().array(),
      curriculum: a.string().array(),
      price: a.float(),
      isActive: a.boolean().default(true),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
      allow.authenticated().role('ADMIN').to(['create', 'update', 'delete']),
    ]),

  // Mentorship
  Mentorship: a
    .model({
      mentorId: a.string().required(),
      studentId: a.string().required(),
      status: a.enum(['PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED']),
      startDate: a.datetime(),
      endDate: a.datetime(),
      goals: a.string().array(),
      notes: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
      allow.authenticated().role('ADMIN').to(['create', 'update', 'delete']),
    ]),

  // Assignments
  Assignment: a
    .model({
      title: a.string().required(),
      description: a.string(),
      lessonId: a.string().required(),
      dueDate: a.datetime(),
      maxPoints: a.integer(),
      instructions: a.string(),
      resources: a.json(), // Array of resource objects
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
      allow.authenticated().role('ADMIN').to(['create', 'update', 'delete']),
    ]),

  // Assignment Submissions
  AssignmentSubmission: a
    .model({
      assignmentId: a.string().required(),
      userId: a.string().required(),
      content: a.string(), // Submission content or file URL
      fileUrl: a.string(),
      submittedAt: a.datetime(),
      grade: a.float(),
      feedback: a.string(),
      status: a.enum(['submitted', 'graded', 'returned']),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
      allow.authenticated().role('ADMIN').to(['create', 'update', 'delete']),
    ]),

  // Payments
  Payment: a
    .model({
      userId: a.string().required(),
      courseId: a.string(),
      amount: a.float().required(),
      currency: a.string().default('INR'),
      status: a.enum(['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED']),
      paymentMethod: a.string(),
      transactionId: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
      allow.authenticated().role('ADMIN').to(['create', 'update', 'delete']),
    ]),

  // Notifications
  Notification: a
    .model({
      userId: a.string().required(),
      title: a.string().required(),
      message: a.string().required(),
      type: a.enum(['INFO', 'SUCCESS', 'WARNING', 'ERROR']),
      isRead: a.boolean().default(false),
      readAt: a.datetime(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  // Referral System
  ReferralCode: a
    .model({
      code: a.string().required(),
      userId: a.string().required(),
      isActive: a.boolean().default(true),
      uses: a.integer().default(0),
      maxUses: a.integer(),
      expiresAt: a.datetime(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  Referral: a
    .model({
      referrerId: a.string().required(),
      refereeId: a.string().required(),
      code: a.string().required(),
      status: a.enum(['PENDING', 'COMPLETED', 'EXPIRED']),
      reward: a.float(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});