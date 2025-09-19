import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import ArticlePageTemplate from '@/components/templates/ArticlePageTemplate';
// FIX: Replaced Post with Article for consistency with type definitions.
import { Article } from '@/types';

// FIX: Updated mock data to conform to the Article type by adding 'id' and 'status'.
// Mock data store for all tips articles
const allTipsPosts: Article[] = [
  {
    id: 13,
    slug: 'creating-a-budget-that-works',
    title: 'Creating a Budget That Actually Works',
    date: '2024-06-20',
    excerpt: 'A step-by-step guide to building a realistic budget you can stick to for long-term financial health.',
    imageUrl: '/images/budgeting.jpg',
    content: `<p>Budgeting is the cornerstone of financial health. Here's a simple, effective method to get started...</p>`,
    category: 'Tips',
    status: 'Published',
    tags: ['Budgeting', 'Personal Finance'],
    author: { name: 'Alice Smith', avatarUrl: '/images/authors/alice-smith.jpg' }
  },
  {
    id: 14,
    slug: 'understanding-401k-options',
    title: 'Understanding Your 401(k) Options',
    date: '2024-07-15',
    excerpt: 'Maximize your retirement savings by learning the ins and outs of your 401(k) plan.',
    imageUrl: '/images/401k.jpg',
    content: `<p>Your 401(k) is a powerful retirement tool. Let's break down concepts like matching, vesting, and investment choices...</p>`,
    category: 'Tips',
    status: 'Published',
    tags: ['Retirement', 'Investing', '401k'],
    author: { name: 'Bob Johnson', avatarUrl: '/images/authors/bob-johnson.jpg' }
  },
  {
    id: 15,
    slug: 'guide-to-emergency-funds',
    title: 'A Beginner\'s Guide to Building an Emergency Fund',
    date: '2024-08-01',
    excerpt: 'Learn why an emergency fund is crucial and how to start building one today, step by step.',
    imageUrl: '/images/emergency-fund.jpg',
    content: `<p>Life is unpredictable. An emergency fund is your financial safety net. We'll show you how to build one...</p>`,
    category: 'Tips',
    status: 'Published',
    tags: ['Savings', 'Emergency Fund', 'Financial Planning'],
    author: { name: 'Alice Smith', avatarUrl: '/images/authors/alice-smith.jpg' }
  },
];


const TipArticlePage = ({ post, recommendedPosts }) => {
  if (!post) return <div>Post not found.</div>;
  return <ArticlePageTemplate post={post} recommendedPosts={recommendedPosts} />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  // In a real app, you'd fetch slugs from a CMS
  const paths = allTipsPosts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // In a real app, you'd fetch a single post by slug
  const post = allTipsPosts.find((p) => p.slug === params.slug);
  // Get other posts for the "recommended" section, excluding the current one
  const recommendedPosts = allTipsPosts.filter((p) => p.slug !== params.slug).slice(0, 2);

  return {
    props: {
      post,
      recommendedPosts,
    },
  };
};

export default TipArticlePage;
