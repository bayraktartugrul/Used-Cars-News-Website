/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'cardealermagazine.co.uk',
      'images.unsplash.com',
      'cdn.cardealermagazine.co.uk',
      'www.cardealermagazine.co.uk',
      'i.dailymail.co.uk',
      'static.cardealermagazine.co.uk'
    ],
    unoptimized: true
  },
}

module.exports = nextConfig 