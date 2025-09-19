import React from 'react';

interface ResultsDisplayProps {
  title: string;
  result: string | number;
  unit: string;
  description: string;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ title, result, unit, description }) => {
  return (
    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 text-navy-blue rounded-md text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-3xl font-bold my-2">
        {typeof result === 'number' ? result.toLocaleString('en-US') : result}
        <span className="text-xl font-medium ml-1">{unit}</span>
      </p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default ResultsDisplay;
