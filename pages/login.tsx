import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import SEO from '@/components/layout/SEO';
import SectionHeader from '@/components/ui/SectionHeader';
import { supabase } from '@/lib/supabaseClient';
import { useSampleData } from '@/config/featureFlags';
import sampleUsers from '@/data/sampleUsers.json';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (useSampleData) {
      // Mock login logic
      const user = sampleUsers.users.find(u => u.email === email && u.password === password);
      if (user) {
        localStorage.setItem('sample-auth-token', JSON.stringify({ id: user.id, email: user.email, role: user.role }));
        router.push('/admin0925');
      } else {
        setError('Invalid email or password in sample mode.');
      }
    } else {
      // Real Supabase login
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        router.push('/admin0925');
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <SEO title="Admin Login" />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <SectionHeader title="Admin Login" />
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-navy-blue bg-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-gray-300"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
            <p className="text-sm text-center text-gray-500">
                Need an account?{' '}
                <Link href="/register" className="font-medium text-navy-blue hover:text-gold">
                    Register here
                </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
