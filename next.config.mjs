/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: ['assets.vercel.com', 'github.com', 'avatars.githubusercontent.com'],
    unoptimized: true
  },
  output: 'export',
  distDir: '.next'
};

export default nextConfig; 