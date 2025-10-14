// pages/admin0925/help.tsx

import React from 'react';
import SectionHeader from '@/components/ui/SectionHeader';

const HelpPage = () => {
    return (
        <>
            <SectionHeader title="Help & Support" subtitle="Find answers and get assistance." />
            <div className="bg-white p-6 rounded-lg shadow-md mt-6">
                <h3 className="text-xl font-bold text-navy-blue mb-4">Frequently Asked Questions</h3>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-semibold text-gray-800">How do I create a new post?</h4>
                        <p className="text-gray-600">Navigate to the "Content" section from the sidebar and click the "+ New Article" button in the top right.</p>
                    </div>
                    <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-800">What is 'alt text'?</h4>
                        <p className="text-gray-600">Alt text is a short description of an image that helps search engines and screen readers understand what the image is about. It's very important for both SEO and accessibility.</p>
                    </div>
                    <div className="border-t pt-4">
                        <h4 className="font-semibold text-gray-800">What is a 'slug'?</h4>
                        <p className="text-gray-600">The slug is the part of the URL that identifies a specific page. It should be short, descriptive, and contain keywords related to the page content. For example, the slug for this page is `help`.</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default HelpPage;