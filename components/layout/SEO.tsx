// components/layout/SEO.tsx
// Enhanced SEO component with proper article support

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import siteConfig from '@/config/siteConfig.json';

const { siteUrl } = siteConfig;

interface SEOProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  schemaData?: object;
  noindex?: boolean;
  keywords?: string;
  canonical?: string;
  isArticle?: boolean; // NEW: To properly set og:type
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  imageUrl,
  schemaData,
  noindex,
  keywords,
  canonical,
  isArticle = false, // Default to false
}) => {
  const siteTitle = 'Insurance SmartApps';
  const siteDescription =
    'Insurance SmartApps offers free calculators, comparison tools, expert tips, and daily insurance news. Make informed decisions on life, health, and auto insurance.';
  const defaultImage = `${siteUrl}/images/social-share-default.jpg`;

  const router = useRouter();
  const canonicalUrl = canonical || `${siteUrl}${router.asPath}`;

  // AUTO-DETECT admin pages and apply noindex
  const isAdminPage =
    router.pathname.startsWith('/admin0925') || router.pathname.startsWith('/dev-admin0925');
  const shouldNoIndex = noindex || isAdminPage;

  // Optimize title and description lengths for SEO
  const pageTitle = title ? `${title} | ${siteTitle}` : siteTitle;
  const optimizedTitle = pageTitle.length > 60 ? pageTitle.substring(0, 57) + '...' : pageTitle;

  const pageDescription = description || siteDescription;
  const optimizedDescription =
    pageDescription.length > 160 ? pageDescription.substring(0, 157) + '...' : pageDescription;

  // Ensure image URL is absolute
  const getAbsoluteImageUrl = (imgUrl?: string) => {
    if (!imgUrl) return defaultImage;
    if (imgUrl.startsWith('http')) return imgUrl;
    // Remove double slashes
    const cleanPath = imgUrl.startsWith('/') ? imgUrl : `/${imgUrl}`;
    return `${siteUrl}${cleanPath}`;
  };

  const shareImage = getAbsoluteImageUrl(imageUrl);

  // Determine og:type
  const ogType = isArticle ? 'article' : 'website';

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{optimizedTitle}</title>
      <meta name="title" content={optimizedTitle} />
      <meta name="description" content={optimizedDescription} />
      <link rel="icon" href="/favicon.ico" />

      {/* Keywords (if provided) */}
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Robots Meta Tag - AUTO-DETECTS admin pages */}
      {shouldNoIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      )}

      {/* Canonical URL - Don't add canonical for admin pages */}
      {!isAdminPage && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook - Don't add OG tags for admin pages */}
      {!isAdminPage && (
        <>
          <meta property="og:type" content={ogType} />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:title" content={optimizedTitle} />
          <meta property="og:description" content={optimizedDescription} />
          <meta property="og:image" content={shareImage} />
          <meta property="og:image:secure_url" content={shareImage} />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="630" />
          <meta property="og:site_name" content={siteTitle} />
          <meta property="og:locale" content="en_US" />
        </>
      )}

      {/* Twitter Card - Don't add Twitter cards for admin pages */}
      {!isAdminPage && (
        <>
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content={canonicalUrl} />
          <meta name="twitter:title" content={optimizedTitle} />
          <meta name="twitter:description" content={optimizedDescription} />
          <meta name="twitter:image" content={shareImage} />
          <meta name="twitter:image:alt" content={optimizedTitle} />
        </>
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content={siteTitle} />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />

      {/* Google verification (add your code if needed) */}
      {/* <meta name="google-site-verification" content="YOUR_CODE_HERE" /> */}

      {/* Schema.org Structured Data - Don't add for admin pages */}
      {!isAdminPage && schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
      )}
    </Head>
  );
};

export default SEO;