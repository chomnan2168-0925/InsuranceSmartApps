import React from 'react';
// FIX: Replaced Post with Article for consistency with type definitions.
import { Article } from '@/types';
import AdminToolbar from '../articles/AdminToolbar';
import ArticleHeader from '../articles/ArticleHeader';
import RecommendedSlider from '../articles/RecommendedSlider';
import TagsSection from '../articles/TagsSection';
import SEO from '../layout/SEO';
import Image from 'next/image';

interface ArticlePageTemplateProps {
  post: Article;
  recommendedPosts: Article[];
}

const ArticlePageTemplate: React.FC<ArticlePageTemplateProps> = ({ post, recommendedPosts }) => {
  return (
    <>
      <SEO title={post.title} description={post.excerpt} />
      <div className="max-w-4xl mx-auto">
        <AdminToolbar slug={post.slug} />

        <article>
          <ArticleHeader post={post} />
          
          <div className="relative w-full h-64 md:h-96 my-8 rounded-lg overflow-hidden shadow-lg">
            <Image src={post.imageUrl} alt={post.title} layout="fill" objectFit="cover" priority />
          </div>

          <div 
            className="prose lg:prose-lg max-w-none mx-auto text-gray-800"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <TagsSection tags={post.tags} />
        </article>
      </div>

      <RecommendedSlider recommendedPosts={recommendedPosts} />
    </>
  );
};

export default ArticlePageTemplate;
