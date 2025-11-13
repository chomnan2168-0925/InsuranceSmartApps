import React from 'react';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import SEO from '@/components/layout/SEO';
import SectionHeader from '@/components/ui/SectionHeader';
import ArticleCard from '@/components/home/ArticleCard';
import { Article } from '@/types';

interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  avatarUrl?: string;
  specialty: string;
  credentials: string[];
  articlesCount: number;
}

interface AuthorProfilePageProps {
  author: Author;
  articles: Article[];
}

const AuthorProfilePage: React.FC<AuthorProfilePageProps> = ({ author, articles }) => {
  const fullUrl = `https://www.insurancesmartcalculator.com/authors/${author.id}`;
  const imageUrl = author.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=400&background=1A365D&color=D4AF37&bold=true`;

  return (
    <>
      <SEO
        title={`${author.name} | Insurance SmartApps Authors`}
        description={author.bio}
        imageUrl={imageUrl}
        noindex={true}
      />

      <div className="space-y-8">
        {/* Back Link */}
        <Link
          href="/authors"
          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-semibold"
        >
          ← Back to All Authors
        </Link>

        {/* Author Profile Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-24 md:h-32"></div>
          
          <div className="px-6 md:px-8 pb-8">
            {/* Avatar & Basic Info */}
            <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 md:-mt-16 mb-6">
              {/* Avatar */}
              <div className="relative mb-4 md:mb-0 flex-shrink-0">
                <Image
                  src={imageUrl}
                  alt={author.name}
                  width={120}
                  height={120}
                  className="rounded-full object-cover ring-8 ring-white shadow-xl"
                />
              </div>

              {/* Name & Role */}
              <div className="md:ml-6 flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-navy-blue mb-2">
                  {author.name}
                </h1>
                <p className="text-lg font-semibold text-gold mb-2">
                  {author.role}
                </p>
                {author.specialty && (
                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-semibold">Specialty:</span> {author.specialty}
                  </p>
                )}
                <p className="text-sm text-gray-600">
                  {author.articlesCount || 0} Published {author.articlesCount === 1 ? 'Article' : 'Articles'}
                </p>
              </div>
            </div>

            {/* Credentials */}
            {author.credentials && author.credentials.length > 0 && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Experience & Background</h3>
                <div className="flex flex-wrap gap-2">
                  {author.credentials.map((cred, idx) => (
                    <span
                      key={idx}
                      className="text-sm bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg font-medium inline-flex items-center"
                    >
                      <span className="mr-1">✓</span> {cred}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Bio */}
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">
                About {author.name.split(' ')[0]}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {author.bio}
              </p>
            </div>

            {/* Educational Disclaimer */}
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <div className="flex items-start">
                <span className="text-xl mr-2 flex-shrink-0">⚠️</span>
                <p className="text-sm text-gray-700">
                  <strong>Educational Content Only:</strong> {author.name} is not a licensed
                  insurance professional or financial advisor. All content is for educational
                  purposes. Please consult with qualified professionals for personalized advice.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Section */}
        <div>
          <SectionHeader 
            title={`Articles by ${author.name}`}
            subtitle={`${articles.length} ${articles.length === 1 ? 'article' : 'articles'} published`}
          />

          {articles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
              {articles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200 mt-6">
              <p className="text-gray-500">No published articles yet. Check back soon!</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const authorId = params?.authorId as string;

  console.log('[Author Profile] Fetching author:', authorId);

  const { data: author, error: authorError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authorId)
    .eq('role', 'Author')
    .single();

  if (authorError || !author) {
    console.error('[Author Profile] Error or unauthorized role:', authorError);
    return {
      notFound: true,
    };
  }

  console.log('[Author Profile] Authorized Author found:', author.name);

  const { data: articles, error: articlesError } = await supabase
    .from('articles')
    .select(`
      *,
      author:profiles!author_id (
        id,
        name
      )
    `)
    .eq('author_id', authorId)
    .eq('status', 'Published')
    .order('publishedDate', { ascending: false });

  if (articlesError) {
    console.error('[Author Profile] Error fetching articles:', articlesError);
  }

  console.log('[Author Profile] Found articles:', articles?.length || 0);

  return {
    props: {
      author,
      articles: articles || [],
    },
  };
};

export default AuthorProfilePage;
