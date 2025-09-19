// FIX: Replaced placeholder content with a functional ChartPlaceholder component.
import React from 'react';

interface ChartPlaceholderProps {
  title: string;
  type?: 'line' | 'bar' | 'pie';
}

const ChartPlaceholder: React.FC<ChartPlaceholderProps> = ({ title, type = 'line' }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-navy-blue mb-4">{title}</h3>
      <div className="border border-dashed border-gray-300 bg-gray-50 h-64 flex items-center justify-center text-center text-gray-500 rounded-lg">
        <p>
          Chart Placeholder
          <br />
          ({type} chart)
        </p>
      </div>
    </div>
  );
};

export default ChartPlaceholder;
