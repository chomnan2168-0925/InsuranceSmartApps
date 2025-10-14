import React from 'react';

interface LengthIndicatorProps {
  text: string;
  min: number;
  idealMin: number;
  idealMax: number;
  max: number;
  label: string;
}

const LengthIndicator: React.FC<LengthIndicatorProps> = ({ text, min, idealMin, idealMax, max, label }) => {
  const length = text.length;
  let status: 'good' | 'warning' | 'bad' = 'bad';
  let message = '';
  let colorClass = '';

  if (length >= idealMin && length <= idealMax) {
    status = 'good';
    message = `Perfect! Your ${label.toLowerCase()} length is ideal for search engines.`;
    colorClass = 'text-green-600';
  } else if (length >= min && length <= max) {
    status = 'warning';
    message = `Good. Your ${label.toLowerCase()} length is acceptable, but could be optimized to be between ${idealMin} and ${idealMax} characters.`;
    colorClass = 'text-yellow-600';
  } else if (length > 0) {
    status = 'bad';
    message = `Needs improvement. Your ${label.toLowerCase()} is ${length > max ? 'too long' : 'too short'}. Aim for ${idealMin} to ${idealMax} characters.`;
    colorClass = 'text-red-600';
  }

  // Calculate percentage for the progress bar
  const progressPercentage = Math.min((length / idealMax) * 100, 100);
  const progressColorClass = status === 'good' ? 'bg-green-500' : status === 'warning' ? 'bg-yellow-500' : 'bg-red-500';

  return (
    <div className="mt-2">
      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>{label} Length</span>
        <span className={colorClass}>{length} / {idealMax}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
        <div className={`${progressColorClass} h-1.5 rounded-full`} style={{ width: `${progressPercentage}%` }}></div>
      </div>
      {message && <p className={`text-xs mt-1 ${colorClass}`}>{message}</p>}
    </div>
  );
};

export default LengthIndicator;