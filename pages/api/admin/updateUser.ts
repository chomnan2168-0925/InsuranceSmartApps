// pages/api/admin/updateUser.ts
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

// Rate limiting
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS = 20;

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

// Sanitize input
function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '');
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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Rate limiting
    const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
               req.socket.remoteAddress || 
               'unknown';
    
    if (!checkRateLimit(ip)) {
      console.warn(`[UPDATE] Rate limit exceeded for IP: ${ip}`);
      return res.status(429).json({ 
        message: 'Too many requests. Please try again later.' 
      });
    }

    // Authentication check
    const { authenticated, user } = await authenticateRequest(req);
    
    if (!authenticated || !user) {
      console.warn('[UPDATE] Unauthorized access attempt');
      return res.status(401).json({ 
        message: 'Unauthorized. Please log in.' 
      });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      console.error('[UPDATE] Missing Supabase configuration');
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
      console.warn(`[UPDATE] Non-admin user ${user.id} attempted to update user`);
      return res.status(403).json({ 
        message: 'Forbidden. Admin access required.' 
      });
    }

    // Input validation and sanitization
    const { userId, newRole, newName } = req.body;

    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ 
        message: 'Invalid user ID provided.' 
      });
    }

    if (!newRole && !newName) {
      return res.status(400).json({ 
        message: 'At least one field (name or role) must be provided.' 
      });
    }

    // Validate role
    const validRoles = ['Admin', 'Author', 'Viewer'];
    if (newRole && !validRoles.includes(newRole)) {
      return res.status(400).json({ 
        message: 'Invalid role. Must be Admin, Author, or Viewer.' 
      });
    }

    // Validate and sanitize name
    if (newName) {
      if (typeof newName !== 'string' || newName.trim().length === 0) {
        return res.status(400).json({ 
          message: 'Name must be a non-empty string.' 
        });
      }
      
      if (newName.length > 100) {
        return res.status(400).json({ 
          message: 'Name is too long (max 100 characters).' 
        });
      }
    }

    console.log(`[UPDATE] Admin ${user.email} updating user ${userId}`);

    // Build update object with sanitized data
    const updateData: any = {};
    if (newName !== undefined && newName !== null) {
      updateData.name = sanitizeString(newName);
    }
    if (newRole !== undefined && newRole !== null) {
      updateData.role = newRole;
    }

    // Update the profile
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select();

    if (error) {
      console.error('[UPDATE ERROR]:', error);
      return res.status(500).json({ 
        message: `Failed to update user: ${error.message}` 
      });
    }

    // If no profile exists, create one
    if (!data || data.length === 0) {
      console.log(`[UPDATE] Creating profile for user ${userId}`);
      
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          name: newName ? sanitizeString(newName) : 'User',
          role: newRole || 'Author'
        });

      if (insertError) {
        console.error('[UPDATE] Profile creation error:', insertError);
        return res.status(500).json({ 
          message: `Profile creation failed: ${insertError.message}` 
        });
      }

      console.log(`[UPDATE SUCCESS] Profile created for user ${userId}`);
      return res.status(200).json({ 
        message: 'User profile created successfully.',
        created: true,
        success: true
      });
    }

    console.log(`[UPDATE SUCCESS] User ${userId} updated by admin ${user.email}`);
    
    return res.status(200).json({ 
      message: 'User updated successfully.',
      data: data[0],
      success: true
    });

  } catch (err: any) {
    console.error('[UPDATE ERROR]:', err?.message ?? err);
    return res.status(500).json({ 
      message: 'An unexpected error occurred.',
      success: false
    });
  }
}
