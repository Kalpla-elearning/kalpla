import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getCurrentUser, signIn, signUp, signOut, confirmSignUp, resendSignUpCode } from 'aws-amplify/auth';
import { uploadData, downloadData, remove, list } from 'aws-amplify/storage';
import type { Schema } from '../amplify/data/resource';

// Configure Amplify with fallbacks
const config = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_ID || 'us-east-1_dummy',
      userPoolClientId: process.env.NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_WEB_CLIENT_ID || 'dummy',
      identityPoolId: process.env.NEXT_PUBLIC_AMPLIFY_AUTH_IDENTITY_POOL_ID || 'us-east-1:dummy',
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
      bucket: process.env.NEXT_PUBLIC_AMPLIFY_STORAGE_BUCKET_NAME || 'dummy-bucket',
      region: process.env.NEXT_PUBLIC_AMPLIFY_REGION || 'us-east-1',
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.NEXT_PUBLIC_AMPLIFY_API_URL || 'https://dummy.appsync-api.us-east-1.amazonaws.com/graphql',
      region: process.env.NEXT_PUBLIC_AMPLIFY_REGION || 'us-east-1',
      defaultAuthMode: 'userPool',
    },
  },
};

// Only configure if we have valid environment variables
if (process.env.NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_ID) {
  Amplify.configure(config, { ssr: true });
}

// Generate the client with error handling
let client: any = null;
try {
  client = generateClient<Schema>();
} catch (error) {
  console.warn('Amplify client not available:', error);
  // Create a mock client for build time
  client = {
    models: {
      Course: { list: () => ({ data: [] }) },
      Post: { list: () => ({ data: [] }) },
      DegreeProgram: { list: () => ({ data: [] }) },
      User: { list: () => ({ data: [] }) },
    }
  };
}

export { client };

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