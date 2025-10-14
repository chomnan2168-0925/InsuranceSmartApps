// /components/calculators/TagCloud.tsx
import React from 'react';
import Link from 'next/link';

// The component now expects a `tags` prop
interface TagCloudProps {
    tags: string[];
}

const TagCloud: React.FC<TagCloudProps> = ({ tags }) => {
    // If there are no tags for some reason, don't render anything
    if (!tags || tags.length === 0) {
        return null;
    }

    return (
        <section>
            <h3 className="text-2xl font-bold text-navy-blue text-center mb-4">Explore Topics</h3>
            <div className="flex flex-wrap justify-center gap-3 bg-white p-6 rounded-lg shadow-md">
                {/* It now maps over the 'tags' prop from the page */}
                {tags.map(tag => (
                    <Link
                        key={tag}
                        href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                        className="bg-gray-100 text-gray-700 hover:bg-navy-blue hover:text-white px-4 py-2 text-sm font-medium rounded-full transition-colors"
                    >
                        {tag}
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default TagCloud;