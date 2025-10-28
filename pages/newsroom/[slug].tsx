import { GetStaticPaths, GetStaticProps } from 'next';
import React from 'react';
import ArticlePageTemplate from '@/components/templates/ArticlePageTemplate';
import { Article } from '@/types';
import { supabase } from '@/lib/supabaseClient';

interface NewsroomArticlePageProps {
  post: Article;
  recommendedPosts: Article[];
  sidebarTopTips: Article[];
  sidebarTopNews: Article[];
  inpostAd?: { code: string; enabled: boolean } | null;
}

const NewsroomArticlePage: React.FC<NewsroomArticlePageProps> = (props) => {
  return <ArticlePageTemplate {...props} />;
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { data: articles, error } = await supabase
    .from('articles')
    .select('slug')
    .eq('category', 'Insurance Newsroom')
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
    fallback: 'blocking'
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string;

  // Fetch article with FULL author information
  const { data: post, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:profiles!author_id (
        id,
        name,
        role,
        bio,
        avatar_url,
        specialty,
        credentials
      )
    `)
    .eq('slug', slug)
    .eq('category', 'Insurance Newsroom')
    .eq('status', 'Published')
    .single();
  
  if (error || !post) {
    console.error('Error fetching article:', error);
    return { notFound: true };
  }

  post.date = post.published_date || post.created_at;

  // Fetch manually assigned "Don't Miss!" articles for Article View Pages
  let { data: recommendedData } = await supabase
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
      tags,
      label,
      featured_locations,
      author:profiles!author_id (
        id,
        name
      )
    `)
    .eq('status', 'Published')
    .eq('label', "Don't Miss!");
  
  // Filter for articles assigned to "Article View Pages"
  if (recommendedData && recommendedData.length > 0) {
    recommendedData = recommendedData.filter(article => {
      if (!article.featured_locations) return false;
      
      if (Array.isArray(article.featured_locations)) {
        return article.featured_locations.includes('Article View Pages');
      }
      
      if (typeof article.featured_locations === 'string') {
        return article.featured_locations.includes('Article View Pages');
      }
      
      return false;
    });
  }

  // Fetch sidebar tips
  const { data: sidebarTipsData } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, imageUrl, category, created_at, published_date')
    .eq('status', 'Published')
    .eq('category', 'Insurance Tips')
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch sidebar news (excluding current article)
  const { data: sidebarNewsData } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, imageUrl, category, created_at, published_date')
    .eq('status', 'Published')
    .eq('category', 'Insurance Newsroom')
    .neq('id', post.id)
    .order('created_at', { ascending: false })
    .limit(3);

  // Fetch ad slots data
  const { data: adData } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'ad_slots')
    .single();

  const adSlots = adData?.value || {};
  const inpostAd = adSlots.inpost || null;

  // Transform dates
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
    revalidate: 600,
  };
};

export default NewsroomArticlePage;