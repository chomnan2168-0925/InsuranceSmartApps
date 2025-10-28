// /components/admin/settings/AuthorsTab.tsx
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';

interface Author {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  avatar_url: string | null;
  specialty: string | null;
  credentials: string[] | null;
  articles_count: number;
}

const AuthorsTab: React.FC = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form state for editing
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    specialty: '',
    avatar_url: '',
    credentials: [] as string[],
  });
  const [newCredential, setNewCredential] = useState('');

  // Fetch all authors
  const fetchAuthors = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'Author')
      .order('articles_count', { ascending: false });

    if (error) {
      console.error('Error fetching authors:', error);
      setMessage({ type: 'error', text: 'Failed to load authors' });
    } else {
      setAuthors(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  // Open edit modal
  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name || '',
      bio: author.bio || '',
      specialty: author.specialty || '',
      avatar_url: author.avatar_url || '',
      credentials: author.credentials || [],
    });
    setShowEditModal(true);
    setMessage(null);
  };

  // Save author changes
  const handleSave = async () => {
    if (!editingAuthor) return;

    setSaving(true);
    setMessage(null);

    const { error } = await supabase
      .from('profiles')
      .update({
        name: formData.name,
        bio: formData.bio,
        specialty: formData.specialty,
        avatar_url: formData.avatar_url,
        credentials: formData.credentials,
      })
      .eq('id', editingAuthor.id);

    if (error) {
      console.error('Error updating author:', error);
      setMessage({ type: 'error', text: 'Failed to save changes' });
    } else {
      setMessage({ type: 'success', text: 'Author updated successfully!' });
      await fetchAuthors();
      setTimeout(() => {
        setShowEditModal(false);
        setEditingAuthor(null);
      }, 1500);
    }

    setSaving(false);
  };

  // Add credential
  const handleAddCredential = () => {
    if (newCredential.trim()) {
      setFormData({
        ...formData,
        credentials: [...formData.credentials, newCredential.trim()],
      });
      setNewCredential('');
    }
  };

  // Remove credential
  const handleRemoveCredential = (index: number) => {
    setFormData({
      ...formData,
      credentials: formData.credentials.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-gray-500">Loading authors...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Author Management</h3>
        <p className="text-sm text-gray-500 mt-1">
          Manage author profiles and credentials. Only users with role "Author" are shown.
        </p>
      </div>

      {/* Authors List */}
      <div className="p-6">
        {authors.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No authors found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {authors.map((author) => (
              <div
                key={author.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                {/* Avatar */}
                <div className="flex items-center mb-3">
                  <Image
                    src={
                      author.avatar_url ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(
                        author.name
                      )}&size=100&background=1A365D&color=D4AF37&bold=true`
                    }
                    alt={author.name}
                    width={60}
                    height={60}
                    className="rounded-full object-cover ring-2 ring-gray-200"
                  />
                  <div className="ml-3 flex-1">
                    <h4 className="font-bold text-gray-900">{author.name}</h4>
                    <p className="text-xs text-gray-500">
                      {author.articles_count} {author.articles_count === 1 ? 'article' : 'articles'}
                    </p>
                  </div>
                </div>

                {/* Specialty */}
                {author.specialty && (
                  <p className="text-sm text-gray-600 mb-2 italic">
                    {author.specialty}
                  </p>
                )}

                {/* Bio Preview */}
                {author.bio && (
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                    {author.bio}
                  </p>
                )}

                {/* Edit Button */}
                <button
                  onClick={() => handleEdit(author)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Edit Profile
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingAuthor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h3 className="text-xl font-bold text-gray-900">
                Edit Author Profile: {editingAuthor.name}
              </h3>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 space-y-4">
              {/* Message */}
              {message && (
                <div
                  className={`p-3 rounded ${
                    message.type === 'success'
                      ? 'bg-green-50 text-green-800 border border-green-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {message.text}
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Specialty */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Specialty
                </label>
                <input
                  type="text"
                  value={formData.specialty}
                  onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                  placeholder="e.g., Life Insurance & Health Coverage"
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  rows={4}
                  placeholder="Write a brief bio about this author..."
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Avatar URL */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Avatar URL
                </label>
                <input
                  type="url"
                  value={formData.avatar_url}
                  onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use auto-generated avatar
                </p>
              </div>

              {/* Credentials */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Experience & Background
                </label>
                <div className="space-y-2">
                  {formData.credentials.map((cred, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={cred}
                        onChange={(e) => {
                          const updated = [...formData.credentials];
                          updated[index] = e.target.value;
                          setFormData({ ...formData, credentials: updated });
                        }}
                        className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={() => handleRemoveCredential(index)}
                        className="text-red-600 hover:text-red-800 text-sm font-medium px-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  
                  {/* Add New Credential */}
                  <div className="flex gap-2 mt-2">
                    <input
                      type="text"
                      value={newCredential}
                      onChange={(e) => setNewCredential(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCredential()}
                      placeholder="Add new credential..."
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddCredential}
                      className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 text-sm font-medium"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              {/* Read-only Info */}
              <div className="bg-gray-50 p-3 rounded border border-gray-200">
                <p className="text-sm text-gray-600">
                  <strong>Author ID:</strong> {editingAuthor.id}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Published Articles:</strong> {editingAuthor.articles_count}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingAuthor(null);
                  setMessage(null);
                }}
                disabled={saving}
                className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving || !formData.name.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthorsTab;