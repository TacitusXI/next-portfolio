/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['github.com', 'raw.githubusercontent.com'],
  },
  output: 'export',
  assetPrefix: '/',
  basePath: '',
}

module.exports = nextConfig 