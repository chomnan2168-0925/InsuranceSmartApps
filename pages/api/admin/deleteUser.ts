// pages/api/admin/deleteUser.ts
import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE' && req.method !== 'POST') {
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

    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    console.log(`[DELETE] Attempting to delete user: ${userId}`);

    // Step 1: Delete the profile first (due to foreign key constraint)
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .delete()
      .eq('id', userId);

    if (profileError) {
      console.error(`[DELETE ERROR] Failed to delete profile:`, profileError);
      // Continue anyway, as the profile might not exist
    }

    // Step 2: Delete the user from auth.users
    const { error: userError } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (userError) {
      console.error(`[DELETE ERROR] Failed to delete user:`, userError);
      return res.status(500).json({ 
        message: `Failed to delete user: ${userError.message}` 
      });
    }

    console.log(`[DELETE SUCCESS] User ${userId} deleted successfully`);

    return res.status(200).json({ 
      message: 'User deleted successfully.' 
    });

  } catch (err: any) {
    console.error('[DELETE CATCH_ALL ERROR]:', err?.message ?? err);
    return res.status(500).json({ 
      message: `An unexpected error occurred: ${err?.message || 'Unknown error'}` 
    });
  }
}