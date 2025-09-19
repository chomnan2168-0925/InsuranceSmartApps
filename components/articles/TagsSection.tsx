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
    <div className="mt-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Tags:</h3>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            // In a real app, this would link to a tag archive page
            href={`/tags/${tag.toLowerCase().replace(/ /g, '-')}`}
            key={tag}
            className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-full text-sm font-medium transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default TagsSection;
