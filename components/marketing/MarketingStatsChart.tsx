import React from 'react';

// Define the structure for the stats data
export interface MarketingStat {
  label: string;
  value: string;
  percentage: number;
  color: string;
}

interface MarketingStatsChartProps {
  stats: MarketingStat[];
}

const StatBar: React.FC<MarketingStat> = ({ label, value, percentage, color }) => (
  <div className="flex items-center space-x-4">
    <div className="w-32 text-sm font-medium text-gray-600 shrink-0">{label}</div>
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

const MarketingStatsChart: React.FC<MarketingStatsChartProps> = ({ stats }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <h3 className="text-xl font-bold text-navy-blue border-b-2 border-gold pb-2 mb-6">
        Our Audience at a Glance
      </h3>
      <div className="space-y-4">
        {stats.map((stat) => (
          <StatBar key={stat.label} {...stat} />
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-4 text-center">
        *Data is based on internal analytics and subject to change.
      </p>
    </div>
  );
};

export default MarketingStatsChart;
