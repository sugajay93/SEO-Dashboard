/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Configure to work with Wasm in the IDE Web Environment
  experimental: {
    forceSwcTransforms: true,
  },
  // Allow app to work with any base path, including Getbind's generated URL
  basePath: '',
  // Disable strict checking of hostnames for development
  assetPrefix: '',
  // Important: Configure image domains
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true
  },
  // Disable unnecessary runtime check
  eslint: {
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig