import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

  if (!deployHookUrl) {
    return res.status(500).json({ message: 'Deploy hook URL is not configured.' });
  }

  try {
    // Call the Vercel deploy hook
    const response = await fetch(deployHookUrl, { method: 'POST' });
    if (!response.ok) {
      throw new Error('Vercel API responded with an error.');
    }
    res.status(200).json({ message: 'Re-deployment triggered successfully!' });
  } catch (error) {
    console.error('Failed to trigger re-deployment:', error);
    res.status(500).json({ message: 'Failed to trigger re-deployment.' });
  }
}