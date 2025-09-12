/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        child_process: false,
        http2: false,
        'node:buffer': false,
        'node:fs': false,
        'node:https': false,
        'node:http': false,
      }
    }
    return config
  },
  images: {
    domains: ['localhost'],
  },
  // Configure for better Vercel deployment
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
    responseLimit: false,
  },
}

module.exports = nextConfig
