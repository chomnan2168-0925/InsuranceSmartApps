import React from 'react';
import CategoryPageTemplate from '@/components/templates/CategoryPageTemplate';
import { Article } from '@/types';
import { GetStaticProps } from 'next';
import { supabase } from '@/lib/supabaseClient';

const POSTS_PER_PAGE = 12;

interface NewsroomPageProps {
  posts: Article[];
  pinnedPosts: Article[];
  currentPage: number;
  totalPages: number;
  sidebarTopTips: Article[];
  sidebarTopNews: Article[];
}

const NewsroomPage: React.FC<NewsroomPageProps> = (props) => {
  return (
    <CategoryPageTemplate
      categoryName="Insurance Newsroom"
      categoryDescription="Stay informed with the latest insurance industry news, press releases, and company announcements. Get expert analysis on market trends and regulatory updates."
      {...props}
    />
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // ✅ FIXED: Use camelCase field names
  const { data: newsroomPosts, error: newsError } = await supabase
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
      label,
      tags,
      author:profiles!author_id (
        id,
        name,
        avatarUrl
      )
    `)
    .eq('category', 'Insurance Newsroom')
    .eq('status', 'Published')
    .order('createdAt', { ascending: false })
    .limit(50);

  // ✅ FIXED: Use camelCase field names
  const { data: tipsPosts, error: tipsError } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, imageUrl, category, createdAt, publishedDate')
    .eq('category', 'Insurance Tips')
    .eq('status', 'Published')
    .order('createdAt', { ascending: false })
    .limit(3);

  if (newsError || !newsroomPosts) {
    console.error('Error fetching articles:', newsError);
    return { 
      props: { 
        posts: [], 
        pinnedPosts: [], 
        currentPage: 1, 
        totalPages: 1, 
        sidebarTopTips: [], 
        sidebarTopNews: [] 
      },
      revalidate: 600
    };
  }

  // ✅ FIXED: Use camelCase field names
  const transformedNews = newsroomPosts.map(post => ({
    ...post,
    date: post.publishedDate || post.createdAt,
  }));

  const transformedTips = (tipsPosts || []).map(post => ({
    ...post,
    date: post.publishedDate || post.createdAt,
  }));
  
  const { count: totalNewsCount } = await supabase
    .from('articles')
    .select('id', { count: 'exact', head: true })
    .eq('category', 'Insurance Newsroom')
    .eq('status', 'Published');
    
  const totalPages = Math.ceil((totalNewsCount || 0) / POSTS_PER_PAGE);

  const pinnedPosts = transformedNews.filter(p => p.label === 'Most Read' || p.label === 'Sponsored');
  const paginatedPosts = transformedNews.slice(0, POSTS_PER_PAGE);
  const sidebarTopNews = transformedNews.slice(0, 3);

  return {
    props: {
      posts: paginatedPosts,
      pinnedPosts,
      currentPage: 1,
      totalPages,
      sidebarTopTips: transformedTips,
      sidebarTopNews,
    },
    revalidate: 600,
  };
};

export default NewsroomPage;
