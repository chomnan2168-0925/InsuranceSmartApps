/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // --- THIS IS THE NEW 'images' BLOCK YOU NEED TO ADD ---
  // It tells Next.js to trust images coming from your Cloudinary account.
  images: {
    domains: ['res.cloudinary.com'],
  },

  // This is your existing redirect configuration, which is correct and remains.
  async redirects() {
    return [
      {
        source: '/our-story',
        destination: '/about-us',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig