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
      categoryDescription="The latest announcements, press releases, and company news from Hybrid Advisor."
      {...props}
    />
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // Fetch all published posts with author information
  const { data: allPublishedPosts, error } = await supabase
    .from('articles')
    .select(`
      *,
      profiles:author_id (
        id,
        name
      )
    `)
    .eq('status', 'Published')
    .order('created_at', { ascending: false });

  if (error || !allPublishedPosts) {
    console.error('Error fetching articles:', error);
    return { 
      props: { 
        posts: [], 
        pinnedPosts: [], 
        currentPage: 1, 
        totalPages: 1, 
        sidebarTopTips: [], 
        sidebarTopNews: [] 
      },
      revalidate: 60
    };
  }

  // Transform author data for all posts
  const transformedPosts = allPublishedPosts.map(post => {
    if (post.profiles) {
      return {
        ...post,
        author: {
          name: post.profiles.name,
          avatarUrl: '/images/default-avatar.png',
        },
        date: post.published_date || post.created_at,
      };
    }
    return {
      ...post,
      date: post.published_date || post.created_at,
    };
  });
  
  // Filter by category
  const allTipsPosts = transformedPosts.filter(p => p.category === 'Insurance Tips');
  const allNewsroomPosts = transformedPosts.filter(p => p.category === 'Insurance Newsroom');
  
  // Get total count for pagination
  const { count: totalNewsCount } = await supabase
    .from('articles')
    .select('id', { count: 'exact', head: true })
    .eq('category', 'Insurance Newsroom')
    .eq('status', 'Published');
    
  const totalPages = Math.ceil((totalNewsCount || 0) / POSTS_PER_PAGE);

  // Build props
  const pinnedPosts = allNewsroomPosts.filter(p => p.label === 'Most Read' || p.label === 'Sponsored');
  const paginatedPosts = allNewsroomPosts.slice(0, POSTS_PER_PAGE);
  const sidebarTopTips = allTipsPosts.slice(0, 3);
  const sidebarTopNews = allNewsroomPosts.slice(0, 3);

  return {
    props: {
      posts: paginatedPosts,
      pinnedPosts,
      currentPage: 1,
      totalPages,
      sidebarTopTips,
      sidebarTopNews,
    },
    revalidate: 600,
  };
};

export default NewsroomPage;