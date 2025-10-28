import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import { Article } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import SEO from '@/components/layout/SEO';
import LayoutWithSidebar from '@/components/layout/LayoutWithSidebar';
import Sidebar from '@/components/layout/Sidebar';
import WelcomeSection from '@/components/home/WelcomeSection';
import RecommendedSlider from '@/components/articles/RecommendedSlider';
import CalculatorTabs, { CalculatorInfo } from '@/components/calculators/CalculatorTabs';
import AutoCalculator from '@/components/calculators/AutoCalculator';
import HomeCalculator from '@/components/calculators/HomeCalculator';
import LifeCalculator from '@/components/calculators/LifeCalculator';
import DisabilityCalculator from '@/components/calculators/DisabilityCalculator';
import siteConfig from '@/config/siteConfig.json';

const CarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const LifeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const DisabilityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.176-5.97M15 21H9" /></svg>;

interface HomePageProps {
  recommendedPosts: Article[];
  sidebarTopTips: Article[];
  sidebarTopNews: Article[];
}

const homeCalculatorTypes: CalculatorInfo[] = [
  { id: 'auto', label: 'Auto', icon: <CarIcon />, activeColorClass: 'text-blue-600 border-blue-500', hoverColorClass: 'hover:border-blue-500' },
  { id: 'home', label: 'Home', icon: <HomeIcon />, activeColorClass: 'text-green-600 border-green-500', hoverColorClass: 'hover:border-green-500' },
  { id: 'life', label: 'Life', icon: <LifeIcon />, activeColorClass: 'text-purple-600 border-purple-500', hoverColorClass: 'hover:border-purple-500' },
  { id: 'disability', label: 'Disability', icon: <DisabilityIcon />, activeColorClass: 'text-orange-600 border-orange-500', hoverColorClass: 'hover:border-orange-500' },
];

type CalculatorType = 'auto' | 'home' | 'life' | 'disability';

const HomePage: React.FC<HomePageProps> = ({ recommendedPosts, sidebarTopTips, sidebarTopNews }) => {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('auto');

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'auto': return <AutoCalculator />;
      case 'home': return <HomeCalculator />;
      case 'life': return <LifeCalculator />;
      case 'disability': return <DisabilityCalculator />;
      default: return <AutoCalculator />;
    }
  };
  
  // ✅ ENHANCED: Comprehensive schemas for homepage
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Insurance SmartCalculator',
    alternateName: 'Insurance SmartApps',
    url: 'https://www.insurancesmartcalculator.com',
    description: 'Free insurance calculators, expert tips, and daily news for life, health, auto, home, disability, and pet insurance. Make informed decisions with our unbiased tools.',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.insurancesmartcalculator.com/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Insurance SmartCalculator',
    url: 'https://www.insurancesmartcalculator.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://www.insurancesmartcalculator.com/logo.png',
      width: 250,
      height: 60
    },
    description: 'Free insurance calculators and expert guidance for all your insurance needs',
    foundingDate: '2024',
    sameAs: [
      'https://www.facebook.com/insurancesmartcalculator',
      'https://twitter.com/insurancesmart',
      'https://www.linkedin.com/company/insurancesmartcalculator'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English'],
      areaServed: 'US'
    }
  };

  // ✅ ENHANCED: WebApplication schema for calculators
  const calculatorSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Insurance Calculator Suite',
    description: 'Free suite of insurance calculators including auto, home, life, health, disability, and pet insurance estimators',
    url: 'https://www.insurancesmartcalculator.com/calculators',
    applicationCategory: 'FinanceApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      'Auto Insurance Calculator',
      'Home Insurance Calculator',
      'Life Insurance Calculator',
      'Health Insurance Calculator',
      'Disability Insurance Calculator',
      'Pet Insurance Calculator'
    ]
  };

  // ✅ ENHANCED: ItemList schema for calculator tools
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Insurance Calculator Tools',
    description: 'Comprehensive suite of free insurance calculators',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'WebApplication',
          name: 'Auto Insurance Calculator',
          url: 'https://www.insurancesmartcalculator.com/calculators/auto-insurance',
          description: 'Calculate your car insurance premium and compare rates'
        }
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'WebApplication',
          name: 'Home Insurance Calculator',
          url: 'https://www.insurancesmartcalculator.com/calculators/home-insurance',
          description: 'Estimate homeowners insurance costs and coverage'
        }
      },
      {
        '@type': 'ListItem',
        position: 3,
        item: {
          '@type': 'WebApplication',
          name: 'Life Insurance Calculator',
          url: 'https://www.insurancesmartcalculator.com/calculators/life-insurance',
          description: 'Determine your life insurance coverage needs'
        }
      },
      {
        '@type': 'ListItem',
        position: 4,
        item: {
          '@type': 'WebApplication',
          name: 'Health Insurance Calculator',
          url: 'https://www.insurancesmartcalculator.com/calculators/health-insurance',
          description: 'Compare health insurance plans and premiums'
        }
      },
      {
        '@type': 'ListItem',
        position: 5,
        item: {
          '@type': 'WebApplication',
          name: 'Disability Insurance Calculator',
          url: 'https://www.insurancesmartcalculator.com/calculators/disability-insurance',
          description: 'Calculate disability income protection needs'
        }
      },
      {
        '@type': 'ListItem',
        position: 6,
        item: {
          '@type': 'WebApplication',
          name: 'Pet Insurance Calculator',
          url: 'https://www.insurancesmartcalculator.com/calculators/pet-insurance',
          description: 'Estimate pet insurance costs and coverage'
        }
      }
    ]
  };

  // ✅ Combine all schemas
  const combinedSchemas = [
    websiteSchema,
    organizationSchema,
    calculatorSchema,
    itemListSchema
  ];

  // ✅ ENHANCED: Better keywords
  const keywords = [
    'insurance calculator',
    'auto insurance calculator',
    'home insurance calculator',
    'life insurance calculator',
    'health insurance calculator',
    'disability insurance calculator',
    'pet insurance calculator',
    'insurance comparison',
    'insurance estimator',
    'free insurance tools',
    'insurance premium calculator',
    'insurance coverage calculator'
  ];

  return (
    <>
      <SEO
  title="Free Insurance Calculators & Expert Tips"
  description="Free insurance calculators for auto, home, life, health, disability & pet insurance. Get expert tips, compare rates, and make informed decisions."
  imageUrl={siteConfig.homepageOgImage}
  canonical="https://www.insurancesmartcalculator.com/"
  schemaData={combinedSchemas}
  keywords={keywords}
/>
      
      <LayoutWithSidebar
        sidebar={<Sidebar topTips={sidebarTopTips} topNews={sidebarTopNews} />}
      >
        <div className="space-y-4">
          <WelcomeSection />

          <section className="bg-white p-4 md:p-6 rounded-lg shadow-lg space-y-4">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-navy-blue text-center">
                Unlock Smarter Savings with Our Advanced Insurance Tools!
              </h2>
              
              <p className="mt-2 text-base text-gray-600 text-center max-w-4xl mx-auto">
                Don't just get a quote - get an education. Our suite of free, unbiased insurance calculator apps and expert tips are designed to help you easily compare plans, understand your options, find the savings you deserve, and choose with confidence.
              </p>
            </div>
            
            <div className="space-y-3 md:space-y-0">
              <div className="flex flex-col md:flex-row md:items-center md:border-b md:border-gray-200">
                <div className="border-b border-gray-200 md:border-0 flex-1">
                  <CalculatorTabs
                    types={homeCalculatorTypes}
                    selectedType={activeCalculator}
                    onTypeSelect={setActiveCalculator as (id: any) => void}
                    variant="secondary" 
                  />
                </div>
                
                <a 
                  href="/calculators"
                  className="
                    w-full md:w-auto md:ml-4
                    mt-1 md:mt-0
                    py-2 px-4 rounded-md text-sm font-semibold text-center
                    border-2 border-blue-500 text-blue-600 
                    transform transition-all duration-300
                    hover:bg-blue-600 hover:text-white hover:shadow-lg hover:-translate-y-0.5
                  "
                >
                  Explore All Smart Apps
                </a>
              </div>
            </div>
            
            <div>
              {renderCalculator()}
            </div>
          </section>

          {/* ✅ ENHANCED: Pass title prop to slider */}
          <RecommendedSlider articles={recommendedPosts} title="Don't Miss These!" />
        </div>
      </LayoutWithSidebar>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // ✅ ENHANCED: Fetch "Don't Miss!" articles filtered by location
  const { data: allFeaturedArticles } = await supabase
    .from('articles')
    .select('*')
    .eq('label', "Don't Miss!")
    .eq('status', 'Published')
    .order('created_at', { ascending: false });

  // Filter for Home Page location
  let recommendedPosts = (allFeaturedArticles || []).filter(article => {
    if (!article.featured_locations) return false;
    if (Array.isArray(article.featured_locations)) {
      return article.featured_locations.includes('Home Page');
    }
    return false;
  });

  // Fetch sidebar data
  const [sidebarTipsResponse, sidebarNewsResponse] = await Promise.all([
    supabase.from('articles').select('*').eq('category', 'Insurance Tips').eq('status', 'Published').order('created_at', { ascending: false }).limit(3),
    supabase.from('articles').select('*').eq('category', 'Insurance Newsroom').eq('status', 'Published').order('created_at', { ascending: false }).limit(3)
  ]);

  return {
    props: {
      recommendedPosts,
      sidebarTopTips: sidebarTipsResponse.data || [],
      sidebarTopNews: sidebarNewsResponse.data || [],
    },
    revalidate: 600,
  };
};

export default HomePage;