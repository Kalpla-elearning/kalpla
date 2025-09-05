/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.s3.ap-south-1.amazonaws.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.amplifyapp.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.cloudfront.net',
        port: '',
        pathname: '/**',
      },
    ],
    // Add fallback for build time
    unoptimized: process.env.NODE_ENV === 'development',
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
  experimental: {
    // Remove appDir as it's now stable in Next.js 14
  },
  // AWS Amplify specific configuration
  env: {
    NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_ID: process.env.NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_ID || '',
    NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_WEB_CLIENT_ID: process.env.NEXT_PUBLIC_AMPLIFY_AUTH_USER_POOL_WEB_CLIENT_ID || '',
    NEXT_PUBLIC_AMPLIFY_AUTH_IDENTITY_POOL_ID: process.env.NEXT_PUBLIC_AMPLIFY_AUTH_IDENTITY_POOL_ID || '',
    NEXT_PUBLIC_AMPLIFY_REGION: process.env.NEXT_PUBLIC_AMPLIFY_REGION || 'us-east-1',
    NEXT_PUBLIC_AMPLIFY_API_URL: process.env.NEXT_PUBLIC_AMPLIFY_API_URL || '',
    NEXT_PUBLIC_AMPLIFY_STORAGE_BUCKET_NAME: process.env.NEXT_PUBLIC_AMPLIFY_STORAGE_BUCKET_NAME || '',
  },
}

module.exports = nextConfig