import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource for Kalpla eLearning Platform
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: true,
    externalProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        scopes: ['openid', 'email', 'profile'],
      },
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
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
  },
  access: (allow) => [
    allow.authenticated().to(['read', 'create', 'update', 'delete']),
    allow.guest().to(['read']),
  ],
});
