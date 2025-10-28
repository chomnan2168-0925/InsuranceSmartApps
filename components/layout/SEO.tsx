// components/layout/SEO.tsx
// UPDATED: Support author as both string and object

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import siteConfig from '@/config/siteConfig.json';

const { siteUrl, siteName: defaultSiteName } = siteConfig;

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

interface HowToStep {
  position: number;
  name: string;
  text: string;
  image?: string;
  url?: string;
}

interface HowToSupply {
  name: string;
}

interface HowToTool {
  name: string;
}

interface HowToSchema {
  name: string;
  description: string;
  totalTime?: string;
  tool?: HowToTool[];
  supply?: HowToSupply[];
  step: HowToStep[];
}

interface CalculatorSchema {
  name: string;
  description: string;
  featureList: string[];
  screenshot?: string;
  ratingValue?: string;
  ratingCount?: string;
  datePublished?: string;
  dateModified?: string;
}

// ✅ NEW: Author can be string or object
interface AuthorData {
  name: string;
  url?: string;
  image?: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  schemaData?: object;
  noindex?: boolean;
  canonical?: string;
  
  // Article-specific props
  isArticle?: boolean;
  publishedDate?: string;
  modifiedDate?: string;
  author?: string | AuthorData;  // ✅ UPDATED: Accept both types
  authorUrl?: string;            // ✅ DEPRECATED: Keep for backwards compatibility
  category?: string;
  tags?: string[];
  
  // Enhanced schema support
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FAQItem[];
  keywords?: string[];           // ✅ NEW: For meta keywords
  readingTime?: number;          // ✅ NEW: For article schema
  
  // AI Search Optimization
  howTo?: HowToSchema;
  calculator?: CalculatorSchema;
  speakableSelectors?: string[];
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  imageUrl,
  schemaData,
  noindex,
  canonical,
  isArticle = false,
  publishedDate,
  modifiedDate,
  author,
  authorUrl,
  category,
  tags = [],
  breadcrumbs,
  faqs,
  keywords,
  readingTime,
  howTo,
  calculator,
  speakableSelectors,
}) => {
  const siteTitle = defaultSiteName;
  
  const siteDescription = siteConfig.seo?.defaultDescription || 
    'Calculate and compare insurance rates with our free calculators. Get instant quotes for auto, home, life, health, disability, and pet insurance.';
  
  const defaultImage = `${siteUrl}${siteConfig.defaultImage}`;

  const router = useRouter();

  // ✅ NEW: Extract author data whether it's string or object
  const authorName = typeof author === 'string' ? author : author?.name;
  const authorProfileUrl = typeof author === 'string' ? authorUrl : author?.url;
  const authorImage = typeof author === 'string' ? undefined : author?.image;

  // Canonical URL Logic
  const cleanPath = router.asPath.split('?')[0].split('#')[0];
  const canonicalUrl = canonical || `${siteUrl}${cleanPath}`;

  // Auto-detect admin pages
  const isAdminPage =
    router.pathname.startsWith('/admin0925') || 
    router.pathname.startsWith('/dev-admin0925') ||
    router.pathname === '/login' ||
    router.pathname === '/register' ||
    router.pathname.startsWith('/api/');
  
  const shouldNoIndex = noindex || isAdminPage;

  const titleSeparator = siteConfig.seo?.titleSeparator || '|';
  const pageTitle = title ? `${title} ${titleSeparator} ${siteTitle}` : siteTitle;
  const pageDescription = description || siteDescription;

  // Development warnings (keeping your existing logic)
  if (process.env.NODE_ENV === 'development') {
    const titleOverhead = ` ${titleSeparator} ${siteTitle}`.length;
    const maxCustomTitleLength = 60 - titleOverhead;
    
    if (pageTitle.length > 60) {
      console.warn(`⚠️ SEO Warning: Title too long (${pageTitle.length} chars, recommended: 50-60)
        ${title ? `Input title: "${title}" (${title.length} chars)` : 'Using default title'}
        Final title: "${pageTitle}" (${pageTitle.length} chars)
        Page: ${router.asPath}
        
        💡 TIP: ${title ? `Keep input title under ${maxCustomTitleLength} chars to account for " ${titleSeparator} ${siteTitle}"` : 'Consider adding a custom title prop'}`);
    }
    
    if (pageDescription.length > 160) {
      console.warn(`⚠️ SEO Warning: Description too long (${pageDescription.length} chars, recommended: 150-160)
        ${description ? 'Custom' : 'Default'} Description: "${pageDescription}"
        Page: ${router.asPath}
        
        💡 TIP: Trim ${pageDescription.length - 160} characters to reach optimal length`);
    }
    
    if (pageDescription.length < 120) {
      console.warn(`⚠️ SEO Warning: Description too short (${pageDescription.length} chars, recommended: 150-160)
        ${description ? 'Custom' : 'Default'} Description: "${pageDescription}"
        Page: ${router.asPath}
        
        💡 TIP: ${!description ? 'Add a custom description prop to this page!' : `Add ${120 - pageDescription.length} more characters for better SEO`}`);
    }

    if (!isAdminPage && !canonicalUrl.startsWith(siteConfig.siteUrl)) {
      console.error(`❌ SEO Error: Canonical URL does not use correct domain!
        Expected: ${siteConfig.siteUrl}
        Got: ${canonicalUrl}
        Page: ${router.asPath}
        
        💡 TIP: Check if you're using a custom canonical prop with wrong domain`);
    }

    if (isArticle && !publishedDate) {
      console.warn(`⚠️ SEO Warning: Article page missing publishedDate
        Page: ${router.asPath}
        
        💡 TIP: Add publishedDate prop for proper Article schema`);
    }
  }

  // Ensure image URL is absolute
  const getAbsoluteImageUrl = (imgUrl?: string) => {
    if (!imgUrl) return defaultImage;
    if (imgUrl.startsWith('http')) return imgUrl;
    const cleanImgPath = imgUrl.startsWith('/') ? imgUrl : `/${imgUrl}`;
    return `${siteUrl}${cleanImgPath}`;
  };

  const shareImage = getAbsoluteImageUrl(imageUrl);
  const ogType = isArticle ? 'article' : 'website';

  // ============================================
  // SCHEMA.ORG STRUCTURED DATA GENERATION
  // ============================================

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.organization.name,
    "legalName": siteConfig.organization.legalName,
    "url": siteConfig.organization.url,
    "logo": siteConfig.organization.logo,
    "description": siteConfig.organization.description,
    "foundingDate": siteConfig.organization.foundingDate,
    "email": siteConfig.organization.email,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": siteConfig.organization.contactPoint.contactType,
      "email": siteConfig.organization.contactPoint.email,
      "availableLanguage": siteConfig.organization.contactPoint.availableLanguage
    },
    "sameAs": siteConfig.organization.sameAs
  };

  // Breadcrumb Schema
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  } : null;

  // FAQ Schema
  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  // HowTo Schema
  const howToSchema = howTo ? {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": howTo.name,
    "description": howTo.description,
    "totalTime": howTo.totalTime || "PT5M",
    "estimatedCost": {
      "@type": "MonetaryAmount",
      "currency": "USD",
      "value": "0"
    },
    ...(howTo.tool && {
      "tool": howTo.tool.map(t => ({
        "@type": "HowToTool",
        "name": t.name
      }))
    }),
    ...(howTo.supply && {
      "supply": howTo.supply.map(s => ({
        "@type": "HowToSupply",
        "name": s.name
      }))
    }),
    "step": howTo.step.map(step => ({
      "@type": "HowToStep",
      "position": step.position,
      "name": step.name,
      "text": step.text,
      ...(step.image && { "image": step.image }),
      ...(step.url && { "url": step.url })
    }))
  } : null;

  // Calculator SoftwareApplication Schema
  const calculatorSchema = calculator ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": calculator.name,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": calculator.description,
    "featureList": calculator.featureList,
    ...(calculator.screenshot && { "screenshot": calculator.screenshot }),
    ...(calculator.datePublished && { "datePublished": calculator.datePublished }),
    ...(calculator.dateModified && { "dateModified": calculator.dateModified }),
    ...(calculator.ratingValue && calculator.ratingCount && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": calculator.ratingValue,
        "ratingCount": calculator.ratingCount,
        "bestRating": "5",
        "worstRating": "1"
      }
    }),
    "provider": {
      "@type": "Organization",
      "name": siteTitle,
      "url": siteUrl
    },
    "potentialAction": {
      "@type": "UseAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": canonicalUrl,
        "actionPlatform": [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform"
        ]
      }
    }
  } : null;

  // WebPage Schema with Speakable
  const webPageSchema = (calculator || speakableSelectors) ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageTitle,
    "url": canonicalUrl,
    "description": pageDescription,
    ...(speakableSelectors && speakableSelectors.length > 0 && {
      "speakable": {
        "@type": "SpeakableSpecification",
        "cssSelector": speakableSelectors
      }
    }),
    ...(calculator && {
      "mainEntity": {
        "@type": "SoftwareApplication",
        "@id": `${canonicalUrl}#calculator`
      }
    })
  } : null;

  // ✅ ENHANCED: Article Schema with richer author data
  const articleSchema = isArticle && publishedDate ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": pageDescription,
    "image": shareImage,
    "datePublished": publishedDate,
    "dateModified": modifiedDate || publishedDate,
    "author": {
      "@type": "Person",
      "name": authorName || siteConfig.author.name,
      ...(authorProfileUrl && { "url": authorProfileUrl }),
      ...(authorImage && { "image": authorImage })
    },
    "publisher": {
      "@type": "Organization",
      "name": siteTitle,
      "logo": {
        "@type": "ImageObject",
        "url": siteConfig.logoUrl
      }
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": canonicalUrl
    },
    "potentialAction": {
      "@type": "ReadAction",
      "target": canonicalUrl
    },
    ...(category && { "articleSection": category }),
    ...(tags && tags.length > 0 && { "keywords": tags.join(", ") }),
    ...(readingTime && { 
      "timeRequired": `PT${readingTime}M`
    })
  } : null;

  // Combine all schemas
  const allSchemas = [
    organizationSchema,
    webPageSchema,
    breadcrumbSchema,
    faqSchema,
    howToSchema,
    calculatorSchema,
    articleSchema,
    schemaData
  ].filter(Boolean);

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      
      {/* ✅ NEW: Keywords meta tag */}
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {/* Robots Meta Tag */}
      {shouldNoIndex ? (
        <meta name="robots" content={siteConfig.seo.robotsNoIndex} />
      ) : (
        <meta name="robots" content={siteConfig.seo.robotsDefault} />
      )}

      {/* Canonical URL */}
      {!isAdminPage && <link rel="canonical" href={canonicalUrl} />}

      {/* Open Graph / Facebook */}
      {!isAdminPage && (
        <>
          <meta property="og:type" content={ogType} />
          <meta property="og:url" content={canonicalUrl} />
          <meta property="og:title" content={pageTitle} />
          <meta property="og:description" content={pageDescription} />
          <meta property="og:image" content={shareImage} />
          <meta property="og:image:secure_url" content={shareImage} />
          <meta property="og:image:width" content={siteConfig.openGraph.images.width.toString()} />
          <meta property="og:image:height" content={siteConfig.openGraph.images.height.toString()} />
          <meta property="og:site_name" content={siteConfig.openGraph.siteName} />
          <meta property="og:locale" content={siteConfig.openGraph.locale} />

          {isArticle && (
            <>
              {publishedDate && (
                <meta property="article:published_time" content={publishedDate} />
              )}
              {modifiedDate && (
                <meta property="article:modified_time" content={modifiedDate} />
              )}
              {authorName && (
                <meta property="article:author" content={authorName} />
              )}
              {category && (
                <meta property="article:section" content={category} />
              )}
              {tags && tags.length > 0 && tags.map((tag) => (
                <meta key={tag} property="article:tag" content={tag} />
              ))}
            </>
          )}
        </>
      )}

      {/* Twitter Card */}
      {!isAdminPage && (
        <>
          <meta name="twitter:card" content={siteConfig.twitter.cardType} />
          <meta name="twitter:site" content={siteConfig.twitter.site} />
          <meta name="twitter:url" content={canonicalUrl} />
          <meta name="twitter:title" content={pageTitle} />
          <meta name="twitter:description" content={pageDescription} />
          <meta name="twitter:image" content={shareImage} />
          <meta name="twitter:image:alt" content={pageTitle} />
          {authorName && <meta name="twitter:label1" content="Written by" />}
          {authorName && <meta name="twitter:data1" content={authorName} />}
        </>
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="language" content={siteConfig.language} />
      <meta name="author" content={authorName || siteConfig.author.name} />

      {/* Schema.org Structured Data */}
      {!isAdminPage && allSchemas.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(allSchemas.length === 1 ? allSchemas[0] : allSchemas) 
          }}
        />
      )}
    </Head>
  );
};

export default SEO;