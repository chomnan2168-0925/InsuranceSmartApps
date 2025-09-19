import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import SEO from '@/components/layout/SEO';
import SectionHeader from '@/components/ui/SectionHeader';
import { supabase } from '@/lib/supabaseClient';
import { useSampleData } from '@/config/featureFlags';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');
    setLoading(true);

    if (useSampleData) {
        // Mock registration logic
        if (!email.includes('@') || password.length < 6) {
            setError('Please enter a valid email and a password of at least 6 characters.');
        } else {
            setSuccessMessage('Registration successful! In a real app, you would check your email to confirm your account. You can now log in with the details you provided if they exist in sampleUsers.json.');
            setEmail('');
            setPassword('');
        }
    } else {
        // Real Supabase registration
        const { error } = await supabase.auth.signUp({
          email: email,
          password: password,
        });

        if (error) {
          setError(error.message);
        } else {
          setSuccessMessage('Registration successful! Please check your email to confirm your account.');
          setEmail('');
          setPassword('');
        }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <SEO title="Register" />
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <SectionHeader title="Create Admin Account" />
        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {successMessage ? (
            <div className="text-center p-4 bg-green-100 text-green-800 rounded-md">
              <p>{successMessage}</p>
            </div>
          ) : (
            <form onSubmit={handleRegister} className="space-y-6">
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
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue sm:text-sm"
                  placeholder="At least 6 characters"
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-navy-blue bg-gold hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-gray-300"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>
              </div>
            </form>
          )}
           <p className="mt-6 text-sm text-center text-gray-500">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-navy-blue hover:text-gold">
                    Sign in
                </Link>
            </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
