import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * Kalpla eLearning Platform - Data Schema
 * Comprehensive schema for courses, users, enrollments, and more
 */

const schema = a.schema({
  // User model
  User: a
    .model({
      name: a.string().required(),
      email: a.string().required(),
      role: a.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']).default('STUDENT'),
      avatar: a.string(),
      bio: a.string(),
      isActive: a.boolean().default(true),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      
      // Relations
      courses: a.hasMany('Course', 'instructorId'),
      enrollments: a.hasMany('Enrollment', 'userId'),
      reviews: a.hasMany('Review', 'userId'),
      posts: a.hasMany('Post', 'authorId'),
      replies: a.hasMany('Reply', 'authorId'),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.authenticated().to(['read']),
    ]),

  // Course model
  Course: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      slug: a.string(),
      thumbnail: a.string(),
      thumbnailUrl: a.string(),
      videoUrl: a.string(),
      price: a.float().required(),
      category: a.string(),
      subcategory: a.string(),
      tags: a.string(),
      requirements: a.string(),
      learningOutcomes: a.string(),
      instructorId: a.id().required(),
      status: a.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
      level: a.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
      duration: a.integer(),
      currency: a.string().default('USD'),
      isFeatured: a.boolean().default(false),
      access: a.enum(['PUBLIC', 'PRIVATE', 'PREMIUM']).default('PUBLIC'),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      
      // Relations
      instructor: a.belongsTo('User', 'instructorId'),
      enrollments: a.hasMany('Enrollment', 'courseId'),
      modules: a.hasMany('Module', 'courseId'),
      reviews: a.hasMany('Review', 'courseId'),
      discussions: a.hasMany('Discussion', 'courseId'),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read']),
      allow.guest().to(['read']),
    ]),

  // Module model
  Module: a
    .model({
      title: a.string().required(),
      description: a.string(),
      order: a.integer().required(),
      courseId: a.id().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      
      // Relations
      course: a.belongsTo('Course', 'courseId'),
      lessons: a.hasMany('Lesson', 'moduleId'),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read']),
    ]),

  // Lesson model
  Lesson: a
    .model({
      title: a.string().required(),
      description: a.string(),
      content: a.string(),
      type: a.enum(['VIDEO', 'TEXT', 'QUIZ', 'ASSIGNMENT']).required(),
      url: a.string(),
      videoUrl: a.string(),
      documentUrl: a.string(),
      order: a.integer().required(),
      moduleId: a.id().required(),
      isPublished: a.boolean().default(false),
      duration: a.integer(), // in minutes
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      
      // Relations
      module: a.belongsTo('Module', 'moduleId'),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read']),
    ]),

  // Enrollment model
  Enrollment: a
    .model({
      userId: a.id().required(),
      courseId: a.id().required(),
      status: a.enum(['ACTIVE', 'COMPLETED', 'CANCELLED', 'SUSPENDED']).default('ACTIVE'),
      enrolledAt: a.datetime(),
      completedAt: a.datetime(),
      progress: a.float().default(0),
      
      // Relations
      user: a.belongsTo('User', 'userId'),
      course: a.belongsTo('Course', 'courseId'),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read']),
    ]),

  // Review model
  Review: a
    .model({
      userId: a.id().required(),
      courseId: a.id().required(),
      rating: a.integer().required(),
      comment: a.string(),
      isVerified: a.boolean().default(false),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      
      // Relations
      user: a.belongsTo('User', 'userId'),
      course: a.belongsTo('Course', 'courseId'),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read']),
    ]),

  // Category model
  Category: a
    .model({
      name: a.string().required(),
      description: a.string(),
      color: a.string(),
      slug: a.string(),
      parentId: a.id(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      
      // Relations
      parent: a.belongsTo('Category', 'parentId'),
      children: a.hasMany('Category', 'parentId'),
    })
    .authorization((allow) => [
      allow.authenticated().to(['read', 'create', 'update', 'delete']),
      allow.guest().to(['read']),
    ]),

  // Post model (for blog)
  Post: a
    .model({
      title: a.string().required(),
      slug: a.string(),
      content: a.string().required(),
      excerpt: a.string(),
      featuredImage: a.string(),
      authorId: a.id().required(),
      status: a.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
      publishedAt: a.datetime(),
      metaTitle: a.string(),
      metaDescription: a.string(),
      tags: a.string(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      
      // Relations
      author: a.belongsTo('User', 'authorId'),
      comments: a.hasMany('Comment', 'postId'),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read']),
      allow.guest().to(['read']),
    ]),

  // Comment model
  Comment: a
    .model({
      postId: a.id().required(),
      authorId: a.id().required(),
      content: a.string().required(),
      parentId: a.id(),
      isApproved: a.boolean().default(true),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      
      // Relations
      post: a.belongsTo('Post', 'postId'),
      author: a.belongsTo('User', 'authorId'),
      parent: a.belongsTo('Comment', 'parentId'),
      replies: a.hasMany('Comment', 'parentId'),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read']),
      allow.guest().to(['read']),
    ]),

  // Discussion model (for course discussions)
  Discussion: a
    .model({
      title: a.string().required(),
      content: a.string().required(),
      courseId: a.id().required(),
      authorId: a.id().required(),
      status: a.enum(['OPEN', 'CLOSED', 'RESOLVED']).default('OPEN'),
      priority: a.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('LOW'),
      isPinned: a.boolean().default(false),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      
      // Relations
      course: a.belongsTo('Course', 'courseId'),
      author: a.belongsTo('User', 'authorId'),
      replies: a.hasMany('Reply', 'discussionId'),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read', 'create']),
    ]),

  // Reply model
  Reply: a
    .model({
      discussionId: a.id().required(),
      authorId: a.id().required(),
      content: a.string().required(),
      parentId: a.id(),
      isSolution: a.boolean().default(false),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      
      // Relations
      discussion: a.belongsTo('Discussion', 'discussionId'),
      author: a.belongsTo('User', 'authorId'),
      parent: a.belongsTo('Reply', 'parentId'),
      replies: a.hasMany('Reply', 'parentId'),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read', 'create']),
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
