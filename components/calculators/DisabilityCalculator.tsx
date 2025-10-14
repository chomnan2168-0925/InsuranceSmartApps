// /components/calculators/DisabilityCalculator.tsx
import React, { useState, useMemo, FormEvent } from 'react';
import ResultsDisplay from './ResultsDisplay';
import config from '@/data/calculatorConfig.json';
import { useCalculatorContext } from '@/context/CalculatorContext';

// Reusable UI components
const InputField = ({ label, value, onChange, placeholder }: { label: string; value: number | ''; onChange: (val: number | '') => void; placeholder: string; }) => (
  <div className="form-input-group">
    <label className="form-label">{label}</label>
    <div className="relative mt-1">
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-gray-500 sm:text-sm">$</span>
      </div>
      <input
        type="number"
        value={value}
        onChange={e => onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
        placeholder={placeholder}
        className="form-input pl-7"
      />
    </div>
  </div>
);

const SelectField = ({ label, value, onChange, children }: { label: string, value: string, onChange: (val: string) => void, children: React.ReactNode }) => (
  <div className="form-input-group">
    <label className="form-label">{label}</label>
    <select value={value} onChange={e => onChange(e.target.value)} className="form-input">
      {children}
    </select>
  </div>
);

const ResultsComparison = ({ benefit, expenses }: { benefit: number, expenses: number }) => {
  const shortfall = Math.max(0, expenses - benefit);
  const surplus = Math.max(0, benefit - expenses);
  
  return (
    <div className="mt-4 p-4 border-2 border-gray-200 rounded-xl space-y-3 bg-white shadow-sm">
      <h4 className="font-bold text-gray-800 flex items-center gap-2">
        <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
          <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9 4a1 1 0 10-2 0v5a1 1 0 102 0V9zm-6 0a1 1 0 10-2 0v5a1 1 0 102 0V9z" clipRule="evenodd" />
        </svg>
        Benefit vs. Expenses Analysis
      </h4>
      <div className="flex justify-between items-center py-2 border-b border-gray-100">
        <span className="text-gray-700">Your Estimated Monthly Benefit:</span>
        <span className="font-bold text-green-600 text-lg">${benefit.toLocaleString()}</span>
      </div>
      <div className="flex justify-between items-center py-2 border-b border-gray-100">
        <span className="text-gray-700">Your Core Monthly Expenses:</span>
        <span className="font-bold text-red-600 text-lg">${expenses.toLocaleString()}</span>
      </div>
      <div className={`mt-3 p-4 rounded-lg ${shortfall > 0 ? 'bg-red-50 border-2 border-red-200' : 'bg-green-50 border-2 border-green-200'}`}>
        {shortfall > 0 ? (
          <p className="text-red-800">
            ⚠️ There is a potential <span className="font-bold text-xl">${shortfall.toLocaleString()}/month shortfall</span> between your benefit and your expenses.
          </p>
        ) : (
          <p className="text-green-800">
            ✓ Your estimated benefit covers your core expenses with a <span className="font-bold text-xl">${surplus.toLocaleString()}/month</span> surplus.
          </p>
        )}
      </div>
    </div>
  );
};

const StExplainer = () => (
  <div className="p-5 bg-gradient-to-br from-blue-50 to-sky-50 rounded-xl border-2 border-blue-200 shadow-sm">
    <h3 className="font-bold text-navy-blue text-lg mb-3 flex items-center gap-2">
      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
      Short-Term vs. Long-Term Disability
    </h3>
    <div className="space-y-3 text-sm">
      <div className="bg-white p-3 rounded-lg">
        <p className="font-semibold text-gray-800 mb-1">Short-Term Disability (STD)</p>
        <p className="text-gray-600">Typically covers you for 3-6 months after an injury or illness. Usually provided by employers as part of benefits package.</p>
      </div>
      <div className="bg-white p-3 rounded-lg">
        <p className="font-semibold text-gray-800 mb-1">Long-Term Disability (LTD)</p>
        <p className="text-gray-600">The coverage you're estimating now. Provides crucial protection that can last for many years, even until retirement, for serious illness or injury.</p>
      </div>
    </div>
  </div>
);

const DisabilityCalculator = () => {
  const { saveResult } = useCalculatorContext();

  const [startCalculator, setStartCalculator] = useState(false);
  const [monthlyIncome, setMonthlyIncome] = useState<number | ''>(6000);
  const [yearsToRetirement, setYearsToRetirement] = useState<number | ''>(25);
  const [coreExpenses, setCoreExpenses] = useState<number | ''>('');
  const [benefitPeriod, setBenefitPeriod] = useState('65');
  const [waitingPeriod, setWaitingPeriod] = useState('90');
  const [result, setResult] = useState<number | null>(null);

  const neededBenefit = useMemo(() => {
    const income = monthlyIncome || 0;
    const replacementAmount = income * config.disability.incomeReplacementPercentage;
    return Math.max(0, replacementAmount);
  }, [monthlyIncome]);

  const relativePremium = useMemo(() => {
    const { benefitPeriodMultiplier, waitingPeriodMultiplier } = config.disability;
    let premiumIndex = 100;
    
    // FIX: Cast to any or use type assertion to handle dynamic keys
    const benefitMultiplier = (benefitPeriodMultiplier as any)[benefitPeriod] || 1;
    const waitingMultiplier = (waitingPeriodMultiplier as any)[waitingPeriod] || 1;
    
    premiumIndex *= benefitMultiplier;
    premiumIndex *= waitingMultiplier;
    
    if (premiumIndex < 95) return <span className="font-bold text-green-600">$ Low</span>;
    if (premiumIndex < 105) return <span className="font-bold text-yellow-600">$$ Medium</span>;
    return <span className="font-bold text-red-600">$$$ High</span>;
  }, [benefitPeriod, waitingPeriod]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setResult(neededBenefit);

    saveResult({
      type: 'disability',
      result: `$${neededBenefit.toLocaleString()}/month`,
      inputs: [
        { label: 'Monthly Income', value: `$${(monthlyIncome || 0).toLocaleString()}` },
        { label: 'Benefit Period', value: benefitPeriod === '65' ? 'To Age 65' : `${benefitPeriod} Years` },
        { label: 'Waiting Period', value: `${waitingPeriod} Days` },
        { label: 'Core Expenses', value: coreExpenses ? `$${(coreExpenses as number).toLocaleString()}` : 'Not specified' }
      ]
    });
  };

  if (!startCalculator) {
    const potentialEarnings = (monthlyIncome || 0) * 12 * (yearsToRetirement || 0);
    
    return (
      <div className="text-center p-8 bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl border-2 border-orange-200 shadow-lg">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-4xl shadow-lg animate-pulse">
          💰
        </div>
        <h3 className="text-3xl font-black text-navy-blue mb-3">Your Most Valuable Asset...</h3>
        <p className="text-lg text-gray-700 mb-6">...isn't your house or your car. It's your <span className="font-bold text-orange-600">ability to earn an income</span>.</p>
        
        <div className="my-8 p-6 bg-white rounded-2xl shadow-xl border-2 border-orange-300">
          <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-2">Your Future Earning Potential</p>
          <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 mb-2">
            ${potentialEarnings.toLocaleString()}
          </p>
          <p className="text-sm text-gray-600">Over the next {yearsToRetirement || 25} years</p>
        </div>
        
        <p className="text-base text-gray-700 mb-8 max-w-md mx-auto">
          What if an illness or injury prevented you from working? Let's calculate how to protect your income.
        </p>
        
        <button
          onClick={() => setStartCalculator(true)}
          className="w-full max-w-md mx-auto bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Start Protecting My Income →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Income & Expenses Section */}
        <div className="form-section p-5 space-y-4 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-navy-blue border-b-2 border-orange-200 pb-3 flex items-center gap-2">
            <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
            </svg>
            Your Income & Core Expenses
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InputField
              label="Your Gross Monthly Income"
              value={monthlyIncome}
              onChange={setMonthlyIncome}
              placeholder="e.g., 6000"
            />
            <InputField
              label="Your Core Monthly Expenses (Optional)"
              value={coreExpenses}
              onChange={setCoreExpenses}
              placeholder="e.g., 3500"
            />
          </div>
          <p className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
            💡 <strong>Tip:</strong> Include mortgage/rent, utilities, food, insurance, and minimum debt payments in your core expenses.
          </p>
        </div>

        {/* Policy Customization */}
        <div className="form-section p-5 space-y-4 bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl shadow-lg">
          <h3 className="text-lg font-bold text-navy-blue border-b-2 border-orange-200 pb-3 flex items-center gap-2">
            <svg className="w-6 h-6 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            Customize Your Policy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              label="Benefit Period (How long it pays)"
              value={benefitPeriod}
              onChange={setBenefitPeriod}
            >
              <option value="5">5 Years</option>
              <option value="10">10 Years</option>
              <option value="65">To Age 65 (Recommended)</option>
            </SelectField>
            <SelectField
              label="Waiting Period (When it starts)"
              value={waitingPeriod}
              onChange={setWaitingPeriod}
            >
              <option value="30">30 Days</option>
              <option value="60">60 Days</option>
              <option value="90">90 Days (Most Common)</option>
              <option value="180">180 Days</option>
            </SelectField>
          </div>
          <div className="text-center p-4 bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg border-2 border-orange-200">
            <span className="text-sm font-semibold text-gray-700">Relative Premium Cost: </span>
            {relativePremium}
            <p className="text-xs text-gray-600 mt-2">Longer waiting periods and shorter benefit periods = lower premiums</p>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Calculate My Benefit Needs
        </button>
      </form>

      {result !== null && (
        <div className="pt-6 border-t-2 border-gray-200 space-y-6 animate-fadeIn">
          <ResultsDisplay
            title="Estimated Monthly Benefit Needed"
            result={`${result.toLocaleString()}`}
            unit="/month"
            description="This benefit would replace approx. 60-70% of your income if you're unable to work due to a qualifying disability."
          />
          
          {typeof coreExpenses === 'number' && coreExpenses > 0 && (
            <ResultsComparison benefit={result} expenses={coreExpenses} />
          )}
          
          <StExplainer />
          
          <div className="sr-only">
            <h2>Disability Insurance Calculator Keywords and Related Phrases</h2>
            <p>Use this disability insurance calculator to understand your income protection needs. Our tool helps you calculate your future earning potential to frame the importance of coverage. Learn the difference between short-term vs long-term disability and how your benefit period and waiting period choices affect your quote. This is a comprehensive lifestyle protection planning tool.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisabilityCalculator;