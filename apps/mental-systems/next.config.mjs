/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@for-humans/tokens', '@for-humans/ui'],
  typescript: { ignoreBuildErrors: true },
  experimental: {},
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
          { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
        ],
      },
    ]
  },
}

export default nextConfig
