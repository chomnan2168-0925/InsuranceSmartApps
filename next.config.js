/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Enable compression for better performance
  compress: true,
  
  // Use SWC minifier for faster builds
  swcMinify: true,
  
  // Image configuration - allows Next.js Image component to load from these domains
  images: {
    domains: [
      'res.cloudinary.com',              // Your existing Cloudinary domain
      'www.insurancesmartcalculator.com', // Your production domain
      'insurancesmartcalculator.com',     // Your production domain (without www)
      'ui-avatars.com',                   // For generated avatar fallbacks
    ],
  },

  // ============================================
  // CUSTOM HEADERS - SEO & SECURITY
  // ============================================
  async headers() {
    return [
      // Apply to all pages
      {
        source: '/:path*',
        headers: [
          // DNS Prefetch Control - Enable DNS prefetching
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          // Frame Options - Prevent clickjacking
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          // Content Type Options - Prevent MIME type sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          // Referrer Policy - Control referrer information
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          // Permissions Policy - Disable unused browser features
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
          },
          // X-XSS-Protection - Enable XSS filter (legacy browsers)
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          }
        ],
      },
      // Cache static assets aggressively (images, fonts, etc.)
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/assets/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache fonts
      {
        source: '/fonts/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      // Cache sitemap for 1 hour with stale-while-revalidate
      {
        source: '/sitemap.xml',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
          {
            key: 'Content-Type',
            value: 'text/xml; charset=utf-8',
          },
        ],
      },
      // Cache robots.txt
      {
        source: '/robots.txt',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400, stale-while-revalidate',
          },
        ],
      },
    ]
  },

  // ============================================
  // REDIRECTS - SEO & URL MANAGEMENT
  // ✅ CANONICAL URL STRATEGY: REDIRECT NON-WWW TO WWW
  // ============================================
  async redirects() {
    return [
      // ✅ ACTIVE: Redirect non-www to www (CANONICAL URL STRATEGY)
      // This is the PRIMARY redirect for SEO - DO NOT COMMENT OUT
      {
        source: '/:path*',
        has: [
          {
            type: 'host',
            value: 'insurancesmartcalculator.com',
          },
        ],
        destination: 'https://www.insurancesmartcalculator.com/:path*',
        permanent: true, // 301 redirect - passes SEO authority
      },
      
      // Existing redirect - keep this
      {
        source: '/our-story',
        destination: '/about-us',
        permanent: true,
      },
      
      // Add more redirects here as needed
      // Example: Old URL structure to new
      // {
      //   source: '/old-path',
      //   destination: '/new-path',
      //   permanent: true,
      // },
    ]
  },
}

module.exports = nextConfig