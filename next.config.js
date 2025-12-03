/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  images: {
    domains: ['mandalatickets.com'],
    unoptimized: false,
  },
}

module.exports = nextConfig

