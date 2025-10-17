// FILE 1: pages/api/admin/invite.ts
// ============================================
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Rate limiting for invite
const inviteRateLimitMap = new Map<string, number[]>();

function checkInviteRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = inviteRateLimitMap.get(ip) || [];
  const recentTimestamps = timestamps.filter(t => now - t < 60000);
  
  if (recentTimestamps.length >= 5) return false;
  
  recentTimestamps.push(now);
  inviteRateLimitMap.set(ip, recentTimestamps);
  return true;
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Authentication helper
async function authenticateInviteRequest(req: NextApiRequest) {
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

export default async function inviteHandler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Rate limiting
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
               req.socket.remoteAddress || 'unknown';
    
    if (!checkInviteRateLimit(ip)) {
      return res.status(429).json({ message: 'Too many requests.' });
    }

    // Authentication
    const { authenticated, user } = await authenticateInviteRequest(req);
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
      return res.status(403).json({ message: 'Forbidden. Admin access required.' });
    }

    // Validate input
    const { email, role, name } = req.body;

    if (!email || !isValidEmail(email)) {
      return res.status(400).json({ message: 'Valid email is required.' });
    }

    const validRoles = ['Admin', 'Author', 'Viewer'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role.' });
    }

    const sanitizedName = name ? name.trim().substring(0, 100) : 'Invited User';

    console.log(`[INVITE] Admin ${user.email} inviting: ${email}`);

    // Invite user
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: { name: sanitizedName, role },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
    });

    if (inviteError) {
      console.error('[INVITE ERROR]:', inviteError);
      return res.status(500).json({ message: `Failed to invite: ${inviteError.message}` });
    }

    // Ensure profile exists
    if (inviteData?.user?.id) {
      const userId = inviteData.user.id;
      await new Promise(resolve => setTimeout(resolve, 500));

      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (!existingProfile) {
        await supabaseAdmin.from('profiles').insert({
          id: userId,
          name: sanitizedName,
          role
        });
      } else {
        await supabaseAdmin.from('profiles').update({ name: sanitizedName, role }).eq('id', userId);
      }
    }

    return res.status(200).json({ 
      message: `Invitation sent to ${email}`,
      userId: inviteData?.user?.id,
      success: true
    });

  } catch (err: any) {
    console.error('[INVITE ERROR]:', err);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
}
