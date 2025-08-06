/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['tile.openstreetmap.org'],
  },
  trailingSlash: true,
  assetPrefix: process.env.NODE_ENV === 'production' ? '' : '',
  experimental: {
    esmExternals: false
  }
}

module.exports = nextConfig