import React from 'react';
import SharedLayout from '../SharedLayout';
import SEO from './SEO';

interface StaticPageTemplateProps {
  title: string;
  tagline: string;
  content: string; // HTML content
}

const StaticPageTemplate: React.FC<StaticPageTemplateProps> = ({ title, tagline, content }) => {
  return (
    <SharedLayout hideAds={true}>
      <SEO title={title} />
      <div className="bg-white p-8 md:p-12 rounded-lg shadow-md">
        <header className="text-center mb-8 border-b pb-6">
          <h1 className="text-4xl md:text-5xl font-bold text-navy-blue mb-2">{title}</h1>
          <p className="text-lg text-gray-600">{tagline}</p>
        </header>
        
        <div 
          className="prose lg:prose-lg max-w-none mx-auto text-gray-800"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </div>
    </SharedLayout>
  );
};

export default StaticPageTemplate;

// Add some basic prose styling to globals.css if not using @tailwindcss/typography
// For example:
// .prose h2 { @apply text-2xl font-bold mb-4 mt-6; }
// .prose p { @apply mb-4 leading-relaxed; }
// .prose ul { @apply list-disc list-inside mb-4; }
// .prose a { @apply text-navy-blue hover:underline; }
