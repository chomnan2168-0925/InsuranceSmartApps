import React, { useState, FormEvent } from 'react';
import ResultsDisplay from './ResultsDisplay';

const InputField = ({ label, value, onChange, type = "number", placeholder = "" }: { label: string, value: number | '', onChange: (value: number | '') => void, type?: string, placeholder?: string }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value === '' ? '' : parseFloat(e.target.value))}
      placeholder={placeholder}
      className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm"
      required
    />
  </div>
);

const HealthCalculator = () => {
  const [adults, setAdults] = useState<number | ''>(2);
  const [children, setChildren] = useState<number | ''>(1);
  const [income, setIncome] = useState<number | ''>(85000);
  const [result, setResult] = useState<string | null>(null);

  const calculateEstimate = (e: FormEvent) => {
    e.preventDefault();
    const numAdults = adults || 0;
    const numChildren = children || 0;
    const annualIncome = income || 0;

    let basePremium = (numAdults * 450) + (numChildren * 250);
    let subsidy = 0;
    // Very simplified ACA subsidy logic
    if (annualIncome > 0 && annualIncome < 100000) {
        subsidy = basePremium * (1 - (annualIncome / 120000));
    }
    const finalPremium = Math.max(0, basePremium - subsidy);
    
    setResult(finalPremium.toFixed(2));
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-navy-blue text-center mb-6">Health Insurance Premium Estimator</h2>
      <form onSubmit={calculateEstimate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Number of Adults" value={adults} onChange={setAdults} />
        <InputField label="Number of Children" value={children} onChange={setChildren} />
        <div className="md:col-span-2">
            <InputField label="Annual Household Income ($)" value={income} onChange={setIncome} placeholder="e.g., 85000" />
        </div>
        <div className="md:col-span-2">
            <button type="submit" className="w-full bg-gold hover:bg-yellow-400 text-navy-blue font-bold py-3 px-4 rounded-md transition-colors duration-300">
                Estimate Premium
            </button>
        </div>
      </form>
      {result !== null && (
        <ResultsDisplay
          title="Estimated Monthly Premium"
          result={`$${result}`}
          unit="/month"
          description="This is a Marketplace (ACA) estimate. Employer plans and actual costs vary widely."
        />
      )}
    </div>
  );
};

export default HealthCalculator;
