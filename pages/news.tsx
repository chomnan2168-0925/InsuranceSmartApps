// FIX: Replaced placeholder content with a functional News category page.
import React from 'react';
import CategoryPageTemplate from '@/components/templates/CategoryPageTemplate';
// FIX: Replaced Post with Article for consistency with type definitions.
import { Article } from '@/types';

// FIX: Updated mock data to conform to the Article type by adding 'id' and 'status'.
// Mock data for news posts
const newsPosts: Article[] = [
  {
    id: 1,
    slug: 'market-outlook-q4-2024',
    title: 'Market Outlook for Q4 2024: Trends to Watch',
    date: '2024-10-01',
    excerpt: 'As we head into the final quarter, experts weigh in on potential market shifts and opportunities.',
    imageUrl: '/images/market-trends.jpg', // Placeholder image
    content: 'Detailed content about market trends...',
    category: 'News',
    status: 'Published',
  },
  {
    id: 2,
    slug: 'new-retirement-legislation-impact',
    title: 'New Legislation Could Impact Your Retirement Strategy',
    date: '2024-09-15',
    excerpt: 'A breakdown of the recent SECURE 3.0 Act and what it means for your savings.',
    imageUrl: '/images/legislation.jpg', // Placeholder image
    content: 'Detailed content about the legislation...',
    category: 'News',
    status: 'Published',
  },
  {
    id: 3,
    slug: 'fintech-innovations-2024',
    title: 'Top FinTech Innovations Changing Personal Finance',
    date: '2024-09-05',
    excerpt: 'From AI advisors to new payment platforms, here\'s what\'s new in the world of financial technology.',
    imageUrl: '/images/fintech.jpg', // Placeholder image
    content: 'Detailed content about fintech...',
    category: 'News',
    status: 'Published',
  },
];

// In a real app, you'd fetch this from a CMS and handle pagination.
const NewsPage = () => {
  const currentPage = 1;
  const totalPages = 1; // Mocking a single page for now

  return (
    <CategoryPageTemplate
      categoryName="News"
      categoryDescription="The latest news and updates from the world of finance and investment."
      posts={newsPosts}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
};

export default NewsPage;
