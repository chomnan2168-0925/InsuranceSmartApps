// /components/admin/seo/SeoHub.tsx

import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import RedirectManager from './RedirectManager';
import AdvancedSeoTools from './AdvancedSeoTools';
import Tooltip from '@/components/ui/Tooltip';
import ContentAuditTool from './ContentAuditTool';
// NEW: Import the new component for managing global settings
import GlobalSeoSettings from './GlobalSeoSettings';
import TagManager from './TagManager';

const SeoHub = () => {
  return (
    <div className="space-y-8"> {/* Increased spacing for better section separation */}
      <SectionHeader 
        title="SEO Hub" 
        subtitle="The central control panel for your website's search engine optimization."
      />

      {/* REPLACEMENT: The old info box is replaced with the new, functional component */}
      <GlobalSeoSettings />
      
      {/* Your existing components remain */}
      <AdvancedSeoTools />
      <ContentAuditTool />

<div>
        <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Topic Tag Manager</h2>
            <Tooltip text="Manage your topic tags to build strong content clusters and improve internal linking, which are crucial for SEO." />
        </div>
        <TagManager />
      </div>

      <div>
        <div className="flex items-center space-x-2 mb-4">
            <h2 className="text-2xl font-bold text-gray-800">URL Redirect Manager</h2>
            <Tooltip text="Forward an old or broken URL to a new page to preserve SEO value and prevent '404 Not Found' errors." />
        </div>
        <RedirectManager />
      </div>
    </div>
  );
};

export default SeoHub;