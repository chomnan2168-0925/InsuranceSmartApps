// pages/admin0925/pages/advertise.tsx
import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import StaticPageData from '@/data/StaticPageData.json';
import withAuth from '@/components/auth/withAuth';

const AdvertiseEditor = () => {
  const [pageData, setPageData] = useState({
    title: '',
    tagline: '',
    content: '',
    seoTitle: '',
    seoDescription: '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load current data
    setPageData(StaticPageData.advertise);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch('/api/pages/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: 'advertise',
          pageData: pageData,
        }),
      });

      if (response.ok) {
        setMessage('✅ Advertise page updated successfully!');
      } else {
        setMessage('❌ Failed to update page.');
      }
    } catch (error) {
      setMessage('❌ Error saving changes.');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <SectionHeader
        title="Edit Advertise Page"
        subtitle="Update the content that appears on /advertise (form and chart remain unchanged)"
      />

      <div className="bg-white p-6 rounded-lg shadow-md space-y-6 mt-6">
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This editor updates the <strong>text content</strong> only. 
            The contact form, marketing chart, and page layout are controlled by the code in <code>/pages/advertise.tsx</code>
          </p>
        </div>

        {/* Page Title */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Page Title
          </label>
          <input
            type="text"
            value={pageData.title}
            onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Advertise With Us"
          />
        </div>

        {/* Tagline */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Tagline/Subtitle
          </label>
          <input
            type="text"
            value={pageData.tagline}
            onChange={(e) => setPageData({ ...pageData, tagline: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Reach thousands of engaged readers"
          />
        </div>

        {/* Main Content */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Main Content (HTML allowed)
          </label>
          <textarea
            value={pageData.content}
            onChange={(e) => setPageData({ ...pageData, content: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            rows={12}
            placeholder="Enter HTML content here..."
          />
          <p className="text-xs text-gray-500 mt-1">
            You can use HTML tags like &lt;p&gt;, &lt;h2&gt;, &lt;ul&gt;, &lt;strong&gt;, etc.
          </p>
        </div>

        {/* SEO Title */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            SEO Title
          </label>
          <input
            type="text"
            value={pageData.seoTitle}
            onChange={(e) => setPageData({ ...pageData, seoTitle: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Advertise With Us | Your Site Name"
          />
          <p className="text-xs text-gray-500 mt-1">
            Appears in browser tab and search results
          </p>
        </div>

        {/* SEO Description */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            SEO Description
          </label>
          <textarea
            value={pageData.seoDescription}
            onChange={(e) => setPageData({ ...pageData, seoDescription: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="e.g., Partner with us to reach our engaged audience..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Appears in search engine results (recommended: 150-160 characters)
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          {message && (
            <span className="text-sm font-medium">{message}</span>
          )}
        </div>

        {/* Preview Section */}
        <div className="pt-6 border-t">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Content Preview</h3>
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h1 className="text-3xl font-bold text-navy-blue mb-2">{pageData.title}</h1>
            <p className="text-gray-600 mb-4">{pageData.tagline}</p>
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: pageData.content }} 
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuth (AdvertiseEditor);
