import React from 'react';

const LoadingCalculator: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-lg">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      <p className="mt-4 text-lg font-semibold text-gray-700 animate-pulse">
        Calculating Your Personalized Results...
      </p>
      <p className="text-sm text-gray-500 mt-2">
        Analyzing your information to provide the most accurate estimate
      </p>
    </div>
  );
};

export default LoadingCalculator;