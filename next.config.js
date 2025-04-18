/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  assetPrefix: './',
  basePath: '',
  images: {
    unoptimized: true,
    domains: ['github.com', 'raw.githubusercontent.com'],
  },
  output: 'export',
}

module.exports = nextConfig 