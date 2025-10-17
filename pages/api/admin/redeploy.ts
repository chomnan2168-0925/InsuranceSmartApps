// FILE 2: pages/api/admin/redeploy.ts
// ============================================
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const redeployRateLimitMap = new Map<string, number[]>();

function checkRedeployRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = redeployRateLimitMap.get(ip) || [];
  const recentTimestamps = timestamps.filter(t => now - t < 300000); // 5 minutes
  
  if (recentTimestamps.length >= 3) return false; // Max 3 deploys per 5 min
  
  recentTimestamps.push(now);
  redeployRateLimitMap.set(ip, recentTimestamps);
  return true;
}

async function authenticateRedeployRequest(req: NextApiRequest) {
  const authHeader = req.headers.authorization;
  let token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    token = req.cookies['sb-access-token'] || req.cookies['supabase-auth-token'];
  }
  
  if (!token) return { authenticated: false, user: null };
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) return { authenticated: false, user: null };
    return { authenticated: true, user };
  } catch (error) {
    return { authenticated: false, user: null };
  }
}

export default async function redeployHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Rate limiting
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
               req.socket.remoteAddress || 'unknown';
    
    if (!checkRedeployRateLimit(ip)) {
      return res.status(429).json({ 
        message: 'Too many redeploy requests. Please wait 5 minutes.' 
      });
    }

    // Authentication
    const { authenticated, user } = await authenticateRedeployRequest(req);
    if (!authenticated || !user) {
      return res.status(401).json({ message: 'Unauthorized.' });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      return res.status(500).json({ message: 'Server configuration error.' });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Verify admin role
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'Admin') {
      console.warn(`[REDEPLOY] Non-admin ${user.id} attempted redeploy`);
      return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }

    const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;

    if (!deployHookUrl) {
      return res.status(500).json({ message: 'Deploy hook URL not configured.' });
    }

    console.log(`[REDEPLOY] Admin ${user.email} triggering redeploy`);

    // Trigger Vercel deployment
    const response = await fetch(deployHookUrl, { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`Vercel API error: ${response.status}`);
    }

    return res.status(200).json({ 
      message: 'Re-deployment triggered successfully!',
      success: true
    });

  } catch (error: any) {
    console.error('[REDEPLOY ERROR]:', error);
    return res.status(500).json({ 
      message: 'Failed to trigger re-deployment.',
      success: false
    });
  }
}
