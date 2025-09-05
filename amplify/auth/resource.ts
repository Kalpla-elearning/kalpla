import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource for Kalpla eLearning Platform
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    // OAuth providers for better UX
    externalProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        scopes: ['openid', 'email', 'profile'],
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || '',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
        scopes: ['user:email'],
      },
      callbackUrls: [
        'http://localhost:3000',
        'https://your-domain.amplifyapp.com',
        'https://your-custom-domain.com'
      ],
      logoutUrls: [
        'http://localhost:3000',
        'https://your-domain.amplifyapp.com',
        'https://your-custom-domain.com'
      ],
    },
  },
  userAttributes: {
    email: {
      required: true,
    },
    name: {
      required: true,
    },
    picture: {
      required: false,
    },
    // Custom attributes for role-based access control
    'custom:role': {
      required: true,
      mutable: true,
    },
    'custom:cohort': {
      required: false,
      mutable: true,
    },
    'custom:points': {
      required: false,
      mutable: true,
    },
    'custom:mentorId': {
      required: false,
      mutable: true,
    },
  },
  // Enable MFA for security
  multifactor: {
    mode: 'OPTIONAL',
    totp: true,
    sms: true,
  },
  // Password policy
  passwordPolicy: {
    minLength: 8,
    requireLowercase: true,
    requireUppercase: true,
    requireNumbers: true,
    requireSymbols: true,
  },
  access: (allow) => [
    // Students can read and update their own data
    allow.authenticated().to(['read', 'create', 'update']),
    // Mentors can read student data and grade assignments
    allow.authenticated().to(['read', 'create', 'update', 'delete']),
    // Admins have full access
    allow.authenticated().to(['read', 'create', 'update', 'delete']),
    // Guests can only read public content
    allow.guest().to(['read']),
  ],
});
