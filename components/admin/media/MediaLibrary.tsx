import React, { useState } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';

// Mock data, in a real app this would come from an API
const mockMedia = [
  { id: 1, url: '/images/401k.jpg', name: '401k.jpg', size: '120 KB' },
  { id: 2, url: '/images/budgeting.jpg', name: 'budgeting.jpg', size: '150 KB' },
  { id: 3, url: '/images/market-trends.jpg', name: 'market-trends.jpg', size: '210 KB' },
  { id: 4, url: '/images/emergency-fund.jpg', name: 'emergency-fund.jpg', size: '180 KB' },
  { id: 5, url: '/images/fintech.jpg', name: 'fintech.jpg', size: '165 KB' },
  { id: 6, url: '/images/funding.jpg', name: 'funding.jpg', size: '250 KB' },
];

const MediaLibrary = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadMessage('');

    // This is a mock upload process
    try {
      // In a real app, you would use FormData and send it to your API
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        // In a real app with libraries like multer, you don't set Content-Type
        // body: formData
      });
      
      const data = await response.json();

      if (response.ok) {
        setUploadMessage(`Success! File "${file.name}" uploaded. (Mock)`);
        // Here you would typically refetch the media list to include the new image
      } else {
        throw new Error(data.message || 'Upload failed');
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      setUploadMessage(`Error: ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <SectionHeader title="Media Library" className="text-left mb-0" />
        <label className="bg-gold hover:bg-yellow-400 text-navy-blue font-bold py-2 px-4 rounded-md transition-colors cursor-pointer">
          {uploading ? 'Uploading...' : 'Upload Media'}
          <input type="file" className="hidden" onChange={handleFileUpload} disabled={uploading} />
        </label>
      </div>

      {uploadMessage && (
        <div className={`p-3 rounded-md text-sm ${uploadMessage.startsWith('Error') ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
          {uploadMessage}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {mockMedia.map((item) => (
            <div key={item.id} className="border rounded-lg overflow-hidden group">
              <div className="relative aspect-square bg-gray-100">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-2 text-xs">
                <p className="font-semibold truncate text-gray-800">{item.name}</p>
                <p className="text-gray-500">{item.size}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MediaLibrary;
