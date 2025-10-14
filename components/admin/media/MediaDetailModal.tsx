import React, { useState, useEffect } from 'react';
import { Media } from '@/types';

interface MediaDetailModalProps {
  media: Media | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: () => void;
}

const MediaDetailModal: React.FC<MediaDetailModalProps> = ({ 
  media, 
  isOpen, 
  onClose, 
  onUpdate 
}) => {
  const [altText, setAltText] = useState('');
  const [caption, setCaption] = useState('');
  const [newName, setNewName] = useState('');
  const [isRenaming, setIsRenaming] = useState(false);
  const [findingUsage, setFindingUsage] = useState(false);
  const [usageInfo, setUsageInfo] = useState<{
    articles: Array<{ id: string; title: string; slug: string }>;
    count: number;
  } | null>(null);

  useEffect(() => {
    if (media) {
      setAltText(media.altText || '');
      setCaption(media.caption || '');
      setNewName(media.name || '');
      setUsageInfo(null); // Reset usage info
    }
  }, [media]);

  if (!isOpen || !media) return null;

  const handleSave = async () => {
    try {
      alert(`Saving details for ${media.name}: Alt Text - "${altText}", Caption - "${caption}" (Mock)`);
      onClose();
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save changes');
    }
  };

  const checkImageUsage = async () => {
    if (!media) return;

    setFindingUsage(true);
    
    try {
      const response = await fetch('/api/media/check-usage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId: media.publicId }),
      });

      if (response.ok) {
        const data = await response.json();
        setUsageInfo(data);
      } else {
        alert('Failed to check image usage');
      }
    } catch (error) {
      console.error('Error checking usage:', error);
      alert('Error checking image usage');
    } finally {
      setFindingUsage(false);
    }
  };

  const handleSafeRename = async () => {
    if (!newName || newName === media.name) {
      alert('Please enter a different name');
      return;
    }

    // Check usage first
    if (!usageInfo) {
      alert('Please check image usage first by clicking "Check Usage"');
      return;
    }

    const slug = newName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    const pathParts = media.publicId.split('/');
    const folder = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') + '/' : '';
    const newPublicId = folder + slug;

    // Warning message
    const warningMsg = usageInfo.count > 0
      ? `⚠️ This image is used in ${usageInfo.count} article(s):\n\n` +
        usageInfo.articles.map(a => `• ${a.title}`).join('\n') +
        `\n\nThe system will automatically update all references.\n\nRename from "${media.name}" to "${slug}"?`
      : `Rename image from "${media.name}" to "${slug}"?\n\nThis image is not currently used in any articles.`;

    const confirmed = confirm(warningMsg);
    if (!confirmed) return;

    setIsRenaming(true);

    try {
      // Use safe rename API with article IDs
      const renamePromises = usageInfo.count > 0
        ? usageInfo.articles.map(article =>
            fetch('/api/media/safe-rename', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                oldPublicId: media.publicId,
                newPublicId: newPublicId,
                articleId: article.id,
              }),
            })
          )
        : [
            fetch('/api/media/safe-rename', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                oldPublicId: media.publicId,
                newPublicId: newPublicId,
              }),
            })
          ];

      const results = await Promise.all(renamePromises);
      const allSuccessful = results.every(r => r.ok);

      if (allSuccessful) {
        alert(
          usageInfo.count > 0
            ? `✅ Image renamed successfully!\n\nUpdated ${usageInfo.count} article(s) automatically.`
            : '✅ Image renamed successfully!'
        );
        onUpdate?.();
        onClose();
      } else {
        alert('⚠️ Some updates failed. Please check the console for details.');
      }
    } catch (error) {
      console.error('Error renaming:', error);
      alert('Error during rename process');
    } finally {
      setIsRenaming(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl flex flex-col md:flex-row max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="w-full md:w-2/3 p-4 flex items-center justify-center bg-gray-100 rounded-t-lg md:rounded-l-lg md:rounded-t-none">
          <img src={media.url} alt="Preview" className="max-h-[70vh] w-full object-contain"/>
        </div>
        <div className="w-full md:w-1/3 p-6 space-y-4 flex flex-col overflow-y-auto">
          <h3 className="text-lg font-bold text-navy-blue border-b pb-2">Media Details</h3>
          
          {/* Safe Rename Section */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              🔄 Safe Rename (SEO)
            </label>
            
            {/* Check Usage Button */}
            {!usageInfo && (
              <button
                onClick={checkImageUsage}
                disabled={findingUsage}
                className="w-full mb-2 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold disabled:opacity-50 text-sm"
              >
                {findingUsage ? 'Checking...' : '1. Check Usage First'}
              </button>
            )}

            {/* Usage Info */}
            {usageInfo && (
              <div className="mb-2 p-2 bg-white rounded border text-sm">
                {usageInfo.count > 0 ? (
                  <>
                    <p className="font-semibold text-orange-600 mb-1">
                      ⚠️ Used in {usageInfo.count} article(s):
                    </p>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {usageInfo.articles.map(article => (
                        <li key={article.id}>• {article.title}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-green-600 mt-2">
                      ✅ All references will be updated automatically
                    </p>
                  </>
                ) : (
                  <p className="text-green-600 font-semibold">
                    ✅ Safe to rename - Not used in any articles
                  </p>
                )}
              </div>
            )}

            {/* Rename Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm"
                placeholder="new-seo-friendly-name"
              />
              <button
                onClick={handleSafeRename}
                disabled={isRenaming || !usageInfo}
                className="px-3 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 font-semibold disabled:opacity-50 whitespace-nowrap text-sm"
                title={!usageInfo ? "Check usage first" : ""}
              >
                {isRenaming ? '...' : '2. Rename'}
              </button>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Must check usage before renaming to ensure safe update
            </p>
          </div>

          {/* Alt Text */}
          <div>
            <label htmlFor="altText" className="block text-sm font-medium text-gray-700">
              Alt Text (SEO & Accessibility)
            </label>
            <input
              type="text"
              id="altText"
              value={altText}
              onChange={e => setAltText(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-navy-blue focus:border-navy-blue"
              placeholder="Describe the image..."
            />
          </div>

          {/* Caption */}
          <div>
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700">
              Caption
            </label>
            <textarea
              id="caption"
              rows={3}
              value={caption}
              onChange={e => setCaption(e.target.value)}
              className="mt-1 w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-navy-blue focus:border-navy-blue"
              placeholder="Optional caption"
            />
          </div>

          {/* Image Info */}
          <div className="bg-gray-50 p-3 rounded-md space-y-1 text-xs">
            <p><span className="font-semibold">Format:</span> {media.format?.toUpperCase()}</p>
            <p><span className="font-semibold">Size:</span> {(media.bytes / 1024).toFixed(1)}KB</p>
            <p><span className="font-semibold">ID:</span> {media.publicId}</p>
          </div>

          {/* Spacer */}
          <div className="flex-grow"></div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 border-t pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-semibold"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-gold text-navy-blue rounded-md hover:bg-yellow-400 font-semibold"
            >
              Save Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetailModal;