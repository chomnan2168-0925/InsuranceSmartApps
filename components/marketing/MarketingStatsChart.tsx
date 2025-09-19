// FIX: Replaced placeholder content with a MarketingStatsChart component.
import React from 'react';

// FIX: Changed component to React.FC to correctly handle props like 'key' from .map().
const StatBar: React.FC<{ label: string, value: string, percentage: number, color: string }> = ({ label, value, percentage, color }) => (
  <div className="flex items-center space-x-4">
    <div className="w-24 text-sm font-medium text-gray-600 shrink-0">{label}</div>
    <div className="flex-1 bg-gray-200 rounded-full h-6">
      <div
        className={`${color} h-6 rounded-full flex items-center justify-end pr-2 text-white text-xs font-bold`}
        style={{ width: `${percentage}%` }}
      >
        {value}
      </div>
    </div>
  </div>
);

const MarketingStatsChart = () => {
  const stats = [
    { label: 'Monthly Visitors', value: '500,000+', percentage: 95, color: 'bg-navy-blue' },
    { label: 'Subscribers', value: '75,000+', percentage: 80, color: 'bg-blue-600' },
    { label: 'Avg. HHI', value: '$120k+', percentage: 85, color: 'bg-blue-500' },
    { label: 'Age 35-55', value: '65%', percentage: 65, color: 'bg-blue-400' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-navy-blue border-b-2 border-gold pb-2 mb-6">
        Our Audience at a Glance
      </h3>
      <div className="space-y-4">
        {stats.map(stat => (
          <StatBar key={stat.label} {...stat} />
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center">*Data is based on internal analytics.</p>
    </div>
  );
};

export default MarketingStatsChart;