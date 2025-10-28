import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';
import { 
  authenticateAdmin, 
  checkRateLimit, 
  getClientIp, 
  sanitizeString, 
  isValidEmail 
} from '@/lib/apiAuth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const startTime = Date.now();

  try {
    // Rate limiting
    const ip = getClientIp(req);
    if (!checkRateLimit(ip, 5, 60000)) {
      console.warn(`[INVITE] Rate limit exceeded for IP: ${ip}`);
      return res.status(429).json({ 
        message: 'Too many requests. Please try again in a minute.' 
      });
    }

    // Authentication & Authorization
    const { authenticated, user, isAdmin } = await authenticateAdmin(req);
    
    if (!authenticated || !user) {
      console.warn('[INVITE] Unauthorized access attempt from IP:', ip);
      return res.status(401).json({ 
        message: 'Unauthorized. Please log in.' 
      });
    }

    if (!isAdmin) {
      console.warn(`[INVITE] Non-admin user ${user.id} attempted to invite user`);
      return res.status(403).json({ 
        message: 'Forbidden. Admin access required.' 
      });
    }

    // Input validation
    const { email, name, role } = req.body;

    if (!email || typeof email !== 'string') {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const sanitizedEmail = email.trim().toLowerCase();
    if (!isValidEmail(sanitizedEmail)) {
      return res.status(400).json({ message: 'Invalid email format.' });
    }

    const validRoles = ['Admin', 'Author', 'Viewer'];
    if (!role || !validRoles.includes(role)) {
      return res.status(400).json({ 
        message: `Invalid role. Must be one of: ${validRoles.join(', ')}` 
      });
    }

    const sanitizedName = name ? sanitizeString(name) : sanitizedEmail.split('@')[0];

    if (sanitizedName.length < 2) {
      return res.status(400).json({ message: 'Name must be at least 2 characters.' });
    }

    // Initialize admin client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    });

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin.auth.admin.listUsers();
    const userExists = existingUser?.users?.some(u => u.email === sanitizedEmail);

    if (userExists) {
      return res.status(409).json({ 
        message: 'A user with this email already exists.' 
      });
    }

    console.log(`[INVITE] Admin ${user.email} inviting ${sanitizedEmail} as ${role}`);

    // Invite user
    const redirectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.insurancesmartcalculator.com'}/auth/callback`;
    
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
      sanitizedEmail,
      {
        data: { 
          name: sanitizedName, 
          role: role 
        },
        redirectTo: redirectUrl
      }
    );

    if (inviteError) {
      console.error('[INVITE ERROR]:', inviteError);
      return res.status(500).json({ 
        message: `Failed to send invitation: ${inviteError.message}` 
      });
    }

    // Create profile
    if (inviteData?.user?.id) {
      const userId = inviteData.user.id;
      
      // Wait a moment for auth record to be created
      await new Promise(resolve => setTimeout(resolve, 500));

      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          name: sanitizedName,
          role: role,
          created_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('[INVITE] Profile creation error:', profileError);
        // Don't fail the request, profile can be created on first login
      }
    }

    const duration = Date.now() - startTime;
    console.log(`[INVITE SUCCESS] User ${sanitizedEmail} invited in ${duration}ms`);

    return res.status(200).json({ 
      message: `Invitation sent to ${sanitizedEmail}`,
      userId: inviteData?.user?.id,
      success: true
    });

  } catch (err: any) {
    console.error('[INVITE ERROR]:', err?.message ?? err);
    return res.status(500).json({ 
      message: 'An unexpected error occurred. Please try again.',
      success: false
    });
  }
}