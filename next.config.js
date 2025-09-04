/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  output: 'standalone',
  images: {
    domains: [
      'localhost',
      'your-s3-bucket.s3.amazonaws.com',
      'your-s3-bucket.s3.ap-south-1.amazonaws.com',
      'amplifyapp.com',
      '*.amplifyapp.com',
    ],
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, PUT, DELETE, OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
        ],
      },
    ]
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  env: {
    AMPLIFY_AUTH_REGION: process.env.AWS_REGION,
    AMPLIFY_AUTH_USER_POOL_ID: process.env.AMPLIFY_AUTH_USER_POOL_ID,
    AMPLIFY_AUTH_USER_POOL_WEB_CLIENT_ID: process.env.AMPLIFY_AUTH_USER_POOL_WEB_CLIENT_ID,
  },
}

module.exports = nextConfig