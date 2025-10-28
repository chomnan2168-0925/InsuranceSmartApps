// components/templates/ArticlePageTemplate.tsx
// Clean SEO-enhanced version - keeps your styling, adds only SEO essentials

import React from 'react';
import { Article } from '@/types';
import AdminToolbar from '../articles/AdminToolbar';
import RecommendedSlider from '../articles/RecommendedSlider';
import TagsSection from '../articles/TagsSection';
import SocialShare from '../articles/SocialShare';
import SEO from '../layout/SEO';
import Image from 'next/image';
import Breadcrumb from '../layout/Breadcrumb';
import LayoutWithSidebar from '../layout/LayoutWithSidebar';
import Sidebar from '../layout/Sidebar';
import InPostAd from '@/components/admin/settings/InPostAd';
import Link from 'next/link';
import siteConfig from '@/config/siteConfig.json';

// Simple Author & Date Metadata Component - ENHANCED for SEO
const ArticleMetadata: React.FC<{ post: Article }> = ({ post }) => {
  // Show updated date if it exists, otherwise published date
  const displayDate = post.last_updated || post.published_date || post.created_at;
  const dateLabel = post.last_updated ? 'Updated' : 'Published';
  
  return (
    <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-600">
      <div className="flex flex-col gap-2">
        {/* Single Date Display with Icon - SEO optimized with <time> tag */}
        {displayDate && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <span className="font-semibold text-gray-700">{dateLabel}:</span>{' '}
              <time dateTime={displayDate}>
                {new Date(displayDate).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </div>
        )}
        
        {/* Author - with matching icon */}
        {post.author && (
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <div>
              <span className="font-semibold text-gray-700">Written by:</span>{' '}
              <Link 
                href={`/authors/${post.author.id}`}
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
              >
                {post.author.name}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Extract FAQs from content - PURE SEO ENHANCEMENT
const extractFAQs = (content: string): Array<{question: string; answer: string}> => {
  const faqs: Array<{question: string; answer: string}> = [];
  
  // Match H2/H3 headers that look like questions
  const headerRegex = /<h[23][^>]*>(.*?)<\/h[23]>/gi;
  const headers = content.match(headerRegex) || [];
  
  headers.forEach((header) => {
    const question = header.replace(/<[^>]*>/g, '').trim();
    
    // Check if it's a question
    if (question.includes('?') || 
        /^(how|what|why|when|where|which|who|can|should|do|does|is|are)/i.test(question)) {
      
      // Extract the paragraph after this header
      const headerIndex = content.indexOf(header);
      const afterHeader = content.substring(headerIndex + header.length);
      const nextParagraph = afterHeader.match(/<p[^>]*>(.*?)<\/p>/i);
      
      if (nextParagraph && nextParagraph[1]) {
        const answer = nextParagraph[1].replace(/<[^>]*>/g, '').trim();
        
        if (answer.length >= 50 && answer.length <= 500) {
          faqs.push({ question, answer });
        }
      }
    }
  });
  
  return faqs.slice(0, 5); // Limit to 5 FAQs
};

// Extract keywords - PURE SEO ENHANCEMENT
const extractKeywords = (post: Article): string[] => {
  const keywords = new Set<string>();
  
  post.tags?.forEach(tag => keywords.add(tag));
  
  // ✅ FIXED: Store the keyword value first to ensure type safety
  const targetKeyword = post.targetKeyword || post.target_keyword;
  if (targetKeyword) {
    keywords.add(targetKeyword);
  }
  
  keywords.add(post.category.toLowerCase());
  keywords.add('insurance');
  keywords.add('insurance tips');
  
  return Array.from(keywords);
};

// Calculate reading time - PURE SEO ENHANCEMENT
const calculateReadingTime = (content: string): number => {
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(wordCount / 200); // 200 words per minute
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

  // Construct URLs
  const categoryPath = post.category === 'Insurance Tips' ? 'insurance-tips' : 'newsroom';
  const fullUrl = `https://www.insurancesmartcalculator.com/${categoryPath}/${post.slug}`;

  // Ensure absolute image URL
  const getAbsoluteImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return siteConfig.defaultOgImage;
  if (imageUrl.startsWith('http')) return imageUrl;
  return `https://www.insurancesmartcalculator.com${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

  const absoluteImageUrl = getAbsoluteImageUrl(post.imageUrl);

  // SEO ENHANCEMENTS - Extract data for schemas
  const faqs = extractFAQs(post.content);
  const keywords = extractKeywords(post);
  const readingTime = calculateReadingTime(post.content);

  // Generate breadcrumbs for schema
  const breadcrumbs = [
    { name: 'Home', url: 'https://www.insurancesmartcalculator.com/' },
    { name: post.category, url: `https://www.insurancesmartcalculator.com/${categoryPath}` },
    { name: post.title, url: fullUrl },
  ];

  return (
    <>
      {/* ENHANCED SEO Component - Only change is passing more data */}
      <SEO
        title={post.metaTitle || post.meta_title || post.title}
        description={post.metaDescription || post.meta_description || post.excerpt}
        imageUrl={absoluteImageUrl}
        canonical={fullUrl}
        
        // Article-specific metadata
        isArticle={true}
        publishedDate={post.published_date || post.created_at}
        modifiedDate={post.last_updated || post.created_at}
        author={{
          name: post.author?.name || 'Insurance SmartCalculator Team',
          url: post.author?.id ? `https://www.insurancesmartcalculator.com/authors/${post.author.id}` : undefined,
          image: post.author?.avatar_url
        }}
        category={post.category}
        tags={post.tags || []}
        
        // SEO ENHANCEMENTS - New props that create schemas
        breadcrumbs={breadcrumbs}
        faqs={faqs.length > 0 ? faqs : undefined}
        keywords={keywords}
        readingTime={readingTime}
      />

      <LayoutWithSidebar sidebar={<Sidebar topTips={sidebarTopTips} topNews={sidebarTopNews} />}>
        <div>
          <AdminToolbar slug={post.slug} />

          {/* Changed div to article for semantic HTML - SEO best practice */}
          <article className="bg-white rounded-lg shadow-sm px-3 pt-0.5 pb-0">
            {/* Keep your original title - no changes to spacing */}
            <h1 className="text-lg md:text-xl font-bold text-navy-blue mt-1 mb-2">
              {post.title}
            </h1>

            {/* Featured Image - Minor SEO enhancement with figure tag */}
            <figure className="relative w-full mb-2 rounded-lg overflow-hidden shadow-lg bg-gray-100">
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
              {/* Hidden caption for accessibility/SEO */}
              <figcaption className="sr-only">{post.title}</figcaption>
            </figure>

            {/* Article Content - Added itemProp for schema.org microdata */}
            <div
              className="prose lg:prose-lg max-w-none mx-auto article-content -mt-3"
              style={{ lineHeight: '1.75' }}
              itemProp="articleBody"
            >
              <InPostAd content={post.content} adSlot={inpostAd} insertAfterParagraph={2} />
            </div>

            {/* Tags Section - No changes */}
            <div className="mt-8">
              <TagsSection tags={post.tags} />
            </div>

            {/* Enhanced Metadata - Shows single date with icon */}
            <ArticleMetadata post={post} />

            {/* Enhanced Share Section - No visual changes, just better structure */}
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

            {/* Recommended Articles - "Don't Miss These!" Slider */}
            <div className="mt-8">
              <RecommendedSlider articles={recommendedPosts} title="Don't Miss These!" />
            </div>
          </article>
        </div>
      </LayoutWithSidebar>
    </>
  );
};

export default ArticlePageTemplate;