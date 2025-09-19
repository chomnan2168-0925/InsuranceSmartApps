

import React from 'react';
import siteConfig from '@/config/siteConfig.json';

// FIX: Changed component to React.FC to correctly handle props like 'key' from .map().
const InputField: React.FC<{ label: string, value: string, name: string, helpText?: string }> = ({ label, value, name, helpText }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type="text"
            id={name}
            name={name}
            defaultValue={value}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-navy-blue focus:border-navy-blue"
        />
        {helpText && <p className="mt-1 text-xs text-gray-500">{helpText}</p>}
    </div>
);

const GeneralSettings = () => {
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Saving general settings... (Mock)');
    // In a real app, you would collect form data and send it to an API.
  };

  return (
    <form onSubmit={handleSave} className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <h3 className="text-xl font-bold text-navy-blue">General Site Settings</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField 
            name="siteName" 
            label="Site Name" 
            value={siteConfig.siteName} 
            helpText="This appears in the header and browser tabs."
        />
        <InputField 
            name="siteDescription" 
            label="Site Description" 
            value={siteConfig.siteDescription}
            helpText="Default meta description for SEO."
        />
      </div>

       <div>
        <h4 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-4">Social Links</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {siteConfig.socialLinks.map(link => (
                <InputField
                    key={link.name}
                    name={`social_${link.name.toLowerCase()}`}
                    label={`${link.name} URL`}
                    value={link.url}
                />
            ))}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button type="submit" className="bg-gold hover:bg-yellow-400 text-navy-blue font-bold py-2 px-4 rounded-md">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default GeneralSettings;