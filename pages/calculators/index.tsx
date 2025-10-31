// pages/calculators/index.tsx
// Main calculator hub page with links to individual calculators
// UPDATED: Shortened SEO metadata

import React from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import { Article } from '@/types';
import { getRecommendedArticles, getSidebarArticles, getAllTags } from '@/lib/dataFetching';
import SEO from '@/components/layout/SEO';
import LayoutWithSidebar from '@/components/layout/LayoutWithSidebar';
import Sidebar from '@/components/layout/Sidebar';
import RecommendedSlider from '@/components/articles/RecommendedSlider';
import TagCloud from '@/components/calculators/TagCloud';
import siteConfig from '@/config/siteConfig.json';

// Icons
const CarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const LifeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const DisabilityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.176-5.97M15 21H9" /></svg>;
const HealthIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

const calculators = [
  {
    id: 'auto',
    title: 'Auto Insurance Calculator',
    description: 'Calculate car insurance premiums based on your vehicle, driving record, and coverage needs.',
    icon: <CarIcon />,
    link: '/calculators/auto-insurance',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    features: ['Vehicle-specific quotes', 'Discount finder', 'Coverage comparison']
  },
  {
    id: 'home',
    title: 'Homeowners Insurance Calculator',
    description: 'Estimate homeowners insurance costs with replacement value and protective features.',
    icon: <HomeIcon />,
    link: '/calculators/home-insurance',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    features: ['Replacement cost analysis', 'Protection credits', 'Coverage customization']
  },
  {
    id: 'life',
    title: 'Life Insurance Calculator',
    description: 'Determine how much life insurance you need using the comprehensive DIME+ method.',
    icon: <LifeIcon />,
    link: '/calculators/life-insurance',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    features: ['DIME+ analysis', 'Term vs whole life', 'Family protection planning']
  },
  {
    id: 'health',
    title: 'Health Insurance Calculator',
    description: 'Calculate ACA marketplace premiums and check subsidy eligibility instantly.',
    icon: <HealthIcon />,
    link: '/calculators/health-insurance',
    color: 'from-sky-500 to-sky-600',
    bgColor: 'bg-sky-50',
    borderColor: 'border-sky-200',
    features: ['ACA subsidy checker', 'Plan tier comparison', 'Tax credit estimator']
  },
  {
    id: 'disability',
    title: 'Disability Insurance Calculator',
    description: 'Calculate income protection needs and estimate disability insurance benefits.',
    icon: <DisabilityIcon />,
    link: '/calculators/disability-insurance',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    features: ['Income replacement', 'Benefit period selection', 'Earning potential analysis']
  },
  {
    id: 'pet',
    title: 'Pet Insurance Calculator',
    description: 'Get breed-specific pet insurance quotes for dogs and cats with wellness options.',
    icon: <PetIcon />,
    link: '/calculators/pet-insurance',
    color: 'from-yellow-500 to-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    features: ['Breed-specific pricing', 'Wellness coverage', 'Reimbursement calculator']
  },
];

interface CalculatorsIndexPageProps {
  dontMissArticles: Article[];
  sidebarTopTips: Article[];
  sidebarTopNews: Article[];
  allTags: string[];
}

const CalculatorsIndexPage: React.FC<CalculatorsIndexPageProps> = ({
  dontMissArticles,
  sidebarTopTips,
  sidebarTopNews,
  allTags,
}) => {
  return (
    <>
      {/* UPDATED: Shortened SEO metadata */}
      <SEO
  title="Free Insurance Calculators | Auto, Home & More"
  description="Free, unbiased insurance calculators for auto, home, life, health, disability, and pet coverage. Get instant quotes with no signup required. Compare options and save."
  imageUrl={siteConfig.pages.calculators.ogImageFull}
  canonical="https://www.insurancesmartcalculator.com/calculators"
  keywords={[
    'insurance calculator',
    'auto insurance calculator',
    'home insurance calculator',
    'life insurance calculator',
    'health insurance calculator',
    'disability insurance calculator',
    'pet insurance calculator',
    'free insurance quotes'
  ]}
/>

      <LayoutWithSidebar
        sidebar={<Sidebar topTips={sidebarTopTips} topNews={sidebarTopNews} />}
      >
        <div className="space-y-8">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8 rounded-2xl shadow-lg border-2 border-blue-100">
            <div className="text-center max-w-3xl mx-auto">
              <div className="inline-block mb-4">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-5xl shadow-xl">
                  🧮
                </div>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-navy-blue mb-4">
                Free Insurance Calculators
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-6">
                Get instant insurance quotes and estimates. No signup required. 100% free.
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-gray-700">No Registration</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-gray-700">Instant Results</span>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow-sm">
                  <svg className="w-5 h-5 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-gray-700">100% Free</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calculator Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {calculators.map((calc) => (
              <Link key={calc.id} href={calc.link}>
                <div className={`
                  group ${calc.bgColor} p-6 rounded-2xl border-2 ${calc.borderColor} 
                  hover:shadow-2xl transition-all duration-300 transform hover:scale-105 
                  cursor-pointer h-full flex flex-col
                `}>
                  {/* Icon */}
                  <div className={`
                    w-16 h-16 bg-gradient-to-br ${calc.color} rounded-xl 
                    flex items-center justify-center text-white mb-4 shadow-lg
                    group-hover:scale-110 transition-transform
                  `}>
                    {calc.icon}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {calc.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 flex-grow">
                    {calc.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2 mb-4">
                    {calc.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-gray-700">
                        <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className={`
                    flex items-center justify-between px-4 py-3 bg-white rounded-lg 
                    border-2 ${calc.borderColor} group-hover:border-gray-400 transition-all
                  `}>
                    <span className="font-bold text-gray-700">Calculate Now</span>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-lg border-2 border-blue-100">
            <h2 className="text-2xl font-bold text-navy-blue mb-6 text-center flex items-center justify-center gap-2">
              <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Why Choose Our Insurance Calculators?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-5 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  Industry-Leading Accuracy
                </h3>
                <p className="text-sm text-gray-600">
                  Our calculators use the same rating factors and algorithms trusted by insurance professionals to provide you with the most accurate estimates possible.
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  Complete Privacy
                </h3>
                <p className="text-sm text-gray-600">
                  No phone number, no email, no spam. Use our calculators completely anonymously without sharing any personal contact information.
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  Save & Compare
                </h3>
                <p className="text-sm text-gray-600">
                  Run multiple scenarios, compare results side-by-side, and share your estimates with family members or advisors.
                </p>
              </div>
              <div className="bg-white p-5 rounded-xl shadow-sm">
                <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  Expert Guidance
                </h3>
                <p className="text-sm text-gray-600">
                  Each calculator includes educational content, tips, and best practices to help you make informed insurance decisions.
                </p>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border-2 border-gray-200">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-navy-blue mb-2">Trusted by Thousands</h2>
              <p className="text-sm text-gray-600">Join the community of smart insurance shoppers</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-3xl font-black text-blue-600 mb-1">50K+</div>
                <div className="text-xs text-gray-600 font-medium">Calculations This Month</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-3xl font-black text-green-600 mb-1">4.8/5</div>
                <div className="text-xs text-gray-600 font-medium">Average User Rating</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-3xl font-black text-purple-600 mb-1">100%</div>
                <div className="text-xs text-gray-600 font-medium">Free Forever</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-3xl font-black text-orange-600 mb-1">0</div>
                <div className="text-xs text-gray-600 font-medium">Personal Info Required</div>
              </div>
            </div>
          </div>

          {/* Recommended Articles */}
          <RecommendedSlider articles={dontMissArticles} />

          {/* Tag Cloud */}
          <TagCloud tags={allTags} />

          {/* SEO Content - Hidden */}
          <div className="sr-only">
            <h2>Free Insurance Calculator Tools and Premium Estimators</h2>
            <p>
              Insurance SmartApps provides comprehensive free insurance calculator tools for auto insurance quotes, 
              car insurance premium estimates, home insurance cost calculator, homeowners insurance estimator, 
              life insurance needs analysis, term life insurance calculator, whole life insurance calculator, 
              health insurance comparison tool, health insurance premium calculator, disability income protection calculator, 
              disability insurance coverage estimator, and pet insurance cost calculator.
            </p>
            <p>
              Our unbiased insurance calculators help you compare insurance rates, understand coverage options, 
              estimate monthly premiums, calculate deductibles, analyze insurance costs, find the best insurance policies, 
              and make informed decisions about your financial protection needs.
            </p>
          </div>
        </div>
      </LayoutWithSidebar>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const [dontMiss, tips, news, tags] = await Promise.all([
    getRecommendedArticles(),
    getSidebarArticles('Insurance Tips', 3),
    getSidebarArticles('Insurance Newsroom', 3),
    getAllTags()
  ]);

  return {
    props: {
      dontMissArticles: dontMiss,
      sidebarTopTips: tips,
      sidebarTopNews: news,
      allTags: tags,
    },
    revalidate: 600,
  };
};

export default CalculatorsIndexPage;
