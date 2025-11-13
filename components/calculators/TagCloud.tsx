// /components/calculators/TagCloud.tsx
// ✅ SEO-FRIENDLY VERSION with "Show More" functionality

import React, { useState } from 'react';
import Link from 'next/link';

interface TagCloudProps {
    tags: string[];
    initialLimit?: number; // ✅ Show this many initially (default: 30)
}

const TagCloud: React.FC<TagCloudProps> = ({ tags, initialLimit = 30 }) => {
    const [showAll, setShowAll] = useState(false);

    // If there are no tags, don't render anything
    if (!tags || tags.length === 0) {
        return null;
    }

    // Determine which tags to display
    const displayedTags = showAll ? tags : tags.slice(0, initialLimit);
    const hasMoreTags = tags.length > initialLimit;

    return (
        <section>
            <h3 className="text-2xl font-bold text-navy-blue text-center mb-4">Explore Topics</h3>
            <div className="flex flex-wrap justify-center gap-3 bg-white p-6 rounded-lg shadow-md">
                {displayedTags.map(tag => (
                    <Link
                        key={tag}
                        href={`/tags/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                        className="bg-gray-100 text-gray-700 hover:bg-navy-blue hover:text-white px-4 py-2 text-sm font-medium rounded-full transition-colors"
                    >
                        {tag}
                    </Link>
                ))}
            </div>
            
            {/* ✅ SEO-FRIENDLY: Show More button */}
            {hasMoreTags && !showAll && (
                <div className="text-center mt-4">
                    <button
                        onClick={() => setShowAll(true)}
                        className="px-6 py-2 bg-navy-blue text-white font-semibold rounded-full hover:bg-blue-800 transition-colors"
                    >
                        Show All {tags.length} Topics ({tags.length - initialLimit} more)
                    </button>
                </div>
            )}

            {/* ✅ Optional: Show Less button */}
            {showAll && hasMoreTags && (
                <div className="text-center mt-4">
                    <button
                        onClick={() => setShowAll(false)}
                        className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-full hover:bg-gray-300 transition-colors"
                    >
                        Show Less
                    </button>
                </div>
            )}
        </section>
    );
};

export default TagCloud;
