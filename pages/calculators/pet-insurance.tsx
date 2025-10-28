// pages/calculators/pet-insurance.tsx
// ✅ AI SEARCH OPTIMIZED - Complete with FAQ, HowTo, Calculator schemas
import React from 'react';
import { GetStaticProps } from 'next';
import { Article } from '@/types';
import { getRecommendedArticles, getSidebarArticles, getAllTags } from '@/lib/dataFetching';
import CalculatorPageLayout from '@/components/calculators/CalculatorPageLayout';
import PetCalculator from '@/components/calculators/PetCalculator';

const seoData = {
  title: "Pet Insurance Calculator | Dog & Cat Insurance Quote Tool",
  description: "Get breed-specific pet insurance quotes. Compare dog and cat coverage costs based on breed, age, and coverage level. Free instant estimates.",
  keywords: "pet insurance calculator, dog insurance cost calculator, cat insurance premium estimator, breed-specific pet insurance, veterinary insurance calculator, pet wellness plan calculator",
  h2: "Intelligent Pet Insurance Calculator with Breed-Specific Premium Estimates",
  content: "Calculate personalized pet insurance quotes tailored to your dog or cat with our advanced breed-specific calculator. Select from 100+ dog breeds or cat breeds. Factor in breed-specific health conditions: hip dysplasia, allergies, heart disease, cancer predisposition, dental issues, eye problems, and hereditary conditions. Input pet age, choose coverage levels: accident-only, accident & illness, comprehensive. Select annual deductible, reimbursement level, annual coverage limit, and add optional wellness/preventive care plans.",
  keywords_list: [
    "pet insurance calculator",
    "dog insurance cost",
    "cat insurance premium",
    "breed-specific insurance",
    "veterinary insurance calculator",
    "pet wellness plan",
    "accident illness coverage",
    "reimbursement calculator",
    "annual limit comparison",
    "multi-pet discount calculator"
  ]
};

// ✅ AI SEARCH OPTIMIZATION: Comprehensive FAQ Schema
const petFaqData = [
  {
    question: "How much does pet insurance typically cost?",
    answer: "Dog insurance averages $30-$70 per month depending on breed, age, and coverage level. Cat insurance is typically cheaper at $15-$40 per month. Larger dog breeds and brachycephalic breeds (bulldogs, pugs) cost more due to higher health risks. Accident-only plans start around $10-$15/month, while comprehensive accident & illness coverage with wellness costs $50-$100/month for dogs."
  },
  {
    question: "What does pet insurance cover?",
    answer: "Accident & illness coverage includes emergency care, surgery, hospitalization, diagnostic tests, prescription medications, chronic conditions, cancer treatment, and hereditary conditions. Accident-only covers injuries from accidents but not illnesses. Wellness add-ons cover routine care like vaccinations, annual exams, dental cleaning, and flea/tick prevention. Pre-existing conditions are always excluded."
  },
  {
    question: "Are certain dog breeds more expensive to insure?",
    answer: "Yes, breeds with known health issues cost significantly more. Large breeds prone to hip dysplasia (German Shepherds, Golden Retrievers, Rottweilers) have higher premiums. Brachycephalic breeds (Bulldogs, Pugs, Boston Terriers) with respiratory issues cost 30-50% more. Mixed breeds often cost less than purebreds. Small, healthy breeds like Beagles or Chihuahuas typically have the lowest premiums."
  },
  {
    question: "What is a deductible in pet insurance?",
    answer: "The deductible is the amount you pay before insurance coverage begins. Annual deductibles ($100-$1,000) apply once per year, after which the insurance covers eligible expenses at your reimbursement level. Per-incident deductibles apply to each new condition separately. Higher deductibles lower monthly premiums but increase out-of-pocket costs when filing claims."
  },
  {
    question: "How do reimbursement levels work?",
    answer: "After meeting your deductible, pet insurance reimburses 70%, 80%, or 90% of covered costs (you choose the level when purchasing). With 80% reimbursement, you pay 20% of eligible expenses. Higher reimbursement levels increase monthly premiums but reduce out-of-pocket costs for major treatments. For expensive surgeries ($3,000-$10,000), the difference between 70% and 90% reimbursement is significant."
  },
  {
    question: "What are annual coverage limits and how do they work?",
    answer: "Annual limits cap the maximum amount your insurer pays per year: $5,000, $10,000, $20,000, or unlimited. Once you reach the limit, you pay all additional costs until the next policy year. Unlimited coverage costs 20-40% more but provides peace of mind for catastrophic illnesses. For breeds prone to expensive conditions (cancer, ACL tears), consider higher limits or unlimited coverage."
  },
  {
    question: "Is pet insurance worth it for cats?",
    answer: "Yes, cat insurance averages $15-$30/month and can save thousands on unexpected illnesses. Common expensive cat conditions include urinary blockages ($1,000-$3,000), kidney disease ($500-$2,000 annually), hyperthyroidism ($500-$1,500/year), and cancer treatment ($2,000-$10,000). Indoor cats have fewer accidents but still face serious illness risks. Insurance provides financial protection and ensures you can afford necessary care."
  },
  {
    question: "When should I buy pet insurance?",
    answer: "Purchase pet insurance when your pet is young and healthy, ideally as a puppy or kitten (8 weeks-1 year old). Premiums are lowest for young pets, and you lock in coverage before pre-existing conditions develop. Any condition diagnosed before coverage begins or during waiting periods (typically 14 days for accidents, 14-30 days for illnesses) won't be covered. Don't wait until your pet shows symptoms."
  },
  {
    question: "Are wellness plans worth adding to pet insurance?",
    answer: "Wellness add-ons ($10-$25/month) cover routine preventive care like annual exams, vaccinations, heartworm tests, flea/tick prevention, and dental cleanings. They're cost-effective if you consistently use preventive services, essentially converting unpredictable costs to predictable monthly payments. Calculate your typical annual wellness expenses - if they exceed the add-on cost, it provides value plus convenience."
  },
  {
    question: "Do multi-pet discounts make insuring multiple pets affordable?",
    answer: "Most insurers offer 5-10% multi-pet discounts when you insure 2+ pets. For two dogs at $50/month each, a 10% discount saves $120 annually. The discount makes comprehensive coverage more affordable for multiple pets, though total costs still accumulate. Prioritize coverage for your youngest or most at-risk pets first if budget is constrained, then add others as finances allow."
  }
];

// ✅ AI SEARCH OPTIMIZATION: HowTo Schema
const petHowToData = {
  name: "How to Calculate Pet Insurance Costs for Dogs and Cats",
  description: "Step-by-step guide to estimating pet insurance premiums with breed-specific factors, coverage options, and cost-benefit analysis",
  totalTime: "PT5M",
  tool: [
    { name: "Pet Insurance Calculator" }
  ],
  supply: [
    { name: "Pet's breed and age" },
    { name: "Coverage preference (accident-only vs. comprehensive)" },
    { name: "Deductible and reimbursement level preferences" },
    { name: "Annual budget for pet healthcare" }
  ],
  step: [
    {
      position: 1,
      name: "Select Pet Type and Breed",
      text: "Choose whether you're insuring a dog or cat, then select your pet's specific breed from 100+ options. Breed selection is critical as different breeds have vastly different premium costs due to hereditary health conditions. Mixed breeds typically cost less than purebreds. The calculator adjusts pricing based on breed-specific health risk profiles including hip dysplasia, cancer, heart disease, and respiratory issues.",
      url: "https://www.insurancesmartcalculator.com/calculators/pet-insurance#step1"
    },
    {
      position: 2,
      name: "Enter Pet Age",
      text: "Input your pet's current age. Premiums increase significantly with age - insuring a 2-year-old dog costs 30-50% less than insuring the same dog at age 8. Puppies and kittens (under 1 year) have the lowest premiums. Senior pets (7+ years for large breeds, 10+ for small breeds and cats) face the highest costs and may have limited coverage options or pre-existing condition restrictions.",
      url: "https://www.insurancesmartcalculator.com/calculators/pet-insurance#step2"
    },
    {
      position: 3,
      name: "Choose Coverage Level",
      text: "Select coverage type: Accident-only (covers injuries from accidents only, lowest cost), Accident & Illness (comprehensive coverage for injuries and illnesses, recommended), or Comprehensive with Wellness (adds routine preventive care). Accident & illness coverage is the sweet spot for most pet owners, providing protection against expensive surgeries, chronic conditions, and emergency care.",
      url: "https://www.insurancesmartcalculator.com/calculators/pet-insurance#step3"
    },
    {
      position: 4,
      name: "Select Deductible and Reimbursement",
      text: "Choose annual deductible ($100, $250, $500, or $1,000) - higher deductibles lower premiums by 10-30%. Select reimbursement level (70%, 80%, or 90%) - this is the percentage of eligible costs the insurer pays after your deductible. Balance premium savings against out-of-pocket risk. For expensive breeds prone to major health issues, consider lower deductibles and higher reimbursement despite higher premiums.",
      url: "https://www.insurancesmartcalculator.com/calculators/pet-insurance#step4"
    },
    {
      position: 5,
      name: "Choose Annual Coverage Limit",
      text: "Select maximum annual payout: $5,000, $10,000, $20,000, or Unlimited. Lower limits reduce premiums but cap coverage for expensive treatments. Large breed dogs and breeds prone to cancer or orthopedic issues should consider $15,000+ or unlimited coverage. Small, healthy cats may be adequately protected with $10,000 limits. Consider your risk tolerance and ability to pay above the limit if needed.",
      url: "https://www.insurancesmartcalculator.com/calculators/pet-insurance#step5"
    },
    {
      position: 6,
      name: "Review Cost Estimate and Coverage",
      text: "See your personalized monthly and annual premium estimate with detailed breakdown by coverage component. Compare the cost against potential veterinary expenses for your breed's common conditions. View example scenarios showing how insurance would pay for typical claims (ACL surgery $3,500, cancer treatment $8,000, emergency care $1,200). Evaluate whether the coverage justifies the cost for your pet's age, breed, and your financial situation.",
      url: "https://www.insurancesmartcalculator.com/calculators/pet-insurance#step6"
    }
  ]
};

// ✅ AI SEARCH OPTIMIZATION: Calculator Schema
const petCalculatorData = {
  name: "Pet Insurance Premium Calculator - Breed-Specific Quotes",
  description: "Calculate personalized pet insurance costs for dogs and cats with breed-specific pricing, age adjustments, coverage level comparison, and wellness plan options. Get instant quotes with no personal information required.",
  featureList: [
    "Breed-specific premium calculator (100+ dog and cat breeds)",
    "Age-adjusted pricing (puppies/kittens to senior pets)",
    "Coverage level comparison (accident-only, accident & illness, comprehensive)",
    "Deductible impact analyzer ($100-$1,000 options)",
    "Reimbursement level selector (70%, 80%, 90%)",
    "Annual limit comparison ($5K-Unlimited)",
    "Wellness plan add-on calculator",
    "Multi-pet discount estimator (5-10% savings)",
    "Breed-specific health risk education",
    "Cost vs. benefit scenario analysis"
  ],
  screenshot: "https://www.insurancesmartcalculator.com/images/pet-calculator-preview.jpg",
  ratingValue: "4.6",
  ratingCount: "987",
  datePublished: "2024-01-15",
  dateModified: "2025-10-25"
};

interface PetInsurancePageProps {
  dontMissArticles: Article[];
  sidebarTopTips: Article[];
  sidebarTopNews: Article[];
  allTags: string[];
}

const PetInsurancePage: React.FC<PetInsurancePageProps> = ({
  dontMissArticles,
  sidebarTopTips,
  sidebarTopNews,
  allTags,
}) => {
  return (
    <CalculatorPageLayout
      calculatorType="pet"
      seoData={seoData}
      icon="🐾"
      displayTitle="Breed-Specific Pet Insurance Calculator"
      subtitle="Get a personalized quote based on your pet's breed and your chosen coverage."
      dontMissArticles={dontMissArticles}
      sidebarTopTips={sidebarTopTips}
      sidebarTopNews={sidebarTopNews}
      allTags={allTags}
      // ✅ AI SEARCH OPTIMIZATION PROPS
      faqs={petFaqData}
      howTo={petHowToData}
      calculator={petCalculatorData}
      speakableSelectors={[".calculator-intro", ".breed-guide", ".coverage-comparison"]}
    >
      <PetCalculator />
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

export default PetInsurancePage;