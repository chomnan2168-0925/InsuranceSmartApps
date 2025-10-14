import React, { useState, useEffect } from 'react';

interface MediaItem {
  id: number;
  url: string;
  name: string;
  altText?: string;
  caption?: string;
}

interface MediaDetailModalProps {
  media: MediaItem | null;
  isOpen: boolean;
  onClose: () => void;
}

const MediaDetailModal: React.FC<MediaDetailModalProps> = ({ media, isOpen, onClose }) => {
    const [altText, setAltText] = useState('');
    const [caption, setCaption] = useState('');

    useEffect(() => {
        if (media) {
            setAltText(media.altText || '');
            setCaption(media.caption || '');
        }
    }, [media]);

    if (!isOpen || !media) return null;

    const handleSave = () => {
        alert(`Saving details for ${media.name}: Alt Text - "${altText}", Caption - "${caption}" (Mock)`);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex" onClick={e => e.stopPropagation()}>
                <div className="w-2/3 p-4">
                    <img src={media.url} alt="Preview" className="max-h-[70vh] w-full object-contain"/>
                </div>
                <div className="w-1/3 p-6 space-y-4 border-l bg-gray-50 flex flex-col">
                    <h3 className="text-lg font-bold text-navy-blue">Media Details</h3>
                    <div>
                        <label htmlFor="altText" className="block text-sm font-medium text-gray-700">Alt Text (for SEO & Accessibility)</label>
                        <input
                            type="text" id="altText" value={altText} onChange={e => setAltText(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Describe the image..."
                        />
                        <p className="text-xs text-gray-500 mt-1">Describes the image for search engines and screen readers.</p>
                    </div>
                     <div>
                        <label htmlFor="caption" className="block text-sm font-medium text-gray-700">Caption</label>
                        <textarea
                            id="caption" rows={3} value={caption} onChange={e => setCaption(e.target.value)}
                            className="mt-1 w-full p-2 border border-gray-300 rounded-md"
                            placeholder="Optional text displayed with the image."
                        />
                    </div>
                    <div className="flex-grow"></div>
                    <div className="flex justify-end space-x-2">
                        <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded-md">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-gold text-navy-blue rounded-md font-semibold">Save Details</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MediaDetailModal;