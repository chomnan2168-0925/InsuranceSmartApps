import { createClient } from '@supabase/supabase-js'
import { useSampleData } from '@/config/featureFlags';

let supabase;

if (useSampleData) {
  // In sample data mode, we use a mock object that mimics the Supabase client interface
  // to avoid errors when components call its methods.
  console.warn('Supabase client is in mocked mode because useSampleData is true.');
  supabase = {
    auth: {
      signInWithPassword: () => ({ error: { message: 'This is a mock instance.' } }),
      signUp: () => ({ error: { message: 'This is a mock instance.' } }),
      signOut: () => Promise.resolve(),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      getSession: () => Promise.resolve({ data: { session: null } }),
    },
    // Add other Supabase methods here if your app uses them
  };
} else {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase URL or Anon Key. Set them in .env.local or enable sample data mode in config/featureFlags.ts')
  }
  supabase = createClient(supabaseUrl, supabaseAnonKey)
}

export { supabase };
