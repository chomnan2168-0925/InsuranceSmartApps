import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({ error: 'Public ID is required' });
    }

    // Search for articles that use this image
    const { data: articles, error } = await supabase
      .from('articles')
      .select('id, title, slug, imageUrl, content')
      .or(`imageUrl.cs.${publicId},content.cs.${publicId}`);

    if (error) {
      throw new Error(error.message);
    }

    // Filter to ensure the publicId is actually present
    const articlesUsingImage = (articles || []).filter(article => {
      const inFeaturedImage = article.imageUrl && article.imageUrl.includes(publicId);
      const inContent = article.content && article.content.includes(publicId);
      return inFeaturedImage || inContent;
    });

    return res.status(200).json({
      articles: articlesUsingImage.map(a => ({
        id: a.id,
        title: a.title,
        slug: a.slug,
      })),
      count: articlesUsingImage.length,
    });

  } catch (error: any) {
    console.error('Error checking image usage:', error);
    return res.status(500).json({ 
      error: error.message || 'Failed to check image usage' 
    });
  }
}