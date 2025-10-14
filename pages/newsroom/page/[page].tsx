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
      categoryDescription="The latest announcements, press releases, and company news from Hybrid Advisor."
      {...props}
    />
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  // Get the total count of Newsroom posts
  const { count } = await supabase
    .from('articles')
    .select('id', { count: 'exact', head: true })
    .eq('category', 'Insurance Newsroom')
    .eq('status', 'Published');

  const totalPages = Math.ceil((count || 0) / POSTS_PER_PAGE);

  // Generate paths for page 2, 3, etc. (page 1 is /newsroom)
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
  
  // Fetch paginated posts with author information
  const { data: paginatedPosts, error: postsError } = await supabase
    .from('articles')
    .select(`
      *,
      profiles:author_id (
        id,
        name
      )
    `)
    .eq('category', 'Insurance Newsroom')
    .eq('status', 'Published')
    .order('created_at', { ascending: false })
    .range(startIndex, endIndex);

  if (postsError) {
    console.error('Error fetching paginated posts:', postsError);
  }

  // Transform author data
  const transformedPosts = (paginatedPosts || []).map(post => {
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

  // Fetch sidebar articles
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
  
  // Pinned posts (optional - can be based on label)
  const pinnedPosts = transformedPosts.filter(p => p.label === 'Most Read' || p.label === 'Sponsored');
  
  // Transform dates for sidebar - handle null values
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