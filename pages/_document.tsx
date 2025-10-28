// pages/_document.tsx
// Enhanced with critical meta tags, performance optimizations, and proper SEO foundation

import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* ============================================
            CRITICAL META TAGS - Affects Every Page
        ============================================ */}
        
        {/* Character Encoding - MUST be first */}
        <meta charSet="utf-8" />
        
        {/* ============================================
            PERFORMANCE OPTIMIZATIONS
        ============================================ */}
        
        {/* DNS Prefetch - Resolve domains early */}
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        
        {/* Preconnect - Establish early connections for critical resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        
        {/* Google Fonts - Optimized with display=swap */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Lora:wght@700&display=swap"
          rel="stylesheet"
        />
        
        {/* ============================================
            FAVICON & APP ICONS
        ============================================ */}
        
        {/* Standard Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        
        {/* SVG Favicon for modern browsers */}
        <link rel="icon" href="/logo.png" type="image/png" />
        
        {/* Apple Touch Icon for iOS devices */}
        <link rel="apple-touch-icon" href="/logo.png" />
        
        {/* Web App Manifest for PWA support */}
        <link rel="manifest" href="/site.webmanifest" />
        
        {/* ============================================
            MOBILE & BROWSER THEMING
        ============================================ */}
        
        {/* Theme color for mobile browsers (matches your gold accent) */}
        <meta name="theme-color" content="#D4AF37" />
        
        {/* Microsoft Tiles */}
        <meta name="msapplication-TileColor" content="#D4AF37" />
        
        {/* ============================================
            SECURITY & COMPATIBILITY
        ============================================ */}
        
        {/* Format detection - Prevent auto-linking */}
        <meta name="format-detection" content="telephone=no" />
        
        {/* IE Compatibility Mode */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}