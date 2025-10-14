// FIX: Replaced placeholder content with a complete, functional StatCard UI component.
import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, change }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h4 className="text-sm font-medium text-gray-500">{title}</h4>
      <p className="text-xl font-bold text-navy-blue mt-1">{value}</p>
      {change && <p className="text-xs text-gray-500 mt-2">{change}</p>}
    </div>
  );
};

export default StatCard;
