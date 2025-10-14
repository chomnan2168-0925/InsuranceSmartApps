import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import ArticlePageTemplate from '@/components/templates/ArticlePageTemplate';
import { Article } from '@/types';
import { supabase } from '@/lib/supabaseClient';

interface ArticlePageProps {
  post: Article;
  recommendedPosts: Article[];
  sidebarTopTips: Article[];
  sidebarTopNews: Article[];
  inpostAd?: { code: string; enabled: boolean } | null;
}

const TipArticlePage: React.FC<ArticlePageProps> = (props) => {
  return <ArticlePageTemplate {...props} />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Fetch all published Insurance Tips article slugs
  const { data: articles, error } = await supabase
    .from('articles')
    .select('slug')
    .eq('category', 'Insurance Tips')
    .eq('status', 'Published');

  if (error || !articles) {
    console.error('Error fetching article paths:', error);
    return { paths: [], fallback: 'blocking' };
  }

  const paths = articles.map((post) => ({
    params: { slug: post.slug },
  }));

  return { 
    paths, 
    fallback: 'blocking' // Generate pages on-demand for new articles
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  // Fetch the main article with author information
  const { data: post, error } = await supabase
    .from('articles')
    .select(`
      *,
      profiles:author_id (
        id,
        name
      )
    `)
    .eq('slug', slug)
    .eq('category', 'Insurance Tips')
    .eq('status', 'Published')
    .single();
  
  if (error || !post) {
    console.error('Error fetching article:', error);
    return { notFound: true };
  }

  // Transform author data
  if (post.profiles) {
    post.author = {
      name: post.profiles.name,
      avatarUrl: '/images/default-avatar.png',
    };
    delete post.profiles; // Clean up the join data
  }

  // Ensure date field for backwards compatibility
  post.date = post.published_date || post.created_at;

  // Fetch recommended posts (same category, exclude current)
  const { data: recommendedData } = await supabase
    .from('articles')
    .select(`
      id,
      slug,
      title,
      excerpt,
      imageUrl,
      category,
      created_at,
      published_date,
      tags
    `)
    .eq('status', 'Published')
    .eq('category', 'Insurance Tips')
    .neq('id', post.id)
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch sidebar tips
  const { data: sidebarTipsData } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, imageUrl, category, created_at, published_date')
    .eq('status', 'Published')
    .eq('category', 'Insurance Tips')
    .neq('id', post.id)
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch sidebar news
  const { data: sidebarNewsData } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, imageUrl, category, created_at, published_date')
    .eq('status', 'Published')
    .eq('category', 'Insurance Newsroom')
    .neq('id', post.id)
    .order('created_at', { ascending: false })
    .limit(3);

// 🆕 Fetch ad slots data
const { data: adData } = await supabase
  .from('site_settings')
  .select('value')
  .eq('key', 'ad_slots')
  .single();

const adSlots = adData?.value || {};
const inpostAd = adSlots.inpost || null;

  // Transform dates for all fetched articles
  const transformDates = (articles: any[]) => 
    articles.map(a => ({ ...a, date: a.published_date || a.created_at }));

  return {
    props: {
      post,
      recommendedPosts: transformDates(recommendedData || []),
      sidebarTopTips: transformDates(sidebarTipsData || []),
      sidebarTopNews: transformDates(sidebarNewsData || []),
      inpostAd,
    },
    revalidate: 600, // Re-generate every 10 minutes
  };
};

export default TipArticlePage;