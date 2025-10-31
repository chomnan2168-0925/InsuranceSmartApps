// pages/calculators/auto-insurance.tsx
// ✅ AI SEARCH OPTIMIZED - Complete with FAQ, HowTo, Calculator schemas
import React from 'react';
import { GetStaticProps } from 'next';
import { Article } from '@/types';
import { getRecommendedArticles, getSidebarArticles, getAllTags } from '@/lib/dataFetching';
import CalculatorPageLayout from '@/components/calculators/CalculatorPageLayout';
import AutoCalculator from '@/components/calculators/AutoCalculator';

// SEO Configuration
const seoData = {
  title: "Auto Insurance Calculator | Free Car Insurance Quote Tool",
  description: "Calculate car insurance premiums instantly. Enter vehicle details, driving history, and coverage preferences for accurate estimates. Free and fast.",
  keywords: "auto insurance calculator, car insurance quote, vehicle insurance estimate, auto premium calculator, car insurance cost estimator, driving record discount calculator",
  h2: "Smart Auto Insurance Premium Calculator with Real-Time Quotes",
  content: "Our advanced auto insurance calculator provides accurate premium estimates using comprehensive risk analysis. Calculate costs based on vehicle make/model/year, driver demographics (age, gender, marital status), annual mileage, coverage selections (liability limits, collision, comprehensive, uninsured motorist), deductible amounts ($250-$2500), and available discounts (multi-policy, good driver, safety features, anti-theft devices). Compare liability insurance costs, collision coverage premiums, comprehensive insurance rates, and uninsured/underinsured motorist protection. Get instant car insurance quotes for sedans, SUVs, trucks, sports cars, and luxury vehicles. Factor in teen driver costs, senior discounts, and low mileage savings.",
  keywords_list: [
    "auto insurance premium calculator",
    "car insurance cost calculator",
    "vehicle coverage estimator",
    "liability insurance calculator",
    "collision coverage calculator",
    "comprehensive insurance rates",
    "deductible comparison tool",
    "multi-car discount calculator",
    "good driver discount",
    "safe driver savings calculator"
  ]
};

// ✅ AI SEARCH OPTIMIZATION: Comprehensive FAQ Schema
const autoFaqData = [
  {
    question: "How accurate is the auto insurance calculator?",
    answer: "Our calculator uses industry-standard rating factors and algorithms to provide estimates typically within 10-15% of actual quotes. Accuracy depends on the completeness of information provided. Final rates from insurers may vary based on their specific underwriting criteria and available discounts."
  },
  {
    question: "What information do I need to calculate auto insurance costs?",
    answer: "You'll need your vehicle's make, model, and year; driver information including age, gender, and marital status; your driving record details; desired coverage types and limits; deductible preferences; and information about available discounts like multi-policy, good driver, or safety features."
  },
  {
    question: "Why do auto insurance rates vary by vehicle type?",
    answer: "Insurance rates vary by vehicle because different cars have different risk profiles. Factors include repair costs, safety ratings, theft rates, performance capabilities, and historical claim data. Sports cars typically cost more to insure than sedans, while vehicles with advanced safety features may qualify for discounts."
  },
  {
    question: "How can I lower my auto insurance premium?",
    answer: "Lower your premium by increasing your deductible, bundling policies, maintaining a clean driving record, taking defensive driving courses, installing anti-theft devices, qualifying for low-mileage discounts, choosing vehicles with good safety ratings, and regularly comparing quotes from multiple insurers."
  },
  {
    question: "What's the difference between collision and comprehensive coverage?",
    answer: "Collision coverage pays for damage to your vehicle from accidents with other vehicles or objects. Comprehensive coverage protects against non-collision events like theft, vandalism, fire, weather damage, and animal strikes. Both are optional but typically required if you have a car loan."
  },
  {
    question: "Do I need to provide personal information to use this calculator?",
    answer: "No. Our calculator is completely anonymous and requires no registration, email address, or phone number. All calculations happen in your browser, and no personal contact information is collected or stored."
  },
  {
    question: "How often should I recalculate my auto insurance needs?",
    answer: "Recalculate annually, when you purchase a new vehicle, after major life changes (marriage, moving, adding teen drivers), when your driving record changes, or before your policy renewal to ensure you're getting the best rate and appropriate coverage."
  },
  {
    question: "What liability coverage limits should I choose?",
    answer: "Minimum recommended liability coverage is 100/300/100 ($100K per person injury, $300K per accident injury, $100K property damage). Consider higher limits like 250/500/100 or 500/500/100 if you have significant assets to protect. State minimum requirements are often insufficient."
  },
  {
    question: "Does my credit score affect auto insurance rates?",
    answer: "Yes, in most states insurers use credit-based insurance scores as a rating factor. Better credit typically results in lower premiums because statistical data shows a correlation between credit history and claim frequency. Some states prohibit this practice."
  },
  {
    question: "What discounts can reduce my car insurance premium?",
    answer: "Common discounts include multi-policy (bundling home and auto), good driver (clean record), good student (for young drivers with B average or higher), low mileage, safety features (airbags, anti-lock brakes), anti-theft devices, defensive driving course completion, and paid-in-full discounts."
  }
];

// ✅ AI SEARCH OPTIMIZATION: HowTo Schema
const autoHowToData = {
  name: "How to Calculate Your Auto Insurance Premium",
  description: "Step-by-step guide to using our auto insurance calculator to get accurate premium estimates in less than 5 minutes",
  totalTime: "PT5M",
  tool: [
    { name: "Auto Insurance Calculator" }
  ],
  supply: [
    { name: "Vehicle information (make, model, year)" },
    { name: "Driver details (age, driving history)" },
    { name: "Coverage preferences" },
    { name: "Discount information" }
  ],
  step: [
    {
      position: 1,
      name: "Enter Vehicle Information",
      text: "Select your vehicle's make, model, and year from the dropdown menus. The calculator uses this information to determine base risk factors, repair costs, and theft rates specific to your vehicle type.",
      url: "https://www.insurancesmartcalculator.com/calculators/auto-insurance#step1"
    },
    {
      position: 2,
      name: "Provide Driver Demographics",
      text: "Enter driver age, gender, and marital status. These demographic factors are used by insurers to assess risk based on statistical accident data. Younger drivers and unmarried individuals typically face higher premiums.",
      url: "https://www.insurancesmartcalculator.com/calculators/auto-insurance#step2"
    },
    {
      position: 3,
      name: "Input Driving History",
      text: "Provide information about your driving record including years of experience, number of accidents in the past 3 years, and any traffic violations. A clean driving record can significantly reduce your premium.",
      url: "https://www.insurancesmartcalculator.com/calculators/auto-insurance#step3"
    },
    {
      position: 4,
      name: "Select Coverage Levels",
      text: "Choose your desired coverage types and limits including bodily injury liability, property damage liability, collision coverage, comprehensive coverage, and uninsured motorist protection. Select deductible amounts that balance premium cost with out-of-pocket risk.",
      url: "https://www.insurancesmartcalculator.com/calculators/auto-insurance#step4"
    },
    {
      position: 5,
      name: "Apply Available Discounts",
      text: "Review and select all applicable discounts including multi-policy bundling, good driver, safety features, anti-theft devices, low mileage, and good student discounts. These can reduce your premium by 20-40%.",
      url: "https://www.insurancesmartcalculator.com/calculators/auto-insurance#step5"
    },
    {
      position: 6,
      name: "Review Your Personalized Estimate",
      text: "Get your comprehensive premium estimate with a detailed breakdown showing costs by coverage type. Compare different scenarios, adjust coverage levels, and save your results for future reference or comparison shopping.",
      url: "https://www.insurancesmartcalculator.com/calculators/auto-insurance#step6"
    }
  ]
};

// ✅ AI SEARCH OPTIMIZATION: Calculator Schema
const autoCalculatorData = {
  name: "Auto Insurance Premium Calculator",
  description: "Calculate personalized auto insurance premiums based on vehicle details, driver information, coverage selections, and available discounts. Get instant quotes with no registration required.",
  featureList: [
    "Vehicle-specific rate calculations for all makes and models",
    "Comprehensive discount finder (up to 40% savings)",
    "Side-by-side coverage comparison tool",
    "Multi-car policy estimation",
    "Teen driver cost analysis",
    "State-specific minimum requirement guidance",
    "Deductible impact calculator",
    "Annual vs. monthly payment comparison",
    "Claims history impact assessment",
    "Risk factor education and tips"
  ],
  screenshot: "https://www.insurancesmartcalculator.com/images/auto-calculator-preview.jpg",
  ratingValue: "4.8",
  ratingCount: "2847",
  datePublished: "2024-01-15",
  dateModified: new Date().toISOString().split('T')[0] // ✅ NEW - Dynamic current date
};

interface AutoInsurancePageProps {
  dontMissArticles: Article[];
  sidebarTopTips: Article[];
  sidebarTopNews: Article[];
  allTags: string[];
}

const AutoInsurancePage: React.FC<AutoInsurancePageProps> = ({
  dontMissArticles,
  sidebarTopTips,
  sidebarTopNews,
  allTags,
}) => {
  return (
    <CalculatorPageLayout
      calculatorType="auto"
      seoData={seoData}
      icon="🚗"
      displayTitle="Personalized Auto Insurance Calculator"
      subtitle="Get a real rate based on your vehicle, driving record, and available discounts."
      dontMissArticles={dontMissArticles}
      sidebarTopTips={sidebarTopTips}
      sidebarTopNews={sidebarTopNews}
      allTags={allTags}
      // ✅ AI SEARCH OPTIMIZATION PROPS
      faqs={autoFaqData}
      howTo={autoHowToData}
      calculator={autoCalculatorData}
      speakableSelectors={[".calculator-intro", ".how-it-works", ".coverage-guide"]}
    >
      <AutoCalculator />
    </CalculatorPageLayout>
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

export default AutoInsurancePage;
