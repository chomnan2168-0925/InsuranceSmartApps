// /components/admin/content/ContentAnalysis.tsx

import React from 'react';

interface ContentAnalysisProps {
    content: string;
}

const ContentAnalysis: React.FC<ContentAnalysisProps> = ({ content }) => {
    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
    
    const calculateReadability = () => {
        if (wordCount < 100) return { score: 'N/A', feedback: 'Add more content for analysis.' };
        const sentences = content.split(/[.!?]+/).length;
        const syllables = content.match(/[aeiouy]{1,2}/g)?.length || 0;
        const score = 206.835 - 1.015 * (wordCount / sentences) - 84.6 * (syllables / wordCount);
        if (score > 90) return { score: 'Very Easy', feedback: 'Great for a broad audience.' };
        if (score > 60) return { score: 'Standard', feedback: 'Easily understood by most people.' };
        return { score: 'Difficult', feedback: 'Consider simplifying sentences.' };
    };
    
    const readability = calculateReadability();

    return (
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
            <h3 className="text-lg font-bold text-navy-blue border-b pb-2">Content Analysis</h3>
            <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-700">Word Count:</span>
                <span className="text-gray-900">{wordCount}</span>
            </div>
            <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-700">Readability:</span>
                <span className="font-bold text-green-700">{readability.score}</span>
            </div>
            <p className="text-xs text-gray-500">{readability.feedback}</p>
        </div>
    );
}

export default ContentAnalysis;