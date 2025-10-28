// pages/api/admin/deleteUser.ts
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  authenticateAdmin, 
  checkRateLimit, 
  getClientIp,
  isValidUUID
} from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const startTime = Date.now();

  try {
    // Rate limiting (stricter for delete operations)
    const ip = getClientIp(req);
    if (!checkRateLimit(ip, 10, 60000)) {
      console.warn(`[DELETE] Rate limit exceeded for IP: ${ip}`);
      return res.status(429).json({ 
        message: 'Too many requests. Please try again later.' 
      });
    }

    // Authentication & Authorization
    const { authenticated, user, isAdmin } = await authenticateAdmin(req);
    
    if (!authenticated || !user) {
      console.warn('[DELETE] Unauthorized access attempt from IP:', ip);
      return res.status(401).json({ 
        message: 'Unauthorized. Please log in.' 
      });
    }

    if (!isAdmin) {
      console.warn(`[DELETE] Non-admin user ${user.id} attempted to delete user`);
      return res.status(403).json({ 
        message: 'Forbidden. Admin access required.' 
      });
    }

    // Input validation
    const { userId } = req.body;

    if (!userId || typeof userId !== 'string' || !isValidUUID(userId)) {
      return res.status(400).json({ message: 'Invalid user ID provided.' });
    }

    // Prevent self-deletion
    if (userId === user.id) {
      return res.status(400).json({ 
        message: 'You cannot delete your own account.' 
      });
    }

    // Initialize admin client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    console.log(`[DELETE] Admin ${user.email} deleting user: ${userId}`);

    // Check if user exists and get their info for logging
    const { data: targetProfile } = await supabaseAdmin
      .from('profiles')
      .select('name, role')
      .eq('id', userId)
      .single();

    if (!targetProfile) {
      return res.status(404).json({ 
        message: 'User not found.' 
      });
    }

    // Delete related data first (articles, etc.)
    // Update articles to remove author reference
    const { error: articlesError } = await supabaseAdmin
      .from('articles')
      .update({ author_id: null })
      .eq('author_id', userId);

    if (articlesError) {
      console.warn('[DELETE] Error updating articles:', articlesError);
    }

    // Delete profile
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error('[DELETE] Profile deletion error:', profileError);
      return res.status(500).json({ 
        message: `Failed to delete profile: ${profileError.message}` 
      });
    }

    // Delete user from auth
    const { error: userError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (userError) {
      console.error('[DELETE] User deletion error:', userError);
      return res.status(500).json({ 
        message: `Failed to delete user: ${userError.message}` 
      });
    }

    const duration = Date.now() - startTime;
    console.log(`[DELETE SUCCESS] User ${targetProfile.name} (${userId}) deleted in ${duration}ms by ${user.email}`);

    return res.status(200).json({ 
      message: 'User deleted successfully.',
      success: true,
      duration: `${duration}ms`
    });

  } catch (err: any) {
    console.error('[DELETE ERROR]:', err?.message ?? err);
    return res.status(500).json({ 
      message: 'An unexpected error occurred.',
      success: false
    });
  }
}