// /components/admin/settings/SettingsTabs.tsx

import React from 'react';

interface SettingsTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const TABS = ['General', 'Calculator Data', 'Marketing', 'Ad Management'];

const SettingsTabs: React.FC<SettingsTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200 bg-white px-4 rounded-t-lg shadow-sm">
      <nav className="-mb-px flex space-x-6" aria-label="Tabs">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`${
              activeTab === tab
                ? 'border-gold text-navy-blue'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm focus:outline-none`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default SettingsTabs;