import React from 'react';
import CategoryPageTemplate from '@/components/templates/CategoryPageTemplate';
import { Article } from '@/types';
import { GetStaticProps } from 'next';
import { supabase } from '@/lib/supabaseClient';

const POSTS_PER_PAGE = 12;

interface TipsPageProps {
  posts: Article[];
  pinnedPosts: Article[];
  currentPage: number;
  totalPages: number;
  sidebarTopTips: Article[];
  sidebarTopNews: Article[];
}

const TipsPage: React.FC<TipsPageProps> = (props) => {
  return (
    <CategoryPageTemplate
      categoryName="Insurance Tips"
      categoryDescription="Get practical insurance advice and proven money management strategies. Learn how to save on premiums, maximize coverage, and build long-term financial wealth with expert tips."
      {...props}
    />
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // ✅ FIXED: Use camelCase field names
  const { data: tipsPosts, error: tipsError } = await supabase
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
    .eq('category', 'Insurance Tips')
    .eq('status', 'Published')
    .order('createdAt', { ascending: false })
    .limit(50);

  // ✅ FIXED: Use camelCase field names
  const { data: newsroomPosts, error: newsError } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, imageUrl, category, createdAt, publishedDate')
    .eq('category', 'Insurance Newsroom')
    .eq('status', 'Published')
    .order('createdAt', { ascending: false })
    .limit(3);

  if (tipsError || !tipsPosts) {
    console.error('Error fetching articles:', tipsError);
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
  const transformedPosts = tipsPosts.map(post => ({
    ...post,
    date: post.publishedDate || post.createdAt,
  }));

  const transformedNews = (newsroomPosts || []).map(post => ({
    ...post,
    date: post.publishedDate || post.createdAt,
  }));
  
  const { count: totalTipsCount } = await supabase
    .from('articles')
    .select('id', { count: 'exact', head: true })
    .eq('category', 'Insurance Tips')
    .eq('status', 'Published');
    
  const totalPages = Math.ceil((totalTipsCount || 0) / POSTS_PER_PAGE);

  const pinnedPosts = transformedPosts.filter(p => p.label === 'Most Read' || p.label === 'Sponsored');
  const paginatedPosts = transformedPosts.slice(0, POSTS_PER_PAGE);
  const sidebarTopTips = transformedPosts.slice(0, 3);

  return {
    props: {
      posts: paginatedPosts,
      pinnedPosts,
      currentPage: 1,
      totalPages,
      sidebarTopTips,
      sidebarTopNews: transformedNews,
    },
    revalidate: 600,
  };
};

export default TipsPage;
