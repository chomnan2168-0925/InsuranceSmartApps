import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest } from 'next';

// Rate limiting store
const rateLimitMap = new Map<string, number[]>();

export function checkRateLimit(ip: string, maxRequests: number = 20, windowMs: number = 60000): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recentTimestamps = timestamps.filter(t => now - t < windowMs);
  
  if (recentTimestamps.length >= maxRequests) {
    return false;
  }
  
  recentTimestamps.push(now);
  rateLimitMap.set(ip, recentTimestamps);
  return true;
}

export function getClientIp(req: NextApiRequest): string {
  return (req.headers['x-forwarded-for'] as string)?.split(',')[0] || 
         (req.headers['x-real-ip'] as string) ||
         req.socket.remoteAddress || 
         'unknown';
}

export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/[<>]/g, '')
    .substring(0, 255);
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 254;
}

export function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

interface AuthResult {
  authenticated: boolean;
  user: any | null;
  isAdmin?: boolean;
}

export async function authenticateAdmin(req: NextApiRequest): Promise<AuthResult> {
  try {
    // Get token from multiple sources
    const authHeader = req.headers.authorization;
    let token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      // Try cookies
      token = req.cookies['sb-access-token'] || 
              req.cookies['supabase-auth-token'] ||
              req.cookies['sb-auth-token'];
    }
    
    if (!token) {
      console.warn('[AUTH] No token found in request');
      return { authenticated: false, user: null, isAdmin: false };
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !serviceKey) {
      console.error('[AUTH] Missing environment variables');
      return { authenticated: false, user: null, isAdmin: false };
    }

    // Verify token
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      console.warn('[AUTH] Invalid token or user not found');
      return { authenticated: false, user: null, isAdmin: false };
    }

    // Check admin role using service role client
    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      console.warn('[AUTH] Profile not found for user:', user.id);
      return { authenticated: true, user, isAdmin: false };
    }

    const isAdmin = profile.role === 'Admin';

    return { authenticated: true, user, isAdmin };
  } catch (error) {
    console.error('[AUTH ERROR]:', error);
    return { authenticated: false, user: null, isAdmin: false };
  }
}