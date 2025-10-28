import React from 'react';
import Link from 'next/link';
import SectionHeader from '@/components/ui/SectionHeader';
import StaticPageData from '@/data/StaticPageData.json';
import withAuth from '@/components/auth/withAuth';

const PagesManagementPage = () => {
  const pages = Object.entries(StaticPageData);

  // Define the order you want pages to appear (optional)
  const pageOrder = [
    'about-us',
    'privacy-policy',
    'cookie-policy',
    'terms-of-use',
    'advertise',
    'ask-an-expert'  // ✅ ADD THIS
  ];

  // Sort pages according to the defined order
  const sortedPages = pages.sort((a, b) => {
    const indexA = pageOrder.indexOf(a[0]);
    const indexB = pageOrder.indexOf(b[0]);
    
    // If both pages are in the order array, sort by their position
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    // If only one page is in the order array, it comes first
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    // Otherwise, sort alphabetically
    return a[0].localeCompare(b[0]);
  });

  return (
    <>
      <SectionHeader 
        title="Static Page Management" 
        subtitle="Edit the content of informational pages like 'About Us', 'Privacy Policy', 'Cookie Policy', and 'Terms of Use'." 
      />
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200 bg-gray-50">
                <th className="p-3 font-semibold text-gray-700">Page Title</th>
                <th className="p-3 font-semibold text-gray-700">URL Path</th>
                <th className="p-3 font-semibold text-gray-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedPages.map(([slug, page]) => (
                <tr key={slug} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium">
                    {/* Link to view the public page in a new tab */}
                    <a 
                      href={`/${slug}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-navy-blue hover:text-gold transition-colors inline-flex items-center gap-1"
                      title={`View ${page.title} page`}
                    >
                      {page.title}
                      <svg 
                        className="w-3 h-3 opacity-50" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                        />
                      </svg>
                    </a>
                  </td>

                  <td className="p-3 font-mono text-sm text-gray-600">
                    /{slug}
                  </td>

                  <td className="p-3 text-center">
                    {/* Edit button that links to the admin edit page */}
                    <Link 
                      href={`/admin0925/pages/${slug}`} 
                      className="inline-flex items-center gap-1 px-4 py-2 bg-navy-blue text-white rounded hover:bg-gold transition-colors font-semibold text-sm"
                      title={`Edit ${page.title}`}
                    >
                      <svg 
                        className="w-4 h-4" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                        />
                      </svg>
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Optional: Add a summary footer */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Total Pages: <span className="font-semibold text-navy-blue">{pages.length}</span>
          </p>
        </div>
      </div>
    </>
  );
};

export default withAuth(PagesManagementPage);