// FIX: Replaced placeholder content with a functional AnalyticsDashboard component.
import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import StatCard from '../ui/StatCard';
import ChartPlaceholder from './ChartPlaceholder';

const AnalyticsDashboard = () => {
  return (
    <div className="space-y-8">
      <SectionHeader title="Analytics" subtitle="Website performance and user engagement." className="text-left mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Unique Visitors (30d)" value="1.2M" change="+8.1%" />
        <StatCard title="Page Views (30d)" value="4.9M" change="+12.3%" />
        <StatCard title="Bounce Rate" value="45.2%" change="-2.5%" />
        <StatCard title="Avg. Session" value="3m 15s" change="+12s" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChartPlaceholder title="Visitors Over Time" />
        <ChartPlaceholder title="Traffic Sources" type="pie" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-navy-blue mb-4">Top Content</h3>
        <ul className="divide-y divide-gray-200">
            <li className="py-2 flex justify-between"><span>/tips/understanding-401k-options</span> <span>320k views</span></li>
            <li className="py-2 flex justify-between"><span>/</span> <span>280k views</span></li>
            <li className="py-2 flex justify-between"><span>/ask-an-expert</span> <span>250k views</span></li>
            <li className="py-2 flex justify-between"><span>/news</span> <span>198k views</span></li>
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
