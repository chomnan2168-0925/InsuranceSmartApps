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

const DisabilityCalculator = () => {
  const [monthlyIncome, setMonthlyIncome] = useState<number | ''>(6000);
  const [otherIncome, setOtherIncome] = useState<number | ''>(500);
  const [result, setResult] = useState<number | null>(null);

  const calculateCoverage = (e: FormEvent) => {
    e.preventDefault();
    const income = monthlyIncome || 0;
    const other = otherIncome || 0;
    
    // Typically covers 60-70% of income. Let's use 65%.
    const neededBenefit = (income * 0.65) - other;
    setResult(Math.max(0, neededBenefit));
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-navy-blue text-center mb-6">Disability Insurance Calculator</h2>
      <form onSubmit={calculateCoverage} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Gross Monthly Income ($)" value={monthlyIncome} onChange={setMonthlyIncome} placeholder="e.g., 6000" />
        <InputField label="Other Monthly Disability Income ($)" value={otherIncome} onChange={setOtherIncome} placeholder="e.g., 500" />
        <div className="md:col-span-2">
            <button type="submit" className="w-full bg-gold hover:bg-yellow-400 text-navy-blue font-bold py-3 px-4 rounded-md transition-colors duration-300">
                Calculate Benefit
            </button>
        </div>
      </form>
      {result !== null && (
        <ResultsDisplay
          title="Estimated Monthly Benefit Needed"
          result={`$${result.toLocaleString()}`}
          unit="/month"
          description="This benefit would replace a portion of your income if you're unable to work."
        />
      )}
    </div>
  );
};

export default DisabilityCalculator;
