import React from 'react';

const GlobalSeoSettings = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-navy-blue">Global Meta Tags</h3>
      <div className="mt-4 border-t pt-4 text-sm text-gray-700 bg-blue-50 p-4 rounded-md">
        <p className="font-semibold">Note for the Site Administrator:</p>
        <p className="mt-2">
          The SEO Title and Meta Description for the Homepage are currently managed directly in the code for performance and stability.
        </p>
        <p className="mt-2">
          To make changes, please edit the <code>/pages/index.tsx</code> file and re-deploy the website.
        </p>
      </div>
    </div>
  );
};

export default GlobalSeoSettings;