// /components/calculators/RateBenchmark.tsx
import React from 'react';

interface RateBenchmarkProps {
  userRate: number;
  averageRate: number;
}

const RateBenchmark: React.FC<RateBenchmarkProps> = ({ userRate, averageRate }) => {
  const difference = userRate - averageRate;
  const isAboveAverage = difference > 0;
  const percentDiff = ((Math.abs(difference) / averageRate) * 100).toFixed(0);
  
  const maxValue = Math.max(userRate, averageRate) * 1.1;
  const userBarWidth = (userRate / maxValue) * 100;
  const averageBarWidth = (averageRate / maxValue) * 100;

  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white text-2xl">
          📊
        </div>
        <h4 className="text-xl font-bold text-gray-800">How You Compare</h4>
      </div>

      <div className="space-y-4">
        {/* Your Estimate Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Your Estimate
            </span>
            <span className="font-bold text-blue-600 text-xl">${userRate.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-6 rounded-full transition-all duration-1000 flex items-center justify-end pr-2" 
              style={{ width: `${userBarWidth}%` }}
            >
              <span className="text-white text-xs font-bold">You</span>
            </div>
          </div>
        </div>
        
        {/* State Average Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-700 flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
              State Average
            </span>
            <span className="font-bold text-gray-700 text-xl">${averageRate.toFixed(2)}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden shadow-inner">
            <div 
              className="bg-gradient-to-r from-gray-400 to-gray-500 h-6 rounded-full transition-all duration-1000 flex items-center justify-end pr-2" 
              style={{ width: `${averageBarWidth}%` }}
            >
              <span className="text-white text-xs font-bold">Avg</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analysis Card */}
      <div className={`
        mt-6 p-4 rounded-xl border-2 transition-all duration-300
        ${Math.abs(difference) < 5 
          ? 'bg-yellow-50 border-yellow-300' 
          : isAboveAverage 
            ? 'bg-orange-50 border-orange-300' 
            : 'bg-green-50 border-green-300'
        }
      `}>
        <div className="flex items-start gap-3">
          <div className="text-3xl flex-shrink-0">
            {Math.abs(difference) < 5 ? '⚖️' : isAboveAverage ? '📈' : '🎉'}
          </div>
          <div className="flex-1">
            {Math.abs(difference) < 5 ? (
              <>
                <p className="font-bold text-yellow-800 mb-1">Right On Target!</p>
                <p className="text-sm text-yellow-700">
                  Your estimated rate is right around the state average. You're getting a fair deal!
                </p>
              </>
            ) : isAboveAverage ? (
              <>
                <p className="font-bold text-orange-800 mb-1">
                  {percentDiff}% Above Average
                </p>
                <p className="text-sm text-orange-700">
                  Your rate is higher than average. This could be due to your vehicle type, coverage choices, or location.
                  <span className="font-semibold text-orange-900"> Our advisors can help find hidden discounts to lower your rate!</span>
                </p>
              </>
            ) : (
              <>
                <p className="font-bold text-green-800 mb-1">
                  Excellent! {percentDiff}% Below Average 🎊
                </p>
                <p className="text-sm text-green-700">
                  You're getting a great rate! This is likely thanks to your clean driving record, safety features, or bundled discounts. Keep up the good work!
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      <div className="mt-4 p-4 bg-white rounded-lg border border-gray-200">
        <p className="text-sm font-semibold text-gray-700 mb-2">💡 Ways to Lower Your Rate:</p>
        <ul className="text-xs text-gray-600 space-y-1">
          <li>• Bundle home and auto insurance for up to 25% savings</li>
          <li>• Increase your deductible to lower monthly premiums</li>
          <li>• Ask about low-mileage or usage-based discounts</li>
          <li>• Maintain a clean driving record for safe driver discounts</li>
        </ul>
      </div>
    </div>
  );
};

export default RateBenchmark;