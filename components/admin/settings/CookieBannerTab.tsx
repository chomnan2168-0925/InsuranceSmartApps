import React, { useEffect, useState } from 'react';

interface CookieBannerSettings {
  enabled: boolean;
  excludePaths: string[];
  style: 'corner' | 'minimal';
  position: 'bottom-left' | 'bottom-right';
}

const CookieBannerTab: React.FC = () => {
  const [settings, setSettings] = useState<CookieBannerSettings>({
    enabled: true,
    excludePaths: [],
    style: 'corner',
    position: 'bottom-right',
  });
  const [newPath, setNewPath] = useState('');
  const [statusMessage, setStatusMessage] = useState('Loading settings...');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings/cookie-banner');
        if (res.ok) {
          const data = await res.json();
          setSettings(data);
          setStatusMessage('');
        } else {
          setStatusMessage('Using default settings');
        }
      } catch (error) {
        setStatusMessage('Error: Failed to load settings');
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage('Saving...');
    
    const res = await fetch('/api/settings/cookie-banner', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings),
    });

    if (res.ok) {
      setStatusMessage('✅ Settings saved successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } else {
      setStatusMessage('❌ Error: Failed to save settings');
    }
  };

  const addExcludePath = () => {
    if (newPath && !settings.excludePaths.includes(newPath)) {
      setSettings({
        ...settings,
        excludePaths: [...settings.excludePaths, newPath]
      });
      setNewPath('');
    }
  };

  const removePath = (path: string) => {
    setSettings({
      ...settings,
      excludePaths: settings.excludePaths.filter(p => p !== path)
    });
  };

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {/* Enable/Disable */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h3 className="text-xl font-bold text-navy-blue">Cookie Banner Control</h3>
        <div className="border-t pt-4">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="enabled"
              checked={settings.enabled}
              onChange={(e) => setSettings({ ...settings, enabled: e.target.checked })}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
              Enable Cookie Consent Banner
            </label>
          </div>
          <p className="text-xs text-gray-500 mt-2 ml-8">
            Turn this off to hide the cookie banner site-wide
          </p>
        </div>
      </div>

      {/* Style Settings */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h3 className="text-xl font-bold text-navy-blue">Banner Appearance</h3>
        <div className="border-t pt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Style</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="style"
                  value="corner"
                  checked={settings.style === 'corner'}
                  onChange={(e) => setSettings({ ...settings, style: e.target.value as 'corner' })}
                  className="text-blue-600"
                />
                <span className="text-sm">Corner Box (Recommended)</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="style"
                  value="minimal"
                  checked={settings.style === 'minimal'}
                  onChange={(e) => setSettings({ ...settings, style: e.target.value as 'minimal' })}
                  className="text-blue-600"
                />
                <span className="text-sm">Minimal Bar</span>
              </label>
            </div>
          </div>

          {settings.style === 'corner' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="position"
                    value="bottom-right"
                    checked={settings.position === 'bottom-right'}
                    onChange={(e) => setSettings({ ...settings, position: e.target.value as 'bottom-right' })}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Bottom Right</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="position"
                    value="bottom-left"
                    checked={settings.position === 'bottom-left'}
                    onChange={(e) => setSettings({ ...settings, position: e.target.value as 'bottom-left' })}
                    className="text-blue-600"
                  />
                  <span className="text-sm">Bottom Left</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Exclude Pages */}
      <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
        <h3 className="text-xl font-bold text-navy-blue">Exclude Pages</h3>
        <div className="border-t pt-4">
          <p className="text-sm text-gray-600 mb-3">
            Hide the cookie banner on specific pages (e.g., admin pages, thank you pages)
          </p>
          
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newPath}
              onChange={(e) => setNewPath(e.target.value)}
              placeholder="/thank-you"
              className="flex-1 px-3 py-2 border rounded-md text-sm"
            />
            <button
              type="button"
              onClick={addExcludePath}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Add Path
            </button>
          </div>

          {settings.excludePaths.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-700">Excluded Paths:</p>
              {settings.excludePaths.map((path) => (
                <div key={path} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md">
                  <span className="text-sm text-gray-700">{path}</span>
                  <button
                    type="button"
                    onClick={() => removePath(path)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end items-center gap-4 pt-4">
        {statusMessage && (
          <p className={`text-sm ${statusMessage.includes('✅') ? 'text-green-600' : 'text-gray-600'}`}>
            {statusMessage}
          </p>
        )}
        <button
          type="submit"
          className="bg-gold hover:bg-yellow-400 text-navy-blue font-bold py-2 px-6 rounded-md"
        >
          Save Cookie Banner Settings
        </button>
      </div>

      {/* Preview Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-bold text-blue-900 mb-2">💡 Preview</h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Banner is {settings.enabled ? 'enabled' : 'disabled'}</li>
          <li>• Style: {settings.style === 'corner' ? 'Corner Box' : 'Minimal Bar'}</li>
          {settings.style === 'corner' && (
            <li>• Position: {settings.position === 'bottom-right' ? 'Bottom Right' : 'Bottom Left'}</li>
          )}
          <li>• Excluded pages: {settings.excludePaths.length || 'None'}</li>
          <li>• Banner shows once per visitor (stored for 1 year)</li>
          <li>• Appears after 2-second delay</li>
          <li>• Auto-accepts after 5 seconds if no interaction</li>
          <li>• Click outside banner to minimize to 🍪 button</li>
        </ul>
      </div>
    </form>
  );
};

export default CookieBannerTab;