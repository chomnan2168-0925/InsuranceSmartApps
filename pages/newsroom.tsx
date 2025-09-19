import React from 'react';
import CategoryPageTemplate from '@/components/templates/CategoryPageTemplate';
// FIX: Replaced Post with Article for consistency with type definitions.
import { Article } from '@/types';

// FIX: Updated mock data to conform to the Article type by adding 'id' and 'status'.
// Mock data for newsroom posts
const newsroomPosts: Article[] = [
  {
    id: 7,
    slug: 'hybrid-advisor-secures-series-b-funding',
    title: 'Hybrid Advisor Secures $50M in Series B Funding',
    date: '2024-11-01',
    excerpt: 'The new funding will accelerate product development and expand our team of financial experts.',
    imageUrl: '/images/funding.jpg', // Placeholder
    content: 'Detailed content about the funding round...',
    category: 'Newsroom',
    status: 'Published',
  },
  {
    id: 8,
    slug: 'new-cfo-joins-leadership-team',
    title: 'Jane Doe Joins Hybrid Advisor as Chief Financial Officer',
    date: '2024-10-20',
    excerpt: 'With over 20 years of experience in FinTech, Jane will guide the company\'s next phase of growth.',
    imageUrl: '/images/new-cfo.jpg', // Placeholder
    content: 'Detailed content about the new CFO...',
    category: 'Newsroom',
    status: 'Published',
  },
  {
    id: 9,
    slug: 'partnership-with-global-bank',
    title: 'Hybrid Advisor Announces Strategic Partnership with Global Bank',
    date: '2024-09-01',
    excerpt: 'This partnership will bring our hybrid financial planning services to a wider audience.',
    imageUrl: '/images/partnership.jpg', // Placeholder
    content: 'Detailed content about the partnership...',
    category: 'Newsroom',
    status: 'Published',
  },
];

const NewsroomPage = () => {
  const currentPage = 1;
  const totalPages = 1; // Mocking a single page for now

  return (
    <CategoryPageTemplate
      categoryName="Newsroom"
      categoryDescription="The latest announcements, press releases, and company news from Hybrid Advisor."
      posts={newsroomPosts}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
};

export default NewsroomPage;
