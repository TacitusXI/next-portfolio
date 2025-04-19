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
  distDir: 'out',
  experimental: {
    mdxRs: true,
  },
  transpilePackages: ['next/font'],
  exportPathMap: async function () {
    return {
      '/': { page: '/' },
    };
  },
}

module.exports = nextConfig 