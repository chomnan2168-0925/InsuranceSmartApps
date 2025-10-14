// /components/calculators/ResultComparison.tsx
import React from 'react';
import { useCalculatorContext } from '@/context/CalculatorContext';

const ResultComparison: React.FC = () => {
  const { compareMode, selectedForCompare, toggleCompareSelection, allResults } = useCalculatorContext();

  if (!compareMode || allResults.length === 0) {
    return null;
  }

  const getCalculatorColor = (type: string) => {
    const colors = {
      auto: { border: 'border-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', gradient: 'from-blue-400 to-blue-600' },
      home: { border: 'border-green-500', bg: 'bg-green-50', text: 'text-green-700', gradient: 'from-green-400 to-green-600' },
      life: { border: 'border-purple-500', bg: 'bg-purple-50', text: 'text-purple-700', gradient: 'from-purple-400 to-purple-600' },
      disability: { border: 'border-orange-500', bg: 'bg-orange-50', text: 'text-orange-700', gradient: 'from-orange-400 to-orange-600' },
      health: { border: 'border-sky-500', bg: 'bg-sky-50', text: 'text-sky-700', gradient: 'from-sky-400 to-sky-600' },
      pet: { border: 'border-yellow-500', bg: 'bg-yellow-50', text: 'text-yellow-700', gradient: 'from-yellow-400 to-yellow-600' },
    };
    return colors[type as keyof typeof colors] || { border: 'border-gray-500', bg: 'bg-gray-50', text: 'text-gray-700', gradient: 'from-gray-400 to-gray-600' };
  };

  const getCalculatorIcon = (type: string) => {
    const icons = {
      auto: '\u{1F697}',
      home: '\u{1F3E0}',
      life: '\u{2764}\u{FE0F}',
      disability: '\u{1F465}',
      health: '\u{23F0}',
      pet: '\u{1F43E}',
    };
    return icons[type as keyof typeof icons] || '\u{1F4CA}';
  };

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return 'Just now';
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 p-6 rounded-2xl shadow-xl border-2 border-purple-100">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white text-2xl shadow-lg">
            📊
          </div>
          <div>
            <h2 className="text-2xl font-bold text-navy-blue">Compare Your Results</h2>
            <p className="text-sm text-gray-600">
              {selectedForCompare.length === 0 
                ? 'Select up to 3 calculations to compare side-by-side' 
                : `${selectedForCompare.length} of 3 selected`}
            </p>
          </div>
        </div>
        
        {/* Progress Indicator */}
        {selectedForCompare.length > 0 && (
          <div className="flex gap-2">
            {[1, 2, 3].map(i => (
              <div 
                key={i} 
                className={`w-3 h-3 rounded-full transition-all ${
                  i <= selectedForCompare.length 
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 scale-110' 
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Available Results to Select */}
      {selectedForCompare.length < 3 && allResults.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            Available Results
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allResults
              .filter(result => !selectedForCompare.find(s => s.timestamp === result.timestamp))
              .slice(0, 6)
              .map((result) => {
                const colors = getCalculatorColor(result.type);
                return (
                  <button
                    key={result.timestamp}
                    onClick={() => toggleCompareSelection(result)}
                    className={`
                      group p-4 rounded-xl border-2 text-left transition-all 
                      ${colors.border} ${colors.bg}
                      hover:shadow-lg hover:scale-105 transform
                    `}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{getCalculatorIcon(result.type)}</span>
                      <div className="flex-1">
                        <span className={`font-bold capitalize ${colors.text}`}>{result.type}</span>
                        <div className="text-xs text-gray-500">{formatDate(result.timestamp)}</div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center group-hover:border-purple-500 transition-colors">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-gray-900">{result.result}</div>
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Comparison View */}
      {selectedForCompare.length > 0 ? (
        <div>
          <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9 4a1 1 0 10-2 0v5a1 1 0 102 0V9zm-6 0a1 1 0 10-2 0v5a1 1 0 102 0V9z" clipRule="evenodd" />
            </svg>
            Side-by-Side Comparison
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedForCompare.map((result, index) => {
              const colors = getCalculatorColor(result.type);
              return (
                <div
                  key={result.timestamp}
                  className={`relative p-5 rounded-xl border-2 ${colors.border} ${colors.bg} shadow-lg animate-fadeIn`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => toggleCompareSelection(result)}
                    className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all flex items-center justify-center text-sm font-bold shadow-md hover:scale-110 z-10"
                    aria-label="Remove from comparison"
                  >
                    ×
                  </button>
                  
                  {/* Badge */}
                  <div className="absolute -top-2 -left-2 w-7 h-7 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                    {index + 1}
                  </div>

                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4 pt-2">
                    <div className={`w-12 h-12 bg-gradient-to-br ${colors.gradient} rounded-full flex items-center justify-center text-3xl shadow-md`}>
                      {getCalculatorIcon(result.type)}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-gray-900 capitalize text-lg">{result.type} Insurance</div>
                      <div className="text-xs text-gray-500">{formatDate(result.timestamp)}</div>
                    </div>
                  </div>

                  {/* Premium Display */}
                  <div className="mb-4 p-4 bg-white rounded-lg shadow-sm">
                    <div className="text-xs text-gray-600 mb-1">Estimated Premium</div>
                    <div className={`text-3xl font-bold ${colors.text}`}>{result.result}</div>
                  </div>

                  {/* Inputs */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                        <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                      </svg>
                      Key Details
                    </div>
                    {result.inputs.slice(0, 4).map((input, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs bg-white bg-opacity-50 px-2 py-1.5 rounded">
                        <span className="text-gray-600">{input.label}:</span>
                        <span className="font-semibold text-gray-900">{input.value}</span>
                      </div>
                    ))}
                    {result.inputs.length > 4 && (
                      <div className="text-xs text-gray-500 italic text-center pt-1">
                        +{result.inputs.length - 4} more details
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <p className="text-lg font-semibold mb-2">No Results to Compare Yet</p>
          <p className="text-sm">Complete calculations and select them above to start comparing</p>
        </div>
      )}
    </div>
  );
};

export default ResultComparison;