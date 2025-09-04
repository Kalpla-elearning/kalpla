import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * Kalpla eLearning Platform - Simplified Data Schema
 * Basic schema to get started with Amplify
 */

const schema = a.schema({
  // Simple Todo model for testing
  Todo: a
    .model({
      content: a.string().required(),
      isCompleted: a.boolean().default(false),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read']),
    ]),

  // Course model
  Course: a
    .model({
      title: a.string().required(),
      description: a.string().required(),
      price: a.float().required(),
      category: a.string(),
      status: a.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
      allow.authenticated().to(['read']),
      allow.guest().to(['read']),
    ]),

  // User Profile model
  UserProfile: a
    .model({
      name: a.string().required(),
      email: a.string().required(),
      role: a.enum(['STUDENT', 'INSTRUCTOR', 'ADMIN']).default('STUDENT'),
      avatar: a.string(),
      bio: a.string(),
    })
    .authorization((allow) => [
      allow.owner().to(['read', 'create', 'update', 'delete']),
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
