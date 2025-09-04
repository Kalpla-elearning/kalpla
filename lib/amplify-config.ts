import { Amplify } from 'aws-amplify'

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_ID!,
      userPoolClientId: process.env.NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_WEB_CLIENT_ID!,
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_AMPLIFY_AUTH_DOMAIN!,
          scopes: ['openid', 'email', 'profile'],
          redirectSignIn: [process.env.NEXT_PUBLIC_AMPLIFY_AUTH_REDIRECT_SIGN_IN!],
          redirectSignOut: [process.env.NEXT_PUBLIC_AMPLIFY_AUTH_REDIRECT_SIGN_OUT!],
          responseType: 'code',
        },
        email: true,
      },
    },
  },
}

// Only configure Amplify on the client side
if (typeof window !== 'undefined') {
  Amplify.configure(amplifyConfig)
}

export default amplifyConfig
