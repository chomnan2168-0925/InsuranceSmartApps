import React from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import StaticPageData from '@/data/StaticPageData.json';

const PagesManagementPage = () => {
  const pages = Object.entries(StaticPageData);

  return (
 <>
      <SectionHeader title="Static Page Management" subtitle="Edit the content of informational pages like 'Our Story' and 'Privacy Policy'." />
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b">
                <th className="p-3 font-semibold">Page Title</th>
                <th className="p-3 font-semibold">URL Path</th>
                <th className="p-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.map(([slug, page]) => (
                <tr key={slug} className="border-b hover:bg-gray-50">
                  
                  {/* === START OF THE FIX === */}
                  <td className="p-3 font-medium">
                    {/* The link now points to the public URL and opens in a new tab */}
                    <a 
                      href={`/${slug}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-navy-blue hover:text-gold transition-colors"
                    >
                      {page.title}
                    </a>
                  </td>
                  {/* === END OF THE FIX === */}

                  <td className="p-3 font-mono text-sm">/{slug}</td>
                  <td className="p-3">
                    {/* This "Edit" link remains the same, pointing to the admin page */}
                    <Link href={`/admin0925/pages/${slug}`} className="text-navy-blue font-semibold hover:underline">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default PagesManagementPage;