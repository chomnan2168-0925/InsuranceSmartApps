import React from 'react';

interface RateBenchmarkProps {
  userRate: number;
  averageRate: number;
}

const RateBenchmark: React.FC<RateBenchmarkProps> = ({ userRate, averageRate }) => {
  const difference = userRate - averageRate;
  const percentageDiff = (difference / averageRate) * 100;
  const isAboveAverage = difference > 0;

  return (
    <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
      <h4 className="text-md font-semibold text-center text-gray-800 mb-2">How Your Rate Compares</h4>
      <div className="flex justify-around items-center text-center">
        <div>
          <p className="text-sm text-gray-500">Your Estimate</p>
          <p className="text-xl font-bold text-navy-blue">${userRate.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">State Average</p>
          <p className="text-xl font-bold text-gray-700">${averageRate.toFixed(2)}</p>
        </div>
      </div>
      <div className="text-center mt-3 text-sm">
        {Math.abs(percentageDiff) < 1 ? (
          <p>Your estimated rate is about average.</p>
        ) : (
          <p>
            Your estimated rate is{' '}
            <span className={`font-bold ${isAboveAverage ? 'text-red-600' : 'text-green-600'}`}>
              {Math.abs(percentageDiff).toFixed(0)}% {isAboveAverage ? 'above' : 'below'}
            </span>{' '}
            the state average.
          </p>
        )}
      </div>
    </div>
  );
};

export default RateBenchmark;
