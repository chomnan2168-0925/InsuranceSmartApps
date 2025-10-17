// pages/api/admin/deleteUser.ts
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Rate limiting
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS = 10;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recentTimestamps = timestamps.filter(t => now - t < RATE_LIMIT_WINDOW);
  
  if (recentTimestamps.length >= MAX_REQUESTS) {
    return false;
  }
  
  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);
  return true;
}

// Authentication helper
async function authenticateRequest(req: NextApiRequest) {
  const authHeader = req.headers.authorization;
  let token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    token = req.cookies['sb-access-token'] || req.cookies['supabase-auth-token'];
  }
  
  if (!token) {
    return { authenticated: false, user: null };
  }
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return { authenticated: false, user: null };
    }
    
    return { authenticated: true, user };
  } catch (error) {
    console.error('[AUTH ERROR]:', error);
    return { authenticated: false, user: null };
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Method validation
  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Rate limiting
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
               req.socket.remoteAddress || 
               'unknown';
    
    if (!checkRateLimit(ip)) {
      console.warn(`[DELETE] Rate limit exceeded for IP: ${ip}`);
      return res.status(429).json({ 
        message: 'Too many requests. Please try again later.' 
      });
    }

    // Authentication check
    const { authenticated, user } = await authenticateRequest(req);
    
    if (!authenticated || !user) {
      console.warn('[DELETE] Unauthorized access attempt');
      return res.status(401).json({ 
        message: 'Unauthorized. Please log in.' 
      });
    }

    // Check user role (only admins can delete users)
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      console.error('[DELETE] Missing Supabase configuration');
      return res.status(500).json({ 
        message: 'Server configuration error.' 
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Verify user is admin
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || profile.role !== 'Admin') {
      console.warn(`[DELETE] Non-admin user ${user.id} attempted to delete user`);
      return res.status(403).json({ 
        message: 'Forbidden. Admin access required.' 
      });
    }

    // Input validation
    const { userId } = req.body;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ 
        message: 'Invalid user ID provided.' 
      });
    }

    // Prevent self-deletion
    if (userId === user.id) {
      return res.status(400).json({ 
        message: 'You cannot delete your own account.' 
      });
    }

    console.log(`[DELETE] Admin ${user.email} deleting user: ${userId}`);

    // Delete profile first
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('[DELETE] Profile deletion error:', profileError);
    }

    // Delete user from auth
    const { error: userError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (userError) {
      console.error('[DELETE] User deletion error:', userError);
      return res.status(500).json({ 
        message: `Failed to delete user: ${userError.message}` 
      });
    }

    console.log(`[DELETE SUCCESS] User ${userId} deleted by admin ${user.email}`);

    return res.status(200).json({ 
      message: 'User deleted successfully.',
      success: true
    });

  } catch (err: any) {
    console.error('[DELETE ERROR]:', err?.message ?? err);
    return res.status(500).json({ 
      message: 'An unexpected error occurred.',
      success: false
    });
  }
}
