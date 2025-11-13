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

  // ✅ FIXED: Using camelCase field names
  const { data: post, error } = await supabase
    .from('articles')
    .select(`
      *,
      author:profiles!author_id (
        id,
        name,
        role,
        bio,
        avatarUrl,
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

  // ✅ FIXED: Using camelCase field names
  post.date = post.publishedDate || post.createdAt;

  // ✅ FIXED: Using camelCase field names
  let { data: recommendedData } = await supabase
    .from('articles')
    .select(`
      id,
      slug,
      title,
      excerpt,
      imageUrl,
      category,
      createdAt,
      publishedDate,
      tags,
      label,
      featuredLocations,
      author:profiles!author_id (
        id,
        name
      )
    `)
    .eq('status', 'Published')
    .eq('label', "Don't Miss!");
  
  // ✅ FIXED: Using camelCase field names
  if (recommendedData && recommendedData.length > 0) {
    recommendedData = recommendedData.filter(article => {
      if (!article.featuredLocations) return false;
      
      if (Array.isArray(article.featuredLocations)) {
        return article.featuredLocations.includes('Article View Pages');
      }
      
      if (typeof article.featuredLocations === 'string') {
        return article.featuredLocations.includes('Article View Pages');
      }
      
      return false;
    });
  }

  // ✅ FIXED: Using camelCase field names
  const { data: sidebarTipsData } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, imageUrl, category, createdAt, publishedDate')
    .eq('status', 'Published')
    .eq('category', 'Insurance Tips')
    .order('createdAt', { ascending: false })
    .limit(3);

  // ✅ FIXED: Using camelCase field names
  const { data: sidebarNewsData } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, imageUrl, category, createdAt, publishedDate')
    .eq('status', 'Published')
    .eq('category', 'Insurance Newsroom')
    .neq('id', post.id)
    .order('createdAt', { ascending: false })
    .limit(3);

  // Fetch ad slots data
  const { data: adData } = await supabase
    .from('site_settings')
    .select('value')
    .eq('key', 'ad_slots')
    .single();

  const adSlots = adData?.value || {};
  const inpostAd = adSlots.inpost || null;

  // ✅ FIXED: Using camelCase field names
  const transformDates = (articles: any[]) => 
    articles.map(a => ({ ...a, date: a.publishedDate || a.createdAt }));

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
