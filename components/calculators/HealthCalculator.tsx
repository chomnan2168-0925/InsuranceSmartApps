// /components/calculators/HealthCalculator.tsx
import React, { useState, useMemo, FormEvent } from 'react';
import ResultsDisplay from './ResultsDisplay';
import { useCalculatorContext } from '@/context/CalculatorContext';

// Reusable UI Components
const InputField = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  type = "number",
  helpText 
}: { 
  label: string; 
  value: string | number; 
  onChange: (val: any) => void; 
  placeholder: string; 
  type?: string;
  helpText?: string;
}) => (
  <div className="form-input-group">
    <label className="form-label">{label}</label>
    {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    <div className="relative mt-1">
      {type === "number" && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">$</span>
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={e => onChange(type === "number" ? (e.target.value === '' ? '' : parseInt(e.target.value, 10)) : e.target.value)}
        placeholder={placeholder}
        className={`form-input ${type === "number" ? 'pl-7' : ''}`}
        required
      />
    </div>
  </div>
);

const SelectField = ({ 
  label, 
  value, 
  onChange, 
  children,
  helpText 
}: { 
  label: string;
  value: string;
  onChange: (val: string) => void;
  children: React.ReactNode;
  helpText?: string;
}) => (
  <div className="form-input-group">
    <label className="form-label">{label}</label>
    {helpText && <p className="text-xs text-gray-500 mt-1">{helpText}</p>}
    <select 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="form-input"
    >
      {children}
    </select>
  </div>
);

const PlanTierCard = ({
  tier,
  coverage,
  selected,
  onClick
}: {
  tier: string;
  coverage: string;
  selected: boolean;
  onClick: () => void;
}) => {
  const colors = {
    bronze: 'border-orange-400 bg-orange-50 text-orange-700',
    silver: 'border-gray-400 bg-gray-50 text-gray-700',
    gold: 'border-yellow-400 bg-yellow-50 text-yellow-700',
    platinum: 'border-purple-400 bg-purple-50 text-purple-700'
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        p-4 rounded-xl border-2 transition-all text-left w-full
        ${selected 
          ? `${colors[tier as keyof typeof colors]} shadow-lg transform scale-105` 
          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-md'
        }
      `}
    >
      <div className="font-bold text-lg capitalize">{tier}</div>
      <div className="text-sm mt-1">{coverage}</div>
    </button>
  );
};

const SubsidyQualificationBanner = ({ 
  qualifies, 
  subsidy, 
  fplPercentage 
}: { 
  qualifies: boolean; 
  subsidy: number;
  fplPercentage: number;
}) => {
  if (!qualifies) {
    return (
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mt-4">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <div className="font-bold text-blue-900">Subsidy Not Applicable</div>
            <div className="text-sm text-blue-800 mt-1">
              Based on your income ({fplPercentage.toFixed(0)}% of FPL), you may not qualify for ACA subsidies. 
              However, you may still find affordable plans on the marketplace.
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-5 mt-4">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="text-lg font-bold text-green-900">Great News! You Qualify for a Subsidy</div>
          <div className="text-sm text-green-800 mt-1">
            Your income is at {fplPercentage.toFixed(0)}% of the Federal Poverty Level
          </div>
          <div className="flex items-baseline gap-2 mt-3">
            <span className="text-3xl font-bold text-green-600">${Math.round(subsidy)}</span>
            <span className="text-sm text-green-700">/month in premium tax credits</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const HealthCalculator = () => {
  const { saveResult } = useCalculatorContext();
  
  const [formData, setFormData] = useState({
    age: '',
    householdSize: '1',
    annualIncome: '',
    state: '',
    tobaccoUse: 'no',
    planTier: 'silver',
  });

  const [result, setResult] = useState<{
    premium: number;
    subsidy: number;
    fplPercentage: number;
    basePremium: number;
  } | null>(null);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setResult(null);
  };

  const calculation = useMemo(() => {
    const age = parseInt(formData.age);
    const income = parseInt(formData.annualIncome);
    const householdSize = parseInt(formData.householdSize);

    if (!age || !income || age < 18) return null;

    // Base premium by age
    let basePremium = 300;
    if (age >= 18 && age < 30) basePremium = 280;
    else if (age >= 30 && age < 40) basePremium = 380;
    else if (age >= 40 && age < 50) basePremium = 480;
    else if (age >= 50 && age < 60) basePremium = 650;
    else if (age >= 60) basePremium = 850;

    // Plan tier adjustments
    const tierMultipliers: { [key: string]: number } = {
      bronze: 0.75,
      silver: 1.0,
      gold: 1.3,
      platinum: 1.55,
    };
    basePremium *= tierMultipliers[formData.planTier];

    // Tobacco surcharge
    if (formData.tobaccoUse === 'yes') {
      basePremium *= 1.5;
    }

    // FPL and subsidy calculation
    const fpl2024 = 14580 + (5140 * (householdSize - 1));
    const fplPercentage = (income / fpl2024) * 100;

    let monthlySubsidy = 0;
    if (fplPercentage >= 100 && fplPercentage <= 400) {
      const maxPremiumPercentage = Math.min(8.5, 2 + (fplPercentage - 100) * 0.065);
      const maxAffordableAmount = (income * (maxPremiumPercentage / 100)) / 12;
      monthlySubsidy = Math.max(0, basePremium - maxAffordableAmount);
    } else if (fplPercentage > 400 && fplPercentage < 500) {
      const affordableAmount = (income * 0.085) / 12;
      monthlySubsidy = Math.max(0, basePremium - affordableAmount);
    }

    const finalPremium = Math.max(0, basePremium - monthlySubsidy);

    return {
      basePremium,
      subsidy: monthlySubsidy,
      premium: finalPremium,
      fplPercentage
    };
  }, [formData]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!calculation) {
      alert('Please fill in all required fields correctly');
      return;
    }

    setResult(calculation);

    saveResult({
      type: 'health',
      result: `$${Math.round(calculation.premium)}/month`,
      inputs: [
        { label: 'Age', value: formData.age },
        { label: 'Household Size', value: formData.householdSize },
        { label: 'Annual Income', value: `$${parseInt(formData.annualIncome).toLocaleString()}` },
        { label: 'Plan Tier', value: formData.planTier.charAt(0).toUpperCase() + formData.planTier.slice(1) },
        { label: 'Tobacco Use', value: formData.tobaccoUse === 'yes' ? 'Yes' : 'No' },
        { label: 'Monthly Subsidy', value: `$${Math.round(calculation.subsidy)}` },
      ],
    });
  };

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-gradient-to-r from-sky-50 to-blue-50 border-l-4 border-sky-500 p-4 rounded-lg">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-sky-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <div className="font-semibold text-sky-900">ACA Marketplace Calculator</div>
            <p className="text-sm text-sky-800 mt-1">
              Estimate your health insurance premium and find out if you qualify for subsidies under the Affordable Care Act.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Information */}
        <div className="form-section p-5 space-y-4">
          <h3 className="text-lg font-semibold text-navy-blue border-b-2 border-sky-200 pb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            Your Information
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Your Age"
              value={formData.age}
              onChange={(val) => handleInputChange('age', val)}
              placeholder="e.g., 35"
              helpText="Must be 18 or older"
            />
            
            <SelectField
              label="Household Size"
              value={formData.householdSize}
              onChange={(val) => handleInputChange('householdSize', val)}
              helpText="Include yourself and dependents"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'person' : 'people'}
                </option>
              ))}
            </SelectField>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Annual Household Income"
              value={formData.annualIncome}
              onChange={(val) => handleInputChange('annualIncome', val)}
              placeholder="e.g., 50000"
              helpText="Modified Adjusted Gross Income (MAGI)"
            />
            
            <InputField
              label="State"
              value={formData.state}
              onChange={(val) => handleInputChange('state', val)}
              placeholder="e.g., California"
              type="text"
              helpText="Premiums vary by location"
            />
          </div>
        </div>

        {/* Plan Selection */}
        <div className="form-section p-5 space-y-4">
          <h3 className="text-lg font-semibold text-navy-blue border-b-2 border-sky-200 pb-2 flex items-center gap-2">
            <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            Select Your Plan Tier
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <PlanTierCard
              tier="bronze"
              coverage="60% coverage"
              selected={formData.planTier === 'bronze'}
              onClick={() => handleInputChange('planTier', 'bronze')}
            />
            <PlanTierCard
              tier="silver"
              coverage="70% coverage"
              selected={formData.planTier === 'silver'}
              onClick={() => handleInputChange('planTier', 'silver')}
            />
            <PlanTierCard
              tier="gold"
              coverage="80% coverage"
              selected={formData.planTier === 'gold'}
              onClick={() => handleInputChange('planTier', 'gold')}
            />
            <PlanTierCard
              tier="platinum"
              coverage="90% coverage"
              selected={formData.planTier === 'platinum'}
              onClick={() => handleInputChange('planTier', 'platinum')}
            />
          </div>
        </div>

        {/* Additional Factors */}
        <div className="form-section p-5 space-y-4">
          <h3 className="text-lg font-semibold text-navy-blue border-b-2 border-sky-200 pb-2">
            Health Factors
          </h3>
          
          <SelectField
            label="Do you use tobacco?"
            value={formData.tobaccoUse}
            onChange={(val) => handleInputChange('tobaccoUse', val)}
            helpText="Tobacco use may increase your premium by up to 50%"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </SelectField>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          Calculate My Premium & Subsidy
        </button>
      </form>

      {/* Results */}
      {result && (
        <div className="space-y-6 pt-6 border-t-2 animate-fadeIn">
          <ResultsDisplay
            title="Your Estimated Monthly Premium"
            result={`$${Math.round(result.premium)}`}
            unit="/month"
            description={`After ${result.subsidy > 0 ? 'applying your subsidy' : 'subsidy calculation'} for ${formData.planTier} tier coverage`}
          />

          <SubsidyQualificationBanner
            qualifies={result.subsidy > 0}
            subsidy={result.subsidy}
            fplPercentage={result.fplPercentage}
          />

          {/* Breakdown */}
          <div className="bg-white border-2 border-gray-200 rounded-xl p-5">
            <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-sky-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9 4a1 1 0 10-2 0v5a1 1 0 102 0V9zm-6 0a1 1 0 10-2 0v5a1 1 0 102 0V9z" clipRule="evenodd" />
              </svg>
              Premium Breakdown
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-700">Base Premium ({formData.planTier})</span>
                <span className="font-semibold text-gray-900">${Math.round(result.basePremium)}/mo</span>
              </div>
              {result.subsidy > 0 && (
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-green-700">Premium Tax Credit</span>
                  <span className="font-semibold text-green-600">-${Math.round(result.subsidy)}/mo</span>
                </div>
              )}
              <div className="flex justify-between items-center py-3 bg-sky-50 px-3 rounded-lg">
                <span className="font-bold text-gray-900">Your Monthly Cost</span>
                <span className="text-2xl font-bold text-sky-600">${Math.round(result.premium)}/mo</span>
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-xs text-yellow-900">
              <strong>Important:</strong> This is an estimate only. Actual premiums and subsidies vary by location, specific plan details, and income verification. Visit HealthCare.gov for official quotes and enrollment.
            </p>
          </div>

          <div className="sr-only">
            <h2>ACA Health Insurance Calculator Keywords</h2>
            <p>Calculate your Affordable Care Act marketplace premium and subsidy eligibility. Our ACA subsidy calculator helps you estimate premium tax credits based on your household income and Federal Poverty Level percentage. Find out if you qualify for health insurance subsidies and compare Bronze, Silver, Gold, and Platinum plan tiers.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthCalculator;