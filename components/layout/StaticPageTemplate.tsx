import React, { useMemo } from 'react';
import InPostAd from '../admin/settings/InPostAd';

interface StaticPageTemplateProps {
  title: string;
  tagline: string;
  content: string;
}

const StaticPageTemplate: React.FC<StaticPageTemplateProps> = ({ title, tagline, content }) => {
  // Clean the content by removing inline styles and MS Word classes
  const cleanContent = useMemo(() => {
    let cleaned = content;
    
    // Remove all style attributes (inline styles) EXCEPT from ul and ol
    cleaned = cleaned.replace(/(<(?!ul|ol)[^>]+)\s*style="[^"]*"/gi, '$1');
    
    // Remove MS Word classes but keep list structure
    cleaned = cleaned.replace(/\s*class="MsoNormal"/gi, '');
    
    // Remove mso-list and other MS Office specific attributes from list items
    cleaned = cleaned.replace(/\s*mso-list:[^;"]*;?/gi, '');
    cleaned = cleaned.replace(/\s*tab-stops:[^;"]*;?/gi, '');
    
    // Clean up list items but preserve ul/ol structure
    cleaned = cleaned.replace(/<li[^>]*class="MsoNormal"[^>]*>/gi, '<li>');
    
    // Remove type attribute from lists (Word adds this)
    cleaned = cleaned.replace(/<ul[^>]*type="[^"]*"[^>]*>/gi, '<ul>');
    cleaned = cleaned.replace(/<ol[^>]*type="[^"]*"[^>]*>/gi, '<ol>');
    
    // Remove empty class attributes
    cleaned = cleaned.replace(/\s*class=""\s*/gi, ' ');
    
    // Fix margin-top on lists
    cleaned = cleaned.replace(/<ul[^>]*style="margin-top:\s*0in;"[^>]*>/gi, '<ul>');
    cleaned = cleaned.replace(/<ol[^>]*style="margin-top:\s*0in;"[^>]*>/gi, '<ol>');
    
    return cleaned;
  }, [content]);

  return (
    <div className="bg-white p-6 md:p-10 rounded-lg shadow-md">
      {/* Compact header to match editor */}
      <header className="text-center mb-4 border-b pb-3">
        <h1 className="text-xl md:text-2xl font-bold text-navy-blue mb-1">{title}</h1>
        <p className="text-sm md:text-base text-gray-600">{tagline}</p>
      </header>
      
      {/* Apply TinyMCE-like spacing */}
      <div className="max-w-none mx-auto text-gray-800 tinymce-content">
        <InPostAd content={cleanContent} spacing="my-0" />
      </div>
    </div>
  );
};

export default StaticPageTemplate;