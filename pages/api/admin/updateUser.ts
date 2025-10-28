// pages/api/admin/updateUser.ts
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  authenticateAdmin, 
  checkRateLimit, 
  getClientIp, 
  sanitizeString,
  isValidUUID
} from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const startTime = Date.now();

  try {
    // Rate limiting
    const ip = getClientIp(req);
    if (!checkRateLimit(ip, 20, 60000)) {
      console.warn(`[UPDATE] Rate limit exceeded for IP: ${ip}`);
      return res.status(429).json({ 
        message: 'Too many requests. Please try again later.' 
      });
    }

    // Authentication & Authorization
    const { authenticated, user, isAdmin } = await authenticateAdmin(req);
    
    if (!authenticated || !user) {
      console.warn('[UPDATE] Unauthorized access attempt from IP:', ip);
      return res.status(401).json({ 
        message: 'Unauthorized. Please log in.' 
      });
    }

    if (!isAdmin) {
      console.warn(`[UPDATE] Non-admin user ${user.id} attempted to update user`);
      return res.status(403).json({ 
        message: 'Forbidden. Admin access required.' 
      });
    }

    // Input validation
    const { userId, newRole, newName } = req.body;

    if (!userId || typeof userId !== 'string' || !isValidUUID(userId)) {
      return res.status(400).json({ message: 'Invalid user ID provided.' });
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
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}` 
      });
    }

    // Validate and sanitize name
    let sanitizedName: string | undefined;
    if (newName) {
      if (typeof newName !== 'string' || newName.trim().length === 0) {
        return res.status(400).json({ 
          message: 'Name must be a non-empty string.' 
        });
      }
      
      sanitizedName = sanitizeString(newName);
      
      if (sanitizedName.length < 2) {
        return res.status(400).json({ 
          message: 'Name must be at least 2 characters.' 
        });
      }
    }

    // Initialize admin client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    console.log(`[UPDATE] Admin ${user.email} updating user ${userId}`);

    // Build update object
    const updateData: any = {};
    if (sanitizedName) updateData.name = sanitizedName;
    if (newRole) updateData.role = newRole;

    // Check if profile exists
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, name, role')
      .eq('id', userId)
      .single();

    if (!existingProfile) {
      // Create new profile
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          name: sanitizedName || 'User',
          role: newRole || 'Author',
          created_at: new Date().toISOString()
        });

      if (insertError) {
        console.error('[UPDATE] Profile creation error:', insertError);
        return res.status(500).json({ 
          message: `Profile creation failed: ${insertError.message}` 
        });
      }

      console.log(`[UPDATE SUCCESS] Profile created for user ${userId}`);
      
      const duration = Date.now() - startTime;
      return res.status(200).json({ 
        message: 'User profile created successfully.',
        created: true,
        success: true,
        duration: `${duration}ms`
      });
    }

    // Update existing profile
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

    const duration = Date.now() - startTime;
    console.log(`[UPDATE SUCCESS] User ${userId} updated in ${duration}ms`);
    
    return res.status(200).json({ 
      message: 'User updated successfully.',
      data: data[0],
      success: true,
      duration: `${duration}ms`
    });

  } catch (err: any) {
    console.error('[UPDATE ERROR]:', err?.message ?? err);
    return res.status(500).json({ 
      message: 'An unexpected error occurred.',
      success: false
    });
  }
}