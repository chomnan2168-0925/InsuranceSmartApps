// components/templates/ArticlePageTemplate.tsx
// Enhanced version with modern sharing and proper SEO

import React from 'react';
import { Article } from '@/types';
import AdminToolbar from '../articles/AdminToolbar';
import RecommendedSlider from '../articles/RecommendedSlider';
import TagsSection from '../articles/TagsSection';
import SocialShare from '../articles/SocialShare'
import SEO from '../layout/SEO';
import Image from 'next/image';
import Breadcrumb from '../layout/Breadcrumb'
import LayoutWithSidebar from '../layout/LayoutWithSidebar';
import Sidebar from '../layout/Sidebar';
import InPostAd from '@/components/admin/settings/InPostAd';

const AuthorBio: React.FC<{ post: Article }> = ({ post }) => {
  if (!post.author) return null;
  return (
    <div className="mt-12 pt-8 border-t border-gray-200 bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-xl">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Image
            className="h-20 w-20 rounded-full object-cover ring-4 ring-white shadow-lg"
            src={post.author.avatarUrl}
            alt={post.author.name}
            width={80}
            height={80}
          />
        </div>
        <div className="ml-6">
          <p className="text-xs text-gray-500 uppercase font-semibold tracking-wide">About the Author</p>
          <h3 className="text-xl font-bold text-gray-900 mt-1">{post.author.name}</h3>
          <p className="text-sm text-gray-600 mt-2">
            Insurance expert and financial advisor with years of experience helping individuals make informed insurance decisions.
          </p>
        </div>
      </div>
    </div>
  );
};

interface ArticlePageTemplateProps {
  post: Article;
  recommendedPosts: Article[];
  sidebarTopTips: Article[];
  sidebarTopNews: Article[];
  inpostAd?: { code: string; enabled: boolean } | null;
}

const ArticlePageTemplate: React.FC<ArticlePageTemplateProps> = ({
  post,
  recommendedPosts,
  sidebarTopTips,
  sidebarTopNews,
  inpostAd,
}) => {
  if (!post) {
    return <h2>Article not found.</h2>;
  }

  // Construct the full URL for social sharing and SEO
  const categoryPath = post.category === 'Insurance Tips' ? 'insurance-tips' : 'newsroom';
  const fullUrl = `https://www.insurancesmartcalculator.com/${categoryPath}/${post.slug}`;

  // Ensure image URL is absolute
  const getAbsoluteImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return 'https://www.insurancesmartcalculator.com/images/social-share-default.jpg';
    if (imageUrl.startsWith('http')) return imageUrl;
    return `https://www.insurancesmartcalculator.com${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  };

  const absoluteImageUrl = getAbsoluteImageUrl(post.imageUrl);

  // Create the Article schema object with enhanced data
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
    headline: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    image: {
      '@type': 'ImageObject',
      url: absoluteImageUrl,
      width: 1200,
      height: 630,
    },
    ...(post.author && post.showAuthor && {
      author: {
        '@type': 'Person',
        name: post.author.name,
      },
    }),
    publisher: {
      '@type': 'Organization',
      name: 'Insurance SmartApps',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.insurancesmartcalculator.com/logo.png',
      },
    },
    datePublished: post.published_date || post.created_at,
    dateModified: post.last_updated || post.created_at,
    articleSection: post.category,
    keywords: post.targetKeyword || post.tags?.join(', ') || '',
  };

  // Breadcrumb schema
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.insurancesmartcalculator.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.category,
        item: `https://www.insurancesmartcalculator.com/${categoryPath}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: fullUrl,
      },
    ],
  };

  // Combine schemas
  const combinedSchema = {
    '@context': 'https://schema.org',
    '@graph': [articleSchema, breadcrumbSchema],
  };

  return (
    <>
      <SEO
        title={post.metaTitle || post.title}
        description={post.metaDescription || post.excerpt}
        imageUrl={absoluteImageUrl}
        schemaData={combinedSchema}
        keywords={post.targetKeyword}
        canonical={fullUrl}
      />

      <LayoutWithSidebar sidebar={<Sidebar topTips={sidebarTopTips} topNews={sidebarTopNews} />}>
        <div>
          <AdminToolbar slug={post.slug} />

          <article className="bg-white rounded-lg shadow-sm px-3 pt-0.5 pb-0">
            {/* REMOVED: Category label that was showing "Insurance Tips" */}
            
            <h1 className="text-lg md:text-xl font-bold text-navy-blue mt-1 mb-2">
              {post.title}
            </h1>

            {/* Author and Date Display - Conditionally Shown */}
            {post.showAuthor && post.author && (
              <div className="flex items-center space-x-3 mb-4">
                <Image
                  src={post.author.avatarUrl}
                  alt={post.author.name}
                  width={40}
                  height={40}
                  className="rounded-full ring-2 ring-gray-200"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">{post.author.name}</p>
                  {post.showPublishDate && (
                    <p className="text-xs text-gray-500">
                      {new Date(
                        post.published_date ?? post.created_at ?? Date.now()
                      ).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Featured Image - FIXED: No cropping, maintains aspect ratio, reduced bottom spacing */}
            <div className="relative w-full mb-2 rounded-lg overflow-hidden shadow-lg bg-gray-100">
              <Image
                src={post.imageUrl}
                alt={post.title}
                width={1200}
                height={675}
                className="w-full h-auto"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                style={{ objectFit: 'contain' }}
              />
            </div>

            {/* Article Content - Fixed line spacing */}
            <div
              className="prose lg:prose-lg max-w-none mx-auto article-content"
              style={{ lineHeight: '1.75' }}
            >
              <InPostAd content={post.content} adSlot={inpostAd} insertAfterParagraph={2} />
            </div>

            {/* Tags Section */}
            <div className="mt-8">
              <TagsSection tags={post.tags} />
            </div>

            {/* Enhanced Share Section - Bottom of Article */}
            <div className="mt-4 pt-3 border-t-2 border-gray-200 bg-gradient-to-r from-gray-100 to-blue-100 -mx-1 px-5 py-4 rounded-lg">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-1">
                    Found this article helpful?
                  </h3>
                  <p className="text-sm text-gray-600 -mt-1">
                    Share it with friends and family who might benefit from this information.
                  </p>
                </div>
                <div className="flex-shrink-0">
                  <SocialShare
                    url={fullUrl}
                    title={post.title}
                    description={post.excerpt}
                    enhanced={true}
                    compact={false}
                    article={{
                      slug: post.slug,
                      category: post.category,
                      imageUrl: post.imageUrl,
                      author: post.author?.name,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Author Bio */}
            {post.showAuthor && <AuthorBio post={post} />}

            {/* Recommended Articles */}
            <div className="mt-8">
              <RecommendedSlider articles={recommendedPosts} />
            </div>
          </article>
        </div>
      </LayoutWithSidebar>
    </>
  );
};

export default ArticlePageTemplate;