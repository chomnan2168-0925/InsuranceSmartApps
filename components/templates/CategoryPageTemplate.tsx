import React from 'react';
// FIX: Replaced Post with Article for consistency with type definitions.
import { Article } from '@/types';
import ArticleCard from '@/components/home/ArticleCard';
import Pagination from '@/components/ui/Pagination';
import SectionHeader from '@/components/ui/SectionHeader';
import SEO from '../layout/SEO';

interface CategoryPageTemplateProps {
  categoryName: string;
  categoryDescription: string;
  posts: Article[];
  currentPage: number;
  totalPages: number;
}

const CategoryPageTemplate: React.FC<CategoryPageTemplateProps> = ({
  categoryName,
  categoryDescription,
  posts,
  currentPage,
  totalPages,
}) => {
  const basePath = `/${categoryName.toLowerCase().replace(' ', '-')}`;
  return (
    <>
      <SEO title={categoryName} description={categoryDescription} />
      <div className="space-y-12">
        <SectionHeader title={categoryName} subtitle={categoryDescription} />
        
        {posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              // FIX: The ArticleCard component expects an 'article' prop, not 'post'.
              <ArticleCard key={post.slug} article={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-700">No articles found.</h2>
            <p className="text-gray-500 mt-2">Check back later for more content in this category.</p>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-12">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath={basePath}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default CategoryPageTemplate;
