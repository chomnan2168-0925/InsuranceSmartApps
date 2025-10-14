import React from 'react';

const AdvancedSeoTools = () => {
    // Mock sitemap data
    const sitemapStatus = {
        url: 'https://www.hybrid-advisor.com/sitemap.xml',
        lastUpdated: '2025-09-26 10:30 AM',
        status: 'Healthy',
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-navy-blue mb-4">Advanced Tools</h3>
            <div className="space-y-4">
                {/* Sitemap Status Checker */}
                <div>
                    <h4 className="text-lg font-semibold text-gray-800">XML Sitemap Status</h4>
                    <div className="mt-2 p-3 bg-gray-50 rounded-md border text-sm">
                        <div className="flex justify-between items-center">
                            <span>Sitemap URL:</span>
                            <a href={sitemapStatus.url} target="_blank" rel="noopener noreferrer" className="font-mono text-navy-blue hover:underline">{sitemapStatus.url}</a>
                        </div>
                         <div className="flex justify-between items-center mt-1">
                            <span>Last Updated:</span>
                            <span className="text-gray-700">{sitemapStatus.lastUpdated}</span>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                            <span>Status:</span>
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                {sitemapStatus.status}
                            </span>
                        </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">The sitemap is automatically updated when you publish new content.</p>
                </div>
            </div>
        </div>
    );
};

export default AdvancedSeoTools;