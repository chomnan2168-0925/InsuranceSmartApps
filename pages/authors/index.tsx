import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import SEO from '@/components/layout/SEO';
import SectionHeader from '@/components/ui/SectionHeader';

interface Author {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  avatar_url: string | null;
  specialty: string | null;
  credentials: string[] | null;
  articles_count: number;
}

interface AuthorsPageProps {
  authors: Author[];
}

const AuthorsPage: React.FC<AuthorsPageProps> = ({ authors }) => {
  return (
    <>
      <SEO
  title="Our Authors | Insurance SmartApps"
  description="Meet our team of insurance researchers and consumer advocates who create educational content to help you make informed insurance decisions."
  noindex={true}
/>

      <div className="space-y-8 max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center">
          <SectionHeader 
            title="Meet Our Authors" 
            subtitle="Insurance Researchers & Consumer Advocates"
          />
          <p className="text-lg text-gray-600 mt-4 max-w-3xl mx-auto">
            Our team researches and shares educational content about insurance to help consumers make informed decisions.
          </p>
        </div>

        {/* Important Disclaimer */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg max-w-4xl mx-auto">
          <div className="flex items-start">
            <span className="text-2xl mr-3">📢</span>
            <div>
              <p className="text-sm text-gray-700 font-medium">
                <strong>Educational Content Only:</strong> Our authors are researchers and consumer advocates,
                not licensed insurance professionals or financial advisors. All content is for
                educational purposes. Please consult with qualified professionals for personalized advice.
              </p>
            </div>
          </div>
        </div>

        {/* Authors Grid */}
        {authors && authors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => (
              <Link
                key={author.id}
                href={`/authors/${author.id}`}
                className="group block"
              >
                <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden h-full border border-gray-200 hover:border-blue-400">
                  {/* Author Image Header */}
                  <div className="relative h-40 bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                    <Image
                      src={
                        author.avatar_url || 
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=200&background=1A365D&color=D4AF37&bold=true`
                      }
                      alt={author.name}
                      width={100}
                      height={100}
                      className="rounded-full object-cover ring-4 ring-white shadow-lg group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>

                  {/* Author Info */}
                  <div className="p-5">
                    <h2 className="text-lg font-bold text-navy-blue group-hover:text-blue-600 transition-colors mb-1">
                      {author.name}
                    </h2>
                    <p className="text-sm font-semibold text-gold mb-2">
                      {author.role}
                    </p>

                    {author.specialty && (
                      <p className="text-xs text-gray-500 mb-3 italic">
                        Specialty: {author.specialty}
                      </p>
                    )}

                    <p className="text-sm text-gray-600 line-clamp-3 mb-3">
                      {author.bio || 'Insurance expert and consumer advocate.'}
                    </p>

                    {/* Credentials */}
                    {author.credentials && author.credentials.length > 0 && (
                      <div className="mb-3">
                        <div className="flex flex-wrap gap-1.5">
                          {author.credentials.slice(0, 2).map((cred, idx) => (
                            <span
                              key={idx}
                              className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded"
                            >
                              {cred}
                            </span>
                          ))}
                          {author.credentials.length > 2 && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                              +{author.credentials.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Article Count & CTA */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                      <span className="text-sm text-gray-600">
                        {author.articles_count || 0} {author.articles_count === 1 ? 'Article' : 'Articles'}
                      </span>
                      <span className="text-sm text-blue-600 font-semibold group-hover:translate-x-1 transition-transform">
                        View Profile →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No authors found.</p>
            <p className="text-sm text-gray-400">
              Authors will appear here once they publish articles.
            </p>
          </div>
        )}
      </div>
    </>
  );
};

// ============================================
// 🔒 SECURE SERVER-SIDE RENDERING
// ============================================
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    console.log('[Authors Page] Fetching authors (role=Author only)...');
    
    // ✅ SECURITY: Multi-layer filtering
    // 1. Only fetch role='Author' (excludes Admin, Editor, etc.)
    // 2. Only show authors with at least 1 published article
    // 3. Order by article count (most active first)
    const { data: authors, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'Author')              // 🔒 CRITICAL: Only public authors
      .gte('articles_count', 1)          // ✅ BONUS: Only show active authors
      .order('articles_count', { ascending: false });

    if (error) {
      console.error('[Authors Page] Error fetching authors:', error);
      return {
        props: {
          authors: [],
        },
      };
    }

    console.log('[Authors Page] Found authors:', authors?.length || 0);

    // Transform data to ensure proper types
    const formattedAuthors: Author[] = (authors || []).map((author) => ({
      id: author.id,
      name: author.name || 'Unknown Author',
      role: author.role || 'Author',
      bio: author.bio || null,
      avatar_url: author.avatar_url || null,
      specialty: author.specialty || null,
      credentials: author.credentials || null,
      articles_count: author.articles_count || 0,
    }));

    return {
      props: {
        authors: formattedAuthors,
      },
    };
  } catch (err) {
    console.error('[Authors Page] Unexpected error:', err);
    return {
      props: {
        authors: [],
      },
    };
  }
};

export default AuthorsPage;