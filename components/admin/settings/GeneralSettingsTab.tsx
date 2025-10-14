import React, { useEffect, useState } from 'react';

// This is the "blueprint" for the data we expect from siteConfig.json
interface SiteConfig {
  siteName: string;
  contactEmail: string; // Assuming you add this to siteConfig.json
  copyright: string;    // Assuming you add this to siteConfig.json
  socialLinks: { name: string; url: string; icon: string }[];
  [key: string]: any; // Allows for other properties like 'navLinks' etc.
}

const GeneralSettingsTab: React.FC = () => {
  // This state holds the data in the component's memory
  const [settings, setSettings] = useState<Partial<SiteConfig>>({
    siteName: '',
    contactEmail: '',
    copyright: '',
    socialLinks: [],
  });
  const [statusMessage, setStatusMessage] = useState('Loading settings...');

  // --- This fetches the current settings from the API when the page loads ---
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings/general');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
          setStatusMessage(''); // Clear loading message
        } else {
          setStatusMessage('Error: Could not load site settings.');
        }
      } catch (error) {
        setStatusMessage('Error: Failed to connect to API.');
      }
    };
    fetchSettings();
  }, []); // The empty array [] means this runs only once.

  // --- This handles changes for simple input fields like siteName ---
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings((prev) => ({ ...prev, [name]: value }));
  };
  
  // --- This handles changes for the more complex social media links ---
  const handleSocialChange = (name: string, url: string) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).map(link => 
        link.name.toLowerCase() === name.toLowerCase() ? { ...link, url } : link
      ),
    }));
  };

  // --- This saves the settings by sending them to our API ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Saving...');
    
    const res = await fetch('/api/settings/general', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    if (res.ok) {
      setStatusMessage('Settings saved successfully! Changes will appear after you re-deploy.');
    } else {
      setStatusMessage('Error: Failed to save settings.');
    }
  };

  // Helper function to safely find a social link URL
  const getSocialUrl = (name: string) => {
    return (settings.socialLinks || []).find(link => link.name.toLowerCase() === name.toLowerCase())?.url || '';
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h3 className="text-xl font-bold text-navy-blue">General Site Information</h3>
        <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Site Name</label>
            <input
              type="text"
              name="siteName"
              value={settings.siteName || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Email</label>
            <input
              type="email"
              name="contactEmail"
              value={settings.contactEmail || ''}
              onChange={handleChange}
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm"
            />
          </div>
        </div>
        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700">Copyright Text</label>
          <input
            type="text"
            name="copyright"
            value={settings.copyright || ''}
            onChange={handleChange}
            className="mt-1 w-full p-2 border rounded-md"
          />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h3 className="text-xl font-bold text-navy-blue">Social Media URLs</h3>
        <div className="border-t pt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Facebook URL</label>
            <input
              type="url"
              value={getSocialUrl('Facebook')}
              onChange={e => handleSocialChange('Facebook', e.target.value)}
              placeholder="https://facebook.com/..."
              className="mt-1 w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm">LinkedIn URL</label>
            <input
              type="url"
              value={getSocialUrl('LinkedIn')}
              onChange={e => handleSocialChange('LinkedIn', e.target.value)}
              placeholder="https://linkedin.com/..."
              className="mt-1 w-full p-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm">YouTube URL</label>
            <input
              type="url"
              value={getSocialUrl('YouTube')}
              onChange={e => handleSocialChange('YouTube', e.target.value)}
              placeholder="https://youtube.com/..."
              className="mt-1 w-full p-2 border rounded-md"
            />
          </div>
          {/* Note: Removed Twitter as it wasn't in your latest siteConfig.json */}
        </div>
      </div>

      <div className="flex justify-end items-center gap-4 pt-4">
        {statusMessage && <p className="text-sm text-gray-600">{statusMessage}</p>}
        <button
          type="submit"
          className="bg-gold hover:bg-yellow-400 text-navy-blue font-bold py-2 px-4 rounded-md"
        >
          Save General Settings
        </button>
      </div>
    </form>
  );
};

export default GeneralSettingsTab;