import { supabase } from './supabaseClient';
import { Article } from '@/types';

export const getRecommendedArticles = async (): Promise<Article[]> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('label', "Don't Miss!")
      .eq('status', 'Published')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recommended articles:', error);
    return [];
  }
};

export const getSidebarArticles = async (
  category: string, 
  limit: number
): Promise<Article[]> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('category', category)
      .eq('status', 'Published')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error(`Error fetching ${category} articles:`, error);
    return [];
  }
};

export const getAllTags = async (): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select('tags')
      .eq('status', 'Published');
    
    if (error) throw error;
    
    const allTags = (data || []).reduce((acc: string[], article) => {
      if (article.tags && Array.isArray(article.tags)) {
        article.tags.forEach((tag: string) => {
          if (!acc.includes(tag)) {
            acc.push(tag);
          }
        });
      }
      return acc;
    }, []);
    
    return allTags;
  } catch (error) {
    console.error('Error fetching tags:', error);
    return [];
  }
};

export const getPageData = async () => {
  const [recommended, tips, news] = await Promise.all([
    getRecommendedArticles(),
    getSidebarArticles('Insurance Tips', 3),
    getSidebarArticles('Insurance Newsroom', 3)
  ]);
  
  return { recommended, tips, news };
};