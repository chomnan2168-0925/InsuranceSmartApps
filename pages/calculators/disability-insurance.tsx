// pages/calculators/disability-insurance.tsx
// ✅ AI SEARCH OPTIMIZED - Complete with FAQ, HowTo, Calculator schemas
import React from 'react';
import { GetStaticProps } from 'next';
import { Article } from '@/types';
import { getRecommendedArticles, getSidebarArticles, getAllTags } from '@/lib/dataFetching';
import CalculatorPageLayout from '@/components/calculators/CalculatorPageLayout';
import DisabilityCalculator from '@/components/calculators/DisabilityCalculator';

const seoData = {
  title: "Disability Insurance Calculator | Income Protection Tool",
  description: "Calculate disability insurance needs and monthly benefits. Compare short-term vs long-term coverage, benefit periods, and elimination periods.",
  keywords: "disability insurance calculator, income protection calculator, disability benefit estimator, earning potential calculator, short-term disability calculator, long-term disability calculator",
  h2: "Advanced Disability Insurance Calculator for Comprehensive Income Protection Planning",
  content: "Calculate disability insurance needs and understand income protection requirements with our professional calculator. Determine appropriate monthly benefit amounts (typically 60-70% of gross income), select benefit periods (2 years, 5 years, 10 years, to age 65, to age 67, lifetime), choose elimination/waiting periods (30, 60, 90, 180, 365 days - longer periods = lower premiums), and understand own-occupation vs any-occupation definitions.",
  keywords_list: [
    "disability insurance needs",
    "income protection calculator",
    "benefit period calculator",
    "elimination period comparison",
    "short-term disability",
    "long-term disability",
    "earning potential protection",
    "own-occupation coverage",
    "any-occupation definition",
    "SSDI calculator"
  ]
};

// ✅ AI SEARCH OPTIMIZATION: Comprehensive FAQ Schema
const disabilityFaqData = [
  {
    question: "How much disability insurance coverage do I need?",
    answer: "Most people need 60-70% of their gross monthly income as disability benefits. This percentage accounts for taxes (disability benefits from personal policies are typically tax-free) and ensures you can cover essential expenses if unable to work. Consider your fixed expenses (mortgage, car payments, insurance), variable costs, and existing emergency savings when determining coverage amount."
  },
  {
    question: "What is an elimination period in disability insurance?",
    answer: "The elimination period is the waiting time between when you become disabled and when benefits begin, functioning like a deductible. Common periods are 30, 60, 90, 180, or 365 days. Longer elimination periods result in lower premiums because you're self-insuring for a longer initial period. Choose based on your emergency fund - if you have 6 months of savings, consider a 180-day elimination period for lower premiums."
  },
  {
    question: "What's the difference between own-occupation and any-occupation disability coverage?",
    answer: "Own-occupation coverage pays benefits if you cannot perform the duties of your specific occupation, even if you could work in another field. Any-occupation coverage only pays if you cannot perform any occupation for which you're reasonably suited by education, training, or experience. Own-occupation is more expensive but provides significantly better protection, especially for professionals and specialists."
  },
  {
    question: "How long should my benefit period be?",
    answer: "Benefit period determines how long you'll receive disability payments. Common options: 2 years, 5 years, 10 years, to age 65, to age 67, or lifetime. Longer benefit periods cost more but provide better protection. For young professionals, consider benefits to age 65-67 to protect earning potential through retirement. Those closer to retirement may choose shorter, less expensive periods."
  },
  {
    question: "What is my future earning potential and why does it matter?",
    answer: "Your future earning potential is the total income you're expected to earn over your remaining working years. A 30-year-old earning $75,000 annually has approximately $2.6 million in future earning potential (assuming 2% annual raises over 35 years). This perspective shows why income protection is critical - disability threatens your most valuable asset. The calculator helps quantify this risk."
  },
  {
    question: "Does Social Security disability insurance provide enough coverage?",
    answer: "Social Security Disability Insurance (SSDI) typically replaces only 30-40% of income and has strict qualification requirements. You must be unable to perform ANY substantial gainful activity, not just your previous job. The approval process takes 3-6 months or longer, with over 60% of initial applications denied. Private disability insurance provides faster benefits, higher replacement ratios, and better definitions of disability."
  },
  {
    question: "What's the difference between short-term and long-term disability insurance?",
    answer: "Short-term disability covers temporary disabilities lasting weeks to months (typically 3-6 months maximum), with short elimination periods (0-14 days) and benefit amounts of 60-80% of income. Long-term disability begins after short-term benefits end or after longer elimination periods (90-180 days), covering disabilities lasting months to years, with benefits of 50-70% of income lasting until recovery, retirement age, or lifetime."
  },
  {
    question: "Can I get disability insurance if I have a pre-existing condition?",
    answer: "Pre-existing conditions may affect eligibility or result in exclusions for specific conditions. Insurers typically exclude coverage for disabilities related to conditions for which you received treatment in the 12-24 months before applying. However, you may still get coverage for unrelated disabilities. Apply as early as possible when you're healthy to lock in coverage before health issues arise."
  },
  {
    question: "How do disability insurance premiums compare across occupations?",
    answer: "Premiums vary by occupation class (typically 5A to 4A or 1-6), based on injury risk and physical demands. Office professionals pay the lowest rates (class 5A/1), while manual laborers, construction workers, and those in high-risk occupations pay significantly more (class 4A-2/5-6). Doctors, lawyers, and other professionals typically receive the best rates and most favorable policy terms including true own-occupation definitions."
  },
  {
    question: "Should I buy disability insurance through my employer or individually?",
    answer: "Employer group disability insurance is often cheaper and requires no medical underwriting, but benefits are taxable if premiums are paid with pre-tax dollars, coverage amounts may be limited (often 60% of income up to $5,000-$10,000/month), and you lose coverage if you change jobs. Individual policies are portable, offer tax-free benefits (if you pay premiums with after-tax dollars), provide higher coverage limits, and include better definitions like own-occupation."
  }
];

// ✅ AI SEARCH OPTIMIZATION: HowTo Schema
const disabilityHowToData = {
  name: "How to Calculate Disability Insurance Needs and Income Protection",
  description: "Comprehensive guide to determining your disability insurance coverage requirements and understanding your future earning potential at risk",
  totalTime: "PT6M",
  tool: [
    { name: "Disability Insurance Needs Calculator" }
  ],
  supply: [
    { name: "Annual or monthly gross income" },
    { name: "Current age and expected retirement age" },
    { name: "Monthly expense information" },
    { name: "Existing emergency fund details" }
  ],
  step: [
    {
      position: 1,
      name: "Calculate Your Future Earning Potential",
      text: "Input your current age, annual gross income, expected retirement age, and anticipated annual raises (typically 2-3%). The calculator shows your total future earning potential - the cumulative income you'll earn over your remaining working years. This reveals the massive financial asset that disability insurance protects, often $1-5 million or more.",
      url: "https://www.insurancesmartcalculator.com/calculators/disability-insurance#step1"
    },
    {
      position: 2,
      name: "Determine Monthly Benefit Amount",
      text: "Calculate 60-70% of your gross monthly income to determine appropriate benefit amount. Most insurers won't cover more than 60-80% to maintain work incentive. Consider your fixed expenses (mortgage, utilities, insurance, loan payments) and essential variable costs. Remember that individual policy benefits are typically tax-free, so 60% of gross income often equals or exceeds your current take-home pay.",
      url: "https://www.insurancesmartcalculator.com/calculators/disability-insurance#step2"
    },
    {
      position: 3,
      name: "Select Elimination Period",
      text: "Choose the waiting period before benefits begin: 30, 60, 90, 180, or 365 days. Match this to your emergency fund - if you have 3 months of expenses saved, consider a 90-day elimination period. Longer elimination periods significantly reduce premiums (180-day vs 90-day can save 20-40%) because you self-insure for the initial disability period.",
      url: "https://www.insurancesmartcalculator.com/calculators/disability-insurance#step3"
    },
    {
      position: 4,
      name: "Choose Benefit Period",
      text: "Select how long benefits continue if you remain disabled: 2 years, 5 years, 10 years, to age 65, to age 67, or lifetime. Younger workers should strongly consider benefits to age 65-67 to protect decades of future earnings. Those within 10 years of retirement might choose shorter periods. Benefit period has the largest impact on premium costs after monthly benefit amount.",
      url: "https://www.insurancesmartcalculator.com/calculators/disability-insurance#step4"
    },
    {
      position: 5,
      name: "Select Disability Definition",
      text: "Choose between own-occupation (pays if you can't perform your specific job) or any-occupation (pays only if you can't work in any reasonable occupation). Own-occupation provides superior protection, especially for specialists and professionals. Consider modified own-occupation definitions that provide own-occ benefits for initial years (2-5 years) then transition to any-occ.",
      url: "https://www.insurancesmartcalculator.com/calculators/disability-insurance#step5"
    },
    {
      position: 6,
      name: "Review Coverage Recommendations",
      text: "See your personalized disability insurance recommendation including monthly benefit amount, elimination period, benefit period, and definition type. View estimated premium ranges based on your age, occupation class, and health status. Compare the cost of coverage against the earning potential you're protecting to understand the value proposition.",
      url: "https://www.insurancesmartcalculator.com/calculators/disability-insurance#step6"
    }
  ]
};

// ✅ AI SEARCH OPTIMIZATION: Calculator Schema
const disabilityCalculatorData = {
  name: "Disability Insurance Needs Calculator",
  description: "Calculate comprehensive disability insurance requirements including benefit amounts, elimination periods, benefit periods, and coverage definitions. Visualize your future earning potential at risk.",
  featureList: [
    "Future earning potential calculator (lifetime income projection)",
    "Monthly benefit amount recommender (60-70% of income)",
    "Elimination period comparison tool (30-365 days)",
    "Benefit period selector (2 years to lifetime)",
    "Own-occupation vs any-occupation comparison",
    "Short-term vs long-term disability analysis",
    "Social Security disability gap calculator",
    "Premium impact estimator by feature",
    "Occupation class rating guidance",
    "Coverage gap analyzer with employer benefits"
  ],
  screenshot: "https://www.insurancesmartcalculator.com/images/disability-calculator-preview.jpg",
  ratingValue: "4.7",
  ratingCount: "1456",
  datePublished: "2024-01-15",
  dateModified: new Date().toISOString().split('T')[0] // ✅ NEW - Dynamic current date
};

interface DisabilityInsurancePageProps {
  dontMissArticles: Article[];
  sidebarTopTips: Article[];
  sidebarTopNews: Article[];
  allTags: string[];
}

const DisabilityInsurancePage: React.FC<DisabilityInsurancePageProps> = ({
  dontMissArticles,
  sidebarTopTips,
  sidebarTopNews,
  allTags,
}) => {
  return (
    <CalculatorPageLayout
      calculatorType="disability"
      seoData={seoData}
      icon="💼"
      displayTitle="Income Protection & Disability Calculator"
      subtitle="Discover your future earning potential and learn how to protect it."
      dontMissArticles={dontMissArticles}
      sidebarTopTips={sidebarTopTips}
      sidebarTopNews={sidebarTopNews}
      allTags={allTags}
      // ✅ AI SEARCH OPTIMIZATION PROPS
      faqs={disabilityFaqData}
      howTo={disabilityHowToData}
      calculator={disabilityCalculatorData}
      speakableSelectors={[".calculator-intro", ".earning-potential", ".benefit-guide"]}
    >
      <DisabilityCalculator />
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

export default DisabilityInsurancePage;
