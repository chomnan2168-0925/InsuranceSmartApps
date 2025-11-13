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
    question: "How much does pet insurance cost in 2025?",
    answer: "Based on 2024-2025 data, average monthly pet insurance costs are $56-$76 for dogs and $32-$42 for cats for accident & illness coverage. Costs vary significantly by breed, age, location, and coverage level. Brachycephalic breeds (French Bulldogs, English Bulldogs, Pugs) can cost 30-50% more, averaging $80-$130 monthly for comprehensive coverage. Senior pets (7+ years for large breeds, 10+ for small breeds and cats) pay 40-60% higher premiums than puppies and kittens."
  },
  {
    question: "Why is French Bulldog insurance so expensive?",
    answer: "French Bulldogs are brachycephalic (flat-faced) breeds prone to serious health conditions including Brachycephalic Obstructive Airway Syndrome (BOAS), hip dysplasia, spinal issues, cherry eye, and skin allergies. Insurance costs $65-$130 monthly vs $35-$55 for mixed breeds. These dogs require frequent vet visits, surgeries ($2,000-$8,000 for airway correction), and ongoing treatment, making them 2-4 times more expensive to insure than average breeds."
  },
  {
    question: "Does pet insurance cover wellness and preventive care?",
    answer: "Standard accident & illness policies don't cover routine wellness care. However, 70% of insurers now offer optional wellness add-ons ($10-$25/month) covering annual exams, vaccinations, heartworm tests, flea/tick prevention, dental cleanings, and spay/neuter procedures. These plans typically reimburse $250-$600 annually for preventive services. Wellness coverage is cost-effective if you consistently use routine vet services and want predictable monthly expenses."
  },
  {
    question: "What is the difference between accident-only and accident & illness coverage?",
    answer: "Accident-only coverage ($15-$25/month for dogs, $10-$18 for cats) covers only injuries from accidents: broken bones, lacerations, toxic ingestion, hit by car, bite wounds. Accident & illness coverage ($50-$75/month for dogs, $30-$45 for cats) also covers illnesses: cancer, infections, allergies, diabetes, kidney disease, heart conditions, digestive issues, and chronic diseases. 85% of pet owners choose accident & illness for comprehensive protection against the most common and expensive conditions."
  },
  {
    question: "Can I get pet insurance for a senior dog or cat?",
    answer: "Yes, but with limitations. Most insurers accept pets up to age 14, though premiums increase 40-60% after age 7-8. Some providers cap enrollment at age 10-12 for new policies. Pre-existing conditions diagnosed before enrollment aren't covered, making early enrollment crucial. Senior pet insurance typically costs $80-$150/month for dogs and $40-$70 for cats. Consider higher deductibles ($500-$1,000) to reduce premiums while maintaining coverage for catastrophic illnesses like cancer or emergency surgeries."
  },
  {
    question: "Do veterinarians recommend pet insurance?",
    answer: "Veterinarian recommendations vary: 42% believe pet insurance helps clients afford necessary care, while 39% feel it's not worth the cost due to exclusions and hassles. However, vets consistently report that insured pets receive more comprehensive treatment since owners face fewer financial constraints. 68% of pet owners are aware of pet insurance, and vets increasingly discuss coverage during puppy/kitten visits. The key is choosing plans with high reimbursement (80-90%), low exclusions, and fast claim processing."
  },
  {
    question: "What's not covered by pet insurance?",
    answer: "Standard exclusions include: pre-existing conditions (anything diagnosed or showing symptoms before coverage starts or during waiting periods), elective procedures (cosmetic tail docking, ear cropping, declawing), breeding costs, preventive care without wellness add-ons, behavioral issues unless illness-related, experimental treatments, and conditions arising from neglect or intentional harm. Some policies also exclude certain hereditary conditions, breed-specific issues, or dental disease without dental riders. Always review policy exclusions before purchasing."
  },
  {
    question: "Can I use any veterinarian with pet insurance?",
    answer: "Yes, 95% of pet insurance plans let you visit any licensed veterinarian, specialist, or emergency clinic nationwide—unlike human health insurance with network restrictions. You pay the vet directly, then submit claims for reimbursement (most process within 5-10 days). A few providers offer direct payment to vets at checkout. This flexibility means you can choose the best care for your pet without worrying about staying in-network, making it ideal for emergencies or specialized treatments."
  },
  {
    question: "Is pet insurance tax deductible?",
    answer: "Pet insurance premiums are generally not tax deductible for personal pets. However, there are exceptions: service animals for documented medical needs may qualify as medical expenses (7.5% AGI threshold applies), and business working animals (guard dogs, farm animals) may be deductible as business expenses. In September 2024, bipartisan U.S. legislation was introduced proposing to allow pet expenses under HSAs and FSAs, but it hasn't passed yet. Consult a tax professional for specific guidance."
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
  description: "Calculate pet insurance costs instantly with our 2025 calculator. Get breed-specific quotes for dogs & cats, compare accident vs illness coverage, wellness plans, and deductibles. Free estimates for French Bulldogs, Labs, German Shepherds & more.",
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
  dateModified: new Date().toISOString().split('T')[0] // ✅ NEW - Dynamic current date
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
