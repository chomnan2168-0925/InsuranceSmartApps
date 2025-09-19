import React from 'react';
// FIX: Replaced Post with Article for consistency with type definitions.
import { Article } from '@/types';
import SectionHeader from '../ui/SectionHeader';
import ArticleCard from '../home/ArticleCard';

interface RecommendedSliderProps {
  recommendedPosts: Article[];
}

const RecommendedSlider: React.FC<RecommendedSliderProps> = ({ recommendedPosts }) => {
  if (!recommendedPosts || recommendedPosts.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 py-12 bg-gray-50 rounded-lg">
      <div className="container mx-auto px-4">
        <SectionHeader title="You Might Also Like" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {recommendedPosts.map((post) => (
            // FIX: The ArticleCard component expects an 'article' prop, not 'post'.
            <ArticleCard key={post.slug} article={post} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedSlider;
