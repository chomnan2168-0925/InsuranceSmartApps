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

const LifeCalculator = () => {
  const [annualIncome, setAnnualIncome] = useState<number | ''>(75000);
  const [years, setYears] = useState<number | ''>(10);
  const [debt, setDebt] = useState<number | ''>(50000);
  const [result, setResult] = useState<number | null>(null);

  const calculateCoverage = (e: FormEvent) => {
    e.preventDefault();
    const income = annualIncome || 0;
    const numYears = years || 0;
    const totalDebt = debt || 0;
    
    // Simple formula: (Income * Years of replacement) + Debt
    const coverage = (income * numYears) + totalDebt;
    setResult(coverage);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-navy-blue text-center mb-6">Life Insurance Calculator</h2>
      <form onSubmit={calculateCoverage} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Annual Income ($)" value={annualIncome} onChange={setAnnualIncome} placeholder="e.g., 75000" />
        <InputField label="Years of Income to Replace" value={years} onChange={setYears} placeholder="e.g., 10" />
        <div className="md:col-span-2">
          <InputField label="Total Debt (Mortgage, Loans, etc.) ($)" value={debt} onChange={setDebt} placeholder="e.g., 50000" />
        </div>
        <div className="md:col-span-2">
            <button type="submit" className="w-full bg-gold hover:bg-yellow-400 text-navy-blue font-bold py-3 px-4 rounded-md transition-colors duration-300">
                Calculate Coverage
            </button>
        </div>
      </form>
      {result !== null && (
        <ResultsDisplay
          title="Estimated Coverage Needed"
          result={`$${result.toLocaleString()}`}
          unit=""
          description="This is a simple estimate. Consult with a financial advisor for a detailed analysis."
        />
      )}
    </div>
  );
};

export default LifeCalculator;
