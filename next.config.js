/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'images.unsplash.com',
      'i.dailymail.com',
      'static.cardealer.com',
      'cdn.cardealer.com',
      'www.cardealer.com'
    ],
    unoptimized: true
  },
}

module.exports = nextConfig 