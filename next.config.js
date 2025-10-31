/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'cdn.pixabay.com', 'plus.unsplash.com'],
  },
  // output: "export"
};

module.exports = nextConfig; 