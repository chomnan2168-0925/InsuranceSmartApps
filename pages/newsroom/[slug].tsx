import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import ArticlePageTemplate from '@/components/templates/ArticlePageTemplate';
// FIX: Replaced Post with Article for consistency with type definitions.
import { Article } from '@/types';

// FIX: Updated mock data to conform to the Article type by adding 'id' and 'status'.
// Mock data store for all newsroom articles
const allNewsroomPosts: Article[] = [
  {
    id: 10,
    slug: 'hybrid-advisor-secures-series-b-funding',
    title: 'Hybrid Advisor Secures $50M in Series B Funding',
    date: '2024-11-01',
    excerpt: 'The new funding will accelerate product development and expand our team of financial experts.',
    imageUrl: '/images/funding.jpg',
    content: `
      <p>We are thrilled to announce that Hybrid Advisor has successfully closed a $50 million Series B funding round. This investment will be instrumental in accelerating our product development pipeline, enhancing our AI-driven advisory tools, and expanding our world-class team of financial experts.</p>
      <p>The round was led by FutureGrowth Ventures, with participation from existing investors. This new capital underscores the confidence our partners have in our mission to democratize financial planning.</p>
    `,
    category: 'Newsroom',
    status: 'Published',
    tags: ['Funding', 'Growth', 'Investment'],
    author: { name: 'John Doe', avatarUrl: '/images/authors/john-doe.jpg' }
  },
  {
    id: 11,
    slug: 'new-cfo-joins-leadership-team',
    title: 'Jane Doe Joins Hybrid Advisor as Chief Financial Officer',
    date: '2024-10-20',
    excerpt: 'With over 20 years of experience in FinTech, Jane will guide the company\'s next phase of growth.',
    imageUrl: '/images/new-cfo.jpg',
    content: `<p>Hybrid Advisor is proud to welcome Jane Doe to our executive team as the new Chief Financial Officer. Jane brings over two decades of financial leadership experience in the FinTech sector, having previously served at several high-growth startups and public companies.</p>`,
    category: 'Newsroom',
    status: 'Published',
    tags: ['Team', 'Leadership'],
    author: { name: 'John Doe', avatarUrl: '/images/authors/john-doe.jpg' }
  },
  {
    id: 12,
    slug: 'partnership-with-global-bank',
    title: 'Hybrid Advisor Announces Strategic Partnership with Global Bank',
    date: '2024-09-01',
    excerpt: 'This partnership will bring our hybrid financial planning services to a wider audience.',
    imageUrl: '/images/partnership.jpg',
    content: `<p>We are excited to announce a strategic partnership with a leading global bank. This collaboration will integrate Hybrid Advisor's platform into the bank's digital offerings, providing millions of customers with access to our unique blend of human and automated financial advice.</p>`,
    category: 'Newsroom',
    status: 'Published',
    tags: ['Partnership', 'Business'],
    author: { name: 'John Doe', avatarUrl: '/images/authors/john-doe.jpg' }
  },
];


const NewsroomArticlePage = ({ post, recommendedPosts }) => {
  if (!post) return <div>Post not found.</div>;
  return <ArticlePageTemplate post={post} recommendedPosts={recommendedPosts} />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  // In a real app, you'd fetch slugs from a CMS
  const paths = allNewsroomPosts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: false };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  // In a real app, you'd fetch a single post by slug
  const post = allNewsroomPosts.find((p) => p.slug === params.slug);
  // Get other posts for the "recommended" section, excluding the current one
  const recommendedPosts = allNewsroomPosts.filter((p) => p.slug !== params.slug).slice(0, 3);

  return {
    props: {
      post,
      recommendedPosts,
    },
  };
};

export default NewsroomArticlePage;
