import React from 'react';
import { GetStaticProps } from 'next';
import SectionHeader from '@/components/ui/SectionHeader';
import MainCalculator from '@/components/home/MainCalculator';
import SidebarWidget from '@/components/home/SidebarWidget';
import ArticleCard from '@/components/home/ArticleCard';
import { Article } from '@/types';
import Link from 'next/link';
import SEO from '@/components/layout/SEO';
import sampleArticles from '@/data/sampleArticles.json';

interface HomePageProps {
  latestNews: Article[];
  latestTips: Article[];
}

const HomePage: React.FC<HomePageProps> = ({ latestNews, latestTips }) => {
  const allArticles = [...latestNews, ...latestTips].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 3);
  
  return (
    <>
      <SEO />
      <div className="space-y-16">
        <section className="text-center bg-white p-8 rounded-lg shadow-md">
          <h1 className="text-4xl md:text-5xl font-bold text-navy-blue mb-4">
            Smarter Financial Planning, Simplified.
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Combining expert human advice with powerful technology to help you achieve your financial goals. Get started with our free retirement calculator.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <MainCalculator />
          </div>
          <aside>
            <SidebarWidget title="Latest News">
              <ul className="space-y-3">
                {latestNews.slice(0, 3).map(article => (
                  <li key={article.id} className="border-b pb-2 last:border-b-0">
                    <Link href={`/${article.category.toLowerCase()}/${article.slug}`} className="hover:text-gold text-navy-blue transition-colors">
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </SidebarWidget>
             <SidebarWidget title="Popular Tips">
              <ul className="space-y-3">
                {latestTips.slice(0, 3).map(article => (
                  <li key={article.id} className="border-b pb-2 last:border-b-0">
                    <Link href={`/${article.category.toLowerCase()}/${article.slug}`} className="hover:text-gold text-navy-blue transition-colors">
                      {article.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </SidebarWidget>
          </aside>
        </div>

        <section>
          <SectionHeader
            title="Latest Articles & Tips"
            subtitle="Stay informed with our latest insights on financial planning, investing, and market news."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  // In sample data mode, we read from the local JSON file.
  const news = sampleArticles.articles.filter(a => a.category === 'News' && a.status === 'Published').slice(0, 6);
  const tips = sampleArticles.articles.filter(a => a.category === 'Tips' && a.status === 'Published').slice(0, 6);
  
  return {
    props: {
      latestNews: news,
      latestTips: tips,
    },
  };
};

export default HomePage;
