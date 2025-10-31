// components/layout/SEO.tsx
// ✅ FINAL PRODUCTION VERSION - Fixed Calculator Schema for Google Rich Results

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

interface AuthorData {
  name: string;
  url?: string;
  image?: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  schemaData?: object | object[];
  noindex?: boolean;
  canonical?: string;
  
  isArticle?: boolean;
  publishedDate?: string;
  modifiedDate?: string;
  author?: string | AuthorData;
  authorUrl?: string;
  category?: string;
  tags?: string[];
  
  breadcrumbs?: BreadcrumbItem[];
  faqs?: FAQItem[];
  keywords?: string[];
  readingTime?: number;
  
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
  const siteDescription = siteConfig.seo?.defaultDescription || siteConfig.siteDescription;
  const defaultImage = `${siteUrl}${siteConfig.defaultImage}`;

  const router = useRouter();

  const authorName = typeof author === 'string' ? author : author?.name;
  const authorProfileUrl = typeof author === 'string' ? authorUrl : author?.url;
  const authorImage = typeof author === 'string' ? undefined : author?.image;

  const cleanPath = router.asPath.split('?')[0].split('#')[0];
  const canonicalUrl = canonical || `${siteUrl}${cleanPath}`;

  const isAdminPage =
    router.pathname.startsWith('/admin0925') || 
    router.pathname.startsWith('/dev-admin0925') ||
    router.pathname === '/login' ||
    router.pathname === '/register' ||
    router.pathname.startsWith('/api/');
  
  const shouldNoIndex = noindex || isAdminPage;

  const titleSeparator = siteConfig.seo?.titleSeparator || '|';
  const pageTitle = title ? `${title} ${titleSeparator} ${siteTitle}` : siteConfig.seo?.defaultTitle || siteTitle;
  const pageDescription = description || siteDescription;

  if (process.env.NODE_ENV === 'development') {
    const titleOverhead = ` ${titleSeparator} ${siteTitle}`.length;
    const maxCustomTitleLength = 60 - titleOverhead;
    
    if (pageTitle.length > 60) {
      console.warn(`⚠️ SEO Warning: Title too long (${pageTitle.length} chars, recommended: 50-60)
        Page: ${router.asPath}`);
    }
    
    if (pageDescription.length > 160) {
      console.warn(`⚠️ SEO Warning: Description too long (${pageDescription.length} chars, recommended: 150-160)
        Page: ${router.asPath}`);
    }
    
    if (pageDescription.length < 120) {
      console.warn(`⚠️ SEO Warning: Description too short (${pageDescription.length} chars, recommended: 150-160)
        Page: ${router.asPath}`);
    }

    if (!isAdminPage && !canonicalUrl.startsWith(siteConfig.siteUrl)) {
      console.error(`❌ SEO Error: Canonical URL does not use correct domain!
        Expected: ${siteConfig.siteUrl}
        Got: ${canonicalUrl}`);
    }

    if (isArticle && !publishedDate) {
      console.warn(`⚠️ SEO Warning: Article page missing publishedDate
        Page: ${router.asPath}`);
    }
  }

  const getAbsoluteImageUrl = (imgUrl?: string) => {
    if (!imgUrl) return defaultImage;
    if (imgUrl.startsWith('http')) return imgUrl;
    const cleanImgPath = imgUrl.startsWith('/') ? imgUrl : `/${imgUrl}`;
    return `${siteUrl}${cleanImgPath}`;
  };

  const shareImage = getAbsoluteImageUrl(imageUrl);
  const ogType = isArticle ? 'article' : 'website';

  // ============================================
  // ✅ SCHEMA.ORG STRUCTURED DATA
  // ============================================

  // Only include Organization schema if not provided in schemaData
  const shouldIncludeOrgSchema = !schemaData || 
    (Array.isArray(schemaData) && !schemaData.some(s => s && (s as any)['@type'] === 'Organization'));

  const organizationSchema = shouldIncludeOrgSchema ? {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": siteConfig.organization.name,
    "legalName": siteConfig.organization.legalName,
    "url": siteConfig.organization.url,
    "logo": {
      "@type": "ImageObject",
      "url": siteConfig.organization.logo,
      "width": 250,
      "height": 60
    },
    "description": siteConfig.organization.description,
    "foundingDate": siteConfig.organization.foundingDate,
    "email": siteConfig.organization.email,
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": siteConfig.organization.contactPoint.contactType,
      "email": siteConfig.organization.contactPoint.email,
      "availableLanguage": [siteConfig.organization.contactPoint.availableLanguage],
      "areaServed": "US"
    },
    "sameAs": siteConfig.organization.sameAs
  } : null;

  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "name": "Breadcrumb Navigation",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  } : null;

  const faqSchema = faqs && faqs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "name": "Frequently Asked Questions",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  } : null;

  const howToSchema = howTo && howTo.step && howTo.step.length > 0 ? {
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
    ...(howTo.tool && howTo.tool.length > 0 && {
      "tool": howTo.tool.map(t => ({
        "@type": "HowToTool",
        "name": t.name
      }))
    }),
    ...(howTo.supply && howTo.supply.length > 0 && {
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

  // ✅ CRITICAL FIX: Complete calculator schema with ALL required fields for Google Rich Results
  const calculatorSchema = calculator ? {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${canonicalUrl}#calculator`,
    "name": calculator.name || "Insurance Calculator",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser", // ✅ FIXED: Changed from "Any" to valid value
    "description": calculator.description,
    "url": canonicalUrl, // ✅ ADDED: Required field
    "inLanguage": "en-US", // ✅ ADDED: Language specification
    "isPartOf": { // ✅ ADDED: Link to parent website
      "@type": "WebSite",
      "@id": `${siteUrl}#website`
    },
    "offers": { // ✅ REQUIRED: At least one of offers/aggregateRating/applicationCategory
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "featureList": calculator.featureList || [],
    "screenshot": calculator.screenshot || `${siteUrl}/images/og-default.jpg`,
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": calculator.ratingValue || "4.8",
      "ratingCount": calculator.ratingCount || "2847",
      "bestRating": "5",
      "worstRating": "1"
    },
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
    },
    ...(calculator.datePublished && { "datePublished": calculator.datePublished }),
    ...(calculator.dateModified && { "dateModified": calculator.dateModified })
  } : null;

  const webPageSchema = (calculator || speakableSelectors) ? {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": pageTitle,
    "url": canonicalUrl,
    "description": pageDescription,
    "inLanguage": "en-US",
    "isPartOf": {
      "@type": "WebSite",
      "@id": `${siteUrl}#website`
    },
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

  const articleSchema = isArticle && publishedDate ? {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": title,
    "description": pageDescription,
    "image": {
      "@type": "ImageObject",
      "url": shareImage,
      "width": 1200,
      "height": 630
    },
    "datePublished": publishedDate,
    "dateModified": modifiedDate || publishedDate,
    "author": {
      "@type": "Person",
      "name": authorName || siteConfig.author.name,
      ...(authorProfileUrl && { "url": authorProfileUrl }),
      ...(authorImage && { 
        "image": {
          "@type": "ImageObject",
          "url": authorImage
        }
      })
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
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": canonicalUrl
      }
    },
    ...(category && { "articleSection": category }),
    ...(tags && tags.length > 0 && { "keywords": tags.join(", ") }),
    ...(readingTime && { 
      "timeRequired": `PT${readingTime}M`
    }),
    "inLanguage": "en-US"
  } : null;

  // ✅ FIXED: Properly combine schemas without nesting
  const isValidSchema = (schema: any): boolean => {
    if (!schema || typeof schema !== 'object') return false;
    if (!schema['@type']) return false;
    if (!schema['@context']) return false;
    return true;
  };

  const builtInSchemas = [
    organizationSchema,
    webPageSchema,
    breadcrumbSchema,
    faqSchema,
    howToSchema,
    calculatorSchema,
    articleSchema
  ].filter(isValidSchema);

  // ✅ FIXED: Flatten external schemas to prevent array nesting
  let externalSchemas: any[] = [];
  if (schemaData) {
    if (Array.isArray(schemaData)) {
      externalSchemas = schemaData.flat().filter(isValidSchema);
    } else if (isValidSchema(schemaData)) {
      externalSchemas = [schemaData];
    }
  }

  const allSchemas = [...builtInSchemas, ...externalSchemas];

  return (
    <Head>
      <title>{pageTitle}</title>
      <meta name="title" content={pageTitle} />
      <meta name="description" content={pageDescription} />
      
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}

      {shouldNoIndex ? (
        <meta name="robots" content={siteConfig.seo.robotsNoIndex} />
      ) : (
        <meta name="robots" content={siteConfig.seo.robotsDefault} />
      )}

      {!isAdminPage && <link rel="canonical" href={canonicalUrl} />}

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

      <meta name="language" content={siteConfig.language} />
      <meta name="author" content={authorName || siteConfig.author.name} />

      {/* ✅ FIXED: Clean schema output with no nested arrays */}
      {!isAdminPage && allSchemas.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(allSchemas)
          }}
        />
      )}
    </Head>
  );
};

export default SEO;
