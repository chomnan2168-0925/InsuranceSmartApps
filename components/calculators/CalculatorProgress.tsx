import React from 'react';

interface CalculatorProgressProps {
  currentStep: number;
  totalSteps: number;
  steps: string[];
}

const CalculatorProgress: React.FC<CalculatorProgressProps> = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2">
        {steps.map((step, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div className={`
              w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300
              ${index < currentStep 
                ? 'bg-green-500 text-white' 
                : index === currentStep 
                ? 'bg-blue-600 text-white ring-4 ring-blue-200' 
                : 'bg-gray-200 text-gray-500'
              }
            `}>
              {index < currentStep ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <p className={`text-xs mt-2 text-center ${index === currentStep ? 'font-bold text-blue-600' : 'text-gray-500'}`}>
              {step}
            </p>
          </div>
        ))}
      </div>
      <div className="relative pt-1">
        <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
          <div
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500"
          ></div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorProgress;