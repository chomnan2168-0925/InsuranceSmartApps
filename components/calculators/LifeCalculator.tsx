// /components/calculators/LifeCalculator.tsx
import React, { useState, useMemo, FormEvent } from 'react';
import ResultsDisplay from './ResultsDisplay';
import RateBenchmark from './RateBenchmark';
import config from '@/data/calculatorConfig.json';
import { useCalculatorContext } from '@/context/CalculatorContext';

// === ENHANCED UI COMPONENTS ===

const TextInput = ({ label, value, onChange, placeholder, icon, helpText }: { 
  label: string, 
  value: number | '', 
  onChange: (val: number | '') => void, 
  placeholder: string,
  icon?: React.ReactNode,
  helpText?: string
}) => (
  <div className="form-input-group">
    <label className="form-label text-gray-700 font-semibold">{label}</label>
    {helpText && <p className="text-xs text-gray-500 mb-2">💡 {helpText}</p>}
    <div className="form-input-wrapper">
      {icon && <div className="form-input-icon">{icon}</div>}
      <div className="relative flex-1">
        <span className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-500 text-sm pointer-events-none">$</span>
        <input
          type="number"
          value={value}
          onChange={e => onChange(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
          placeholder={placeholder}
          className="form-input pl-5 w-full"
        />
      </div>
    </div>
  </div>
);

const Slider = ({ label, value, onChange, min, max, step, helpText, color = 'blue' }: { 
  label: string, 
  value: number, 
  onChange: (val: number) => void, 
  min: number, 
  max: number, 
  step: number, 
  helpText?: string,
  color?: string 
}) => (
  <div className="form-input-group">
    <label className="form-label flex items-center justify-between text-gray-700 font-semibold">
      <span>{label}</span>
      <span className={`font-bold text-${color}-600 text-lg`}>{value} years</span>
    </label>
    {helpText && <p className="text-xs text-gray-500 mb-2">💡 {helpText}</p>}
    <div className="relative pt-2">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-full h-3 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full appearance-none cursor-pointer slider-thumb"
        style={{
          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - min) / (max - min)) * 100}%, #dbeafe ${((value - min) / (max - min)) * 100}%, #dbeafe 100%)`
        }}
      />
    </div>
  </div>
);

const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number, totalSteps: number }) => {
  const steps = [
    { number: 1, label: 'Debts', icon: '💳' },
    { number: 2, label: 'Income', icon: '💰' },
    { number: 3, label: 'Education', icon: '🎓' },
    { number: 4, label: 'Final', icon: '🕊️' }
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center gap-2">
        {steps.map((s, index) => (
          <React.Fragment key={s.number}>
            {/* Step Circle */}
            <div className="flex flex-col items-center">
              <div 
                className={`
                  w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all duration-300 transform
                  ${currentStep >= s.number 
                    ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white scale-110 shadow-xl ring-4 ring-blue-200' 
                    : 'bg-white border-3 border-gray-300 text-gray-400 shadow-md'
                  }
                `}
              >
                {s.icon}
              </div>
              <span className={`text-sm mt-2 font-semibold ${currentStep >= s.number ? 'text-blue-600' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
            
            {/* Arrow Connector (except after last step) */}
            {index < steps.length - 1 && (
              <div className="flex flex-col items-center mb-6">
                <svg 
                  className={`w-8 h-8 transition-all duration-300 ${currentStep > s.number ? 'text-blue-500' : 'text-gray-300'}`}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={3} 
                    d="M13 7l5 5m0 0l-5 5m5-5H6" 
                  />
                </svg>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const QuickPresets = ({ onSelect }: { onSelect: (preset: any) => void }) => {
  const presets = [
    {
      name: 'Young Family',
      icon: '👨‍👩‍👧',
      values: { mortgage: 250000, otherLoans: 30000, annualIncome: 60000, yearsToReplace: 20, numChildren: 2, collegeFund: 100000, finalExpenses: 15000 }
    },
    {
      name: 'Mid-Career',
      icon: '💼',
      values: { mortgage: 350000, otherLoans: 20000, annualIncome: 90000, yearsToReplace: 15, numChildren: 1, collegeFund: 150000, finalExpenses: 20000 }
    },
    {
      name: 'Pre-Retirement',
      icon: '🏖️',
      values: { mortgage: 100000, otherLoans: 10000, annualIncome: 75000, yearsToReplace: 10, numChildren: 0, collegeFund: 0, finalExpenses: 25000 }
    }
  ];

  return (
    <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border-2 border-blue-100">
      <h4 className="text-sm font-bold text-gray-800 mb-3">⚡ Quick Start Presets</h4>
      <div className="grid grid-cols-3 gap-3">
        {presets.map(preset => (
          <button
            key={preset.name}
            type="button"
            onClick={() => onSelect(preset.values)}
            className="p-3 bg-white hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-lg transition-all duration-200 transform hover:scale-105"
          >
            <div className="text-2xl mb-1">{preset.icon}</div>
            <div className="text-xs font-semibold text-gray-700">{preset.name}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

const RunningTotal = ({ total }: { total: number }) => (
  <div className="sticky top-4 p-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl shadow-lg text-white">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm opacity-90">Running Total</p>
        <p className="text-3xl font-black">${total.toLocaleString()}</p>
      </div>
      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-3xl">
        🎯
      </div>
    </div>
  </div>
);

const ResultsBreakdown = ({ breakdown }: { breakdown: { label: string; value: number; icon: string }[] }) => (
  <div className="mt-6 p-6 bg-white rounded-2xl border-2 border-gray-100 shadow-md">
    <h4 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
      <span>📊</span> Coverage Breakdown
    </h4>
    <div className="space-y-3">
      {breakdown.map(item => (
        <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{item.icon}</span>
            <span className="text-sm font-medium text-gray-700">{item.label}</span>
          </div>
          <span className="font-bold text-gray-900">${item.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  </div>
);

const PolicyTypeExplainer = () => (
  <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-100">
    <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center gap-2">
      <span>🛡️</span> Understanding Your Coverage Options
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-white rounded-xl border-2 border-blue-200 hover:shadow-lg transition-all">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">⏱️</span>
          <h4 className="font-bold text-gray-800">Term Life Insurance</h4>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Provides coverage for a specific period (10, 20, or 30 years). Perfect for covering temporary needs like mortgages or until children are independent.
        </p>
        <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
          <span className="text-lg">💵</span>
          <p className="text-xs font-semibold text-green-700">Affordable: as low as $30/month</p>
        </div>
      </div>
      
      <div className="p-4 bg-white rounded-xl border-2 border-purple-200 hover:shadow-lg transition-all">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">♾️</span>
          <h4 className="font-bold text-gray-800">Permanent (Whole) Life</h4>
        </div>
        <p className="text-sm text-gray-600 mb-3">
          Provides lifelong coverage with a cash value component that grows tax-deferred. Ideal for estate planning and leaving a legacy.
        </p>
        <button className="text-xs font-bold text-purple-600 hover:text-purple-800 hover:underline flex items-center gap-1">
          Learn More <span>→</span>
        </button>
      </div>
    </div>
  </div>
);

// === MAIN CALCULATOR COMPONENT ===

const LifeCalculator = () => {
  const { saveResult } = useCalculatorContext();
  
  const [step, setStep] = useState(1);
  const [showResults, setShowResults] = useState(false);
  const [mortgage, setMortgage] = useState<number | ''>('');
  const [otherLoans, setOtherLoans] = useState<number | ''>('');
  const [annualIncome, setAnnualIncome] = useState<number | ''>(75000);
  const [yearsToReplace, setYearsToReplace] = useState(config.life.incomeReplacementYears);
  const [numChildren, setNumChildren] = useState<number | ''>(0);
  const [collegeFund, setCollegeFund] = useState<number | ''>(config.life.defaultCollegeFund);
  const [finalExpenses, setFinalExpenses] = useState<number | ''>(config.life.defaultFinalExpenses);
  
  const totalSteps = 4;
  
  const goToNextStep = () => {
    setStep(prev => Math.min(prev + 1, totalSteps));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const goToPrevStep = () => {
    setStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const applyPreset = (preset: any) => {
    setMortgage(preset.mortgage);
    setOtherLoans(preset.otherLoans);
    setAnnualIncome(preset.annualIncome);
    setYearsToReplace(preset.yearsToReplace);
    setNumChildren(preset.numChildren);
    setCollegeFund(preset.collegeFund);
    setFinalExpenses(preset.finalExpenses);
  };
  
  const calculatedNeeds = useMemo(() => {
    const debtTotal = (mortgage || 0) + (otherLoans || 0);
    const incomeTotal = (annualIncome || 0) * yearsToReplace;
    const educationTotal = (numChildren || 0) * (collegeFund || 0);
    const endOfLifeTotal = finalExpenses || 0;
    return { 
      debt: debtTotal, 
      income: incomeTotal, 
      education: educationTotal, 
      endOfLife: endOfLifeTotal, 
      total: debtTotal + incomeTotal + educationTotal + endOfLifeTotal 
    };
  }, [mortgage, otherLoans, annualIncome, yearsToReplace, numChildren, collegeFund, finalExpenses]);

  const handleSubmit = () => {
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    saveResult({
      type: 'life',
      result: `$${calculatedNeeds.total.toLocaleString()}`,
      inputs: [
        { label: 'Income', value: `$${(annualIncome || 0).toLocaleString()}` },
        { label: 'Years', value: `${yearsToReplace} years` },
        { label: 'Debts', value: `$${calculatedNeeds.debt.toLocaleString()}` },
        { label: 'Education', value: `$${calculatedNeeds.education.toLocaleString()}` }
      ]
    });
  };

  if (showResults) {
    return (
      <div className="space-y-6 animate-fadeIn">
        {/* Main Result Card */}
        <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 rounded-2xl shadow-2xl text-white">
          <div className="text-center">
            <div className="inline-block p-3 bg-white/20 backdrop-blur-sm rounded-full mb-4">
              <span className="text-5xl">🛡️</span>
            </div>
            <p className="text-lg opacity-90 mb-2">Your Recommended Coverage</p>
            <p className="text-6xl font-black mb-2">${calculatedNeeds.total.toLocaleString()}</p>
            <p className="text-xl opacity-90">Life Insurance Protection</p>
          </div>
        </div>

        {/* Breakdown */}
        <ResultsBreakdown breakdown={[
          { label: 'Debts & Mortgages', value: calculatedNeeds.debt, icon: '💳' },
          { label: 'Income Replacement', value: calculatedNeeds.income, icon: '💰' },
          { label: 'Education Fund', value: calculatedNeeds.education, icon: '🎓' },
          { label: 'Final Expenses', value: calculatedNeeds.endOfLife, icon: '🕊️' },
        ]} />

        {/* Policy Explainer */}
        <PolicyTypeExplainer />

        {/* SEO Content */}
        <div className="sr-only">
          <h2>Life Insurance Keywords and Needs Analysis Phrases</h2>
          <p>
            This free life insurance calculator helps you perform a comprehensive needs analysis. 
            Our guided wizard uses the DIME+ method (Debt, Income, Mortgage, Education, and End-of-Life) 
            to determine how much life insurance you really need. Calculate the right coverage amount for 
            income replacement, covering mortgage debt, funding a college education, and final expenses. 
            After your analysis, learn the difference between term vs whole life insurance to make an informed decision.
          </p>
        </div>

        {/* Action Button - Enhanced */}
<div className="relative group">
  {/* Animated background glow */}
  <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-500 group-hover:duration-200 animate-pulse"></div>
  
  <button 
    onClick={() => setShowResults(false)} 
    className="relative w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white font-bold py-5 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 group"
  >
    <svg 
      className="w-6 h-6 transition-transform duration-300 group-hover:-translate-x-1" 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
    <span className="text-lg">Try Different Scenarios</span>
    <span className="text-2xl">🔄</span>
  </button>
</div>

{/* Encouragement text */}
<p className="text-center text-sm text-gray-600 mt-4">
  💡 <strong>Tip:</strong> Adjust your inputs to see how different life scenarios impact your coverage needs!
</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <StepIndicator currentStep={step} totalSteps={totalSteps} />
      
      {step === 1 && <QuickPresets onSelect={applyPreset} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form Area */}
        <div className="lg:col-span-2">
          <div className="form-section bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-md border-2 border-blue-100 animate-fadeIn">
            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg">
                    💳
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Cover Your Debts</h3>
                    <p className="text-sm text-gray-600">Protect your family from financial burdens</p>
                  </div>
                </div>
                <TextInput 
                  label="Outstanding Mortgage Balance" 
                  value={mortgage} 
                  onChange={setMortgage} 
                  placeholder="250000"
                  icon={<span>🏠</span>}
                  helpText="Your remaining home loan balance"
                />
                <TextInput 
                  label="Other Loans (Car, Student, Credit Cards)" 
                  value={otherLoans} 
                  onChange={setOtherLoans} 
                  placeholder="50000"
                  icon={<span>🚗</span>}
                  helpText="Total of all other outstanding debts"
                />
              </div>
            )}
            
            {step === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg">
                    💰
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Replace Your Income</h3>
                    <p className="text-sm text-gray-600">Ensure financial stability for your loved ones</p>
                  </div>
                </div>
                <TextInput 
                  label="Annual Income to Replace" 
                  value={annualIncome} 
                  onChange={setAnnualIncome} 
                  placeholder="75000"
                  icon={<span>💵</span>}
                  helpText="Your current after-tax annual income"
                />
                <Slider 
                  label="Years of Income to Replace" 
                  value={yearsToReplace} 
                  onChange={setYearsToReplace} 
                  min={5} 
                  max={30} 
                  step={1} 
                  helpText="How long your family will need financial support"
                  color="green"
                />
              </div>
            )}
            
            {step === 3 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg">
                    🎓
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Plan for Education</h3>
                    <p className="text-sm text-gray-600">Secure your children's future</p>
                  </div>
                </div>
                <div className="form-input-group">
                  <label className="form-label text-gray-700 font-semibold">Number of Children</label>
                  <div className="form-input-wrapper">
                    <div className="form-input-icon">👶</div>
                    <input
                      type="number"
                      value={numChildren}
                      onChange={e => setNumChildren(e.target.value === '' ? '' : parseInt(e.target.value))}
                      placeholder="2"
                      className="form-input"
                    />
                  </div>
                </div>
                <TextInput 
                  label="College Fund per Child" 
                  value={collegeFund} 
                  onChange={setCollegeFund} 
                  placeholder="100000"
                  icon={<span>🎓</span>}
                  helpText="Estimated cost of 4-year college education"
                />
              </div>
            )}
            
            {step === 4 && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center text-white text-3xl shadow-lg">
                    🕊️
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">Final Expenses</h3>
                    <p className="text-sm text-gray-600">Cover end-of-life costs with dignity</p>
                  </div>
                </div>
                <TextInput 
                  label="Estimated Final Expenses" 
                  value={finalExpenses} 
                  onChange={setFinalExpenses} 
                  placeholder="15000"
                  icon={<span>⚱️</span>}
                  helpText="Medical bills, funeral, and burial costs"
                />
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-gray-700">
                    <strong>💡 Did you know?</strong> The average funeral costs between $7,000-$12,000. 
                    Adding medical and legal expenses, most families budget $15,000-$25,000.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6">
            <button 
              onClick={goToPrevStep} 
              disabled={step === 1}
              className="bg-white hover:bg-gray-50 text-gray-700 font-bold py-3 px-8 rounded-xl border-2 border-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
            >
              ← Back
            </button>
            {step < totalSteps ? (
              <button 
                onClick={goToNextStep}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Next Step →
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg flex items-center gap-2"
              >
                <span>Calculate My Coverage</span>
                <span>🎯</span>
              </button>
            )}
          </div>
        </div>

        {/* Running Total Sidebar */}
        <div className="lg:col-span-1">
          <RunningTotal total={calculatedNeeds.total} />
          
          {/* Progress Info */}
          <div className="mt-6 p-4 bg-white rounded-xl border-2 border-gray-100 shadow-sm">
            <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <span>📋</span> Your Progress
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Debts Covered:</span>
                <span className="font-bold text-gray-800">${calculatedNeeds.debt.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Income Replaced:</span>
                <span className="font-bold text-gray-800">${calculatedNeeds.income.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Education Funded:</span>
                <span className="font-bold text-gray-800">${calculatedNeeds.education.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Final Expenses:</span>
                <span className="font-bold text-gray-800">${calculatedNeeds.endOfLife.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LifeCalculator;