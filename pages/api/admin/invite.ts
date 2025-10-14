// pages/api/admin/invite.ts
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceKey) {
      console.error('API Error: Missing Supabase URL or Service Role Key.');
      return res.status(500).json({ message: 'Server configuration error. Check environment variables.' });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { email, role, name } = req.body;

    if (!email || !role) {
      return res.status(400).json({ message: 'Email and role are required.' });
    }

    console.log(`[INVITE] Attempting to invite user: ${email} with role: ${role}`);

    // Step 1: Invite the user
    const { data: inviteData, error: inviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(email, {
      data: {
        name: name || 'Invited User',
        role: role,
      },
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`
    });

    if (inviteError) {
      console.error(`[INVITE ERROR] ${email}:`, inviteError);
      return res.status(500).json({ 
        message: `Failed to invite user: ${inviteError.message}` 
      });
    }

    console.log(`[INVITE SUCCESS] User invited:`, inviteData);

    // Step 2: Ensure profile exists
    // The trigger should handle this, but let's be explicit
    if (inviteData?.user?.id) {
      const userId = inviteData.user.id;
      
      // Wait a moment for the trigger to fire
      await new Promise(resolve => setTimeout(resolve, 500));

      // Check if profile exists
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('id')
        .eq('id', userId)
        .single();

      if (!existingProfile) {
        console.log(`[PROFILE] Creating profile for ${email}`);
        const { error: insertError } = await supabaseAdmin
          .from('profiles')
          .insert({
            id: userId,
            name: name || 'Invited User',
            role: role
          });

        if (insertError) {
          console.error(`[PROFILE ERROR] Failed to create profile:`, insertError);
          return res.status(200).json({
            message: `User invited but profile creation failed: ${insertError.message}`
          });
        }
      } else {
        // Update existing profile
        console.log(`[PROFILE] Updating profile for ${email}`);
        const { error: updateError } = await supabaseAdmin
          .from('profiles')
          .update({ 
            name: name || 'Invited User',
            role: role 
          })
          .eq('id', userId);

        if (updateError) {
          console.error(`[PROFILE ERROR] Failed to update profile:`, updateError);
        }
      }
    }

    return res.status(200).json({ 
      message: `Invitation sent successfully to ${email}`,
      userId: inviteData?.user?.id 
    });

  } catch (err: any) {
    console.error('[INVITE CATCH_ALL ERROR]:', err?.message ?? err);
    return res.status(500).json({ 
      message: `An unexpected error occurred: ${err?.message || 'Unknown error'}` 
    });
  }
}