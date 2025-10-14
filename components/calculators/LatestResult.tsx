// /components/calculators/LatestResult.tsx
import React from 'react';
import { useCalculatorContext } from '@/context/CalculatorContext';
import ShareButton from './ShareButton';

const LatestResult: React.FC = () => {
  const { latestResult } = useCalculatorContext();

  if (!latestResult) {
    return null;
  }

  const getCalculatorColor = (type: string) => {
    const colors = {
      auto: { bg: 'bg-blue-50', border: 'border-blue-500', text: 'text-blue-600', gradient: 'from-blue-400 to-blue-600' },
      home: { bg: 'bg-green-50', border: 'border-green-500', text: 'text-green-600', gradient: 'from-green-400 to-green-600' },
      life: { bg: 'bg-purple-50', border: 'border-purple-500', text: 'text-purple-600', gradient: 'from-purple-400 to-purple-600' },
      disability: { bg: 'bg-orange-50', border: 'border-orange-500', text: 'text-orange-600', gradient: 'from-orange-400 to-orange-600' },
      health: { bg: 'bg-sky-50', border: 'border-sky-500', text: 'text-sky-600', gradient: 'from-sky-400 to-sky-600' },
      pet: { bg: 'bg-yellow-50', border: 'border-yellow-500', text: 'text-yellow-600', gradient: 'from-yellow-400 to-yellow-600' },
    };
    return colors[type as keyof typeof colors] || { bg: 'bg-gray-50', border: 'border-gray-500', text: 'text-gray-600', gradient: 'from-gray-400 to-gray-600' };
  };

  const getCalculatorIcon = (type: string) => {
    const icons = {
      auto: '🚗',
      home: '🏠',
      life: '❤️',
      disability: '👥',
      health: '⏰',
      pet: '🐾',
    };
    return icons[type as keyof typeof icons] || '📊';
  };

  const colors = getCalculatorColor(latestResult.type);

  return (
    <div 
      id="latest-result-card"
      className={`relative ${colors.bg} p-4 rounded-2xl shadow-xl border-2 ${colors.border} overflow-hidden animate-fadeIn`}
    >
      {/* Decorative Background Pattern */}
      <div className="absolute top-0 right-0 w-64 h-64 opacity-5">
        <div className={`w-full h-full bg-gradient-to-br ${colors.gradient} rounded-full transform translate-x-20 -translate-y-20`}></div>
      </div>

      {/* Header */}
      <div className="relative flex items-start justify-between mb-6 flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 bg-gradient-to-br ${colors.gradient} rounded-2xl flex items-center justify-center text-4xl shadow-lg transform hover:scale-110 transition-transform`}>
            {getCalculatorIcon(latestResult.type)}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <h2 className="text-2xl font-bold text-gray-900">Your Latest Estimate</h2>
              <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                NEW
              </span>
            </div>
            <p className={`text-sm font-semibold capitalize ${colors.text}`}>{latestResult.type} Insurance</p>
          </div>
        </div>
        
        {/* Time Badge */}
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border border-gray-200">
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-xs font-bold text-gray-600 ">Just now</span>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-6 -mt-4">
        {/* Premium Display */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100 hover:shadow-xl transition-shadow h-full flex flex-col justify-center">
            <div className="text-center">
              <div className="text-md font-bold text-gray-500 uppercase tracking-wide mb-1">
                Estimated Premium
              </div>
              <div className={`font-black ${colors.text} mb-3 leading-tight`}>
  <div className="text-4xl sm:text-4xl break-words">
    {latestResult.result.split('/')[0]}
  </div>
  {latestResult.result.includes('/') && (
    <div className="text-2xl sm:text-xl font-semibold opacity-80">
      /{latestResult.result.split('/')[1]}
    </div>
  )}
</div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                <svg className="w-3 h-3 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-gray-600 font-medium">Based on your inputs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Input Summary */}
        <div className="md:col-span-2 -mb-2 -mt-3 sm:pb-2 sm:pt-3">
          <div className="bg-white rounded-2xl p-4 shadow-lg border-2 border-gray-100 h-full">
            <h3 className="text-md font-bold text-gray-500 uppercase mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Calculation Summary
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {latestResult.inputs.map((input, idx) => (
                <div 
                  key={idx} 
                  className="flex justify-between items-center px-4 py-3 bg-gradient-to-r from-gray-50 to-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                >
                  <span className="text-sm text-gray-600 font-medium">{input.label}</span>
                  <span className="text-sm font-bold text-gray-900">{input.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="relative mt-6 flex flex-wrap gap-3">
        
        <ShareButton result={latestResult} colors={colors} />
        
        <a 
          href="/ask-an-expert"
          className={`
            flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold
            bg-gradient-to-r ${colors.gradient} text-white
            hover:shadow-lg hover:scale-105 transition-all transform
            ml-auto
          `}
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Get Expert Advice
        </a>
      </div>

      {/* Additional Info Banner */}
      <div className="relative -mb-3 mt-3 p-2 bg-white bg-opacity-80 border-2 border-gray-200 rounded-xl">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">Next Steps:</span> This is an estimate based on the information provided. 
              Actual premiums may vary. Contact an expert for a personalized quote and to explore additional coverage options.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestResult;