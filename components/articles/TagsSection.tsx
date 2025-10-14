import React from 'react';
import Link from 'next/link';

interface TagsSectionProps {
  tags?: string[];
}

const TagsSection: React.FC<TagsSectionProps> = ({ tags }) => {
  if (!tags || tags.length === 0) {
    return null;
  }

  return (
    // --- UPDATED: Padding reduced from pt-6 to pt-4 for a smaller field ---
    <div className="mt-1 pt-2 border-t border-gray-200">
      <div className="flex items-center flex-wrap gap-x-1 gap-y-2">
        
        {/* --- UPDATED: Label font size reduced to text-sm to match --- */}
        <span className="text-sm font-semibold text-gray-900">Tags:</span>
        
        <div className="flex flex-wrap gap-1">
          {tags.map((tag) => (
            <Link
              key={tag}
              href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}
              className="bg-gray-100 text-gray-800 hover:bg-gray-200 px-3 py-1 text-sm font-medium rounded-full transition-colors"
            >
              {tag}
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
};

export default TagsSection;