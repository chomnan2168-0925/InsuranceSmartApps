// /pages/ask-an-expert.tsx

import React from 'react';
import { GetStaticProps } from 'next';
import SEO from '@/components/layout/SEO';
import AskAnExpertForm from '@/components/forms/AskAnExpertForm';
import AdPlacement from '@/components/layout/AdPlacement';
import StaticPageData from '@/data/StaticPageData.json';

interface AskAnExpertPageProps {
  pageData: {
    title: string;
    tagline: string;
    content: string;
    seoTitle: string;
    seoDescription: string;
  };
}

const AskAnExpertPage: React.FC<AskAnExpertPageProps> = ({ pageData }) => {
  return (
    <>
      <SEO
        title={pageData.seoTitle}
        description={pageData.seoDescription}
      />
      
      <div className="container mx-auto px-3 pt-0 pb-4 md:pt-0 md:pb-6 max-w-5xl">
        
        {/* Hero Section - Matching Calculator Style */}
        <section className="bg-white p-4 md:p-6 rounded-lg shadow">
          <div className="text-center max-w-4xl mx-auto space-y-2">
            {/* Icon */}
            <div className="inline-block">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-4xl md:text-5xl shadow-xl transform hover:scale-110 transition-transform">
                💬
              </div>
            </div>
            
            {/* Title - Now from CMS */}
            <h1 className="text-xl md:text-2xl font-bold text-navy-blue">
              {pageData.title}
            </h1>
            
            {/* Subtitle - Now from CMS */}
            <div 
              className="text-base text-gray-600 max-w-4xl mx-auto"
              dangerouslySetInnerHTML={{ __html: pageData.content }}
            />
          </div>
        </section>

        {/* Ad Placement - Zero spacing, optimal position */}
        <div className="my-0">
          <AdPlacement slotId="inpost" spacing="-my-1" />
        </div>
        
        {/* Form Container */}
        <section className="bg-white p-4 md:p-6 lg:p-8 rounded-lg shadow-lg">
          <AskAnExpertForm />
        </section>
        
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const pageData = StaticPageData['ask-an-expert'];

  return {
    props: {
      pageData,
    },
    revalidate: 86400, // Revalidate every 24 hours
  };
};

export default AskAnExpertPage;