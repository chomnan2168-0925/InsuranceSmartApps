import React, { useState, FormEvent } from 'react';

const MainCalculator = () => {
  const [currentAge, setCurrentAge] = useState<number | ''>(30);
  const [retirementAge, setRetirementAge] = useState<number | ''>(65);
  const [currentSavings, setCurrentSavings] = useState<number | ''>(50000);
  const [monthlyContribution, setMonthlyContribution] = useState<number | ''>(500);
  const [annualReturn, setAnnualReturn] = useState<number | ''>(7);
  const [result, setResult] = useState<string | null>(null);

  const calculateRetirementSavings = (e: FormEvent) => {
    e.preventDefault();

    const yearsToRetirement = (retirementAge || 0) - (currentAge || 0);
    if (yearsToRetirement <= 0 || (currentSavings || 0) < 0 || (monthlyContribution || 0) < 0) {
      setResult("Please enter valid numbers.");
      return;
    }

    const monthlyReturnRate = (annualReturn || 0) / 100 / 12;
    const totalMonths = yearsToRetirement * 12;

    // Future value of current savings
    const fvCurrentSavings = (currentSavings || 0) * Math.pow(1 + monthlyReturnRate, totalMonths);

    // Future value of an annuity (monthly contributions)
    const fvAnnuity = (monthlyContribution || 0) * (
      (Math.pow(1 + monthlyReturnRate, totalMonths) - 1) / monthlyReturnRate
    );

    const totalSavings = fvCurrentSavings + fvAnnuity;

    setResult(
      `Estimated savings at retirement: $${totalSavings.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`
    );
  };
  
  const InputField = ({ label, value, onChange, type = "number", placeholder = "" }) => (
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

  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-navy-blue text-center mb-6">Retirement Savings Calculator</h2>
      <form onSubmit={calculateRetirementSavings} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField label="Current Age" value={currentAge} onChange={setCurrentAge} />
        <InputField label="Retirement Age" value={retirementAge} onChange={setRetirementAge} />
        <InputField label="Current Savings ($)" value={currentSavings} onChange={setCurrentSavings} placeholder="e.g., 50000" />
        <InputField label="Monthly Contribution ($)" value={monthlyContribution} onChange={setMonthlyContribution} placeholder="e.g., 500" />
        <div className="md:col-span-2">
            <InputField label="Estimated Annual Return (%)" value={annualReturn} onChange={setAnnualReturn} placeholder="e.g., 7" />
        </div>
        <div className="md:col-span-2">
            <button type="submit" className="w-full bg-gold hover:bg-yellow-400 text-navy-blue font-bold py-3 px-4 rounded-md transition-colors duration-300">
                Calculate
            </button>
        </div>
      </form>
      {result && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 text-navy-blue rounded-md text-center">
          <p className="font-semibold text-lg">{result}</p>
        </div>
      )}
    </div>
  );
};

export default MainCalculator;
