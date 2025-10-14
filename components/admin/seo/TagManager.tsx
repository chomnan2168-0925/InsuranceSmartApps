import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface Tag {
  name: string;
  count: number;
}

const TagManager = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      const { data, error } = await supabase.rpc('get_tag_counts');
      
      if (error) {
        console.error("Error fetching tag counts. Make sure the 'get_tag_counts' function exists in Supabase.", error);
      } else if (data) {
        setTags(data);
      }
      setLoading(false);
    };
    fetchTags();
  }, []);
  
  // Handlers for editing and deleting remain as mocks
  const handleEdit = (oldName: string) => alert(`Editing tags requires advanced database operations. (Mock for "${oldName}")`);
  const handleDelete = (tagName: string) => alert(`Deleting tags requires advanced database operations. (Mock for "${tagName}")`);
  const handleMerge = () => alert('Merging tags is an advanced operation. (Mock)');
  const handleDeleteSelected = () => alert('Bulk deleting tags is an advanced operation. (Mock)');

  // Selection handlers
  const handleSelect = (tagName: string) => {
    setSelectedTags(prev => prev.includes(tagName) ? prev.filter(t => t !== tagName) : [...prev, tagName]);
  };
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTags(tags.map(t => t.name));
    } else {
      setSelectedTags([]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-navy-blue">Tag Audit Tool</h3>
      <p className="text-sm text-gray-600 mt-1">Audit, edit, and consolidate your content tags from the database.</p>
      <p className="text-xs text-gray-500 mt-1"><strong>Note:</strong> To enable this feature, a SQL function named `get_tag_counts` must be created in your Supabase project.</p>
      
      {selectedTags.length > 0 && (
        <div className="bg-gray-100 p-3 rounded-md my-4 flex items-center gap-4 border">
          <span className="font-semibold text-sm">{selectedTags.length} selected</span>
          <button onClick={handleMerge} className="px-3 py-1 bg-navy-blue text-white rounded-md text-sm font-semibold">Merge Selected...</button>
          <button onClick={handleDeleteSelected} className="px-3 py-1 bg-red-600 text-white rounded-md text-sm font-semibold">Delete Selected</button>
        </div>
      )}

      <div className="overflow-x-auto mt-4 border rounded-lg">
        {loading ? <p className="p-4 text-center">Loading tags from database...</p> : (
            <table className="w-full text-left text-sm">
            <thead className="border-b bg-gray-50">
                <tr>
                <th className="p-3 w-4"><input type="checkbox" onChange={handleSelectAll} checked={selectedTags.length > 0 && selectedTags.length === tags.length} /></th>
                <th className="p-3 font-semibold">Tag Name</th>
                <th className="p-3 font-semibold">Article Count</th>
                <th className="p-3 font-semibold">Actions</th>
                </tr>
            </thead>
            <tbody>
                {tags.map((tag) => (
                <tr key={tag.name} className={`border-b hover:bg-gray-50 ${selectedTags.includes(tag.name) ? 'bg-yellow-50' : ''}`}>
                    <td className="p-3"><input type="checkbox" checked={selectedTags.includes(tag.name)} onChange={() => handleSelect(tag.name)} /></td>
                    <td className="p-3 font-medium"><a href={`/tags/${tag.name.toLowerCase().replace(/\s+/g, '-')}`} target="_blank" rel="noopener noreferrer" className="text-navy-blue hover:text-gold">{tag.name}</a></td>
                    <td className="p-3">{tag.count}</td>
                    <td className="p-3 space-x-4">
                    <button onClick={() => handleEdit(tag.name)} className="text-navy-blue hover:underline font-semibold">Edit</button>
                    <button onClick={() => handleDelete(tag.name)} className="text-red-600 hover:underline font-semibold">Delete</button>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
};

export default TagManager;