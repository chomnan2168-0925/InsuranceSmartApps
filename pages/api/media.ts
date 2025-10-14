import type { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // GET - Fetch all images
  if (req.method === 'GET') {
    try {
      if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        return res.status(500).json({ error: 'Cloudinary credentials not configured' });
      }

      const maxResults = req.query.max_results || '100';
      const nextCursor = req.query.next_cursor;

      const baseUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/image`;
      const params = new URLSearchParams({
        max_results: maxResults as string,
        resource_type: 'image',
      });

      if (nextCursor) {
        params.append('next_cursor', nextCursor as string);
      }

      const url = `${baseUrl}?${params.toString()}`;
      const auth = Buffer.from(`${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}`).toString('base64');
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Basic ${auth}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Cloudinary API error: ${response.statusText}`);
      }

      const data = await response.json();

      const transformedResources = data.resources.map((resource: any) => ({
        publicId: resource.public_id,
        url: resource.secure_url,
        thumbnail: resource.secure_url.replace('/upload/', '/upload/w_300,h_300,c_fill/'),
        name: resource.public_id.split('/').pop() || resource.public_id,
        format: resource.format,
        bytes: resource.bytes,
        width: resource.width,
        height: resource.height,
        createdAt: resource.created_at,
        altText: resource.context?.custom?.alt || '',
        caption: resource.context?.custom?.caption || '',
      }));

      return res.status(200).json({
        resources: transformedResources,
        next_cursor: data.next_cursor,
        total_count: data.total_count,
      });

    } catch (error) {
      console.error('Error fetching media from Cloudinary:', error);
      return res.status(500).json({ error: 'Failed to fetch media' });
    }
  }

  // DELETE - Delete an image
  else if (req.method === 'DELETE') {
    try {
      if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        return res.status(500).json({ error: 'Cloudinary credentials not configured' });
      }

      const { publicId } = req.body;

      if (!publicId) {
        return res.status(400).json({ error: 'Public ID is required' });
      }

      // Generate signature
      const timestamp = Math.round(Date.now() / 1000);
      const paramsToSign = {
        public_id: publicId,
        timestamp: timestamp,
      };

      const sortedParams = Object.keys(paramsToSign)
        .sort()
        .map(key => `${key}=${paramsToSign[key as keyof typeof paramsToSign]}`)
        .join('&');
      
      const signature = crypto
        .createHash('sha1')
        .update(sortedParams + CLOUDINARY_API_SECRET)
        .digest('hex');

      const formData = new URLSearchParams({
        public_id: publicId,
        timestamp: timestamp.toString(),
        api_key: CLOUDINARY_API_KEY,
        signature: signature,
      });

      const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/destroy`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
      });

      const data = await response.json();

      if (!response.ok || data.result !== 'ok') {
        throw new Error(data.error?.message || 'Failed to delete image');
      }

      return res.status(200).json({
        success: true,
        result: data.result,
      });

    } catch (error: any) {
      console.error('Error deleting media from Cloudinary:', error);
      return res.status(500).json({ error: error.message || 'Failed to delete media' });
    }
  }

  // Method not allowed
  else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}