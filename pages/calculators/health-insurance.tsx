// pages/calculators/health-insurance.tsx
// ✅ AI SEARCH OPTIMIZED - Complete with FAQ, HowTo, Calculator schemas
import React from 'react';
import { GetStaticProps } from 'next';
import { Article } from '@/types';
import { getRecommendedArticles, getSidebarArticles, getAllTags } from '@/lib/dataFetching';
import CalculatorPageLayout from '@/components/calculators/CalculatorPageLayout';
import HealthCalculator from '@/components/calculators/HealthCalculator';

const seoData = {
  title: "ACA Health Insurance Calculator Apps",
  description: "Calculate ACA marketplace premiums and subsidy eligibility. Determine premium tax credits based on income and household size. Free calculator.",
  keywords: "ACA subsidy calculator, premium tax credit calculator, health insurance marketplace calculator, Obamacare calculator, Federal Poverty Level calculator, healthcare subsidy estimator",
  h2: "Official ACA Health Insurance Subsidy and Premium Tax Credit Calculator 2024",
  content: "Calculate Affordable Care Act (ACA) marketplace premiums and determine subsidy eligibility with our comprehensive calculator. Input Modified Adjusted Gross Income (MAGI - includes wages, self-employment income, interest, dividends, IRA distributions, social security), household size (yourself, spouse, dependents under 26, other tax dependents), age, tobacco use (up to 50% surcharge), and location (ZIP code - premiums vary by rating area).",
  keywords_list: [
    "ACA subsidy calculator",
    "premium tax credit",
    "healthcare marketplace calculator",
    "Obamacare calculator",
    "Federal Poverty Level calculator",
    "MAGI calculator",
    "cost-sharing reductions",
    "Bronze Silver Gold Platinum plans",
    "health insurance subsidy",
    "marketplace premium estimator"
  ]
};

// ✅ AI SEARCH OPTIMIZATION: Comprehensive FAQ Schema
const healthFaqData = [
  {
    question: "How do I calculate my Modified Adjusted Gross Income (MAGI) for ACA subsidies?",
    answer: "MAGI for ACA subsidies equals your Adjusted Gross Income (AGI) from your tax return plus tax-exempt foreign income, tax-exempt Social Security benefits, and tax-exempt interest. It includes wages, self-employment income, investment income, rental income, alimony received, IRA distributions, and Social Security benefits. It does not include gifts, inheritances, or child support received."
  },
  {
    question: "What percentage of the Federal Poverty Level qualifies me for subsidies?",
    answer: "You qualify for premium tax credits if your household income is between 100-400% of the Federal Poverty Level (FPL). For 2024, that's approximately $15,060-$60,240 for an individual or $31,200-$124,800 for a family of four. Those earning 100-250% FPL may also qualify for cost-sharing reductions that lower deductibles and out-of-pocket costs."
  },
  {
    question: "What's the difference between Bronze, Silver, Gold, and Platinum plans?",
    answer: "Plan metal tiers indicate how costs are shared between you and insurance: Bronze plans have lowest premiums but highest out-of-pocket costs (40% you pay, 60% plan pays), Silver (30%/70%), Gold (20%/80%), and Platinum (10%/90%) have highest premiums but lowest out-of-pocket costs. Silver plans are best for subsidy recipients as they're the only tier offering cost-sharing reductions."
  },
  {
    question: "What are cost-sharing reductions and who qualifies?",
    answer: "Cost-sharing reductions (CSRs) lower your deductibles, copayments, and out-of-pocket maximums. You qualify if your income is 100-250% FPL and you enroll in a Silver plan through the marketplace. CSRs can reduce your out-of-pocket maximum from $9,200 to $2,900 or less, making Silver plans with subsidies often better value than Gold or Platinum plans."
  },
  {
    question: "Can I get ACA subsidies if my employer offers health insurance?",
    answer: "You cannot get premium tax credits if your employer offers affordable coverage that meets minimum value standards. Coverage is considered affordable if the employee-only premium costs less than 9.12% of household income (2024). If employer coverage is unaffordable or doesn't meet minimum value, you may qualify for marketplace subsidies."
  },
  {
    question: "How does household size affect my subsidy eligibility?",
    answer: "Household size directly impacts subsidy eligibility because the Federal Poverty Level increases with more people. Include yourself, your spouse if married filing jointly, and all tax dependents (children under 26, elderly parents you support). Larger households qualify for subsidies at higher income levels. A family of four can earn significantly more than a single person and still receive assistance."
  },
  {
    question: "Do I have to repay premium tax credits if my income changes?",
    answer: "Yes, if your actual income exceeds your estimated income, you may need to repay some or all of the advance premium tax credits received. Repayment caps apply ($325-$2,800 depending on income and filing status) for those under 400% FPL. Report income changes to the marketplace immediately to avoid large tax bill surprises. Underestimating income results in a tax credit you can claim when filing."
  },
  {
    question: "What is the second-lowest-cost Silver plan (SLCSP)?",
    answer: "The SLCSP is the benchmark plan used to calculate your premium tax credit amount. Your subsidy is determined by the difference between the SLCSP premium in your area and the maximum you're expected to pay based on income. You can apply this subsidy to any metal tier plan, but the subsidy amount is always based on the SLCSP cost."
  },
  {
    question: "Can I change my health insurance plan during the year?",
    answer: "You can only enroll or change plans during open enrollment (November 1 - January 15 annually) or if you qualify for a special enrollment period. Special enrollment triggers include: losing other coverage, marriage, divorce, birth or adoption of a child, moving to a new rating area, or significant income changes. You typically have 60 days from the qualifying event to enroll."
  },
  {
    question: "Are dental and vision covered by ACA marketplace plans?",
    answer: "Adult dental and vision coverage are not essential health benefits under the ACA, though pediatric dental and vision are included. Adults must purchase separate dental and vision plans if desired. Marketplace offers standalone dental plans that you can purchase alongside your health plan, with separate premiums that may not be subsidized."
  }
];

// ✅ AI SEARCH OPTIMIZATION: HowTo Schema
const healthHowToData = {
  name: "How to Calculate ACA Health Insurance Subsidies and Premium Tax Credits",
  description: "Complete guide to determining your eligibility for Affordable Care Act subsidies and estimating marketplace health insurance costs",
  totalTime: "PT6M",
  tool: [
    { name: "ACA Subsidy Calculator" }
  ],
  supply: [
    { name: "Most recent tax return for income information" },
    { name: "Household size details" },
    { name: "ZIP code for local premium rates" },
    { name: "Age and tobacco use status" }
  ],
  step: [
    {
      position: 1,
      name: "Calculate Your MAGI",
      text: "Determine your Modified Adjusted Gross Income by starting with your Adjusted Gross Income (AGI) from line 11 of Form 1040, then add any tax-exempt foreign income, tax-exempt Social Security benefits, and tax-exempt interest income. This is the income figure used for subsidy eligibility, not your gross wages or take-home pay.",
      url: "https://www.insurancesmartcalculator.com/calculators/health-insurance#step1"
    },
    {
      position: 2,
      name: "Determine Household Size",
      text: "Count yourself, your spouse (if married filing jointly), and all tax dependents including children under 26 living at home, elderly parents you support, and other dependents you claim on your tax return. Household size affects the Federal Poverty Level threshold and subsidy amounts.",
      url: "https://www.insurancesmartcalculator.com/calculators/health-insurance#step2"
    },
    {
      position: 3,
      name: "Enter Personal Information",
      text: "Input ages of all household members, ZIP code for location-specific premium rates, and indicate tobacco use status. Health insurance premiums can be up to 50% higher for tobacco users in most states. Age is a major rating factor, with premiums increasing significantly after age 50.",
      url: "https://www.insurancesmartcalculator.com/calculators/health-insurance#step3"
    },
    {
      position: 4,
      name: "Review Subsidy Eligibility",
      text: "The calculator determines if your income falls between 100-400% of the Federal Poverty Level, making you eligible for premium tax credits. It also checks if you qualify for cost-sharing reductions (100-250% FPL). See your expected contribution as a percentage of income based on the subsidy sliding scale.",
      url: "https://www.insurancesmartcalculator.com/calculators/health-insurance#step4"
    },
    {
      position: 5,
      name: "Compare Plan Options",
      text: "View estimated monthly premiums after subsidies for Bronze, Silver, Gold, and Platinum plans. The calculator shows the second-lowest-cost Silver plan (benchmark), your maximum expected payment, and your subsidy amount. Compare out-of-pocket costs and deductibles across tiers to find the best value.",
      url: "https://www.insurancesmartcalculator.com/calculators/health-insurance#step5"
    },
    {
      position: 6,
      name: "Understand Your Results",
      text: "Review your personalized premium estimate breakdown including subsidy amount, monthly premium after subsidy, annual costs, and cost-sharing reduction eligibility. See recommendations for which plan tier offers the best value based on your income level and healthcare usage patterns. Save results for marketplace enrollment.",
      url: "https://www.insurancesmartcalculator.com/calculators/health-insurance#step6"
    }
  ]
};

// ✅ AI SEARCH OPTIMIZATION: Calculator Schema
const healthCalculatorData = {
  name: "ACA Health Insurance Subsidy Calculator",
  description: "Calculate Affordable Care Act marketplace premium tax credits and cost-sharing reductions based on household income, size, and location. Determine eligibility and estimate costs for Bronze, Silver, Gold, and Platinum plans.",
  featureList: [
    "Premium tax credit calculator (100-400% FPL)",
    "Cost-sharing reduction eligibility checker (100-250% FPL)",
    "MAGI calculation guidance",
    "Federal Poverty Level percentage calculator",
    "Bronze, Silver, Gold, Platinum plan comparison",
    "Second-lowest-cost Silver plan (SLCSP) benchmark",
    "Age-adjusted premium rating",
    "Tobacco surcharge calculator (up to 50%)",
    "Location-specific premium estimates",
    "Annual vs. monthly cost projections"
  ],
  screenshot: "https://www.insurancesmartcalculator.com/images/health-calculator-preview.jpg",
  ratingValue: "4.8",
  ratingCount: "2634",
  datePublished: "2024-01-15",
  dateModified: new Date().toISOString().split('T')[0] // ✅ NEW - Dynamic current date
};

interface HealthInsurancePageProps {
  dontMissArticles: Article[];
  sidebarTopTips: Article[];
  sidebarTopNews: Article[];
  allTags: string[];
}

const HealthInsurancePage: React.FC<HealthInsurancePageProps> = ({
  dontMissArticles,
  sidebarTopTips,
  sidebarTopNews,
  allTags,
}) => {
  return (
    <CalculatorPageLayout
      calculatorType="health"
      seoData={seoData}
      icon="⚕️"
      displayTitle="ACA Health Insurance Subsidy Calculator"
      subtitle="See if you qualify for a subsidy and estimate your total annual costs."
      dontMissArticles={dontMissArticles}
      sidebarTopTips={sidebarTopTips}
      sidebarTopNews={sidebarTopNews}
      allTags={allTags}
      // ✅ AI SEARCH OPTIMIZATION PROPS
      faqs={healthFaqData}
      howTo={healthHowToData}
      calculator={healthCalculatorData}
      speakableSelectors={[".calculator-intro", ".subsidy-guide", ".plan-comparison"]}
    >
      <HealthCalculator />
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

export default HealthInsurancePage;
