import React, { useState, FormEvent } from 'react';
import ResultsDisplay from './ResultsDisplay';

// FIX: Made children optional to satisfy TypeScript compiler error.
const SelectField = ({ label, value, onChange, children }: { label: string, value: string, onChange: (value: string) => void, children?: React.ReactNode }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm rounded-md"
      >
        {children}
      </select>
    </div>
);


const PetCalculator = () => {
  const [petType, setPetType] = useState('dog');
  const [petAge, setPetAge] = useState('young');
  const [coverageLevel, setCoverageLevel] = useState('medium');
  const [result, setResult] = useState<string | null>(null);

  const calculatePremium = (e: FormEvent) => {
    e.preventDefault();
    let baseRate = petType === 'dog' ? 45 : 25; // monthly
    
    if (petAge === 'middle') baseRate *= 1.2;
    if (petAge === 'senior') baseRate *= 1.8;

    if (coverageLevel === 'basic') baseRate *= 0.8;
    if (coverageLevel === 'premium') baseRate *= 1.5;
    
    setResult(baseRate.toFixed(2));
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-navy-blue text-center mb-6">Pet Insurance Premium Estimator</h2>
      <form onSubmit={calculatePremium} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField label="Pet Type" value={petType} onChange={setPetType}>
            <option value="dog">Dog</option>
            <option value="cat">Cat</option>
        </SelectField>
         <SelectField label="Pet Age" value={petAge} onChange={setPetAge}>
            <option value="young">Young (0-2 yrs)</option>
            <option value="middle">Middle-Aged (3-7 yrs)</option>
            <option value="senior">Senior (8+ yrs)</option>
        </SelectField>
        <div className="md:col-span-2">
            <SelectField label="Coverage Level" value={coverageLevel} onChange={setCoverageLevel}>
                <option value="basic">Basic (Accident Only)</option>
                <option value="medium">Medium (Accident &amp; Illness)</option>
                <option value="premium">Premium (Includes Wellness)</option>
            </SelectField>
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
          description="Estimates can vary by breed, location, and specific plan details."
        />
      )}
    </div>
  );
};

export default PetCalculator;