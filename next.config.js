/** @type {import('next').NextConfig} */

// Check if we're building for production (IPFS export)
const isExportBuild = process.env.NEXT_EXPORT === 'true';

const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    domains: ['github.com', 'raw.githubusercontent.com'],
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.js'
  },
  transpilePackages: ['next/font'],
  generateEtags: false,
  poweredByHeader: false,
  
  // Only apply export settings when explicitly building for IPFS
  ...(isExportBuild && {
    output: 'export',
    distDir: 'out',
    trailingSlash: true,
    assetPrefix: '',
    basePath: '',
    compress: false,
    generateBuildId: () => 'build'
  })
}

module.exports = nextConfig 