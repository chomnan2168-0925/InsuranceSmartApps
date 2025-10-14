import React, { useState, FormEvent } from 'react';
import ResultsDisplay from '@/components/calculators/ResultsDisplay';

const InputField = ({ label, value, onChange, type = "number", placeholder = "", unit = '' }: { label: string, value: number, onChange: (value: number) => void, type?: string, placeholder?: string, unit?: string }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <div className="mt-1 relative rounded-md shadow-sm">
      {unit === '$' && <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"><span className="text-gray-500 sm:text-sm">$</span></div>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        placeholder={placeholder}
        className={`w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm ${unit === '$' ? 'pl-7' : ''} ${unit === '%' ? 'pr-8' : ''}`}
        required
      />
      {unit === '%' && <div className="pointer-events-none absolute inset-y-0 right-0 pr-3 flex items-center"><span className="text-gray-500 sm:text-sm">%</span></div>}
    </div>
  </div>
);

const MainCalculator: React.FC = () => {
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge, setRetirementAge] = useState(65);
  const [currentSavings, setCurrentSavings] = useState(50000);
  const [monthlyContribution, setMonthlyContribution] = useState(500);
  const [annualReturn, setAnnualReturn] = useState(7);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (currentAge >= retirementAge) {
      setError('Retirement age must be greater than your current age.');
      setResult(null);
      return;
    }

    const yearsToRetirement = retirementAge - currentAge;
    const monthsToRetirement = yearsToRetirement * 12;
    const monthlyReturnRate = annualReturn / 100 / 12;

    const fvOfCurrentSavings = currentSavings * Math.pow(1 + monthlyReturnRate, monthsToRetirement);

    let fvOfContributions = 0;
    if (monthlyReturnRate > 0) {
      fvOfContributions = monthlyContribution * ((Math.pow(1 + monthlyReturnRate, monthsToRetirement) - 1) / monthlyReturnRate);
    } else {
      fvOfContributions = monthlyContribution * monthsToRetirement;
    }

    const totalSavings = fvOfCurrentSavings + fvOfContributions;
    setResult(totalSavings);
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-navy-blue text-center mb-6">
        Retirement Savings Calculator
      </h2>
      <form onSubmit={handleCalculate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField label="Current Age" value={currentAge} onChange={setCurrentAge} />
        <InputField label="Planned Retirement Age" value={retirementAge} onChange={setRetirementAge} />
        <InputField label="Current Retirement Savings" value={currentSavings} onChange={setCurrentSavings} unit="$" />
        <InputField label="Monthly Contribution" value={monthlyContribution} onChange={setMonthlyContribution} unit="$" />
        <div className="md:col-span-2">
          <InputField label="Estimated Annual Return" value={annualReturn} onChange={setAnnualReturn} unit="%" />
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="w-full bg-gold hover:bg-yellow-400 text-navy-blue font-bold py-3 px-4 rounded-md transition-colors duration-300">
            Calculate
          </button>
        </div>
      </form>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-md text-center">
          {error}
        </div>
      )}

      {result !== null && (
        <ResultsDisplay
          title="Estimated Retirement Savings"
          result={`$${result.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`}
          unit=""
          description={`This is your projected balance at age ${retirementAge}. This estimate is for illustrative purposes only.`}
        />
      )}
    </div>
  );
};

export default MainCalculator;
