import React from 'react';
import Head from 'next/head';

interface SEOProps {
    title?: string;
    description?: string;
}

const SEO: React.FC<SEOProps> = ({ title, description }) => {
  const siteTitle = 'Hybrid Advisor';
  const siteDescription = 'Your trusted partner in financial planning.';

  return (
    <Head>
      <title>{title ? `${title} | ${siteTitle}` : siteTitle}</title>
      <meta name="description" content={description || siteDescription} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default SEO;
