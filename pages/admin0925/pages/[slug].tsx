// pages/admin0925/pages/[slug].tsx

import React, { useState } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import SectionHeader from '@/components/ui/SectionHeader';
import StaticPageData from '@/data/StaticPageData.json';
import AdvancedRichTextEditor from '@/components/admin/content/AdvancedRichTextEditor';
import withAuth from '@/components/auth/withAuth';

interface PageData {
  title: string;
  tagline: string;
  content: string;
  seoTitle: string;
  seoDescription: string;
}

const EditStaticPage = ({ page: initialPageData, slug }: { page: PageData, slug: string }) => {
  const router = useRouter();
  
  const [page, setPage] = useState<PageData>(initialPageData);
  const [statusMessage, setStatusMessage] = useState('');

  const handleSave = async () => {
    setStatusMessage('Saving...');
    try {
      const res = await fetch('/api/pages/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, pageData: page }),
      });

      if (res.ok) {
        setStatusMessage('Saved successfully!');
        // Wait a moment before redirecting so the user can see the message
        setTimeout(() => {
          router.push('/admin0925/pages');
        }, 1000);
      } else {
        const error = await res.json();
        setStatusMessage(`Error: ${error.message || 'Failed to save.'}`);
      }
    } catch (error) {
      setStatusMessage('Error: Could not connect to the server.');
    }
  };

  return (
    <>
      <SectionHeader title={`Editing: ${page.title}`} subtitle={`Managing content for the /${slug} page.`} />
      
      <div className="mt-6 space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <label className="block text-sm font-medium">Page Title</label>
          <input 
            type="text" 
            value={page.title} 
            onChange={(e) => setPage({ ...page, title: e.target.value })}
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <label className="block text-sm font-medium">Page Tagline</label>
          <input 
            type="text" 
            value={page.tagline} 
            onChange={(e) => setPage({ ...page, tagline: e.target.value })}
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <label className="block text-sm font-medium mb-2">Page Content</label>
          <AdvancedRichTextEditor 
            value={page.content} 
            onChange={(content) => setPage({ ...page, content: content })} 
          />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <label className="block text-sm font-medium">SEO Title</label>
          <input 
            type="text" 
            value={page.seoTitle} 
            onChange={(e) => setPage({ ...page, seoTitle: e.target.value })}
            className="mt-1 w-full p-2 border rounded-md"
            placeholder="e.g., Page Title | InsuranceSmartCalculator"
          />
          <p className="text-xs text-gray-500 mt-1">
            Appears in browser tab and search results
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <label className="block text-sm font-medium">SEO Description</label>
          <textarea 
            value={page.seoDescription} 
            onChange={(e) => setPage({ ...page, seoDescription: e.target.value })}
            className="mt-1 w-full p-2 border rounded-md"
            rows={3}
            placeholder="e.g., Brief description of the page content..."
          />
          <p className="text-xs text-gray-500 mt-1">
            Appears in search engine results (recommended: 150-160 characters)
          </p>
        </div>

        <div className="flex justify-end items-center gap-4">
          {statusMessage && <p className="text-sm text-gray-600">{statusMessage}</p>}
          <button 
            onClick={() => router.push('/admin0925/pages')} 
            className="px-6 py-2 bg-gray-200 rounded-md font-semibold hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleSave} 
            className="px-6 py-2 bg-gold text-navy-blue rounded-md font-bold hover:bg-yellow-500 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { slug } = context.params!;
  
  // ✅ Redirect special pages with dedicated editors to their specific editor pages
  if (slug === 'advertise' || slug === 'ask-an-expert') {
    return {
      redirect: {
        destination: `/admin0925/pages/${slug}`,
        permanent: false,
      },
    };
  }
  
  const pageData = (StaticPageData as any)[slug as string];

  if (!pageData) { 
    return { notFound: true }; 
  }
  
  return { 
    props: { 
      page: pageData, 
      slug 
    } 
  };
};

export default withAuth(EditStaticPage);