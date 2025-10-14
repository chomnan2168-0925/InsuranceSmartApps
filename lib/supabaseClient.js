import { createClient } from '@supabase/supabase-js';

// Get the Supabase credentials directly from your environment variables.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// --- THIS IS THE NEW DIAGNOSTIC LINE ---
// This will print the values to your server's terminal window.
console.log("--- Supabase Client Initializing ---");
console.log("URL:", supabaseUrl);
console.log("Anon Key:", supabaseAnonKey ? "Key Found (starts with ey...)" : "Key Not Found!");
console.log("------------------------------------");


// Check if the credentials are provided. If not, it's a critical error.
if (!supabaseUrl || !supabaseAnonKey) {
  // This error will crash the app if the variables are missing, which is a good safety check.
  throw new Error('CRITICAL ERROR: Missing Supabase URL or Anon Key. Please check your .env.local file and restart the server.');
}

// Create and export the Supabase client.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);