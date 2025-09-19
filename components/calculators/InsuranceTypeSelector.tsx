import React from 'react';

type CalculatorType = 'auto' | 'home' | 'life' | 'disability' | 'health' | 'pet';

interface InsuranceTypeSelectorProps {
  selectedType: CalculatorType;
  onTypeSelect: (type: CalculatorType) => void;
}

const calculatorTypes: { id: CalculatorType; label: string }[] = [
  { id: 'life', label: 'Life' },
  { id: 'home', label: 'Home' },
  { id: 'auto', label: 'Auto' },
  { id: 'disability', label: 'Disability' },
  { id: 'health', label: 'Health' },
  { id: 'pet', label: 'Pet' },
];

const InsuranceTypeSelector: React.FC<InsuranceTypeSelectorProps> = ({ selectedType, onTypeSelect }) => {
  return (
    <div className="flex flex-wrap justify-center gap-2 md:gap-4">
      {calculatorTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => onTypeSelect(type.id)}
          className={`px-4 py-2 text-sm font-semibold rounded-full transition-colors duration-300 ${
            selectedType === type.id
              ? 'bg-navy-blue text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {type.label} Insurance
        </button>
      ))}
    </div>
  );
};

export default InsuranceTypeSelector;
