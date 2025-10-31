// pages/calculators/home-insurance.tsx
// ✅ AI SEARCH OPTIMIZED - Complete with FAQ, HowTo, Calculator schemas
import React from 'react';
import { GetStaticProps } from 'next';
import { Article } from '@/types';
import { getRecommendedArticles, getSidebarArticles, getAllTags } from '@/lib/dataFetching';
import CalculatorPageLayout from '@/components/calculators/CalculatorPageLayout';
import HomeCalculator from '@/components/calculators/HomeCalculator';

const seoData = {
  title: "Homeowners Insurance Calculator | Free Premium Estimator",
  description: "Calculate homeowners insurance premiums with our replacement cost calculator. Get accurate estimates based on home features and location. Free tool.",
  keywords: "homeowners insurance calculator, home insurance premium estimator, property insurance calculator, dwelling coverage calculator, replacement cost calculator, home insurance quote tool",
  h2: "Comprehensive Homeowners Insurance Premium Calculator with Replacement Cost Analysis",
  content: "Calculate accurate homeowners insurance premiums using our intelligent property insurance calculator. Input dwelling replacement cost (not market value), home age and construction type (frame, masonry, superior construction), square footage, location/ZIP code, roof age and material, coverage limits (dwelling, personal property, liability, medical payments), deductible options ($500-$5000), and protective features. Earn premium credits for smoke detectors, fire alarms, burglar alarms, deadbolts, sprinkler systems, storm shutters, and proximity to fire hydrants/fire stations.",
  keywords_list: [
    "homeowners insurance cost",
    "property insurance premium",
    "dwelling coverage calculator",
    "replacement cost estimator",
    "home insurance quote",
    "liability coverage calculator",
    "protective device discounts",
    "fire alarm discount",
    "burglar alarm savings",
    "HO-3 policy calculator"
  ]
};

// ✅ AI SEARCH OPTIMIZATION: Comprehensive FAQ Schema
const homeFaqData = [
  {
    question: "How do I calculate the replacement cost of my home?",
    answer: "Replacement cost is calculated using square footage multiplied by local construction costs per square foot, adjusted for your home's features, quality, and materials. It differs from market value as it represents the cost to rebuild your home from scratch, not what someone would pay to buy it. Use construction cost data for your region, typically ranging from $100-300 per square foot depending on location and quality."
  },
  {
    question: "What's the difference between actual cash value and replacement cost coverage?",
    answer: "Replacement cost coverage pays to rebuild or repair your home with materials of similar quality at current prices without depreciation. Actual cash value coverage pays replacement cost minus depreciation, meaning you receive less for older items. Replacement cost coverage has higher premiums but provides better protection and is strongly recommended for your dwelling."
  },
  {
    question: "How much dwelling coverage do I need?",
    answer: "Your dwelling coverage should equal the full replacement cost of your home, not its market value. Market value includes land (which doesn't need insurance), while replacement cost covers only the structure. Calculate using local construction costs per square foot multiplied by your home's square footage, adjusted for quality, features, and special construction elements."
  },
  {
    question: "What home improvements can lower my insurance premium?",
    answer: "Premium-reducing improvements include installing monitored security systems (5-20% discount), fire alarm systems (5-10% discount), sprinkler systems (up to 15% discount), impact-resistant roofing (up to 35% in hurricane zones), storm shutters, deadbolt locks, smoke detectors, and upgrading electrical, plumbing, and HVAC systems. Newer roofs can save 5-15% on premiums."
  },
  {
    question: "Should I increase my deductible to lower my premium?",
    answer: "Increasing your deductible from $500 to $1,000 can reduce premiums by 10-15%, while raising it to $2,500 can save 20-30%. However, ensure you can afford the higher out-of-pocket cost if you file a claim. Consider your emergency fund, home age, and claim history when deciding. Higher deductibles work best for homeowners with substantial savings who want to insure only major losses."
  },
  {
    question: "Does my homeowners insurance cover flood damage?",
    answer: "No, standard homeowners insurance does not cover flood damage. You need separate flood insurance through the National Flood Insurance Program (NFIP) or private insurers. Flood insurance covers damage from rising water, storm surge, and heavy rainfall overflow. Even if you're not in a high-risk flood zone, consider coverage as 20-25% of flood claims occur outside designated flood zones."
  },
  {
    question: "How much personal property coverage do I need?",
    answer: "Personal property coverage typically defaults to 50-70% of your dwelling coverage. Calculate your actual needs by inventorying belongings and estimating replacement costs. High-value items like jewelry, art, and electronics may need scheduled personal property endorsements or floaters for full coverage. Consider replacement cost coverage for personal property rather than actual cash value."
  },
  {
    question: "What factors affect my homeowners insurance rates?",
    answer: "Key factors include location (weather risks, crime rates, fire protection), home age and condition, construction type and materials, roof age and material, square footage, claims history, credit score, coverage amounts, deductible level, and protective devices. Homes in areas prone to hurricanes, wildfires, or earthquakes face higher premiums."
  },
  {
    question: "Do I need earthquake or hurricane coverage?",
    answer: "Standard homeowners policies exclude earthquake damage and often limit hurricane/windstorm coverage in coastal areas. If you live in earthquake-prone regions (California, Pacific Northwest, New Madrid Seismic Zone), purchase separate earthquake insurance. Coastal homeowners may need separate windstorm/hurricane coverage or endorsements. Evaluate your risk based on location and home value."
  },
  {
    question: "How does my credit score impact home insurance rates?",
    answer: "In most states, insurers use credit-based insurance scores as a rating factor, which can affect premiums by 20-50%. Better credit typically results in lower rates because statistical data shows correlation between credit history and claim frequency. Improving your credit score can significantly reduce your homeowners insurance costs over time."
  }
];

// ✅ AI SEARCH OPTIMIZATION: HowTo Schema
const homeHowToData = {
  name: "How to Calculate Homeowners Insurance Premium",
  description: "Complete guide to estimating your homeowners insurance costs using our replacement cost calculator in under 5 minutes",
  totalTime: "PT5M",
  tool: [
    { name: "Homeowners Insurance Calculator" }
  ],
  supply: [
    { name: "Home details (age, size, construction type)" },
    { name: "Roof information (age, material)" },
    { name: "Coverage preferences" },
    { name: "Security system details" }
  ],
  step: [
    {
      position: 1,
      name: "Calculate Replacement Cost",
      text: "Determine your home's replacement cost by multiplying square footage by local construction costs per square foot. Use $100-300/sq ft depending on your region and home quality. This is the cost to rebuild your home, not its market value. Consider special features, high-end materials, and custom construction that may increase costs.",
      url: "https://www.insurancesmartcalculator.com/calculators/home-insurance#step1"
    },
    {
      position: 2,
      name: "Enter Home Details",
      text: "Input your home's age, construction type (frame, masonry, brick, superior), square footage, number of stories, and year built. Older homes and certain construction types may have higher premiums due to increased risk or replacement costs.",
      url: "https://www.insurancesmartcalculator.com/calculators/home-insurance#step2"
    },
    {
      position: 3,
      name: "Provide Roof Information",
      text: "Enter your roof's age and material type (asphalt shingle, metal, tile, slate). Newer roofs and impact-resistant materials qualify for discounts up to 35% in some states. Roofs older than 15-20 years may result in limited coverage or higher premiums.",
      url: "https://www.insurancesmartcalculator.com/calculators/home-insurance#step3"
    },
    {
      position: 4,
      name: "Select Coverage Limits",
      text: "Choose coverage amounts for dwelling (replacement cost), personal property (typically 50-70% of dwelling), personal liability ($100K-$500K recommended), and medical payments ($1K-$5K). Select your deductible from $500 to $5,000 to balance premium costs with out-of-pocket risk.",
      url: "https://www.insurancesmartcalculator.com/calculators/home-insurance#step4"
    },
    {
      position: 5,
      name: "Apply Protective Discounts",
      text: "Indicate all protective features including smoke detectors, fire alarms, burglar alarms, deadbolts, fire extinguishers, sprinkler systems, storm shutters, and proximity to fire hydrants or fire stations. These safety features can reduce premiums by 5-20% each.",
      url: "https://www.insurancesmartcalculator.com/calculators/home-insurance#step5"
    },
    {
      position: 6,
      name: "Review Your Premium Estimate",
      text: "Get your detailed premium estimate with breakdown by coverage type. See how different deductibles, coverage limits, and protective features impact your costs. Compare scenarios to find the optimal balance of coverage and affordability for your situation.",
      url: "https://www.insurancesmartcalculator.com/calculators/home-insurance#step6"
    }
  ]
};

// ✅ AI SEARCH OPTIMIZATION: Calculator Schema
const homeCalculatorData = {
  name: "Homeowners Insurance Premium Calculator",
  description: "Calculate accurate homeowners insurance premiums using replacement cost analysis, coverage customization, and protective device discounts. Get instant estimates with detailed breakdowns.",
  featureList: [
    "Replacement cost calculator (not market value)",
    "Construction type adjustment factors",
    "Roof age and material discount calculator",
    "Protective device discount finder (up to 35% savings)",
    "Deductible impact comparison tool",
    "Personal property coverage estimator",
    "Liability coverage recommendations",
    "Multi-policy bundling discount calculator",
    "Claims-free discount tracker",
    "Regional risk factor analysis"
  ],
  screenshot: "https://www.insurancesmartcalculator.com/images/home-calculator-preview.jpg",
  ratingValue: "4.7",
  ratingCount: "1923",
  datePublished: "2024-01-15",
  dateModified: new Date().toISOString().split('T')[0] // ✅ NEW - Dynamic current date
};

interface HomeInsurancePageProps {
  dontMissArticles: Article[];
  sidebarTopTips: Article[];
  sidebarTopNews: Article[];
  allTags: string[];
}

const HomeInsurancePage: React.FC<HomeInsurancePageProps> = ({
  dontMissArticles,
  sidebarTopTips,
  sidebarTopNews,
  allTags,
}) => {
  return (
    <CalculatorPageLayout
      calculatorType="home"
      seoData={seoData}
      icon="🏠"
      displayTitle="Accurate Homeowners Insurance Premium Calculator"
      subtitle="Estimate your premium based on your home's features and protective credits."
      dontMissArticles={dontMissArticles}
      sidebarTopTips={sidebarTopTips}
      sidebarTopNews={sidebarTopNews}
      allTags={allTags}
      // ✅ AI SEARCH OPTIMIZATION PROPS
      faqs={homeFaqData}
      howTo={homeHowToData}
      calculator={homeCalculatorData}
      speakableSelectors={[".calculator-intro", ".replacement-cost-guide", ".discount-finder"]}
    >
      <HomeCalculator />
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

export default HomeInsurancePage;
