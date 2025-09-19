// FIX: Replaced placeholder content with a complete, functional Dashboard component for the admin panel.
import React from 'react';
import StatCard from './ui/StatCard';
import SectionHeader from '../ui/SectionHeader';

const Dashboard = () => {
  // Mock data for the dashboard
  const stats = [
    { title: 'Total Posts', value: '42', change: '+2 this week' },
    { title: 'New Users', value: '1,280', change: '+15% this month' },
    { title: 'Form Submissions', value: '312', change: '5 new today' },
    { title: 'Site Visitors (24h)', value: '15,678', change: '+5.2%' },
  ];

  const recentActivity = [
    { action: 'New post published:', item: 'Market Outlook Q4 2024', time: '2h ago' },
    { action: 'New user registered:', item: 'test@example.com', time: '3h ago' },
    { action: 'Expert question submitted:', item: 'Retirement Planning', time: '5h ago' },
  ];

  return (
    <div className="space-y-8">
      <SectionHeader title="Admin Dashboard" subtitle="Overview of website activity." className="text-left mb-6" />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <StatCard key={index} title={stat.title} value={stat.value} change={stat.change} />
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold text-navy-blue mb-4">Recent Activity</h3>
        <ul className="divide-y divide-gray-200">
          {recentActivity.map((activity, index) => (
            <li key={index} className="py-3 flex justify-between items-center">
              <div>
                <span className="font-semibold text-gray-800">{activity.action}</span>
                <span className="text-gray-600 ml-2">{activity.item}</span>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
