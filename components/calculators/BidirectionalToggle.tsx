import React from 'react';

interface BidirectionalToggleProps {
  option1: string;
  option2: string;
  selectedOption: string;
  onToggle: (option: string) => void;
}

const BidirectionalToggle: React.FC<BidirectionalToggleProps> = ({ option1, option2, selectedOption, onToggle }) => {
  const isOption1Selected = selectedOption === option1;

  return (
    <div className="flex items-center justify-center my-4">
      <button
        onClick={() => onToggle(option1)}
        className={`px-6 py-2 rounded-l-md font-semibold transition-colors ${
          isOption1Selected ? 'bg-navy-blue text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        {option1}
      </button>
      <button
        onClick={() => onToggle(option2)}
        className={`px-6 py-2 rounded-r-md font-semibold transition-colors ${
          !isOption1Selected ? 'bg-navy-blue text-white' : 'bg-gray-200 text-gray-700'
        }`}
      >
        {option2}
      </button>
    </div>
  );
};

export default BidirectionalToggle;
