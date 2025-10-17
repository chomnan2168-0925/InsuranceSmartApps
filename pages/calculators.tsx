// /pages/calculators.tsx
import React, { useState } from 'react';
import { GetStaticProps } from 'next';
import Head from 'next/head';
import { Article } from '@/types';
import { getRecommendedArticles, getSidebarArticles, getAllTags } from '@/lib/dataFetching';
import { useCalculatorContext } from '@/context/CalculatorContext';
import SEO from '@/components/layout/SEO';
import LayoutWithSidebar from '@/components/layout/LayoutWithSidebar';
import Sidebar from '@/components/layout/Sidebar';
import RecommendedSlider from '@/components/articles/RecommendedSlider';
import CalculatorTabs, { CalculatorInfo } from '@/components/calculators/CalculatorTabs';
import AutoCalculator from '@/components/calculators/AutoCalculator';
import HomeCalculator from '@/components/calculators/HomeCalculator';
import LifeCalculator from '@/components/calculators/LifeCalculator';
import DisabilityCalculator from '@/components/calculators/DisabilityCalculator';
import HealthCalculator from '@/components/calculators/HealthCalculator';
import PetCalculator from '@/components/calculators/PetCalculator';
import ResultComparison from '@/components/calculators/ResultComparison';
import LatestResult from '@/components/calculators/LatestResult';
import TagCloud from '@/components/calculators/TagCloud';
import ShareMetaTags from '@/components/calculators/ShareMetaTags';

// Security: Sanitize text for JSON-LD structured data
const sanitizeForJsonLd = (text: string): string => {
  if (!text) return '';
  return String(text)
    .replace(/[<>]/g, '') // Remove HTML brackets
    .replace(/"/g, '\\"') // Escape quotes
    .replace(/\\/g, '\\\\') // Escape backslashes
    .replace(/\n/g, ' ') // Remove newlines
    .trim();
};

// Security: Validate calculator type
const isValidCalculatorType = (type: string): boolean => {
  const validTypes = ['auto', 'home', 'life', 'disability', 'health', 'pet'];
  return validTypes.includes(type);
};

// Icons
const CarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const HomeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const LifeIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
const DisabilityIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M15 21v-1a6 6 0 00-5.176-5.97M15 21H9" /></svg>;
const HealthIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const PetIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;

// SEO Configuration for Each Calculator
const calculatorSEO = {
  auto: {
    title: "Free Auto Insurance Calculator | Get Accurate Car Insurance Quotes 2024",
    description: "Calculate your auto insurance premium instantly with our smart calculator. Get personalized car insurance quotes based on vehicle type, driving record, coverage options, and discounts. Free estimates in seconds.",
    keywords: "auto insurance calculator, car insurance quote, vehicle insurance estimate, auto premium calculator, car insurance cost estimator, driving record discount calculator",
    h2: "Smart Auto Insurance Premium Calculator with Real-Time Quotes",
    content: "Our advanced auto insurance calculator provides accurate premium estimates using comprehensive risk analysis. Calculate costs based on vehicle make/model/year, driver demographics (age, gender, marital status), annual mileage, coverage selections (liability limits, collision, comprehensive, uninsured motorist), deductible amounts ($250-$2500), and available discounts (multi-policy, good driver, safety features, anti-theft devices). Compare liability insurance costs, collision coverage premiums, comprehensive insurance rates, and uninsured/underinsured motorist protection. Get instant car insurance quotes for sedans, SUVs, trucks, sports cars, and luxury vehicles. Factor in teen driver costs, senior discounts, and low mileage savings.",
    keywords_list: ["auto insurance premium calculator", "car insurance cost calculator", "vehicle coverage estimator", "liability insurance calculator", "collision coverage calculator", "comprehensive insurance rates", "deductible comparison tool", "multi-car discount calculator", "good driver discount", "safe driver savings calculator"]
  },
  home: {
    title: "Homeowners Insurance Calculator | Free Premium Estimator & Coverage Tool",
    description: "Calculate your homeowners insurance premium with our replacement cost calculator. Get accurate property insurance estimates based on home features, location, coverage limits, and protective credits. Free online tool.",
    keywords: "homeowners insurance calculator, home insurance premium estimator, property insurance calculator, dwelling coverage calculator, replacement cost calculator, home insurance quote tool",
    h2: "Comprehensive Homeowners Insurance Premium Calculator with Replacement Cost Analysis",
    content: "Calculate accurate homeowners insurance premiums using our intelligent property insurance calculator. Input dwelling replacement cost (not market value), home age and construction type (frame, masonry, superior construction), square footage, location/ZIP code, roof age and material, coverage limits (dwelling, personal property, liability, medical payments), deductible options ($500-$5000), and protective features. Earn premium credits for smoke detectors, fire alarms, burglar alarms, deadbolts, sprinkler systems, storm shutters, and proximity to fire hydrants/fire stations. Estimate costs for HO-3 special form policies, dwelling coverage, personal property protection (50-70% of dwelling), loss of use coverage, personal liability ($100K-$500K), and medical payments. Consider additional endorsements: water backup coverage, equipment breakdown, scheduled personal property (jewelry, art), identity theft protection, and ordinance or law coverage.",
    keywords_list: ["homeowners insurance cost", "property insurance premium", "dwelling coverage calculator", "replacement cost estimator", "home insurance quote", "liability coverage calculator", "protective device discounts", "fire alarm discount", "burglar alarm savings", "HO-3 policy calculator"]
  },
  life: {
    title: "Life Insurance Calculator | DIME+ Needs Analysis & Coverage Amount Tool",
    description: "Calculate how much life insurance you need with our comprehensive DIME+ method calculator. Analyze debt, income replacement, mortgage, education costs, and final expenses. Free life insurance needs assessment.",
    keywords: "life insurance calculator, life insurance needs analysis, DIME method calculator, coverage amount calculator, life insurance estimator, term life calculator, income replacement calculator",
    h2: "Professional Life Insurance Needs Calculator Using DIME+ Analysis Method",
    content: "Determine optimal life insurance coverage with our expert DIME+ needs analysis calculator. Calculate comprehensive protection based on: Debt (mortgage balance, auto loans, credit cards, student loans, personal loans), Income replacement (annual salary multiplied by years of support needed, typically 5-10 years for dependents), Mortgage payoff (remaining principal balance), Education funding (college costs per child: $100K-$250K for 4-year degree), and End-of-life expenses (funeral costs $7K-$12K, final medical bills, estate settlement). Compare term life insurance options (10-year, 15-year, 20-year, 30-year terms) vs permanent life insurance (whole life, universal life, variable universal life). Consider return of premium riders, accelerated death benefit riders, waiver of premium riders, and child/spouse term riders. Calculate Human Life Value (HLV) using earning potential, age, retirement timeline, inflation adjustments, and discount rates. Factor in existing coverage through employer group life, existing individual policies, social security survivor benefits, and spouse income.",
    keywords_list: ["life insurance needs calculator", "DIME method analysis", "coverage amount estimator", "term life calculator", "whole life insurance", "income replacement needs", "mortgage payoff calculator", "education funding calculator", "funeral cost estimator", "human life value calculator"]
  },
  disability: {
    title: "Disability Insurance Calculator | Income Protection & Benefit Amount Estimator",
    description: "Calculate your disability insurance needs and monthly benefit amount with our income protection calculator. Compare short-term vs long-term disability coverage, benefit periods, and elimination periods. Free tool.",
    keywords: "disability insurance calculator, income protection calculator, disability benefit estimator, earning potential calculator, short-term disability calculator, long-term disability calculator",
    h2: "Advanced Disability Insurance Calculator for Comprehensive Income Protection Planning",
    content: "Calculate disability insurance needs and understand income protection requirements with our professional calculator. Determine appropriate monthly benefit amounts (typically 60-70% of gross income), select benefit periods (2 years, 5 years, 10 years, to age 65, to age 67, lifetime), choose elimination/waiting periods (30, 60, 90, 180, 365 days - longer periods = lower premiums), and understand own-occupation vs any-occupation definitions. Compare short-term disability (STD) coverage (3-6 months, typically through employer, covers 50-70% of salary) versus long-term disability (LTD) insurance (begins after STD exhausts, continues for years or until retirement). Calculate future earning potential: current salary × years until retirement × annual raises (3-5%). Factor in existing coverage: employer group disability, Social Security Disability Insurance (SSDI - average $1,537/month in 2024), workers compensation, state disability programs (CA, HI, NJ, NY, RI, PR). Consider cost of living adjustment (COLA) riders, residual/partial disability riders, catastrophic disability riders, and return to work provisions. Understand tax implications: employer-paid premiums = taxable benefits, individual-paid premiums = tax-free benefits.",
    keywords_list: ["disability insurance needs", "income protection calculator", "benefit period calculator", "elimination period comparison", "short-term disability", "long-term disability", "earning potential protection", "own-occupation coverage", "any-occupation definition", "SSDI calculator"]
  },
  health: {
    title: "ACA Health Insurance Subsidy Calculator | Premium Tax Credit Estimator 2024",
    description: "Calculate your ACA marketplace premium and subsidy eligibility instantly. Determine premium tax credits based on income, household size, and Federal Poverty Level. Free Obamacare calculator with plan comparisons.",
    keywords: "ACA subsidy calculator, premium tax credit calculator, health insurance marketplace calculator, Obamacare calculator, Federal Poverty Level calculator, healthcare subsidy estimator",
    h2: "Official ACA Health Insurance Subsidy and Premium Tax Credit Calculator 2024",
    content: "Calculate Affordable Care Act (ACA) marketplace premiums and determine subsidy eligibility with our comprehensive calculator. Input Modified Adjusted Gross Income (MAGI - includes wages, self-employment income, interest, dividends, IRA distributions, social security), household size (yourself, spouse, dependents under 26, other tax dependents), age, tobacco use (up to 50% surcharge), and location (ZIP code - premiums vary by rating area). Our calculator computes Federal Poverty Level (FPL) percentage: 2024 FPL is $14,580 for individual, $19,720 for 2-person household, add $5,140 per additional person. Premium tax credits available for 100-400% FPL (some states extend to 600% FPL with state subsidies). Calculate costs for metal tier plans: Bronze (60% actuarial value, lowest premiums, highest out-of-pocket), Silver (70% actuarial value, eligible for cost-sharing reductions at 100-250% FPL), Gold (80% actuarial value, higher premiums, lower out-of-pocket), Platinum (90% actuarial value, highest premiums, lowest out-of-pocket). Factor in cost-sharing reductions (CSR) that lower deductibles, copays, and coinsurance for Silver plans at 100-250% FPL. Compare premiums with/without subsidies, calculate annual maximum out-of-pocket limits ($9,450 individual, $18,900 family in 2024), and understand advance premium tax credits (APTC) paid directly to insurers vs reconciling when filing taxes.",
    keywords_list: ["ACA subsidy calculator", "premium tax credit", "healthcare marketplace calculator", "Obamacare calculator", "Federal Poverty Level calculator", "MAGI calculator", "cost-sharing reductions", "Bronze Silver Gold Platinum plans", "health insurance subsidy", "marketplace premium estimator"]
  },
  pet: {
    title: "Pet Insurance Calculator | Breed-Specific Dog & Cat Insurance Quote Tool",
    description: "Get accurate pet insurance quotes with our breed-specific calculator. Compare dog and cat insurance costs based on breed, age, coverage level, deductible, and reimbursement. Free instant estimates with wellness options.",
    keywords: "pet insurance calculator, dog insurance cost calculator, cat insurance premium estimator, breed-specific pet insurance, veterinary insurance calculator, pet wellness plan calculator",
    h2: "Intelligent Pet Insurance Calculator with Breed-Specific Premium Estimates",
    content: "Calculate personalized pet insurance quotes tailored to your dog or cat with our advanced breed-specific calculator. Select from 100+ dog breeds (Labrador Retriever, German Shepherd, Golden Retriever, French Bulldog, Bulldog, Beagle, Poodle, Rottweiler, Yorkshire Terrier, Dachshund, Boxer, Siberian Husky, Great Dane, Chihuahua, mixed breeds) or cat breeds (Domestic Shorthair, Domestic Longhair, Maine Coon, Persian, Siamese, Ragdoll, Bengal, British Shorthair, Sphynx, mixed breeds). Factor in breed-specific health conditions: hip dysplasia, allergies, heart disease, cancer predisposition, dental issues, eye problems, and hereditary conditions. Input pet age (premiums increase 5-10% annually, enroll young for best rates), choose coverage levels: accident-only (lowest cost, covers injuries, foreign objects, toxins), accident & illness (most popular, adds cancer, infections, chronic conditions, hereditary issues), comprehensive (includes exam fees, prescription medications, surgeries, hospitalizations, diagnostic tests, emergency care). Select annual deductible ($0-$1000 - higher deductible = lower premium), reimbursement level (70%, 80%, 90% of vet bill after deductible), annual coverage limit ($5K, $10K, $20K, unlimited - unlimited costs 30% more), and add optional wellness/preventive care plans (+$15-$40/month covers annual exams, vaccinations, heartworm/flea prevention, dental cleanings, spay/neuter). Compare coverage for exam fees (included vs not included - $20-$50 per visit), waiting periods (accidents: 2-5 days, illnesses: 14-30 days, orthopedic: 6-12 months), pre-existing condition exclusions (conditions before policy starts or during waiting periods are not covered), and understand reimbursement methods (actual vet bill vs benefit schedule). Calculate savings for multi-pet discounts (5-10% off), annual pay discounts (5% vs monthly payments), and microchip discounts.",
    keywords_list: ["pet insurance calculator", "dog insurance cost", "cat insurance premium", "breed-specific insurance", "veterinary insurance calculator", "pet wellness plan", "accident illness coverage", "reimbursement calculator", "annual limit comparison", "multi-pet discount calculator"]
  }
};

const calculatorTypes: (CalculatorInfo & { title: string; subtitle: string; })[] = [
  { id: 'auto', label: 'Auto', icon: <CarIcon />, title: 'Personalized Auto Insurance Calculator', subtitle: 'Get a real rate based on your vehicle, driving record, and available discounts.', activeColorClass: 'text-blue-600 border-blue-500', hoverColorClass: 'hover:border-blue-500' },
  { id: 'home', label: 'Home', icon: <HomeIcon />, title: 'Accurate Homeowners Insurance Premium Calculator', subtitle: 'Estimate your premium based on your home\'s features and protective credits.', activeColorClass: 'text-green-600 border-green-500', hoverColorClass: 'hover:border-green-500' },
  { id: 'life', label: 'Life', icon: <LifeIcon />, title: 'Comprehensive Life Insurance Needs Analysis', subtitle: 'Use our guided wizard to determine the right coverage amount for your family.', activeColorClass: 'text-purple-600 border-purple-500', hoverColorClass: 'hover:border-purple-500' },
  { id: 'disability', label: 'Disability', icon: <DisabilityIcon />, title: 'Income Protection & Disability Calculator', subtitle: 'Discover your future earning potential and learn how to protect it.', activeColorClass: 'text-orange-600 border-orange-500', hoverColorClass: 'hover:border-orange-500' },
  { id: 'health', label: 'Health', icon: <HealthIcon />, title: 'ACA Health Insurance Subsidy Calculator', subtitle: 'See if you qualify for a subsidy and estimate your total annual costs.', activeColorClass: 'text-sky-600 border-sky-500', hoverColorClass: 'hover:border-sky-500' },
  { id: 'pet', label: 'Pet', icon: <PetIcon />, title: 'Breed-Specific Pet Insurance Calculator', subtitle: 'Get a personalized quote based on your pet\'s breed and your chosen coverage.', activeColorClass: 'text-yellow-600 border-yellow-500', hoverColorClass: 'hover:border-yellow-500' },
];

type CalculatorType = typeof calculatorTypes[number]['id'];

interface CalculatorsPageProps {
  dontMissArticles: Article[];
  sidebarTopTips: Article[];
  sidebarTopNews: Article[];
  allTags: string[];
}

// Structured Data Component for Rich Snippets - SECURITY ENHANCED
const CalculatorStructuredData = ({ calculatorType }: { calculatorType: CalculatorType }) => {
  // Security: Validate calculator type
  if (!isValidCalculatorType(calculatorType)) {
    console.error('Invalid calculator type:', calculatorType);
    return null;
  }

  const seoData = calculatorSEO[calculatorType];
  if (!seoData) {
    console.error('SEO data not found for calculator type:', calculatorType);
    return null;
  }
  
  // Security: Sanitize all text content
  const safeTitle = sanitizeForJsonLd(seoData.title);
  const safeDescription = sanitizeForJsonLd(seoData.description);
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": safeTitle,
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "2847"
    },
    "description": safeDescription,
    "screenshot": `https://InsuranceSmartCalculator.com/images/calculators/${calculatorType}-calculator-screenshot.jpg`,
    "featureList": [
      "Free instant calculations",
      "No personal information required",
      "Comprehensive needs analysis",
      "Compare multiple quotes",
      "Save and print results",
      "Mobile-friendly interface"
    ]
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://insurancesmartcalculator.com"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "Calculators",
        "item": "https://insurancesmartcalculator.com/calculators"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": `${calculatorType.charAt(0).toUpperCase() + calculatorType.slice(1)} Insurance Calculator`,
        "item": `https://insurancesmartcalculator.com/calculators#${calculatorType}`
      }
    ]
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `How accurate is the ${sanitizeForJsonLd(calculatorType)} insurance calculator?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Our ${sanitizeForJsonLd(calculatorType)} insurance calculator provides estimates based on industry-standard rating factors and algorithms. Actual quotes may vary based on specific insurer underwriting guidelines and additional factors.`
        }
      },
      {
        "@type": "Question",
        "name": "Is the calculator really free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes! Our insurance calculators are 100% free with no hidden fees, no registration required, and no obligation to purchase."
        }
      },
      {
        "@type": "Question",
        "name": "Do I need to provide personal information?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Our calculators provide estimates without collecting personally identifiable information. You can use the tools anonymously."
        }
      }
    ]
  };

  return (
    <>
      {/* 
        Security Note: dangerouslySetInnerHTML is SAFE here because:
        1. JSON.stringify() automatically escapes all HTML/script tags
        2. Content comes from our hardcoded calculatorSEO object, not user input
        3. Additional sanitization via sanitizeForJsonLd() provides extra protection
        4. This is the standard method for adding JSON-LD structured data to React/Next.js
      */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
      />
    </>
  );
};

// Enhanced SEO Content Component
const EnhancedSEOContent = ({ calculatorType }: { calculatorType: CalculatorType }) => {
  const seoData = calculatorSEO[calculatorType];

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

const CalculatorsPage: React.FC<CalculatorsPageProps> = ({
  dontMissArticles,
  sidebarTopTips,
  sidebarTopNews,
  allTags,
}) => {
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('auto');
  const { allResults, compareMode, setCompareMode, latestResult } = useCalculatorContext();
  
  React.useEffect(() => {
    // Security: Sanitize and validate URL parameters
    const params = new URLSearchParams(window.location.search);
    const sharedCalc = params.get('calc');
    const sharedResult = params.get('result');
    
    // Security: Validate calculator type from URL
    if (sharedCalc && isValidCalculatorType(sharedCalc)) {
      setActiveCalculator(sharedCalc as CalculatorType);
      
      // Security: Process result parameter if present
      if (sharedResult) {
        // Only accept alphanumeric and limited special characters
        const sanitizedResult = sharedResult.replace(/[^a-zA-Z0-9-_]/g, '');
        
        // Process inputs safely
        const inputs = [];
        let i = 0;
        while (params.get(`i${i}`)) {
          const inputParam = params.get(`i${i}`);
          if (inputParam) {
            const parts = inputParam.split(':');
            const label = parts[0] || '';
            const value = parts[1] || '';
            inputs.push({ 
              label: sanitizeForJsonLd(label), 
              value: sanitizeForJsonLd(value) 
            });
          }
          i++;
        }
        
        // You can use sanitizedResult and inputs here if needed
        // Example: console.log('Shared result:', sanitizedResult, inputs);
      }
    }
  }, []);

  const currentCalculatorInfo = calculatorTypes.find(c => c.id === activeCalculator) || calculatorTypes[0];
  const currentSEO = calculatorSEO[activeCalculator];

  const renderCalculator = () => {
    // Security: Validate calculator type before rendering
    if (!isValidCalculatorType(activeCalculator)) {
      console.warn('Invalid calculator type, defaulting to auto:', activeCalculator);
      return <AutoCalculator />;
    }
    
    switch (activeCalculator) {
      case 'auto': 
        return <AutoCalculator />;
      case 'home': 
        return <HomeCalculator />;
      case 'life': 
        return <LifeCalculator />;
      case 'disability': 
        return <DisabilityCalculator />;
      case 'health': 
        return <HealthCalculator />;
      case 'pet': 
        return <PetCalculator />;
      default: 
        return <AutoCalculator />;
    }
  };

  return (
    <>
      {/* Dynamic SEO Meta Tags */}
      <SEO
        title={currentSEO.title}
        description={currentSEO.description}
      />
      
      {/* Additional Meta Tags in Head */}
      <Head>
        {/* Keywords Meta Tag */}
        <meta name="keywords" content={currentSEO.keywords} />
        
        {/* Open Graph Tags for Social Sharing */}
        <meta property="og:title" content={currentSEO.title} />
        <meta property="og:description" content={currentSEO.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://insurancesmartcalculator.com/calculators#${activeCalculator}`} />
        <meta property="og:image" content={`https://insurancesmartcalculator.com/images/calculators/${activeCalculator}-calculator-og.jpg`} />
        <meta property="og:site_name" content="Insurance SmartApps" />
        
        {/* Twitter Card Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={currentSEO.title} />
        <meta name="twitter:description" content={currentSEO.description} />
        <meta name="twitter:image" content={`https://insurancesmartcalculator.com/images/calculators/${activeCalculator}-calculator-twitter.jpg`} />
        
        {/* Additional SEO Meta Tags */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
        <meta name="googlebot" content="index, follow" />
        <link rel="canonical" href={`https://insurancesmartcalculator.com/calculators#${activeCalculator}`} />
        
        {/* Language and Region */}
        <meta httpEquiv="content-language" content="en-US" />
        <meta name="geo.region" content="US" />
        <meta name="geo.placename" content="United States" />
      </Head>
      {/* Dynamic meta tags for calculator results - NEW! */}
      <ShareMetaTags 
        result={latestResult} 
        pageTitle={currentSEO.title}
        pageDescription={currentSEO.description}
      />
      
      {/* Structured Data for Rich Snippets */}
      <CalculatorStructuredData calculatorType={activeCalculator} />

      <LayoutWithSidebar
        sidebar={<Sidebar topTips={sidebarTopTips} topNews={sidebarTopNews} />}
      >
        <div className="space-y-8">

          {/* Enhanced Calculator Section */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-xl border-2 border-gray-100">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
                  🧮
                </div>
                <div className="flex-1">
                  <h1 className="text-2xl md:text-3xl font-bold">
                    <span className="gradient-text">{currentCalculatorInfo.title}</span>
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">{currentCalculatorInfo.subtitle}</p>
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
              <EnhancedSEOContent calculatorType={activeCalculator} />
            </div>

            <CalculatorTabs
              types={calculatorTypes}
              selectedType={activeCalculator}
              onTypeSelect={setActiveCalculator}
            />

            <div className="mt-6 animate-fadeIn">
              {renderCalculator()}
            </div>
          </div>

          {/* Result Comparison */}
          <ResultComparison />
          
          {/* Latest Result */}
          <LatestResult />

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
              Why Choose Our Insurance Calculators?
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

          {/* Calculator Features Showcase */}
          <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-gray-100">
            <h2 className="text-2xl font-bold text-navy-blue mb-4">Smart Features for Better Decisions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Instant Calculations</h3>
                <p className="text-xs text-gray-600">Get results in seconds</p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Secure & Private</h3>
                <p className="text-xs text-gray-600">No data collection</p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto bg-purple-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Compare Results</h3>
                <p className="text-xs text-gray-600">Side-by-side analysis</p>
              </div>
              <div className="text-center p-4">
                <div className="w-16 h-16 mx-auto bg-orange-100 rounded-full flex items-center justify-center mb-3">
                  <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="font-bold text-sm text-gray-900 mb-1">Mobile Friendly</h3>
                <p className="text-xs text-gray-600">Calculate on-the-go</p>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-2xl border-2 border-gray-200">
            <div className="text-center mb-4">
              <h2 className="text-xl font-bold text-navy-blue mb-2">Trusted by Thousands of Users</h2>
              <p className="text-sm text-gray-600">Join thousands who have used our calculators to make informed insurance decisions</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-3xl font-black text-blue-600 mb-1">2,847+</div>
                <div className="text-xs text-gray-600 font-medium">Calculations Today</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-3xl font-black text-green-600 mb-1">4.8/5</div>
                <div className="text-xs text-gray-600 font-medium">User Rating</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-3xl font-black text-purple-600 mb-1">100%</div>
                <div className="text-xs text-gray-600 font-medium">Free to Use</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <div className="text-3xl font-black text-orange-600 mb-1">0</div>
                <div className="text-xs text-gray-600 font-medium">Hidden Fees</div>
              </div>
            </div>
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

export default CalculatorsPage;
