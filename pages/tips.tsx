import React from 'react';
import CategoryPageTemplate from '@/components/templates/CategoryPageTemplate';
// FIX: Replaced Post with Article for consistency with type definitions.
import { Article } from '@/types';

// FIX: Updated mock data to conform to the Article type by adding 'id' and 'status'.
// Mock data for tips posts
const tipsPosts: Article[] = [
  {
    id: 4,
    slug: 'creating-a-budget-that-works',
    title: 'Creating a Budget That Actually Works',
    date: '2024-06-20',
    excerpt: 'A step-by-step guide to building a realistic budget you can stick to for long-term financial health.',
    imageUrl: '/images/budgeting.jpg',
    content: 'Detailed content about budgeting...',
    category: 'Tips',
    status: 'Published',
  },
  {
    id: 5,
    slug: 'understanding-401k-options',
    title: 'Understanding Your 401(k) Options',
    date: '2024-07-15',
    excerpt: 'Maximize your retirement savings by learning the ins and outs of your 401(k) plan.',
    imageUrl: '/images/401k.jpg',
    content: 'Detailed content about 401(k)s...',
    category: 'Tips',
    status: 'Published',
  },
  {
    id: 6,
    slug: 'guide-to-emergency-funds',
    title: 'A Beginner\'s Guide to Building an Emergency Fund',
    date: '2024-08-01',
    excerpt: 'Learn why an emergency fund is crucial and how to start building one today, step by step.',
    imageUrl: '/images/emergency-fund.jpg',
    content: 'Detailed content about emergency funds...',
    category: 'Tips',
    status: 'Published',
  },
];

// In a real app, you'd fetch this from a CMS and handle pagination.
const TipsPage = () => {
  const currentPage = 1;
  const totalPages = 1; // Mocking a single page for now

  return (
    <CategoryPageTemplate
      categoryName="Financial Tips"
      categoryDescription="Practical advice and strategies to help you manage your money and build wealth."
      posts={tipsPosts}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
};

export default TipsPage;
