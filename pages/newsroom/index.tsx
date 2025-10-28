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
  // ✅ OPTIMIZED: Fetch only Newsroom posts with minimal fields for listing
  const { data: newsroomPosts, error: newsError } = await supabase
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
      label,
      tags,
      author:profiles!author_id (
        id,
        name,
        avatar_url
      )
    `)
    .eq('category', 'Insurance Newsroom')
    .eq('status', 'Published')
    .order('created_at', { ascending: false })
    .limit(50); // Limit initial fetch to reasonable amount

  // ✅ OPTIMIZED: Fetch only Tips posts for sidebar (minimal fields)
  const { data: tipsPosts, error: tipsError } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, imageUrl, category, created_at, published_date')
    .eq('category', 'Insurance Tips')
    .eq('status', 'Published')
    .order('created_at', { ascending: false })
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

  // Transform posts
  const transformedNews = newsroomPosts.map(post => ({
    ...post,
    date: post.published_date || post.created_at,
  }));

  const transformedTips = (tipsPosts || []).map(post => ({
    ...post,
    date: post.published_date || post.created_at,
  }));
  
  // Get total count for pagination
  const { count: totalNewsCount } = await supabase
    .from('articles')
    .select('id', { count: 'exact', head: true })
    .eq('category', 'Insurance Newsroom')
    .eq('status', 'Published');
    
  const totalPages = Math.ceil((totalNewsCount || 0) / POSTS_PER_PAGE);

  // Build props
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