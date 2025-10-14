// /pages/admin0925/settings.tsx

import React, { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
// These imports will now work correctly
import SettingsTabs from '@/components/admin/settings/SettingsTabs';
import GeneralSettingsTab from '@/components/admin/settings/GeneralSettingsTab';
import CalculatorDataTab from '@/components/admin/settings/CalculatorDataTab';
import MarketingTab from '@/components/admin/settings/MarketingTab';
import AdManagerTab from '@/components/admin/settings/AdManagerTab';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('General');

  return (
    <>
      <SectionHeader title="Site Settings" subtitle="Manage global configuration for your website and application." />
      
      {/* The Tab buttons */}
      <div className="mt-4">
        <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* The content for the active tab */}
      <div className="mt-6">
        {activeTab === 'General' && <GeneralSettingsTab />}
        {activeTab === 'Calculator Data' && <CalculatorDataTab />}
        {activeTab === 'Marketing' && <MarketingTab />}
        {activeTab === 'Ad Management' && <AdManagerTab />}
      </div>
    </>
  );
};

export default SettingsPage;