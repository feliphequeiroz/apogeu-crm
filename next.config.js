/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  allowedDevOrigins: ['http://192.168.15.6:3000', 'http://192.168.15.6:3001'],
}

module.exports = nextConfig