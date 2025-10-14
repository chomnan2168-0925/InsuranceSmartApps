// pages/api/admin/updateUser.ts
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
      console.error('[UPDATE] Missing Supabase URL or Service Role Key.');
      return res.status(500).json({ message: 'Server configuration error. Check environment variables.' });
    }

    const supabaseAdmin = createClient(supabaseUrl, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const { userId, newRole, newName } = req.body;

    // Validate inputs
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    if (!newRole && !newName) {
      return res.status(400).json({ message: 'At least one field (name or role) must be provided.' });
    }

    console.log(`[UPDATE] Updating user ${userId}: name="${newName}", role="${newRole}"`);

    // Build the update object dynamically
    const updateData: any = {};
    if (newName !== undefined && newName !== null) updateData.name = newName;
    if (newRole !== undefined && newRole !== null) updateData.role = newRole;

    // Update the profile
    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update(updateData)
      .eq('id', userId)
      .select();

    if (error) {
      console.error(`[UPDATE ERROR] Failed to update user ${userId}:`, error);
      return res.status(500).json({ 
        message: `Failed to update user: ${error.message}` 
      });
    }

    // Check if profile was found and updated
    if (!data || data.length === 0) {
      console.log(`[UPDATE] No profile found for user ${userId}, creating one...`);
      
      // Profile doesn't exist, create it
      const { error: insertError } = await supabaseAdmin
        .from('profiles')
        .insert({
          id: userId,
          name: newName || 'User',
          role: newRole || 'Author'
        });

      if (insertError) {
        console.error(`[UPDATE ERROR] Failed to create profile:`, insertError);
        return res.status(500).json({ 
          message: `Profile not found and creation failed: ${insertError.message}` 
        });
      }

      console.log(`[UPDATE SUCCESS] Profile created for user ${userId}`);
      return res.status(200).json({ 
        message: 'User profile created successfully.',
        created: true
      });
    }

    console.log(`[UPDATE SUCCESS] User ${userId} updated successfully:`, data[0]);
    
    return res.status(200).json({ 
      message: 'User updated successfully.',
      data: data[0]
    });

  } catch (err: any) {
    console.error('[UPDATE CATCH_ALL ERROR]:', err?.message ?? err);
    return res.status(500).json({ 
      message: `An unexpected error occurred: ${err?.message || 'Unknown error'}` 
    });
  }
}