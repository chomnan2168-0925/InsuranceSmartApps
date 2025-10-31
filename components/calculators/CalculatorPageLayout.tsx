// components/calculators/CalculatorPageLayout.tsx
// ✅ FIXED: Removed duplicate calculator schema creation that was causing "Unnamed item" errors
// Now properly uses calculator prop from pages without creating defaults

import React from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Article } from '@/types';
import { useCalculatorContext } from '@/context/CalculatorContext';
import SEO from '@/components/layout/SEO';
import LayoutWithSidebar from '@/components/layout/LayoutWithSidebar';
import Sidebar from '@/components/layout/Sidebar';
import RecommendedSlider from '@/components/articles/RecommendedSlider';
import ResultComparison from '@/components/calculators/ResultComparison';
import LatestResult from '@/components/calculators/LatestResult';
import TagCloud from '@/components/calculators/TagCloud';
import ShareMetaTags from '@/components/calculators/ShareMetaTags';
import CalculatorTabs, { CalculatorInfo } from '@/components/calculators/CalculatorTabs';
import siteConfig from '@/config/siteConfig.json';

export type CalculatorType = 'auto' | 'home' | 'life' | 'disability' | 'health' | 'pet';

interface SEOData {
  title: string;
  description: string;
  keywords: string;
  h2: string;
  content: string;
  keywords_list: string[];
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

interface CalculatorPageLayoutProps {
  calculatorType: CalculatorType;
  seoData: SEOData;
  icon: string;
  displayTitle: string;
  subtitle: string;
  children: React.ReactNode;
  dontMissArticles: Article[];
  sidebarTopTips: Article[];
  sidebarTopNews: Article[];
  allTags: string[];
  
  faqs?: FAQItem[];
  howTo?: HowToSchema;
  calculator?: CalculatorSchema;
  speakableSelectors?: string[];
}

// Icons for tabs
const CarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const LifeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const DisabilityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.176-5.97M15 21H9" /></svg>;
const HealthIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

// Calculator tabs configuration
const calculatorTypes: CalculatorInfo[] = [
  { id: 'auto', label: 'Auto', icon: <CarIcon />, activeColorClass: 'text-blue-600 border-blue-500', hoverColorClass: 'hover:border-blue-500' },
  { id: 'home', label: 'Home', icon: <HomeIcon />, activeColorClass: 'text-green-600 border-green-500', hoverColorClass: 'hover:border-green-500' },
  { id: 'life', label: 'Life', icon: <LifeIcon />, activeColorClass: 'text-purple-600 border-purple-500', hoverColorClass: 'hover:border-purple-500' },
  { id: 'disability', label: 'Disability', icon: <DisabilityIcon />, activeColorClass: 'text-orange-600 border-orange-500', hoverColorClass: 'hover:border-orange-500' },
  { id: 'health', label: 'Health', icon: <HealthIcon />, activeColorClass: 'text-sky-600 border-sky-500', hoverColorClass: 'hover:border-sky-500' },
  { id: 'pet', label: 'Pet', icon: <PetIcon />, activeColorClass: 'text-yellow-600 border-yellow-500', hoverColorClass: 'hover:border-yellow-500' },
];

// Enhanced SEO Content Component
const EnhancedSEOContent = ({ calculatorType, seoData }: { calculatorType: CalculatorType; seoData: SEOData }) => {
  return (
    <div className="sr-only">
      <h2>{seoData.h2}</h2>
      <p>{seoData.content}</p>
      <div>
        <h3>Related Insurance Calculator Keywords and Topics:</h3>
        <ul>
          {seoData.keywords_list.map((keyword, idx) => (
            <li key={idx}>{keyword}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Why Use Our {calculatorType.charAt(0).toUpperCase() + calculatorType.slice(1)} Insurance Calculator?</h3>
        <ul>
          <li>Free, instant, and accurate insurance premium estimates</li>
          <li>No personal information required - completely anonymous</li>
          <li>Compare multiple coverage options side-by-side</li>
          <li>Industry-leading calculation algorithms and rating factors</li>
          <li>Mobile-friendly responsive design for calculations on-the-go</li>
          <li>Save, print, and share your insurance quote results</li>
          <li>Expert guidance and educational resources included</li>
          <li>Updated regularly with latest insurance industry data</li>
        </ul>
      </div>
    </div>
  );
};

// FAQ Section (visible to users AND AI crawlers)
const FAQSection = ({ faqs }: { faqs?: FAQItem[] }) => {
  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="mt-8 bg-white p-6 rounded-xl shadow-lg border border-gray-100">
      <h2 className="text-2xl font-bold text-navy-blue mb-6 flex items-center gap-2">
        <span className="text-3xl">❓</span>
        Frequently Asked Questions
      </h2>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
            <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const CalculatorPageLayout: React.FC<CalculatorPageLayoutProps> = ({
  calculatorType,
  seoData,
  icon,
  displayTitle,
  subtitle,
  children,
  dontMissArticles,
  sidebarTopTips,
  sidebarTopNews,
  allTags,
  faqs,
  howTo,
  calculator,
  speakableSelectors,
}) => {
  const router = useRouter();
  const { allResults, compareMode, setCompareMode, latestResult } = useCalculatorContext();

  const getCalculatorOGImage = () => {
    const calc = siteConfig.calculators.find(
      (c) => c.slug === `${calculatorType}-insurance`
    );
    return calc?.ogImageFull || siteConfig.defaultOgImage;
  };

  const ogImageUrl = getCalculatorOGImage();

  // ✅ FIXED: Create proper breadcrumbs
  const breadcrumbs = [
    { name: 'Home', url: 'https://www.insurancesmartcalculator.com' },
    { name: 'Calculators', url: 'https://www.insurancesmartcalculator.com/calculators' },
    { name: displayTitle, url: `https://www.insurancesmartcalculator.com/calculators/${calculatorType}-insurance` }
  ];

  // ✅ FIXED: Create default FAQs if not provided
  const defaultFAQs: FAQItem[] = [
    {
      question: `How accurate is the ${calculatorType} insurance calculator?`,
      answer: `Our ${calculatorType} insurance calculator provides estimates based on industry-standard rating factors and algorithms. Actual quotes may vary based on specific insurer underwriting guidelines and additional factors.`
    },
    {
      question: "Is the calculator really free to use?",
      answer: "Yes! Our insurance calculators are 100% free with no hidden fees, no registration required, and no obligation to purchase."
    },
    {
      question: "Do I need to provide personal information?",
      answer: "No. Our calculators provide estimates without collecting personally identifiable information. You can use the tools anonymously."
    }
  ];

  // ✅ CRITICAL FIX: Removed calculatorSchemaData creation - use prop directly
  // This was causing duplicate SoftwareApplication schemas (the "Unnamed item" error)
  // Now we ONLY use the calculator prop passed from each calculator page

  // Handle tab switching with navigation
  const handleTabSwitch = (newType: CalculatorInfo['id']) => {
    router.push(`/calculators/${newType}-insurance`);
  };

  return (
    <>
      {/* ✅ FIXED: SEO component now handles ALL structured data */}
      <SEO
        title={seoData.title}
        description={seoData.description}
        imageUrl={ogImageUrl}
        canonical={`https://www.insurancesmartcalculator.com/calculators/${calculatorType}-insurance`}
        keywords={seoData.keywords_list}
        breadcrumbs={breadcrumbs}
        faqs={faqs || defaultFAQs}
        howTo={howTo}
        calculator={calculator}
        speakableSelectors={speakableSelectors || ['.calculator-content', '.faq-section']}
      />
      
      {/* Additional Meta Tags - Only non-schema tags here */}
      <Head>
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        
        {/* Language and Region */}
        <meta httpEquiv="content-language" content="en-US" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
      </Head>

      {/* Dynamic meta tags for calculator results */}
      <ShareMetaTags 
        result={latestResult} 
        pageTitle={seoData.title}
        pageDescription={seoData.description}
      />

      <LayoutWithSidebar
        sidebar={<Sidebar topTips={sidebarTopTips} topNews={sidebarTopNews} />}
      >
        <div className="space-y-8">

          {/* Enhanced Calculator Section */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border-2 border-gray-100 calculator-content">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
                  {icon}
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    <span className="gradient-text">{displayTitle}</span>
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
                </div>
              </div>

              {/* Comparison Toggle */}
              {allResults.length > 1 && (
                <div className="flex justify-end">
                  <button
                    onClick={() => setCompareMode(!compareMode)}
                    className={`
                      px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300 flex items-center gap-2
                      ${compareMode 
                        ? 'bg-purple-600 text-white shadow-lg' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    {compareMode ? 'Exit Compare Mode' : 'Compare Results'}
                  </button>
                </div>
              )}

              {/* Enhanced Hidden SEO Content */}
              <EnhancedSEOContent calculatorType={calculatorType} seoData={seoData} />
            </div>

            {/* Calculator Tabs */}
            <div className="mb-6">
              <CalculatorTabs
                types={calculatorTypes}
                selectedType={calculatorType}
                onTypeSelect={handleTabSwitch}
                variant="primary"
              />
            </div>

            {/* Calculator Component */}
            <div className="mt-6 animate-fadeIn">
              {children}
            </div>
          </div>

          {/* Result Comparison */}
          <ResultComparison />
          
          {/* Latest Result */}
          <LatestResult />

          {/* FAQ Section (Visible to users AND AI) */}
          <div className="faq-section">
            <FAQSection faqs={faqs || defaultFAQs} />
          </div>

          {/* Recommended Articles */}
          <RecommendedSlider articles={dontMissArticles} />

          {/* Tag Cloud */}
          <TagCloud tags={allTags} />

          {/* Additional SEO Content Block - Visible to Users */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-lg border-2 border-blue-100">
            <h2 className="text-2xl font-bold text-navy-blue mb-4 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Why Choose Our {calculatorType.charAt(0).toUpperCase() + calculatorType.slice(1)} Insurance Calculator?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-green-600">✓</span>
                  100% Free & No Registration
                </h3>
                <p className="text-sm text-gray-600">
                  All our insurance calculators are completely free to use with no hidden fees, no registration required, and no obligation to purchase.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-blue-600">✓</span>
                  Accurate Industry Algorithms
                </h3>
                <p className="text-sm text-gray-600">
                  Our calculators use industry-standard rating factors and algorithms trusted by insurance professionals nationwide.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-purple-600">✓</span>
                  Instant Results & Comparisons
                </h3>
                <p className="text-sm text-gray-600">
                  Get immediate premium estimates and compare multiple scenarios side-by-side to find the best coverage options.
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-orange-600">✓</span>
                  Privacy Protected
                </h3>
                <p className="text-sm text-gray-600">
                  Your privacy matters. Use our calculators anonymously without providing personal information or contact details.
                </p>
              </div>
            </div>
          </div>

        </div>
      </LayoutWithSidebar>
    </>
  );
};

export default CalculatorPageLayout;
