// /components/home/WelcomeSection.tsx
import React from 'react';

const WelcomeSection = () => (
  <section className="text-center bg-white mt-1 p-4 md:p-8 rounded-lg shadow-md">
    
    {/* --- SECTION 1: VISIBLE HEADER (FOR YOUR VISITORS) --- */}
    {/* This is the content your users will see. You can easily edit this text to whatever you feel is best. */}

    {/* --- THIS IS THE NEW, TWO-LINE HEADING STRUCTURE --- */}
    <h1 className="text-3xl md:text-4xl font-extrabold text-navy-blue flex flex-col items-center gap-2 mb-2">
      
      {/* Line 1: The Main Brand Name */}
      <span>
        Insurance Smart Apps
      </span>
      
      {/* Line 2: The Features - smaller and less bold */}
      <span className="text-xl md:text-2xl font-semibold text-gray-600 tracking-wide">
        Practical Tips | Useful Tools | Latest News
      </span>

    </h1>
    <p className="text-md md:text-lg text-gray-600 max-w-4xl mx-auto md:mx-0">
      We make complex insurance simpler than you ever thought. Get free, actionable tips, the latest news, and our advanced calculators to compare options, plan your budget, and see the real value before you buy. Your unconditional free advisor.
    </p>

    {/* --- SECTION 2: HIDDEN SEO PARAGRAPH (FOR GOOGLE) --- */}
    {/* As your SEO expert, this is my recommended text. It is invisible to users but is packed with keywords. */}
    <div className="sr-only">
      <h2>Insurance Smart Advisor: Full Mission and SEO Keywords</h2>
      <p>
        As your unconditional free advisor, Insurance Smart Advisor provides a full suite of services to make complex insurance simpler than you ever thought. 
        Get free, actionable tips to save money and stay informed with the latest insurance news. 
        Use our advanced and unbiased insurance calculator apps to easily compare options, plan your budget, and see the real value before you buy. 
        We help you find your smart path to insurance savings and achieve your financial goals. 
        This is your best partner for discovering affordable insurance options.
      </p>
    </div>
    
  </section>
);

export default WelcomeSection;