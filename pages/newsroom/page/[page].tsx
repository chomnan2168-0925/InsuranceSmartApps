import React from 'react';
import CategoryPageTemplate from '@/components/templates/CategoryPageTemplate';
import { Article } from '@/types';
import { GetStaticPaths, GetStaticProps } from 'next';
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

const NewsroomPaginatedPage: React.FC<NewsroomPageProps> = (props) => {
  return (
    <CategoryPageTemplate
      categoryName="Insurance Newsroom"
      categoryDescription="Breaking insurance industry news explained simply. Get the latest updates on policy changes, market trends, and regulations that affect your coverage and costs."
      {...props}
    />
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const { count } = await supabase
    .from('articles')
    .select('id', { count: 'exact', head: true })
    .eq('category', 'Insurance Newsroom')
    .eq('status', 'Published');

  const totalPages = Math.ceil((count || 0) / POSTS_PER_PAGE);

  const paths = Array.from({ length: totalPages > 1 ? totalPages - 1 : 0 }, (_, i) => ({
    params: { page: (i + 2).toString() },
  }));

  return { 
    paths, 
    fallback: 'blocking' 
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const page = parseInt(context.params?.page as string || '1');
  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const endIndex = startIndex + POSTS_PER_PAGE - 1;
  
  // ✅ OPTIMIZED: Fetch only necessary fields for listing (no full content)
  const { data: paginatedPosts, error: postsError } = await supabase
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
    .range(startIndex, endIndex);

  if (postsError) {
    console.error('Error fetching paginated posts:', postsError);
  }

  // Transform posts
  const transformedPosts = (paginatedPosts || []).map(post => ({
    ...post,
    date: post.published_date || post.created_at,
  }));

  // ✅ OPTIMIZED: Fetch sidebar articles with minimal fields
  const { data: sidebarTips } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, imageUrl, category, created_at, published_date')
    .eq('status', 'Published')
    .eq('category', 'Insurance Tips')
    .order('created_at', { ascending: false })
    .limit(3);

  const { data: sidebarNews } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, imageUrl, category, created_at, published_date')
    .eq('status', 'Published')
    .eq('category', 'Insurance Newsroom')
    .order('created_at', { ascending: false })
    .limit(3);

  // Get total count for pagination
  const { count } = await supabase
    .from('articles')
    .select('id', { count: 'exact', head: true })
    .eq('category', 'Insurance Newsroom')
    .eq('status', 'Published');
    
  const totalPages = Math.ceil((count || 0) / POSTS_PER_PAGE);
  
  // Pinned posts (only on page 1, but keeping logic for consistency)
  const pinnedPosts = transformedPosts.filter(p => p.label === 'Most Read' || p.label === 'Sponsored');
  
  // Transform dates for sidebar
  const transformDates = (articles: any[] | null) => 
    (articles || []).map(a => ({ ...a, date: a.published_date || a.created_at }));

  return {
    props: {
      posts: transformedPosts,
      pinnedPosts,
      currentPage: page,
      totalPages,
      sidebarTopTips: transformDates(sidebarTips),
      sidebarTopNews: transformDates(sidebarNews),
    },
    revalidate: 600,
  };
};

export default NewsroomPaginatedPage;