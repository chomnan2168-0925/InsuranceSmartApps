import React, { useState, useEffect } from 'react';
import SectionHeader from '@/components/ui/SectionHeader';
import MediaDetailModal from '@/components/admin/media/MediaDetailModal';
import { Media } from '@/types';

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const MediaLibrary = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMedia, setSelectedMedia] = useState<Media | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setIsLoading(true);
      // Call your API route that fetches from Cloudinary
      const response = await fetch('/api/media');
      
      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }
      
      const data = await response.json();
      setMedia(data.resources || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching media:', err);
      setError('Failed to load media. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMediaClick = (item: Media) => {
    setSelectedMedia(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (publicId: string) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const response = await fetch('/api/media/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publicId }),
      });

      if (response.ok) {
        setMedia(media.filter(item => item.publicId !== publicId));
        alert('Image deleted successfully');
      } else {
        alert('Failed to delete image');
      }
    } catch (err) {
      console.error('Error deleting media:', err);
      alert('Error deleting image');
    }
  };

  const toggleSelection = (publicId: string) => {
    const newSelection = new Set(selectedItems);
    if (newSelection.has(publicId)) {
      newSelection.delete(publicId);
    } else {
      newSelection.add(publicId);
    }
    setSelectedItems(newSelection);
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    if (!confirm(`Delete ${selectedItems.size} selected images?`)) return;

    try {
      const deletePromises = Array.from(selectedItems).map(publicId =>
        fetch('/api/media/delete', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ publicId }),
        })
      );

      await Promise.all(deletePromises);
      setMedia(media.filter(item => !selectedItems.has(item.publicId)));
      setSelectedItems(new Set());
      alert('Images deleted successfully');
    } catch (err) {
      console.error('Error bulk deleting:', err);
      alert('Error deleting images');
    }
  };

  const filteredMedia = media.filter(item =>
    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.altText?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="space-y-6">
        <SectionHeader 
          title="Media Library" 
          subtitle="Manage all your uploaded images and assets." 
          className="text-left mb-0" 
        />
        <div className="flex flex-col items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-blue mb-4"></div>
          <p className="text-gray-500">Loading media...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <SectionHeader 
          title="Media Library" 
          subtitle="Manage all your uploaded images and assets." 
          className="text-left mb-0" 
        />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={fetchMedia}
            className="px-4 py-2 bg-navy-blue text-white rounded-md hover:bg-navy-blue/90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <SectionHeader 
          title="Media Library" 
          subtitle={`${media.length} images in your library`}
          className="text-left mb-0" 
        />

        {/* Search and Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white p-4 rounded-lg shadow-sm">
          <div className="flex-1 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search images..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-navy-blue focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {selectedItems.size > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold"
              >
                Delete Selected ({selectedItems.size})
              </button>
            )}
            <button
              onClick={fetchMedia}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 font-semibold"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Media Grid */}
        {filteredMedia.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="mt-4 text-gray-500">
              {searchTerm ? 'No images found matching your search' : 'No images in your library yet'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredMedia.map((item) => (
              <div
                key={item.publicId}
                className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-200"
              >
                {/* Selection Checkbox */}
                <div className="absolute top-2 left-2 z-10">
                  <input
                    type="checkbox"
                    checked={selectedItems.has(item.publicId)}
                    onChange={() => toggleSelection(item.publicId)}
                    className="w-5 h-5 rounded border-gray-300 text-navy-blue focus:ring-navy-blue cursor-pointer"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                {/* Image */}
                <div 
                  className="aspect-square cursor-pointer overflow-hidden bg-gray-100"
                  onClick={() => handleMediaClick(item)}
                >
                  <img
                    src={item.thumbnail || item.url}
                    alt={item.altText || item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                </div>

                {/* Image Info */}
                <div className="p-2">
                  <p className="text-xs font-medium text-gray-700 truncate">
                    {item.name || 'Untitled'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {item.format?.toUpperCase()} • {(item.bytes / 1024).toFixed(0)}KB
                  </p>
                </div>

                {/* Hover Actions */}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMediaClick(item)}
                      className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                      title="View details"
                    >
                      <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(item.publicId);
                      }}
                      className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Media Detail Modal */}
      <MediaDetailModal
        media={selectedMedia}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default MediaLibrary;