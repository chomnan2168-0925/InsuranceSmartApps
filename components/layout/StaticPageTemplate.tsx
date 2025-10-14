import React from 'react';
import InPostAd from '../admin/settings/InPostAd'; // --- STEP 1: ADD THIS IMPORT ---

interface StaticPageTemplateProps {
  title: string;
  tagline: string;
  content: string; // HTML content
}

const StaticPageTemplate: React.FC<StaticPageTemplateProps> = ({ title, tagline, content }) => {
  return (
    <div className="bg-white p-8 md:p-12 rounded-lg shadow-md">
      <header className="text-center mb-8 border-b pb-6">
        <h1 className="text-xl md:text-2xl font-bold text-navy-blue mb-2">{title}</h1>
        <p className="text-lg text-gray-600">{tagline}</p>
      </header>
      
      {/* --- STEP 2: THIS IS THE FIX --- */}
      {/* The old 'dangerouslySetInnerHTML' div has been replaced with this block */}
      <div className="prose lg:prose-lg max-w-none mx-auto text-gray-800">
  <InPostAd content={content} spacing="my-0" />
</div>

    </div>
  );
};

export default StaticPageTemplate;