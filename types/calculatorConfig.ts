export type DriverAge = 'young' | 'adult' | 'senior';
export type DrivingRecord = 'clean' | 'tickets' | 'accident';
export type CoverageLevel = 'minimum' | 'good' | 'best';
export type PetAge = 'young' | 'adult' | 'senior';

export interface AutoConfig {
  baseRate: number;
  ageMultiplier: Record<DriverAge, number>;
  recordMultiplier: Record<DrivingRecord, number>;
  coverageMultiplier: Record<CoverageLevel, number>;
  deductibleMultiplier: Record<string, number>;
  discounts: Record<string, number>;
}

export interface HomeConfig {
  baseRate: number;
  constructionMultiplier: Record<string, number>;
  ageMultiplier: Record<string, number>;
  protectiveCredits: Record<string, number>;
  liabilityMultiplier: Record<string, number>;
  deductibleMultiplier: Record<string, number>;
}

export interface LifeConfig {
  incomeReplacementYears: number;
  defaultFinalExpenses: number;
  defaultCollegeFund: number;
}

export interface DisabilityConfig {
  incomeReplacementPercentage: number;
  benefitPeriodMultiplier: Record<string, number>;
  waitingPeriodMultiplier: Record<string, number>;
}

export interface HealthPlan {
  premium: number;
  deductible: number;
  oopMax: number;
  isHSA: boolean;
}

export interface HealthConfig {
  fpl: {
    base: number;
    perPerson: number;
  };
  plans: Record<string, HealthPlan>;
  subsidy: {
    maxContributionPercent: number;
  };
  hsa: {
    assumedTaxRate: number;
  };
}

export interface PetBreed {
  name: string;
  risk: number;
  issues?: Array<{ name: string; cost: number }>;
}

export interface PetConfig {
  baseRate: number;
  ageMultiplier: Record<PetAge, number>;
  deductibleMultiplier: Record<string, number>;
  reimbursementMultiplier: Record<string, number>;
  limitMultiplier: Record<string, number>;
  wellnessPlanCost: number;
  breeds: Record<string, PetBreed>;
}

export interface CalculatorConfig {
  auto: AutoConfig;
  home: HomeConfig;
  life: LifeConfig;
  disability: DisabilityConfig;
  health: HealthConfig;
  pet: PetConfig;
}