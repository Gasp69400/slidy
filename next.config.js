const path = require('path')
const { loadEnvConfig } = require('@next/env')

// Charge .env / .env.local avant la config Webpack (clés serveur comme GROQ_API_KEY).
loadEnvConfig(path.join(__dirname))

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Réduit les watchers (souvent cause d’EMFILE sur macOS avec `npm run dev`)
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 600,
        ignored: ['**/node_modules/**', '**/.git/**'],
      }
    }
    return config
  },
}

module.exports = nextConfig
