import { useEffect } from 'react';
import Head from 'next/head';
import { CalculatorResult } from '@/context/CalculatorContext';
import { generateSocialShareData, getOGImageUrl } from '@/lib/socialShare';

interface ShareMetaTagsProps {
  result?: CalculatorResult | null;
  pageTitle?: string;
  pageDescription?: string;
}

const ShareMetaTags: React.FC<ShareMetaTagsProps> = ({ 
  result, 
  pageTitle = "Smart Insurance Calculator - Get Your Free Quote",
  pageDescription = "Calculate your insurance needs in under 2 minutes. Free, fast, and no personal information required."
}) => {
  
  useEffect(() => {
    // Update meta tags dynamically when result changes
    if (result && typeof document !== 'undefined') {
      const shareData = generateSocialShareData(result);
      const ogImage = getOGImageUrl(result);
      
      // Update OG meta tags
      updateMetaTag('og:title', shareData.title);
      updateMetaTag('og:description', shareData.description);
      updateMetaTag('og:image', ogImage);
      updateMetaTag('og:url', shareData.url);
      
      // Update Twitter meta tags
      updateMetaTag('twitter:title', shareData.title);
      updateMetaTag('twitter:description', shareData.description);
      updateMetaTag('twitter:image', ogImage);
      
      // Update page title
      document.title = shareData.title;
    }
  }, [result]);

  const updateMetaTag = (property: string, content: string) => {
    let meta = document.querySelector(`meta[property="${property}"]`) as HTMLMetaElement;
    if (!meta) {
      meta = document.querySelector(`meta[name="${property}"]`) as HTMLMetaElement;
    }
    if (meta) {
      meta.content = content;
    }
  };

  // Get meta data
  const getMetaData = () => {
    if (!result) {
      return {
        title: pageTitle,
        description: pageDescription,
        image: '/images/og-default.jpg'
      };
    }

    const shareData = generateSocialShareData(result);
    return {
      title: shareData.title,
      description: shareData.description,
      image: getOGImageUrl(result),
      url: shareData.url
    };
  };

  const metaData = getMetaData();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://yoursite.com';

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{metaData.title}</title>
      <meta name="title" content={metaData.title} />
      <meta name="description" content={metaData.description} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={metaData.url || siteUrl} />
      <meta property="og:title" content={metaData.title} />
      <meta property="og:description" content={metaData.description} />
      <meta property="og:image" content={metaData.image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="Smart Insurance Calculator" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={metaData.url || siteUrl} />
      <meta property="twitter:title" content={metaData.title} />
      <meta property="twitter:description" content={metaData.description} />
      <meta property="twitter:image" content={metaData.image} />
      <meta name="twitter:creator" content="@YourTwitterHandle" />
    </Head>
  );
};

export default ShareMetaTags;