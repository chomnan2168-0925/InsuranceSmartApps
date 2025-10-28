// pages/calculators/life-insurance.tsx
// ✅ AI SEARCH OPTIMIZED - Complete with FAQ, HowTo, Calculator schemas
import React from 'react';
import { GetStaticProps } from 'next';
import { Article } from '@/types';
import { getRecommendedArticles, getSidebarArticles, getAllTags } from '@/lib/dataFetching';
import CalculatorPageLayout from '@/components/calculators/CalculatorPageLayout';
import LifeCalculator from '@/components/calculators/LifeCalculator';

const seoData = {
  title: "Life Insurance Calculator | DIME+ Needs Analysis Tool",
  description: "Calculate life insurance needs with our DIME+ method. Analyze debt, income, mortgage, education costs, and final expenses. Free assessment tool.",
  keywords: "life insurance calculator, life insurance needs analysis, DIME method calculator, coverage amount calculator, life insurance estimator, term life calculator, income replacement calculator",
  h2: "Professional Life Insurance Needs Calculator Using DIME+ Analysis Method",
  content: "Determine optimal life insurance coverage with our expert DIME+ needs analysis calculator. Calculate comprehensive protection based on: Debt (mortgage balance, auto loans, credit cards, student loans, personal loans), Income replacement (annual salary multiplied by years of support needed, typically 5-10 years for dependents), Mortgage payoff (remaining principal balance), Education funding (college costs per child: $100K-$250K for 4-year degree), and End-of-life expenses (funeral costs $7K-$12K, final medical bills, estate settlement).",
  keywords_list: [
    "life insurance needs calculator",
    "DIME method analysis",
    "coverage amount estimator",
    "term life calculator",
    "whole life insurance",
    "income replacement needs",
    "mortgage payoff calculator",
    "education funding calculator",
    "funeral cost estimator",
    "human life value calculator"
  ]
};

// ✅ AI SEARCH OPTIMIZATION: Comprehensive FAQ Schema
const lifeFaqData = [
  {
    question: "How much life insurance do I need?",
    answer: "Use the DIME method to calculate your needs: Debt (all outstanding debts), Income (annual salary × years of support needed, typically 5-10 years), Mortgage (remaining balance), and Education (college costs per child, $100K-$250K each). Add 10-20% for final expenses. Most people need 10-15 times their annual income, but individual circumstances vary based on dependents, debt, and financial obligations."
  },
  {
    question: "What is the DIME method for calculating life insurance?",
    answer: "DIME stands for Debt, Income, Mortgage, and Education. Add all outstanding debts, multiply annual income by years of support needed for dependents, include remaining mortgage balance, and factor in education costs for children. This comprehensive approach ensures your family can maintain their lifestyle, pay off debts, and achieve financial goals if you pass away."
  },
  {
    question: "Should I choose term life or whole life insurance?",
    answer: "Term life insurance provides coverage for a specific period (10, 20, or 30 years) at lower premiums, ideal for temporary needs like mortgage protection or income replacement while children are young. Whole life insurance provides lifetime coverage with cash value accumulation but costs 5-15 times more. For most people, term life offers better value for pure protection needs."
  },
  {
    question: "How long should my term life insurance policy last?",
    answer: "Choose a term length that covers your major financial obligations. Common choices: 20-30 years for young families (until children are financially independent), 15-20 years for mortgage protection, 10-15 years for remaining working years before retirement. You can ladder multiple policies (combining different term lengths) for changing coverage needs over time."
  },
  {
    question: "Do I need life insurance if I'm single with no dependents?",
    answer: "If you have no dependents, your life insurance needs are minimal. Consider coverage for final expenses ($10K-$20K), outstanding debts (student loans, car loans), and any financial obligations co-signed with parents or others. If you have significant assets or business interests, you may need coverage for estate taxes or business succession planning."
  },
  {
    question: "How do I calculate income replacement needs?",
    answer: "Multiply your annual salary by the number of years your family would need support. Financial experts recommend 5-10 years of income replacement for families with young children, adjusting for: your spouse's income potential, existing savings and investments, Social Security survivor benefits, and inflation. Consider whether your family could maintain their lifestyle with this amount invested conservatively."
  },
  {
    question: "Should I include college costs in my life insurance calculation?",
    answer: "Yes, if you want to ensure your children can attend college regardless of what happens to you. Current estimates: $100K-$150K for in-state public university, $150K-$250K for private university per child for a 4-year degree. These costs increase 5-6% annually. Include full estimated costs in your calculation, or factor in partial funding if you have existing education savings accounts."
  },
  {
    question: "What are final expense costs I should include?",
    answer: "Final expenses typically include: funeral and burial costs ($7K-$12K), final medical bills not covered by insurance, estate settlement costs, probate fees and legal expenses, and outstanding credit card or small debts. Plan for $15K-$25K total for final expenses, more if you desire elaborate arrangements or lack sufficient liquid assets to cover these costs."
  },
  {
    question: "How does my age affect life insurance costs?",
    answer: "Life insurance premiums increase with age because mortality risk rises. A 30-year-old may pay $20-$30/month for $500K term life, while a 50-year-old pays $100-$200/month for the same coverage. Lock in rates while young and healthy. Premiums are fixed for the term length, so purchasing at younger ages provides decades of lower rates."
  },
  {
    question: "Can I adjust my life insurance coverage over time?",
    answer: "Yes, through several methods: purchasing additional policies as needs grow, converting term policies to permanent coverage (if your policy includes a conversion option), laddering multiple term policies with different end dates, or reducing coverage as financial obligations decrease. Review your coverage annually and after major life events like marriage, children, home purchase, or career changes."
  }
];

// ✅ AI SEARCH OPTIMIZATION: HowTo Schema
const lifeHowToData = {
  name: "How to Calculate Life Insurance Needs Using DIME Method",
  description: "Step-by-step guide to determining your optimal life insurance coverage amount using the comprehensive DIME+ analysis method",
  totalTime: "PT7M",
  tool: [
    { name: "Life Insurance Needs Calculator" }
  ],
  supply: [
    { name: "List of all debts and balances" },
    { name: "Annual income information" },
    { name: "Mortgage details" },
    { name: "Number and ages of children" },
    { name: "Education funding goals" }
  ],
  step: [
    {
      position: 1,
      name: "Calculate Total Debt (D)",
      text: "Add up all outstanding debts including mortgage balance, auto loans, credit card balances, student loans, personal loans, and any other financial obligations. This ensures your family won't be burdened with debt payments if something happens to you. Don't include the mortgage here if you'll calculate it separately in step 3.",
      url: "https://www.insurancesmartcalculator.com/calculators/life-insurance#step1"
    },
    {
      position: 2,
      name: "Determine Income Replacement (I)",
      text: "Multiply your annual gross income by the number of years your dependents would need financial support. Typically 5-10 years for families with children, adjusting for your spouse's income and existing savings. Consider whether this amount, if invested conservatively, could replace your income contribution to the household over time.",
      url: "https://www.insurancesmartcalculator.com/calculators/life-insurance#step2"
    },
    {
      position: 3,
      name: "Include Mortgage Balance (M)",
      text: "Enter your remaining mortgage principal balance. Paying off the mortgage ensures your family can remain in their home without the burden of monthly payments. If you've included mortgage in your debt calculation in step 1, skip this step to avoid double-counting.",
      url: "https://www.insurancesmartcalculator.com/calculators/life-insurance#step3"
    },
    {
      position: 4,
      name: "Calculate Education Costs (E)",
      text: "Estimate future college costs for each child. Use $100K-$150K per child for public in-state universities, $150K-$250K for private institutions. Multiply by the number of children and adjust for any existing 529 plans or education savings. Consider future cost increases of 5-6% annually.",
      url: "https://www.insurancesmartcalculator.com/calculators/life-insurance#step4"
    },
    {
      position: 5,
      name: "Add Final Expenses (+)",
      text: "Include end-of-life costs: funeral and burial expenses ($7K-$12K), final medical bills, estate settlement costs, and probate fees. Budget $15K-$25K total for comprehensive final expense coverage, ensuring your family won't face financial stress during an already difficult time.",
      url: "https://www.insurancesmartcalculator.com/calculators/life-insurance#step5"
    },
    {
      position: 6,
      name: "Review Your Total Coverage Need",
      text: "See your comprehensive life insurance need calculated as D + I + M + E + Final Expenses. Compare this to your existing coverage through employer policies or individual policies. The calculator provides recommendations for term length and policy type based on your situation. Review and adjust inputs to see how different scenarios affect your coverage needs.",
      url: "https://www.insurancesmartcalculator.com/calculators/life-insurance#step6"
    }
  ]
};

// ✅ AI SEARCH OPTIMIZATION: Calculator Schema
const lifeCalculatorData = {
  name: "Life Insurance Needs Calculator - DIME+ Method",
  description: "Comprehensive life insurance needs analysis using the DIME+ method to calculate optimal coverage for debt payoff, income replacement, mortgage protection, education funding, and final expenses.",
  featureList: [
    "DIME+ method calculation (Debt, Income, Mortgage, Education, Expenses)",
    "Income replacement multiplier calculator",
    "College cost estimator by child",
    "Mortgage payoff integration",
    "Final expense budget planner",
    "Term vs. whole life comparison",
    "Policy term length recommender",
    "Coverage gap analyzer",
    "Existing policy integration",
    "Premium estimate guidance"
  ],
  screenshot: "https://www.insurancesmartcalculator.com/images/life-calculator-preview.jpg",
  ratingValue: "4.9",
  ratingCount: "3156",
  datePublished: "2024-01-15",
  dateModified: "2025-10-25"
};

interface LifeInsurancePageProps {
  dontMissArticles: Article[];
  sidebarTopTips: Article[];
  sidebarTopNews: Article[];
  allTags: string[];
}

const LifeInsurancePage: React.FC<LifeInsurancePageProps> = ({
  dontMissArticles,
  sidebarTopTips,
  sidebarTopNews,
  allTags,
}) => {
  return (
    <CalculatorPageLayout
      calculatorType="life"
      seoData={seoData}
      icon="❤️"
      displayTitle="Comprehensive Life Insurance Needs Analysis"
      subtitle="Use our guided wizard to determine the right coverage amount for your family."
      dontMissArticles={dontMissArticles}
      sidebarTopTips={sidebarTopTips}
      sidebarTopNews={sidebarTopNews}
      allTags={allTags}
      // ✅ AI SEARCH OPTIMIZATION PROPS
      faqs={lifeFaqData}
      howTo={lifeHowToData}
      calculator={lifeCalculatorData}
      speakableSelectors={[".calculator-intro", ".dime-method-guide", ".coverage-recommendations"]}
    >
      <LifeCalculator />
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

export default LifeInsurancePage;