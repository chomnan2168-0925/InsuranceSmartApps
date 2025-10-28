// /pages/admin0925/settings.tsx
import React, { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
// Existing imports
import SettingsTabs from '@/components/admin/settings/SettingsTabs';
import GeneralSettingsTab from '@/components/admin/settings/GeneralSettingsTab';
import CalculatorDataTab from '@/components/admin/settings/CalculatorDataTab';
import MarketingTab from '@/components/admin/settings/MarketingTab';
import AdManagerTab from '@/components/admin/settings/AdManagerTab';
import CookieBannerTab from '@/components/admin/settings/CookieBannerTab';
// ⭐ NEW: Import for Authors tab
import AuthorsTab from '@/components/admin/settings/AuthorsTab';
import withAuth from '@/components/auth/withAuth';

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
        {activeTab === 'Cookie Banner' && <CookieBannerTab />}
        {activeTab === 'Calculator Data' && <CalculatorDataTab />}
        {activeTab === 'Marketing' && <MarketingTab />}
        {activeTab === 'Ad Management' && <AdManagerTab />}
        {/* ⭐ NEW: Add Authors tab rendering */}
        {activeTab === 'Authors' && <AuthorsTab />}
      </div>
    </>
  );
};

export default withAuth(SettingsPage);