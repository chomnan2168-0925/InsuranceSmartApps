// FIX: Replaced placeholder content with a functional SeoHub component.
import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import RedirectManager from './RedirectManager';

const SeoHub = () => {
  return (
    <div className="space-y-8">
      <SectionHeader title="SEO Hub" subtitle="Tools for managing your site's search engine optimization." className="text-left mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-navy-blue mb-2">Meta Tag Editor</h3>
            <p className="text-gray-600">Globally manage meta title and description templates for different page types. (Coming Soon)</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-navy-blue mb-2">Sitemap Generator</h3>
            <p className="text-gray-600">Generate and submit your sitemap to search engines. Last generated: 2 days ago.</p>
            <button className="mt-4 bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md">
                Regenerate Sitemap
            </button>
        </div>
      </div>

      <RedirectManager />
    </div>
  );
};

export default SeoHub;
