/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix workspace root warning
  outputFileTracingRoot: process.cwd(),
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    // Next.js 15 has better image optimization
    formats: ['image/webp', 'image/avif'],
    unoptimized: false, // Enable optimization for better performance
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Next.js 15 experimental features
  experimental: {
    // Enable React 19 features if available
    reactCompiler: false, // Disable for now to avoid issues
  },
  // Better caching for Next.js 15
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
}

export default nextConfig
