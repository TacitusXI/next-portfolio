/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['github.com', 'raw.githubusercontent.com'],
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.js'
  },
  output: 'export',
  distDir: 'out',
  // For IPFS compatibility - use relative paths from root
  assetPrefix: '',
  basePath: '',
  transpilePackages: ['next/font'],
  generateEtags: false,
  poweredByHeader: false,
  // Ensure clean IPFS-compatible output
  compress: false,
  generateBuildId: () => 'build'
}

module.exports = nextConfig 