
import React, { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import GeneralSettings from './GeneralSettings';
import MarketingReports from './MarketingReports';
import CalculatorData from './CalculatorData';

type Tab = 'general' | 'reports' | 'calculators';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<Tab>('general');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general':
        return <GeneralSettings />;
      case 'reports':
        return <MarketingReports />;
      case 'calculators':
          return <CalculatorData />;
      default:
        return <GeneralSettings />;
    }
  };

  const TabButton = ({ tab, label }: { tab: Tab, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        activeTab === tab ? 'bg-navy-blue text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-8">
      <SectionHeader title="Settings" subtitle="Manage website configuration and data." className="text-left mb-6" />

      <div className="flex items-center space-x-2 border-b pb-2">
        <TabButton tab="general" label="General" />
        <TabButton tab="reports" label="Marketing Reports" />
        <TabButton tab="calculators" label="Calculator Data" />
      </div>

      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default SettingsPage;
