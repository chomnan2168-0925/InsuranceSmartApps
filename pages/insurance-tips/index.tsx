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
  // ✅ OPTIMIZED: Fetch only Insurance Tips posts with minimal fields for listing
  const { data: tipsPosts, error: tipsError } = await supabase
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
    .eq('category', 'Insurance Tips')
    .eq('status', 'Published')
    .order('created_at', { ascending: false })
    .limit(50); // Limit initial fetch to reasonable amount

  // ✅ OPTIMIZED: Fetch only Newsroom posts for sidebar (minimal fields)
  const { data: newsroomPosts, error: newsError } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, imageUrl, category, created_at, published_date')
    .eq('category', 'Insurance Newsroom')
    .eq('status', 'Published')
    .order('created_at', { ascending: false })
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

  // Transform posts
  const transformedPosts = tipsPosts.map(post => ({
    ...post,
    date: post.published_date || post.created_at,
  }));

  const transformedNews = (newsroomPosts || []).map(post => ({
    ...post,
    date: post.published_date || post.created_at,
  }));
  
  // Get total count for pagination
  const { count: totalTipsCount } = await supabase
    .from('articles')
    .select('id', { count: 'exact', head: true })
    .eq('category', 'Insurance Tips')
    .eq('status', 'Published');
    
  const totalPages = Math.ceil((totalTipsCount || 0) / POSTS_PER_PAGE);

  // Build props
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