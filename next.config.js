/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
    serverComponentsExternalPackages: ['mongoose']
  },
  images: {
    domains: ['m.media-amazon.com','media-ik.croma.com','aitdgoa.edu.in','reliancedigital.in','www.reliancedigital.in']
  }
}

module.exports = nextConfig


