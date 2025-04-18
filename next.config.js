/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['github.com', 'raw.githubusercontent.com'],
  },
  output: 'export',
  assetPrefix: './',
  basePath: '',
  experimental: {
    // This enables the export to strip all URLs and make them relative
    optimizeUniversalDefaults: true
  }
}

module.exports = nextConfig 