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

const HomeCalculator = () => {
  const [propertyValue, setPropertyValue] = useState<number | ''>(350000);
  const [personalProperty, setPersonalProperty] = useState<number | ''>(75000);
  const [result, setResult] = useState<number | null>(null);

  const calculateCoverage = (e: FormEvent) => {
    e.preventDefault();
    const dwellingCoverage = propertyValue || 0;
    // Personal property is often a percentage of dwelling, but we'll use a direct input.
    const totalCoverage = dwellingCoverage + (personalProperty || 0);
    setResult(totalCoverage);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-navy-blue text-center mb-6">Homeowners Insurance Calculator</h2>
      <form onSubmit={calculateCoverage} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Home Replacement Cost ($)" value={propertyValue} onChange={setPropertyValue} placeholder="e.g., 350000" />
        <InputField label="Personal Property Value ($)" value={personalProperty} onChange={setPersonalProperty} placeholder="e.g., 75000" />
        <div className="md:col-span-2">
            <button type="submit" className="w-full bg-gold hover:bg-yellow-400 text-navy-blue font-bold py-3 px-4 rounded-md transition-colors duration-300">
                Calculate Coverage
            </button>
        </div>
      </form>
      {result !== null && (
        <ResultsDisplay
          title="Estimated Total Coverage"
          result={`$${result.toLocaleString()}`}
          unit=""
          description="This includes dwelling and personal property. Other coverages like liability are separate."
        />
      )}
    </div>
  );
};

export default HomeCalculator;
