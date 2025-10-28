import { CalculatorResult } from '@/context/CalculatorContext';
import siteConfig from '@/config/siteConfig.json';

export const generateSocialShareData = (result: CalculatorResult) => {
  const calculatorTitles: Record<string, string> = {
    auto: "Auto Insurance",
    home: "Home Insurance",
    life: "Life Insurance",
    disability: "Disability Insurance",
    health: "Health Insurance",
    pet: "Pet Insurance",
  };

  const calculatorDescriptions: Record<string, string> = {
    auto: "Get a personalized auto insurance quote based on your vehicle, driving record, and discounts. Compare rates and find the best coverage for your needs.",
    home: "Calculate your homeowners insurance premium with our smart tool. Factor in your home's features, location, and protective measures for accurate estimates.",
    life: "Determine how much life insurance coverage you need with our comprehensive needs analysis. Protect your family's financial future today.",
    disability: "Estimate your income protection needs with our disability insurance calculator. See how much coverage you need to safeguard your earning potential.",
    health: "Find out if you qualify for ACA subsidies and estimate your health insurance costs. Compare plan tiers and see your total annual expenses.",
    pet: "Get a breed-specific pet insurance quote instantly. Compare coverage options and find the best protection for your furry friend.",
  };

  const calculatorIcons: Record<string, string> = {
    auto: "🚗",
    home: "🏠",
    life: "❤️",
    disability: "🛡️",
    health: "🏥",
    pet: "🐾",
  };

  const type = result.type as keyof typeof calculatorTitles;
  const title = `${calculatorIcons[type] || '💼'} My ${calculatorTitles[type] || 'Insurance'} Estimate: ${result.result}`;
  const description = `I just calculated my insurance needs! ${calculatorDescriptions[type]} Try this free Smart Insurance Calculator and see your personalized estimate in minutes.`;
  
  return {
    title,
    description,
    url: generateShareableURL(result),
    hashtags: ['Insurance', 'FinancialPlanning', 'SmartMoney', calculatorTitles[type]?.replace(/\s+/g, '') || 'Insurance'],
  };
};

export const generateShareableURL = (result: CalculatorResult): string => {
  if (typeof window === 'undefined') return '';
  
  const params = new URLSearchParams();
  params.set('calc', result.type);
  params.set('result', result.result);
  params.set('timestamp', result.timestamp?.toString() || Date.now().toString());
  
  result.inputs.slice(0, 6).forEach((input, idx) => {
    params.set(`i${idx}`, `${input.label}:${input.value}`);
  });
  
  return `${window.location.origin}/calculators?${params.toString()}`;
};

export const getOGImageUrl = (result: CalculatorResult): string => {
  if (typeof window === 'undefined') return siteConfig.defaultImage;
  
  const params = new URLSearchParams();
  params.set('type', result.type);
  params.set('result', result.result);
  
  result.inputs.slice(0, 4).forEach((input, idx) => {
    params.set(`input${idx}`, `${input.label}:${input.value}`);
  });
  
  return `${window.location.origin}/api/og-image?${params.toString()}`;
};