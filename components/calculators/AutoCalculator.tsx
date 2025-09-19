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


const AutoCalculator = () => {
  const [age, setAge] = useState('25-34');
  const [vehicleValue, setVehicleValue] = useState('20k-30k');
  const [drivingRecord, setDrivingRecord] = useState('clean');
  const [result, setResult] = useState<string | null>(null);

  const calculatePremium = (e: FormEvent) => {
    e.preventDefault();
    let baseRate = 120; // monthly
    if (age === '18-24') baseRate *= 1.5;
    if (age === '35-54') baseRate *= 0.9;
    if (age === '55+') baseRate *= 0.85;

    if (vehicleValue === '30k-50k') baseRate *= 1.2;
    if (vehicleValue === '>50k') baseRate *= 1.4;

    if (drivingRecord === '1-accident') baseRate *= 1.3;
    if (drivingRecord === 'multiple-accidents') baseRate *= 1.8;
    
    setResult(baseRate.toFixed(2));
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-navy-blue text-center mb-6">Auto Insurance Premium Estimator</h2>
      <form onSubmit={calculatePremium} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SelectField label="Age Group" value={age} onChange={setAge}>
            <option value="18-24">18-24</option>
            <option value="25-34">25-34</option>
            <option value="35-54">35-54</option>
            <option value="55+">55+</option>
        </SelectField>
         <SelectField label="Vehicle Value" value={vehicleValue} onChange={setVehicleValue}>
            <option value="<20k">Under $20,000</option>
            <option value="20k-30k">$20,000 - $30,000</option>
            <option value="30k-50k">$30,000 - $50,000</option>
            <option value=">50k">Over $50,000</option>
        </SelectField>
        <div className="md:col-span-2">
            <SelectField label="Driving Record" value={drivingRecord} onChange={setDrivingRecord}>
                <option value="clean">Clean Record</option>
                <option value="1-accident">1 At-Fault Accident</option>
                <option value="multiple-accidents">Multiple Accidents/Tickets</option>
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
          description="This is a rough estimate. Actual rates vary by location, carrier, and other factors."
        />
      )}
    </div>
  );
};

export default AutoCalculator;