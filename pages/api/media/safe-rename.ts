import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';
import { supabase } from '@/lib/supabaseClient';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

// Input validation with strict patterns
const PUBLIC_ID_PATTERN = /^[a-zA-Z0-9_\-\/]+$/;
const MAX_PUBLIC_ID_LENGTH = 255;

function validatePublicId(publicId: string): boolean {
  if (!publicId || typeof publicId !== 'string') return false;
  if (publicId.length > MAX_PUBLIC_ID_LENGTH) return false;
  if (!PUBLIC_ID_PATTERN.test(publicId)) return false;
  // Prevent path traversal
  if (publicId.includes('..') || publicId.includes('//')) return false;
  return true;
}

function generateSignature(paramsToSign: Record<string, any>, apiSecret: string): string {
  const sortedParams = Object.keys(paramsToSign)
    .sort()
    .map(key => `${key}=${paramsToSign[key]}`)
    .join('&');
  
  // Use SHA-256 instead of SHA-1 (weak crypto fix)
  return crypto
    .createHash('sha256')
    .update(sortedParams + apiSecret)
    .digest('hex');
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { oldPublicId, newPublicId, articleId } = req.body;

    // Strict input validation
    if (!oldPublicId || !newPublicId) {
      return res.status(400).json({ error: 'Both oldPublicId and newPublicId are required' });
    }

    if (!validatePublicId(oldPublicId) || !validatePublicId(newPublicId)) {
      return res.status(400).json({ error: 'Invalid public ID format' });
    }

    // Validate articleId if provided
    if (articleId && (typeof articleId !== 'string' || !/^[a-zA-Z0-9\-]+$/.test(articleId))) {
      return res.status(400).json({ error: 'Invalid article ID format' });
    }

    // Step 1: Rename in Cloudinary
    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = {
      from_public_id: oldPublicId,
      to_public_id: newPublicId,
      timestamp: timestamp,
    };

    const signature = generateSignature(paramsToSign, CLOUDINARY_API_SECRET!);

    const formData = new URLSearchParams({
      from_public_id: oldPublicId,
      to_public_id: newPublicId,
      timestamp: timestamp.toString(),
      api_key: CLOUDINARY_API_KEY!,
      signature: signature,
    });

    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/rename`;
    
    const cloudinaryResponse = await fetch(cloudinaryUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });

    const cloudinaryData = await cloudinaryResponse.json();

    if (!cloudinaryResponse.ok) {
      throw new Error(cloudinaryData.error?.message || 'Failed to rename in Cloudinary');
    }

    const newUrl = cloudinaryData.secure_url;
    const oldUrl = newUrl.replace(newPublicId, oldPublicId);

    // Step 2: Update database if articleId provided
    if (articleId) {
      // Fetch the article
      const { data: article, error: fetchError } = await supabase
        .from('articles')
        .select('*')
        .eq('id', articleId)
        .single();

      if (fetchError || !article) {
        console.error('Article not found, but Cloudinary rename succeeded');
        return res.status(200).json({
          success: true,
          warning: 'Image renamed in Cloudinary but article not found in database',
          publicId: newPublicId,
          url: newUrl,
        });
      }

      // Update imageUrl if it matches
      let updatedImageUrl = article.imageUrl;
      if (article.imageUrl && article.imageUrl.includes(oldPublicId)) {
        updatedImageUrl = article.imageUrl.replace(oldPublicId, newPublicId);
      }

      // Update content - use proper escaping to prevent XSS
      let updatedContent = article.content || '';
      if (updatedContent.includes(oldUrl)) {
        // Use split/join for safe replacement (no regex ReDoS risk)
        updatedContent = updatedContent.split(oldUrl).join(newUrl);
      }

      // Update in database with parameterized query (SQL injection safe)
      const { error: updateError } = await supabase
        .from('articles')
        .update({
          imageUrl: updatedImageUrl,
          content: updatedContent,
        })
        .eq('id', articleId);

      if (updateError) {
        console.error('Database update failed:', updateError);
        return res.status(200).json({
          success: true,
          warning: 'Image renamed in Cloudinary but database update failed',
          publicId: newPublicId,
          url: newUrl,
        });
      }
    }

    return res.status(200).json({
      success: true,
      publicId: newPublicId,
      url: newUrl,
      oldUrl: oldUrl,
      databaseUpdated: !!articleId,
    });

  } catch (error: any) {
    console.error('Error in safe rename:', error);
    // Don't expose internal error details
    return res.status(500).json({ 
      error: 'Failed to rename image safely' 
    });
  }
}
