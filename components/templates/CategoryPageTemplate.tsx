import React from 'react';
import Head from 'next/head'; // NEW: Import Head for prev/next link tags
import { Article } from '@/types';
import SEO from '@/components/layout/SEO';
import LayoutWithSidebar from '@/components/layout/LayoutWithSidebar';
import Sidebar from '@/components/layout/Sidebar';
import ArticleCard from '@/components/home/ArticleCard';
import Pagination from '@/components/ui/Pagination';
import PinnedPostCard from '@/components/shared/PinnedPostCard';

interface CategoryPageTemplateProps {
  categoryName: string;
  categoryDescription: string;
  posts: Article[];
  currentPage: number;
  totalPages: number;
  sidebarTopTips: Article[];
  sidebarTopNews: Article[];
  pinnedPosts?: Article[];
}

const CategoryPageTemplate: React.FC<CategoryPageTemplateProps> = ({
  categoryName,
  categoryDescription,
  posts,
  currentPage,
  totalPages,
  sidebarTopTips,
  sidebarTopNews,
  pinnedPosts,
}) => {
  // --- This logic for basePath is correct and remains ---
  const getBasePath = () => {
    if (categoryName === 'Insurance Newsroom') return '/newsroom';
    if (categoryName === 'Insurance Tips') return '/insurance-tips';
    return `/${categoryName.toLowerCase().replace(/\s+/g, '-')}`;
  };
  const basePath = getBasePath();

  // --- NEW: Dynamic metadata logic ---
  const isPaginated = currentPage > 1;
  const siteTitle = 'Insurance SmartApps'; // Or pull from a config file

  // Dynamically create the title based on the page number
  const pageTitle = isPaginated
  ? `${categoryName} - Page ${currentPage}`
  : categoryName;

  // Dynamically create the description based on the page number
  const pageDescription = isPaginated
    ? `Page ${currentPage} of articles about ${categoryName}. ${categoryDescription}`
    : categoryDescription;

  // --- NEW: Logic for generating prev/next link tags ---
  const siteUrl = 'https://www.InsuranceSmartCalculator.com'; // Replace with your actual domain

  // Generate the URL for the previous page, if it exists
  const prevPageUrl = currentPage > 1
    ? (currentPage === 2 ? `${siteUrl}${basePath}` : `${siteUrl}${basePath}/page/${currentPage - 1}`)
    : null;
    
  // Generate the URL for the next page, if it exists
  const nextPageUrl = currentPage < totalPages
    ? `${siteUrl}${basePath}/page/${currentPage + 1}`
    : null;


  // This sr-only logic is fine and can remain
  const seoKeywordsParagraph = () => {
    // ... (your existing seoKeywordsParagraph function is unchanged)
    if (categoryName === 'Insurance Tips') {
      return (
        <p>
          Discover a comprehensive collection of actionable insurance tips designed to help you save money and make confident financial decisions. 
          This hub page is your guide to understanding auto, home, life, and health insurance. 
          Find advice on how to lower your premiums, compare insurance quotes, and choose the right policy.
        </p>
      );
    }
    if (categoryName === 'Insurance Newsroom') {
      return (
        <p>
          Stay informed with the latest insurance industry news and official press releases from Insurance Smart Advisor. 
          This newsroom is your source for market updates, analysis on new regulations, and company announcements to keep you ahead of the curve.
        </p>
      );
    }
    return null;
  };

  return (
    <>
      {/* UPDATED: Pass the new dynamic title and description to the SEO component */}
      <SEO title={pageTitle} description={pageDescription} />

      {/* NEW: Add the crucial prev/next link tags for paginated series */}
      <Head>
        {prevPageUrl && <link rel="prev" href={prevPageUrl} />}
        {nextPageUrl && <link rel="next" href={nextPageUrl} />}
      </Head>

      <LayoutWithSidebar
        sidebar={<Sidebar topTips={sidebarTopTips} topNews={sidebarTopNews} />}
      >
        <div className="flex flex-col flex-grow h-full">
          <div className="flex-grow">
            <div className="space-y-1">
              {/* Your sr-only block is fine here */}
              <div className="sr-only">
                <h2>{categoryName} - Related Keywords and Topics</h2>
                {seoKeywordsParagraph()}
              </div>

              {currentPage === 1 && pinnedPosts && pinnedPosts.length > 0 && (
                <div className="space-y-3">
                  {pinnedPosts.map((post) => (
                    <PinnedPostCard key={post.slug} article={post} />
                  ))}
                </div>
              )}

              {posts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {posts.map((post) => (
                    <ArticleCard key={post.slug} article={post} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-gray-500">No articles found in this category yet.</p>
                </div>
              )}
            </div>
          </div>
          
          {totalPages > 1 && (
            <div className="mt-3">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                basePath={basePath}
              />
            </div>
          )}
        </div>
      </LayoutWithSidebar>
    </>
  );
};

export default CategoryPageTemplate;