import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getCurrentUser, signIn, signUp, signOut, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { uploadData, downloadData, remove, list } from 'aws-amplify/storage';
import type { Schema } from '../amplify/data/resource';

// Configure Amplify
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_WEB_CLIENT_ID!,
      identityPoolId: process.env.NEXT_PUBLIC_AMPLIFY_AUTH_IDENTITY_POOL_ID!,
      loginWith: {
        email: true,
        phone: true,
        username: true,
      },
      signUpVerificationMethod: 'code',
      userAttributes: {
        email: {
          required: true,
        },
        name: {
          required: true,
        },
        phone_number: {
          required: false,
        },
      },
    },
  },
  Storage: {
    S3: {
      bucket: process.env.NEXT_PUBLIC_AMPLIFY_STORAGE_BUCKET_NAME!,
      region: process.env.NEXT_PUBLIC_AMPLIFY_REGION!,
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_AMPLIFY_API_URL!,
      region: process.env.NEXT_PUBLIC_AMPLIFY_REGION!,
      defaultAuthMode: 'userPool',
    },
  },
}, {
  ssr: true,
});

// Generate the client
export const client = generateClient<Schema>();

// Auth functions
export const auth = {
  getCurrentUser,
  signIn,
  signUp,
  signOut,
  confirmSignUp,
  resendSignUpCode,
};

// Storage functions
export const storage = {
  uploadData,
  downloadData,
  remove,
  list,
};

// Data functions
export const data = {
  client,
};

export default Amplify;