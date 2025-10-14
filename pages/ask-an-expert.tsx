// /pages/ask-an-expert.tsx

import React from 'react';
import SEO from '@/components/layout/SEO';
import AskAnExpertForm from '@/components/forms/AskAnExpertForm';
import AdPlacement from '@/components/layout/AdPlacement';

const AskAnExpertPage = () => {
  return (
    <>
      <SEO
        title="Ask a Financial Expert for Free | Unbiased Advice | ISC"
        description="Get free, unbiased answers to your financial questions. Ask our experts about insurance, retirement, or investing and get the clarity you need with no sales pitch."
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
            
            {/* Title */}
            <h1 className="text-xl md:text-2xl font-bold text-navy-blue">
              Ask An Expert
            </h1>
            
            {/* Subtitle */}
            <p className="text-base text-gray-600 max-w-4xl mx-auto">
              Have a question about insurance, investing, or planning for retirement? Submit it below to get a clear, unbiased answer from our team of financial experts. Our guidance is always free, and there's never a sales pitch.
            </p>
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

export default AskAnExpertPage;